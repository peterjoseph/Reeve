module.exports = function(sequelize, DataTypes) {
	return sequelize.define(
		"changeEmailAddress",
		{
			id: {
				type: DataTypes.INTEGER(11).UNSIGNED,
				allowNull: false,
				primaryKey: true,
				autoIncrement: true
			},
			emailCode: {
				type: DataTypes.STRING(255),
				allowNull: false,
				defaultValue: ""
			},
			activated: {
				type: DataTypes.INTEGER(1),
				allowNull: false
			},
			userId: {
				type: DataTypes.INTEGER(11).UNSIGNED,
				allowNull: false,
			},
			clientId: {
				type: DataTypes.INTEGER(11).UNSIGNED,
				allowNull: false,
			},
			gracePeriod: {
				type: DataTypes.INTEGER(2).UNSIGNED,
				allowNull: false
			},
			oldEmailAddress: {
				type: DataTypes.STRING(255),
				allowNull: false,
				defaultValue: ""
			},
			newEmailAddress: {
				type: DataTypes.STRING(255),
				allowNull: false,
				defaultValue: ""
			},
			createdAt: {
				type: DataTypes.DATE,
				allowNull: false
			},
			updatedAt: {
				type: DataTypes.DATE,
				allowNull: false
			}
		},
		{
			tableName: "changeEmailAddress"
		}
	);
};
