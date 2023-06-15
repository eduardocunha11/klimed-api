const { UniqueConstraintError, Transaction } = require("sequelize");
const { body } = require("express-validator");
const { sha512 } = require("js-sha512");

const db = require("../database/models");
const { isRequestInvalid } = require("../utils/http-validation");
const { ensureAuthorized } = require("./login");

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
async function getAll (req, res) {
	try {
		const workers = await db.Pessoa.findAll({
			include: [{
				association: "funcionario",
				attributes: ["dataContrato", "salario"],
				required: true,
				include: [{
					association: "medico",
					attributes: ["especialidade", "crm"],
					required: false
				}]
			}]
		});

		res.status(200).json(workers.map(w => {
			w.funcionario.salario = Number(w.funcionario.salario);
			return w;
		}));
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

		const worker = await db.Funcionario.create({
			codigo: person.codigo,
			dataContrato: req.body.dataContrato,
			salario: req.body.salario,
			senhaHash: sha512(req.body.senhaHash)
		}, {
			transaction,
			returning: true
		});

		let physician = undefined;
		if (req.body.especialidade) {
			physician = await db.Medico.create({
				codigo: person.codigo,
				especialidade: req.body.especialidade,
				crm: req.body.crm
			}, {
				transaction,
				returning: true
			});
		}

		transaction.commit();
		res.status(201).json({
			...person,
			funcionario: {
				...worker,
				medico: physician
			}
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

	// Funcionário
	body("dataContrato").isDate({ format: "YYYY-MM-DD" }).withMessage("Data de contratação inválida."),
	body("salario").isNumeric().withMessage("Salário inválido."),
	body("senhaHash").isString().withMessage("Senha inválida."),

	// Médico
	body("especialidade").optional().isString().withMessage("Especialidade inválida."),
	body("crm").optional().isString().withMessage("CRM inválido.")
];

module.exports = { getAll, insert };
