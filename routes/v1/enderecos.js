const { Router } = require("express");

const EnderecosController = require("../../controllers/enderecos");

const router = Router();

router.get("/", EnderecosController.getAll);

router.get("/:cep", EnderecosController.getByCEP);

router.post("/", EnderecosController.insert.validations, EnderecosController.insert);

module.exports = router;
