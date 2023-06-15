module.exports = {
	development: {
		username: "postgres",
		password: "1897",
		database: "klimed_dev",
		host: "127.0.0.1",
		dialect: "postgres",
		logging: false,
		pool: { max: 20, min: 0 }
	},
	test: {
		username: "postgres",
		password: "root",
		database: "klimed_test",
		host: "127.0.0.1",
		dialect: "postgres",
		logging: false,
		pool: { max: 20, min: 0 }
	},
	production: {
		username: "eduardocunha11",
		password: "UV3GDNFi1BdZ",
		database: "neondb",
		host: "ep-holy-unit-576309.us-east-2.aws.neon.tech",
		dialect: "postgres",
		protocol: "postgres",
		dialectOptions: {
			ssl: true,
			native: true
		},
		logging: false,
		pool: { max: 20, min: 0 }
	}
};
