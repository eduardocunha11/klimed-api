const { Model, DataTypes } = require("sequelize");

class Endereco extends Model {
	/**
	 * Cria as associações entre as tabelas do banco de dados
	 * @param {import("./index")} models Modelos das tabelas do banco de dados
	 */
	static associate (models) { }
}

/**
 * Cria o modelo da tabela itens
 * @param {import("sequelize/types").Sequelize} sequelize
 */
function initEndereco (sequelize) {
	Endereco.init({
		cep: {
			type: DataTypes.STRING(15),
			allowNull: false,
			primaryKey: true
		},
		logradouro: {
			type: DataTypes.STRING(255),
			allowNull: false
		},
		bairro: {
			type: DataTypes.STRING(255),
			allowNull: false
		},
		cidade: {
			type: DataTypes.STRING(255),
			allowNull: false
		},
		estado: {
			type: DataTypes.STRING(2),
			allowNull: false
		}
	}, {
		sequelize,
		paranoid: false,
		timestamps: false,
		underscored: true,
		modelName: "Endereco",
		tableName: "base_de_enderecos"
	});

	return Endereco;
}

module.exports = initEndereco;
