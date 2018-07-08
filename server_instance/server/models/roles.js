module.exports = function(sequelize, DataTypes) {
	return sequelize.define(
		"roles",
		{
			id: {
				type: DataTypes.INTEGER(11).UNSIGNED,
				allowNull: false,
				primaryKey: true,
				autoIncrement: true
			},
			name: {
				type: DataTypes.STRING(255),
				allowNull: false,
				defaultValue: ""
			},
			description: {
				type: DataTypes.STRING(255),
				allowNull: false,
				defaultValue: ""
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
			tableName: "roles"
		}
	);
};
