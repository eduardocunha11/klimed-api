const { Model, DataTypes } = require("sequelize");

class Funcionario extends Model {
	/**
	 * Cria as associações entre as tabelas do banco de dados
	 * @param {import("./index")} models Modelos das tabelas do banco de dados
	 */
	static associate (models) {
		Funcionario.hasOne(models.Medico, { as: "medico", foreignKey: "codigo" });
		Funcionario.belongsTo(models.Pessoa, { as: "pessoa", foreignKey: "codigo" });
	}
}

/**
 * Cria o modelo da tabela itens
 * @param {import("sequelize/types").Sequelize} sequelize
 */
function initFuncionario (sequelize) {
	Funcionario.init({
		codigo: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			references: { model: "pessoas", key: "codigo" }
		},
		dataContrato: {
			type: DataTypes.DATEONLY,
			allowNull: false
		},
		salario: {
			type: DataTypes.DECIMAL(8, 2),
			allowNull: false
		},
		senhaHash: {
			type: DataTypes.STRING(255),
			allowNull: false
		}
	}, {
		sequelize,
		paranoid: false,
		timestamps: false,
		underscored: true,
		modelName: "Funcionario",
		tableName: "funcionarios"
	});

	return Funcionario;
}

module.exports = initFuncionario;
