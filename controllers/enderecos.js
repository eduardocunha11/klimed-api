const { UniqueConstraintError } = require("sequelize");
const { body } = require("express-validator");

const db = require("../database/models");
const { isRequestInvalid } = require("../utils/http-validation");

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
async function getAll (req, res) {
	try {
		const addresses = await db.Endereco.findAll();
		res.status(200).json(addresses);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: error.message, error });
	}
}

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
async function getByCEP (req, res) {
	try {
		const address = await db.Endereco.findByPk(req.params.cep);
		res.status(200).json(address);
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

	try {
		const address = await db.Endereco.create(req.body);
		res.status(201).json(address);
	} catch (error) {
		if (error instanceof UniqueConstraintError)
			return res.status(400).json({ message: "Este CEP já está cadastrado." });

		console.error(error);
		res.status(500).json({ message: error.message, error });
	}
}

insert.validations = [
	body("cep").isString().isLength({ min: 9 }).withMessage("CEP inválido."),
	body("logradouro").isString().withMessage("Logradouro inválido."),
	body("bairro").isString().withMessage("Bairro inválido."),
	body("cidade").isString().withMessage("Cidade inválida."),
	body("estado").isString().isLength({ min: 2, max: 2 }).withMessage("Estado inválido.")
];

module.exports = { getAll, getByCEP, insert };
