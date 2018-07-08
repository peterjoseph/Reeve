module.exports = function(sequelize, DataTypes) {
	return sequelize.define(
		"clientStyling",
		{
			id: {
				type: DataTypes.INTEGER(11).UNSIGNED,
				allowNull: false,
				primaryKey: true,
				autoIncrement: true
			},
			clientId: {
				type: DataTypes.INTEGER(11).UNSIGNED,
				allowNull: false,
				references: {
					model: "client",
					key: "id"
				}
			},
			logoImage: {
				type: DataTypes.STRING(255),
				allowNull: true
			},
			backgroundImage: {
				type: DataTypes.STRING(255),
				allowNull: true
			},
			backgroundColor: {
				type: DataTypes.STRING(32),
				allowNull: true
			},
			primaryColor: {
				type: DataTypes.STRING(32),
				allowNull: true
			},
			secondaryColor: {
				type: DataTypes.STRING(32),
				allowNull: true
			},
			createdAt: {
				type: DataTypes.DATEONLY,
				allowNull: true
			},
			updatedAt: {
				type: DataTypes.DATEONLY,
				allowNull: true
			}
		},
		{
			tableName: "clientStyling"
		}
	);
};
