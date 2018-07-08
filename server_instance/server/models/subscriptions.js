module.exports = function(sequelize, DataTypes) {
	return sequelize.define(
		"subscriptions",
		{
			id: {
				type: DataTypes.INTEGER(3).UNSIGNED,
				allowNull: false,
				primaryKey: true,
				autoIncrement: true
			},
			name: {
				type: DataTypes.STRING(255),
				allowNull: false,
				defaultValue: ""
			},
			description: {
				type: DataTypes.STRING(255),
				allowNull: true
			},
			active: {
				type: DataTypes.INTEGER(1),
				allowNull: false
			}
		},
		{
			tableName: "subscriptions"
		}
	);
};
