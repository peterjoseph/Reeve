module.exports = function(sequelize, DataTypes) {
	return sequelize.define(
		"userRoles",
		{
			id: {
				type: DataTypes.INTEGER(21).UNSIGNED,
				allowNull: false,
				primaryKey: true,
				autoIncrement: true,
				field: "id"
			},
			userId: {
				type: DataTypes.INTEGER(11).UNSIGNED,
				allowNull: false,
				field: "userId"
			},
			roleId: {
				type: DataTypes.INTEGER(11).UNSIGNED,
				allowNull: false,
				field: "roleId"
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
			tableName: "userRoles"
		}
	);
};
