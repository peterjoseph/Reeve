module.exports = function(sequelize, DataTypes) {
	return sequelize.define(
		"client",
		{
			id: {
				type: DataTypes.INTEGER(11).UNSIGNED,
				allowNull: false,
				primaryKey: true,
				autoIncrement: true
			},
			name: {
				type: DataTypes.STRING(255),
				allowNull: false,
				defaultValue: ""
			},
			workspaceURL: {
				type: DataTypes.STRING(255),
				allowNull: false,
				defaultValue: ""
			},
			subscriptionId: {
				type: DataTypes.INTEGER(3),
				allowNull: false,
				defaultValue: "1"
			},
			subscriptionStartDate: {
				type: DataTypes.DATEONLY,
				allowNull: true
			},
			subscriptionEndDate: {
				type: DataTypes.DATEONLY,
				allowNull: true
			},
			billingCycle: {
				type: DataTypes.INTEGER(2),
				allowNull: true
			},
			createdAt: {
				type: DataTypes.DATEONLY,
				allowNull: false
			},
			updatedAt: {
				type: DataTypes.DATEONLY,
				allowNull: false
			},
			defaultLanguage: {
				type: DataTypes.INTEGER(11).UNSIGNED,
				allowNull: false,
				defaultValue: "1"
			},
			active: {
				type: DataTypes.INTEGER(1),
				allowNull: false,
				defaultValue: "1"
			}
		},
		{
			tableName: "client"
		}
	);
};
