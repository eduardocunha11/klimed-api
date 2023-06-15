const { body } = require("express-validator");
const { sign, verify } = require("jsonwebtoken");

const { isRequestInvalid } = require("../utils/http-validation");
const db = require("../database/models");
const { sha512 } = require("js-sha512");

const KEY_TOKEN = "$#O23BIolRwVS&Av$T&H%9d6QebvvzPR";
const EXPIRATION_TIME = 3 * 24 * 60 * 60;

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
function ensureAuthorized (req, res, next) {
	const token = req.headers["x-access-token"];
	if (!token) {
		res.status(403).json({ message: "Acesso não autorizado. A sessão do usuário é inválida." });
		return res.end();
	}

	verify(token, KEY_TOKEN, (error, user) => {
		if (error) {
			res.status(403).json({
				message: "Acesso não autorizado. A sessão do usuário é inválida.",
				expired: error.name === "TokenExpiredError",
				error
			});
			return res.end();
		}

		res.locals.user = user;
		next(null);
	});
}

/**
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
async function login (req, res) {
	if (isRequestInvalid(req, res)) return;

	try {
		// Faz o hash da senha antes de fazer o login
		const password = sha512(req.body.password);

		const user = await db.Funcionario.findOne({
			attributes: ["dataContrato"],
			include: [{
				association: "pessoa",
				attributes: ["codigo", "nome", "email"],
				required: true,
				where: { email: req.body.email }
			}, {
				association: "medico",
				attributes: ["especialidade", "crm"],
				required: false
			}],
			where: { senhaHash: password }
		});

		if (!user) {
			res.status(403).json({ message: "E-mail ou senha incorretos." });
			return;
		}

		const plainUser = user.toJSON();
		const token = sign(plainUser, KEY_TOKEN, { expiresIn: EXPIRATION_TIME });
		res.status(200).json({ token });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Erro ao fazer login.", error });
	}
}

login.validations = [
	body("email").isEmail().withMessage("E-mail inválido.").normalizeEmail(),
	body("password").isString().withMessage("Senha inválida.")
];

module.exports = {
	ensureAuthorized,
	login
};
