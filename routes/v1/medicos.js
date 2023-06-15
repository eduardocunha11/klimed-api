const { Router } = require("express");

const medicosController = require("../../controllers/medicos");

const router = Router();

router.get(["/", "/especialidade/:especialidade"], medicosController.getAll);

router.get("/especialidades", medicosController.getSpecialties);

router.get("/horariosDisponiveis/:codigoMedico/:data", medicosController.getAvailableAppointmentSlots);

module.exports = router;
