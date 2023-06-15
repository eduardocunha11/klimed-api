"use strict";

module.exports = {
	/**
	 * Função de aplicação da migração
	 * @param {import("sequelize/types").QueryInterface} queryInterface
	 * @param {import("sequelize/types").DataTypes} Sequelize
	 */
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable("agenda", {
			codigo: {
				type: Sequelize.INTEGER,
				allowNull: false,
				primaryKey: true,
				autoIncrement: true
			},
			data: {
				type: Sequelize.DATEONLY,
				allowNull: false
			},
			horario: {
				type: Sequelize.SMALLINT,
				allowNull: false
			},
			nome: {
				type: Sequelize.STRING(255),
				allowNull: false
			},
			email: {
				type: Sequelize.STRING(127),
				allowNull: false
			},
			telefone: {
				type: Sequelize.STRING(31),
				allowNull: false
			},
			codigo_medico: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: { model: "medicos", key: "codigo" }
			}
		});
	},

	/**
	 * Função que desfaz a migração
	 * @param {import("sequelize/types").QueryInterface} queryInterface
	 * @param {import("sequelize/types").Sequelize} Sequelize
	 */
	down: async (queryInterface, Sequelize) => {
		await queryInterface.dropTable("agenda");
	}
};
