module.exports = function(sequelize, DataTypes) {
	return sequelize.define(
		"subscriptionFeatures",
		{
			id: {
				type: DataTypes.INTEGER(11).UNSIGNED,
				allowNull: false,
				primaryKey: true,
				autoIncrement: true
			},
			subscriptionId: {
				type: DataTypes.INTEGER(3).UNSIGNED,
				allowNull: false,
				references: {
					model: "subscriptions",
					key: "id"
				}
			},
			featureId: {
				type: DataTypes.INTEGER(11).UNSIGNED,
				allowNull: false,
				references: {
					model: "features",
					key: "id"
				}
			}
		},
		{
			tableName: "subscriptionFeatures"
		}
	);
};
