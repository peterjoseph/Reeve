module.exports = function(sequelize, DataTypes) {
	return sequelize.define(
		"currencies",
		{
			id: {
				type: DataTypes.INTEGER(11).UNSIGNED,
				allowNull: false,
				primaryKey: true,
				autoIncrement: true,
				field: "id"
			},
			identifier: {
				type: DataTypes.CHAR(3),
				allowNull: false,
				defaultValue: "",
				field: "identifier"
			},
			description: {
				type: DataTypes.STRING(255),
				allowNull: true,
				field: "description"
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
			tableName: "currencies"
		}
	);
};
