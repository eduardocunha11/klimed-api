"use strict";

module.exports = {
	/**
	 * Função de aplicação da migração
	 * @param {import("sequelize/types").QueryInterface} queryInterface
	 * @param {import("sequelize/types").DataTypes} Sequelize
	 */
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable("base_de_enderecos", {
			cep: {
				type: Sequelize.STRING(15),
				allowNull: false,
				primaryKey: true
			},
			logradouro: {
				type: Sequelize.STRING(255),
				allowNull: false
			},
			bairro: {
				type: Sequelize.STRING(255),
				allowNull: false
			},
			cidade: {
				type: Sequelize.STRING(255),
				allowNull: false
			},
			estado: {
				type: Sequelize.STRING(2),
				allowNull: false
			}
		});
	},

	/**
	 * Função que desfaz a migração
	 * @param {import("sequelize/types").QueryInterface} queryInterface
	 * @param {import("sequelize/types").Sequelize} Sequelize
	 */
	down: async (queryInterface, Sequelize) => {
		await queryInterface.dropTable("base_de_enderecos");
	}
};
