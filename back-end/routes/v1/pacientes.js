const { Router } = require("express");

const { ensureAuthorized } = require("../../controllers/login");
const PacientesController = require("../../controllers/pacientes");

const router = Router();

router.get("/", ensureAuthorized, PacientesController.getAll);

router.post("/", PacientesController.insert.validations, PacientesController.insert);

module.exports = router;
