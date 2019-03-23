module.exports = function(sequelize, DataTypes) {
	return sequelize.define(
		"client",
		{
			id: {
				type: DataTypes.INTEGER(11).UNSIGNED,
				allowNull: false,
				primaryKey: true,
				autoIncrement: true,
				field: "id"
			},
			name: {
				type: DataTypes.STRING(255),
				allowNull: false,
				defaultValue: "",
				field: "name"
			},
			workspaceURL: {
				type: DataTypes.STRING(255),
				allowNull: false,
				defaultValue: "",
				field: "workspaceURL"
			},
			description: {
				type: DataTypes.STRING(255),
				allowNull: true,
				field: "description"
			},
			subscriptionId: {
				type: DataTypes.INTEGER(3),
				allowNull: false,
				defaultValue: "1",
				field: "subscriptionId"
			},
			subscriptionStartDate: {
				type: DataTypes.DATE,
				allowNull: true,
				field: "subscriptionStartDate"
			},
			subscriptionEndDate: {
				type: DataTypes.DATE,
				allowNull: true,
				field: "subscriptionEndDate"
			},
			billingCycle: {
				type: DataTypes.INTEGER(2),
				allowNull: true,
				field: "billingCycle"
			},
			defaultLanguage: {
				type: DataTypes.INTEGER(11).UNSIGNED,
				allowNull: false,
				defaultValue: "1",
				field: "defaultLanguage"
			},
			active: {
				type: DataTypes.INTEGER(1),
				allowNull: false,
				defaultValue: "1",
				field: "active"
			},
			createdAt: {
				type: DataTypes.DATE,
				allowNull: true,
				field: "createdAt"
			},
			updatedAt: {
				type: DataTypes.DATE,
				allowNull: true,
				field: "updatedAt"
			}
		},
		{
			tableName: "client"
		}
	);
};
