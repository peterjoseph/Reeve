module.exports = function(sequelize, DataTypes) {
	return sequelize.define(
		"user",
		{
			id: {
				type: DataTypes.INTEGER(11).UNSIGNED,
				allowNull: false,
				primaryKey: true,
				autoIncrement: true
			},
			firstName: {
				type: DataTypes.STRING(255),
				allowNull: false,
				defaultValue: ""
			},
			lastName: {
				type: DataTypes.STRING(255),
				allowNull: false,
				defaultValue: ""
			},
			clientId: {
				type: DataTypes.INTEGER(11).UNSIGNED,
				allowNull: false,
				references: {
					model: "client",
					key: "id"
				}
			},
			emailAddress: {
				type: DataTypes.STRING(255),
				allowNull: false,
				defaultValue: ""
			},
			password: {
				type: DataTypes.STRING(255),
				allowNull: false,
				defaultValue: ""
			},
			lastLoginDate: {
				type: DataTypes.DATE,
				allowNull: true
			},
			language: {
				type: DataTypes.INTEGER(11).UNSIGNED,
				allowNull: false,
				defaultValue: "1"
			},
			active: {
				type: DataTypes.INTEGER(1),
				allowNull: false,
				defaultValue: "1"
			},
			createdAt: {
				type: DataTypes.DATEONLY,
				allowNull: false
			},
			updatedAt: {
				type: DataTypes.DATEONLY,
				allowNull: false
			}
		},
		{
			tableName: "user"
		}
	);
};
