"use strict";

module.exports = {
	/**
	 * Função de aplicação da migração
	 * @param {import("sequelize/types").QueryInterface} queryInterface
	 * @param {import("sequelize/types").DataTypes} Sequelize
	 */
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable("medicos", {
			codigo: {
				type: Sequelize.INTEGER,
				allowNull: false,
				primaryKey: true,
				references: { model: "funcionarios", key: "codigo" }
			},
			especialidade: {
				type: Sequelize.STRING(255),
				allowNull: false
			},
			crm: {
				type: Sequelize.STRING(15),
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
		await queryInterface.dropTable("medicos");
	}
};
