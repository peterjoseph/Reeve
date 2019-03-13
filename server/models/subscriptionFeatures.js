module.exports = function(sequelize, DataTypes) {
	return sequelize.define(
		"subscriptionFeatures",
		{
			id: {
				type: DataTypes.INTEGER(11).UNSIGNED,
				allowNull: false,
				primaryKey: true,
				autoIncrement: true,
				field: "id"
			},
			subscriptionId: {
				type: DataTypes.INTEGER(3).UNSIGNED,
				allowNull: false,
				field: "subscriptionId"
			},
			featureId: {
				type: DataTypes.INTEGER(11).UNSIGNED,
				allowNull: false,
				field: "featureId"
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
			tableName: "subscriptionFeatures"
		}
	);
};
