module.exports = {
	apps: [
		{
			name: "node.js-server (worker)",
			script: "server/server.js",
			env: {
				COMMON_VARIABLE: "true"
			},
			env_production: {
				NODE_ENV: "production"
			},
			instances: "max",
			exec_mode: "cluster"
		}
	]
};
