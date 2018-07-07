module.exports = (sequelize, DataTypes) => {
	const Client = sequelize.define("client", {
		name: {
			type: DataTypes.INTEGER,
			allowNull: false,
			get() {
				return this.getDataValue("name");
			},
			set(val) {
				this.setDataValue("name", val);
			}
		},
		workspaceURL: {
			type: DataTypes.STRING,
			allowNull: false,
			get() {
				return this.getDataValue("workspaceURL");
			},
			set(val) {
				this.setDataValue("workspaceURL", val);
			}
		}
	});

	return Client;
};
