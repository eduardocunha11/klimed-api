"use strict";

module.exports = {
	/**
	 * Função de aplicação da migração
	 * @param {import("sequelize/types").QueryInterface} queryInterface
	 * @param {import("sequelize/types").DataTypes} Sequelize
	 */
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable("funcionarios", {
			codigo: {
				type: Sequelize.INTEGER,
				allowNull: false,
				primaryKey: true,
				references: { model: "pessoas", key: "codigo" }
			},
			data_contrato: {
				type: Sequelize.DATEONLY,
				allowNull: false
			},
			salario: {
				type: Sequelize.DECIMAL(8, 2),
				allowNull: false
			},
			senha_hash: {
				type: Sequelize.STRING(255),
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
		await queryInterface.dropTable("funcionarios");
	}
};
