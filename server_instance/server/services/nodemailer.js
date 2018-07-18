import { database, models } from "services/sequelize";
import { ServerResponseError } from "utilities/errors/serverResponseError";
import { t } from "shared/translations/i18n";

const nodemailer = require("nodemailer");
const ejs = require("ejs");
const serializeError = require("serialize-error");
const config = require("../../config");

let transporter = null;

function initialize() {
	transporter = nodemailer.createTransport({
		host: config.email.host,
		port: config.email.port,
		secure: config.email.secure,
		auth: {
			user: config.email.auth.username,
			pass: config.email.auth.password
		}
	});
}

function sendEmail(emailType, language, to, messageParams, clientId, userId) {
	database().transaction(async function(transaction) {
		try {
			// Load email template
			const emailTemplate = await models().emailTemplates.findOne({ where: { type: emailType, language: language } }, { transaction: transaction });

			// Throw an error if the email template does not exist
			if (emailTemplate === null) {
				throw new ServerResponseError(500, t("validation.emailTemplateNotFound"), null);
			}

			// Render html email parts using ejs
			const subject = ejs.render(emailTemplate.get("subject"), messageParams);
			const body = ejs.render(emailTemplate.get("html"), messageParams);

			// Store email properties in object for transporter
			const mailOptions = {
				to,
				from: config.email.senderAddress,
				subject: subject,
				html: body
			};

			// Send email through transporter, gracefully store failure errors in db
			try {
				await transporter.sendMail(mailOptions);
				await models().sentEmails.create(
					{
						clientId: clientId,
						userId: userId,
						emailType: emailType,
						emailLanguage: language,
						to: to,
						from: config.email.senderAddress,
						subject: subject,
						contents: body
					},
					{ transaction: transaction }
				);
			} catch (error) {
				// If there is an email send failure, output result to db table
				const reason = JSON.stringify(serializeError(error));
				await models().failedEmails.create(
					{
						clientId: clientId,
						userId: userId,
						emailType: emailType,
						emailLanguage: language,
						to: to,
						from: config.email.senderAddress,
						subject: subject,
						contents: body,
						reason: reason
					},
					{ transaction: transaction }
				);
			}
			return;
		} catch (error) {
			throw error;
		}
	});
}

module.exports = {
	initialize: initialize,
	sendEmail: sendEmail
};
