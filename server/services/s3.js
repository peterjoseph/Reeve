import aws from "aws-sdk";
import mime from "mime-types";

import { ServerResponseError } from "utilities/errors/serverResponseError";
import { validateURL } from "shared/utilities/domains";
import { t } from "shared/translations/i18n";

let config = require("../../config");

let s3 = null;
let cfSigner = null;

function initialize(app) {
	if (!config.s3.enabled) {
		return;
	}

	// Initialize new s3 connection
	s3 = new aws.S3({
		accessKeyId: config.s3.accessKeyId,
		secretAccessKey: config.s3.secretAccessKey,
		region: config.s3.region,
		endpoint: config.s3.endpoint,
		useAccelerateEndpoint: config.s3.useAccelerateEndpoint,
		forcePathStyle: config.s3.forcePathStyle,
		bucketEndpoint: config.s3.bucketEndpoint,
		signatureVersion: config.s3.signatureVersion
	});

	// Connect to cloudfront Signer if enabled
	if (config.cloudfront.enabled) {
		cfSigner = new aws.CloudFront.Signer(config.cloudfront.accessKeyId, config.cloudfront.privateAccessKey);
	}
}

// Check object exists in bucket
async function checkObjectExists(bucket, key) {
	if (!config.s3.enabled) {
		throw new ServerResponseError(403, t("error.s3notEnabled"), null);
	}

	try {
		await s3.headObject({ Bucket: bucket, Key: key }).promise();
		return true;
	} catch (error) {
		return false;
	}
}

// Generate pre-signed url for put object into bucket
async function presignedPutObject(contentType, bucket, signedUrlExpiryTime, acl, clientId, userId) {
	if (!config.s3.enabled) {
		throw new ServerResponseError(403, t("error.s3notEnabled"), null);
	}

	try {
		// Create file name to store object in bucket
		const extension = mime.extension(contentType);
		const filePath = config.s3.fileDestination ? config.s3.fileDestination : "";
		const key = `${filePath}${Date.now().toString()}_${clientId}_${userId}.${extension}`;

		const url = await s3.getSignedUrl("putObject", {
			Bucket: bucket,
			Key: key,
			Expires: signedUrlExpiryTime,
			ACL: acl,
			ContentType: contentType
		});

		// Throw exception if url is not valid
		if (!validateURL(url)) {
			throw new ServerResponseError(403, t("validation.signedURLInvalidProperties"), null);
		}

		return {
			key: key,
			signedURL: url
		};
	} catch (error) {
		throw error;
	}
}

// Presigned get object from a bucket
async function presignedGetObject(bucket, key, signedUrlExpiryTime) {
	if (!config.s3.enabled) {
		throw new ServerResponseError(403, t("error.s3notEnabled"), null);
	}
	try {
		// Create an empty url variable
		let url = "";

		// If cloudfront enabled, load the signed url from cloudfront, else, direct from S3 bucket
		if (config.cloudfront.enabled) {
			url = cfSigner.getSignedUrl({
				url: `${config.cloudfront.endpoint}${key}`,
				Expires: signedUrlExpiryTime
			});
		} else {
			// Generate signed key from S3 bucket
			url = await s3.getSignedUrl("getObject", {
				Bucket: bucket,
				Key: key,
				Expires: signedUrlExpiryTime
			});
		}

		// Throw exception if url is not valid
		if (!validateURL(url)) {
			throw new ServerResponseError(403, t("validation.signedURLInvalidProperties"), null);
		}

		return {
			key: key,
			signedURL: url
		};
	} catch (error) {
		throw error;
	}
}

// Delete an object from a bucket
async function deleteObject(bucket, key) {
	if (!config.s3.enabled) {
		throw new ServerResponseError(403, t("error.s3notEnabled"), null);
	}
	try {
		await s3.deleteObject({ Bucket: bucket, Key: key }).promise();
		return {
			key: key,
			deleted: true
		};
	} catch (error) {
		throw new ServerResponseError(403, t("error.deletionError"), null);
	}
}

module.exports = {
	initialize: initialize,
	checkObjectExists: checkObjectExists,
	presignedPutObject: presignedPutObject,
	presignedGetObject: presignedGetObject,
	deleteObject: deleteObject
};
