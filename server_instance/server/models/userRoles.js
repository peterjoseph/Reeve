module.exports = function(sequelize, DataTypes) {
	return sequelize.define(
		"userRoles",
		{
			id: {
				type: DataTypes.INTEGER(21).UNSIGNED,
				allowNull: false,
				primaryKey: true,
				autoIncrement: true
			},
			userId: {
				type: DataTypes.INTEGER(11).UNSIGNED,
				allowNull: false,
				references: {
					model: "user",
					key: "id"
				}
			},
			roleId: {
				type: DataTypes.INTEGER(11).UNSIGNED,
				allowNull: false,
				references: {
					model: "roles",
					key: "id"
				}
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
			tableName: "userRoles"
		}
	);
};
