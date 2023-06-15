const { Model, DataTypes } = require("sequelize");

class Agendamento extends Model {
	/**
	 * Cria as associações entre as tabelas do banco de dados
	 * @param {import("./index")} models Modelos das tabelas do banco de dados
	 */
	static associate (models) {
		Agendamento.belongsTo(models.Medico, { as: "medico", foreignKey: "codigoMedico" });
	}
}

/**
 * Cria o modelo da tabela itens
 * @param {import("sequelize/types").Sequelize} sequelize
 */
function initAgendamento (sequelize) {
	Agendamento.init({
		codigo: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		data: {
			type: DataTypes.DATEONLY,
			allowNull: false
		},
		horario: {
			type: DataTypes.SMALLINT,
			allowNull: false
		},
		nome: {
			type: DataTypes.STRING(255),
			allowNull: false
		},
		email: {
			type: DataTypes.STRING(127),
			allowNull: false
		},
		telefone: {
			type: DataTypes.STRING(31),
			allowNull: false
		},
		codigoMedico: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: { model: "medicos", key: "codigo" }
		}
	}, {
		sequelize,
		paranoid: false,
		timestamps: false,
		underscored: true,
		modelName: "Agendamento",
		tableName: "agenda"
	});

	return Agendamento;
}

module.exports = initAgendamento;
