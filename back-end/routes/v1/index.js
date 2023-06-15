const { Router } = require("express");

const agendamentosRouter = require("./agendamentos");
const enderecosRouter = require("./enderecos");
const funcionariosRouter = require("./funcionarios");
const loginRouter = require("./login");
const medicosRouter = require("./medicos");
const pacientesRouter = require("./pacientes");

const router = Router();

// ============= Rotas ============= //

router.use("/agendamentos", agendamentosRouter);

router.use("/enderecos", enderecosRouter);

router.use("/funcionarios", funcionariosRouter);

router.use("/medicos", medicosRouter);

router.use("/pacientes", pacientesRouter);

router.use(loginRouter);

module.exports = router;
