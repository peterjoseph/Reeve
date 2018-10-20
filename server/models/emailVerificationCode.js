module.exports = function(sequelize, DataTypes) {
	return sequelize.define(
		"emailVerificationCode",
		{
			id: {
				type: DataTypes.INTEGER(11).UNSIGNED,
				allowNull: false,
				primaryKey: true,
				autoIncrement: true,
				field: "id"
			},
			verificationCode: {
				type: DataTypes.STRING(255),
				allowNull: false,
				defaultValue: "",
				field: "verificationCode"
			},
			activated: {
				type: DataTypes.INTEGER(1),
				allowNull: false,
				field: "activated"
			},
			userId: {
				type: DataTypes.INTEGER(11).UNSIGNED,
				allowNull: false,
				references: {
					model: "user",
					key: "id"
				},
				field: "userId"
			},
			clientId: {
				type: DataTypes.INTEGER(11).UNSIGNED,
				allowNull: false,
				references: {
					model: "client",
					key: "id"
				},
				field: "clientId"
			},
			gracePeriod: {
				type: DataTypes.INTEGER(2).UNSIGNED,
				allowNull: false,
				field: "gracePeriod"
			},
			createdAt: {
				type: DataTypes.DATE,
				allowNull: false,
				field: "createdAt"
			},
			updatedAt: {
				type: DataTypes.DATE,
				allowNull: false,
				field: "updatedAt"
			}
		},
		{
			tableName: "emailVerificationCode"
		}
	);
};
