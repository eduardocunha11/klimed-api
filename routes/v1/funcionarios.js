const { Router } = require("express");

const FuncionariosController = require("../../controllers/funcionarios");
const { ensureAuthorized } = require("../../controllers/login");

const router = Router();

router.get("/", ensureAuthorized, FuncionariosController.getAll);

router.post("/", FuncionariosController.insert.validations, FuncionariosController.insert);

module.exports = router;
