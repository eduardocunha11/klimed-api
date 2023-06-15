"use strict";

module.exports = {
	/**
	 * Função de aplicação da migração
	 * @param {import("sequelize/types").QueryInterface} queryInterface
	 * @param {import("sequelize/types").DataTypes} Sequelize
	 */
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable("pessoas", {
			codigo: {
				type: Sequelize.INTEGER,
				allowNull: false,
				primaryKey: true,
				autoIncrement: true
			},
			nome: {
				type: Sequelize.STRING(255),
				allowNull: false
			},
			email: {
				type: Sequelize.STRING(127),
				allowNull: false,
				unique: true
			},
			telefone: {
				type: Sequelize.STRING(31),
				allowNull: false
			},
			cep: {
				type: Sequelize.STRING(15),
				allowNull: false
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
		await queryInterface.dropTable("pessoas");
	}
};
