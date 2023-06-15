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
		const appointments = await db.Agendamento.findAll({
			include: [{
				association: "medico",
				attributes: ["especialidade", "crm"],
				include: [{
					association: "funcionario",
					attributes: ["dataContrato", "salario"],
					include: [{ association: "pessoa" }]
				}]
			}]
		});
		res.status(200).json(appointments.map(a => {
			a.medico.funcionario.salario = Number(a.medico.funcionario.salario);
			return a;
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
async function getByUser (req, res) {
	try {
		const appointments = await db.Agendamento.findAll({
			include: [{
				association: "medico",
				attributes: ["especialidade", "crm"],
				include: [{
					association: "funcionario",
					attributes: ["dataContrato", "salario"],
					include: [{ association: "pessoa" }]
				}]
			}],
			where: {
				codigoMedico: res.locals.user.pessoa.codigo
			}
		});
		res.status(200).json(appointments);
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
		const appointment = await db.Agendamento.create(req.body);
		res.status(201).json(appointment);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: error.message, error });
	}
}

insert.validations = [
	body("data").isDate({ format: "YYYY-MM-DD" }).withMessage("Data de consulta inválida."),
	body("horario").isNumeric().withMessage("Horário inválido."),
	body("nome").isString().withMessage("Nome inválido."),
	body("email").isEmail().withMessage("E-mail inválido."),
	body("telefone").isString().isLength({ min: 12 }).withMessage("Telefone inválido."),
	body("codigoMedico").isNumeric().withMessage("Médico inválido.")
];

module.exports = { getAll, getByUser, insert };
