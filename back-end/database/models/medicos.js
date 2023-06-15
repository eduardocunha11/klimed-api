const { Model, DataTypes } = require("sequelize");

class Medico extends Model {
	/**
	 * Cria as associações entre as tabelas do banco de dados
	 * @param {import("./index")} models Modelos das tabelas do banco de dados
	 */
	static associate (models) {
		Medico.hasMany(models.Agendamento, { as: "agendamentos", foreignKey: "codigoMedico" });
		Medico.belongsTo(models.Funcionario, { as: "funcionario", foreignKey: "codigo" });
	}
}

/**
 * Cria o modelo da tabela itens
 * @param {import("sequelize/types").Sequelize} sequelize
 */
function initMedico (sequelize) {
	Medico.init({
		codigo: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			references: { model: "funcionarios", key: "codigo" }
		},
		especialidade: {
			type: DataTypes.STRING(255),
			allowNull: false
		},
		crm: {
			type: DataTypes.STRING(15),
			allowNull: false
		}
	}, {
		sequelize,
		paranoid: false,
		timestamps: false,
		underscored: true,
		modelName: "Medico",
		tableName: "medicos"
	});

	return Medico;
}

module.exports = initMedico;
