const Sequelize = require("sequelize");

const configs = require("../config/config");
const initAgendamento = require("./agendamentos");
const initEndereco = require("./enderecos");
const initFuncionario = require("./funcionarios");
const initMedico = require("./medicos");
const initPaciente = require("./pacientes");
const initPessoa = require("./pessoas");

const env = process.env.NODE_ENV || "development";
const config = configs[env];

/**
 * @type {Sequelize}
 */
let sequelize;

if (config.use_env_variable)
	sequelize = new Sequelize(process.env[config.use_env_variable], config);
else
	sequelize = new Sequelize(config.database, config.username, config.password, config);

 
const db = {
	sequelize,
	Sequelize,
	Agendamento: initAgendamento(sequelize),
	Endereco: initEndereco(sequelize),
	Funcionario: initFuncionario(sequelize),
	Medico: initMedico(sequelize),
	Paciente: initPaciente(sequelize),
	Pessoa: initPessoa(sequelize)
};

// Cria o relacionamento da tabelas
db.Agendamento.associate(db);
db.Endereco.associate(db);
db.Funcionario.associate(db);
db.Medico.associate(db);
db.Paciente.associate(db);
db.Pessoa.associate(db);

// Testa a conexão com o banco de dados
db.sequelize.authenticate()
	.then(_ => console.log("Database connected."))
	.catch(console.log(console.error));

module.exports = db;
