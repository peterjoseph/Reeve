module.exports = function(sequelize, DataTypes) {
	return sequelize.define(
		"emailTemplates",
		{
			id: {
				type: DataTypes.INTEGER(11).UNSIGNED,
				allowNull: false,
				primaryKey: true,
				autoIncrement: true,
				field: "id"
			},
			type: {
				type: DataTypes.INTEGER(11).UNSIGNED,
				allowNull: false,
				references: {
					model: "emailTypes",
					key: "id"
				},
				field: "type"
			},
			language: {
				type: DataTypes.INTEGER(11).UNSIGNED,
				allowNull: false,
				references: {
					model: "languages",
					key: "id"
				},
				field: "language"
			},
			name: {
				type: DataTypes.STRING(255),
				allowNull: false,
				defaultValue: "",
				field: "name"
			},
			description: {
				type: DataTypes.STRING(255),
				allowNull: true,
				field: "description"
			},
			subject: {
				type: DataTypes.STRING(255),
				allowNull: false,
				defaultValue: "",
				field: "subject"
			},
			html: {
				type: DataTypes.TEXT,
				allowNull: false,
				field: "html"
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
			tableName: "emailTemplates"
		}
	);
};
