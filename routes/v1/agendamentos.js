const { Router } = require("express");

const agendamentosController = require("../../controllers/agendamentos");
const { ensureAuthorized } = require("../../controllers/login");

const router = Router();

router.get("/", ensureAuthorized, agendamentosController.getAll);

router.get("/usuario", ensureAuthorized, agendamentosController.getByUser);

router.post("/", agendamentosController.insert.validations, agendamentosController.insert);

module.exports = router;
