module.exports = function(sequelize, DataTypes) {
	return sequelize.define(
		"subscriptions",
		{
			id: {
				type: DataTypes.INTEGER(3).UNSIGNED,
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
			description: {
				type: DataTypes.STRING(255),
				allowNull: true,
				field: "description"
			},
			active: {
				type: DataTypes.INTEGER(1),
				allowNull: false,
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
			tableName: "subscriptions"
		}
	);
};
