module.exports = function(sequelize, DataTypes) {
	return sequelize.define(
		"plans",
		{
			id: {
				type: DataTypes.INTEGER(11).UNSIGNED,
				allowNull: false,
				primaryKey: true,
				autoIncrement: true,
				field: "id"
			},
			name: {
				type: DataTypes.STRING(128),
				allowNull: false,
				defaultValue: "",
				field: "name"
			},
			description: {
				type: DataTypes.STRING(255),
				allowNull: true,
				field: "description"
			},
			stripeProductId: {
				type: DataTypes.STRING(128),
				allowNull: true,
				field: "stripeProductId"
			},
			billingInterval: {
				type: DataTypes.INTEGER(16).UNSIGNED,
				allowNull: true,
				field: "billingInterval"
			},
			currency: {
				type: DataTypes.INTEGER(11).UNSIGNED,
				allowNull: false,
				defaultValue: "1",
				field: "currency"
			},
			price: {
				type: DataTypes.DECIMAL,
				allowNull: false,
				defaultValue: "0.00",
				field: "price"
			},
			subscriptionId: {
				type: DataTypes.INTEGER(11).UNSIGNED,
				allowNull: true,
				field: "subscriptionId"
			},
			newSubscriptionsAllowed: {
				type: DataTypes.INTEGER(1),
				allowNull: false,
				field: "newSubscriptionsAllowed"
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
			tableName: "plans"
		}
	);
};
