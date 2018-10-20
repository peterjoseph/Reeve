module.exports = function(sequelize, DataTypes) {
	return sequelize.define(
		"languages",
		{
			id: {
				type: DataTypes.INTEGER(11).UNSIGNED,
				allowNull: false,
				primaryKey: true,
				autoIncrement: true,
				field: "id"
			},
			language: {
				type: DataTypes.STRING(11),
				allowNull: false,
				defaultValue: "",
				field: "language"
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
			tableName: "languages"
		}
	);
};
