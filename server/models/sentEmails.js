module.exports = function(sequelize, DataTypes) {
	return sequelize.define(
		"sentEmails",
		{
			id: {
				type: DataTypes.BIGINT,
				allowNull: false,
				primaryKey: true,
				autoIncrement: true,
				field: "id"
			},
			clientId: {
				type: DataTypes.INTEGER(11).UNSIGNED,
				allowNull: true,
				field: "clientId"
			},
			userId: {
				type: DataTypes.INTEGER(11).UNSIGNED,
				allowNull: true,
				field: "userId"
			},
			emailType: {
				type: DataTypes.INTEGER(11).UNSIGNED,
				allowNull: false,
				field: "emailType"
			},
			emailLanguage: {
				type: DataTypes.INTEGER(11).UNSIGNED,
				allowNull: false,
				field: "emailLanguage"
			},
			to: {
				type: DataTypes.STRING(255),
				allowNull: false,
				defaultValue: "",
				field: "to"
			},
			from: {
				type: DataTypes.STRING(255),
				allowNull: false,
				defaultValue: "",
				field: "from"
			},
			subject: {
				type: DataTypes.STRING(255),
				allowNull: false,
				defaultValue: "",
				field: "subject"
			},
			contents: {
				type: DataTypes.TEXT,
				allowNull: false,
				field: "contents"
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
			tableName: "sentEmails"
		}
	);
};
