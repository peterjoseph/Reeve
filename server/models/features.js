module.exports = function(sequelize, DataTypes) {
	return sequelize.define(
		"features",
		{
			id: {
				type: DataTypes.INTEGER(11).UNSIGNED,
				allowNull: false,
				primaryKey: true,
				autoIncrement: true,
				field: "id"
			},
			name: {
				type: DataTypes.STRING(255),
				allowNull: false,
				defaultValue: "",
				field: "name"
			},
			description: {
				type: DataTypes.STRING(255),
				allowNull: false,
				defaultValue: "",
				field: "description"
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
			tableName: "features"
		}
	);
};
