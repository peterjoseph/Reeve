import { models } from "services/sequelize";

const nodemailer = require("nodemailer");
const config = require("../../config");

let transporter = null;

function initialize() {
	transporter = nodemailer.createTransport({
		host: config.email.host,
		port: config.email.port,
		secure: config.email.secure,
		auth: {
			user: config.email.username,
			pass: config.email.password
		}
	});
}

function sendEmail(to, subject, message) {
	const mailOptions = {
		to,
		from: config.email.senderAddress,
		subject,
		html: message
	};

	transporter.sendMail(mailOptions, (error, info) => {
		if (error) {
			return console.log(error);
		}
	});
}

module.exports = {
	initialize: initialize,
	sendEmail: sendEmail
};
