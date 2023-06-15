"use strict";

module.exports = {
	/**
	 * Função de aplicação da migração
	 * @param {import("sequelize/types").QueryInterface} queryInterface
	 * @param {import("sequelize/types").DataTypes} Sequelize
	 */
	up: async (queryInterface, Sequelize) => {
		/**
		 * @type {Transaction}
		 */
		let transaction;

		try {
			transaction = await queryInterface.sequelize.transaction();

			const person = (await queryInterface.bulkInsert("pessoas", [{
				nome: "Administrador",
				email: "adm@gmail.com",
				telefone: "(31) 3354-2234",
				cep: "30421-169",
				logradouro: "Av. Amazonas",
				bairro: "Nova Suíça",
				cidade: "Belo Horizonte",
				estado: "MG"
			}], {
				transaction,
				returning: true
			}))[0];

			await queryInterface.bulkInsert("funcionarios", [{
				codigo: person.codigo,
				data_contrato: "2022-01-01",
				salario: 1,

				// A senha é 123456
				senha_hash: "3c2a6eb64cc629de76c419308830c53bbe63b874f6a526f7cd784182b33a2f5f3daaab47b5bde5868b82e4dd3b521d147a7542292b689acdf60122b97e99523f"
			}], {
				transaction,
				returning: true
			});

			transaction.commit();
		} catch (error) {
			if (transaction)
				transaction.rollback();

			throw error;
		}
	},

	/**
	 * Função que desfaz a migração
	 * @param {import("sequelize/types").QueryInterface} queryInterface
	 * @param {import("sequelize/types").Sequelize} Sequelize
	 */
	down: async (queryInterface, Sequelize) => {
		//* Deliberadamente não implementado, é só usar a interface gráfica.
	}
};
