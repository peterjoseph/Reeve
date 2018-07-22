module.exports = function(sequelize, DataTypes) {
	return sequelize.define(
		"user",
		{
			id: {
				type: DataTypes.INTEGER(11).UNSIGNED,
				allowNull: false,
				primaryKey: true,
				autoIncrement: true,
				field: "id"
			},
			firstName: {
				type: DataTypes.STRING(255),
				allowNull: false,
				defaultValue: "",
				field: "firstName"
			},
			lastName: {
				type: DataTypes.STRING(255),
				allowNull: false,
				defaultValue: "",
				field: "lastName"
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
			emailAddress: {
				type: DataTypes.STRING(255),
				allowNull: false,
				defaultValue: "",
				field: "emailAddress"
			},
			emailVerified: {
				type: DataTypes.INTEGER(1),
				allowNull: false,
				defaultValue: "0",
				field: "emailVerified"
			},
			password: {
				type: DataTypes.STRING(255),
				allowNull: false,
				defaultValue: "",
				field: "password"
			},
			lastLoginDate: {
				type: DataTypes.DATE,
				allowNull: true,
				field: "lastLoginDate"
			},
			language: {
				type: DataTypes.INTEGER(11).UNSIGNED,
				allowNull: false,
				defaultValue: "1",
				references: {
					model: "languages",
					key: "id"
				},
				field: "language"
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
			tableName: "user"
		}
	);
};
