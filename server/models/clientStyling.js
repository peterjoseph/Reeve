module.exports = function(sequelize, DataTypes) {
	return sequelize.define(
		"clientStyling",
		{
			id: {
				type: DataTypes.INTEGER(11).UNSIGNED,
				allowNull: false,
				primaryKey: true,
				autoIncrement: true,
				field: "id"
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
			logoImage: {
				type: DataTypes.STRING(255),
				allowNull: true,
				field: "logoImage"
			},
			backgroundImage: {
				type: DataTypes.STRING(255),
				allowNull: true,
				field: "backgroundImage"
			},
			backgroundColor: {
				type: DataTypes.STRING(32),
				allowNull: true,
				field: "backgroundColor"
			},
			primaryColor: {
				type: DataTypes.STRING(32),
				allowNull: true,
				field: "primaryColor"
			},
			secondaryColor: {
				type: DataTypes.STRING(32),
				allowNull: true,
				field: "secondaryColor"
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
			tableName: "clientStyling"
		}
	);
};
