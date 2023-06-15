const { UniqueConstraintError, Transaction } = require("sequelize");
const { body } = require("express-validator");

const db = require("../database/models");
const { isRequestInvalid } = require("../utils/http-validation");
const { ensureAuthorized } = require("./login");

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
async function getAll (req, res) {
	try {
		const patients = await db.Pessoa.findAll({
			include: [{
				association: "paciente",
				required: true
			}]
		});

		res.status(200).json(patients);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: error.message, error });
	}
}

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
async function insert (req, res) {
	if (isRequestInvalid(req, res)) return;

	/**
	 * @type {Transaction}
	 */
	let transaction;

	try {
		transaction = await db.sequelize.transaction();

		const person = await db.Pessoa.create({
			nome: req.body.nome,
			email: req.body.email,
			telefone: req.body.telefone,
			cep: req.body.cep,
			logradouro: req.body.logradouro,
			bairro: req.body.bairro,
			cidade: req.body.cidade,
			estado: req.body.estado
		}, {
			transaction,
			returning: true
		});

		const patient = await db.Paciente.create({
			codigo: person.codigo,
			peso: req.body.peso,
			altura: req.body.altura,
			tipoSanguineo: req.body.tipoSanguineo
		}, {
			transaction,
			returning: true
		});

		transaction.commit();
		res.status(201).json({
			...person,
			paciente: patient
		});
	} catch (error) {
		if (transaction)
			transaction.rollback();

		if (error instanceof UniqueConstraintError)
			return res.status(400).json({ message: "Este e-mail já está cadastrado." });

		console.error(error);
		res.status(500).json({ message: error.message, error });
	}
}

insert.validations = [
	ensureAuthorized,

	// Pessoa
	body("nome").isString().withMessage("Nome inválido."),
	body("email").isEmail().withMessage("E-mail inválido."),
	body("telefone").isString().isLength({ min: 12 }).withMessage("Telefone inválido."),
	body("cep").isString().isLength({ min: 9 }).withMessage("CEP inválido."),
	body("logradouro").isString().withMessage("Logradouro inválido."),
	body("bairro").isString().withMessage("Bairro inválido."),
	body("cidade").isString().withMessage("Cidade inválida."),
	body("estado").isString().isLength({ min: 2, max: 2 }).withMessage("Estado inválido."),

	// Paciente
	body("peso").isNumeric().withMessage("Peso inválido."),
	body("altura").isNumeric().withMessage("Altura inválida."),
	body("tipoSanguineo").isIn(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]).withMessage("Tipo sanguíneo inválido.")
];

module.exports = { getAll, insert };
