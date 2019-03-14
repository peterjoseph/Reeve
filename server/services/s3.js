import multer from "multer";
import multerS3 from "multer-s3";
import aws from "aws-sdk";

let config = require("../../config");

let s3 = null;

function initialize(app) {
	if (!config.s3.enabled) {
		return;
	}

	// Initialize new s3 connection
	s3 = new aws.S3({
		accessKeyId: config.s3.accessKeyId,
		secretAccessKey: config.s3.secretAccessKey,
		region: config.s3.region
	});
}

function uploadFile(req, res, fileInformation) {
	if (!config.s3.enabled) {
		return;
	}

	return multer({
		storage: multerS3({
			s3: s3,
			...fileInformation,
			metadata: function(req, file, cb) {
				cb(null, { fieldName: file.fieldname });
			},
			key: function(req, file, cb) {
				cb(null, `${Date.now().toString()}_${req.user.clientId}_${req.user.userId}`);
			}
		})
	});
}

module.exports = {
	initialize: initialize,
	uploadFile: uploadFile
};
