const { Sequelize } = require("../database/models");
const db = require("../database/models");

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
async function getAll (req, res) {
	try {
		const physicians = await db.Pessoa.findAll({
			include: [{
				association: "funcionario",
				attributes: ["dataContrato", "salario"],
				required: true,
				include: [{
					association: "medico",
					attributes: ["especialidade", "crm"],
					required: true,
					...(req.params.especialidade ?
						{ where: { especialidade: req.params.especialidade } }:
						{ }
					)
				}]
			}]
		});

		res.status(200).json(physicians.map(p => {
			p.funcionario.salario = Number(p.funcionario.salario);
			return p;
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
async function getSpecialties (req, res) {
	try {
		const specialties = await db.Medico.findAll({
			attributes: [
				[Sequelize.fn("DISTINCT", Sequelize.col("especialidade")), "especialidade"]
			],
			order: [["especialidade", "ASC"]]
		});

		res.status(200).json(specialties.map(s => s.especialidade));
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: error.message, error });
	}
}

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
async function getAvailableAppointmentSlots (req, res) {
	try {
		const dt = new Date();
		const today = `${dt.getFullYear()}-${(dt.getMonth() + 1).toString().padStart(2, "0")}-${dt.getDate().toString().padStart(2, "0")}`;
		let appointmentSlots = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17];

		if (today === req.params.data) {
			const nextHour = dt.getHours() + 1;
			appointmentSlots = appointmentSlots.filter(s => s >= nextHour);
		}

		const appointments = await db.Agendamento.findAll({
			attributes: ["horario"],
			where: {
				codigoMedico: req.params.codigoMedico,
				data: req.params.data
			}
		});

		res.status(200).json(
			appointmentSlots.filter(h => !appointments.find(a => a.horario == h))
		);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: error.message, error });
	}
}

module.exports = { getAll, getSpecialties, getAvailableAppointmentSlots };
