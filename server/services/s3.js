import awsS3 from "aws-sdk/clients/s3";
import mime from "mime-types";

let config = require("../../config");

let s3 = null;

function initialize(app) {
	if (!config.s3.enabled) {
		return;
	}

	// Initialize new s3 connection
	s3 = new awsS3({
		accessKeyId: config.s3.accessKeyId,
		secretAccessKey: config.s3.secretAccessKey,
		region: config.s3.region,
		endpoint: config.s3.endpoint,
		useAccelerateEndpoint: config.s3.useAccelerateEndpoint,
		forcePathStyle: config.s3.forcePathStyle,
		bucketEndpoint: config.s3.bucketEndpoint,
		signatureVersion: config.s3.signatureVersion
	});
}

// Generate pre-signed url for put object into bucket
async function presignedPutObject(contentType, bucket, signedUrlExpiryTime, acl, clientId, userId) {
	if (!config.s3.enabled) {
		return;
	}

	try {
		// Create file name to store object in bucket
		const extension = mime.extension(contentType);
		const key = `${Date.now().toString()}_${clientId}_${userId}.${extension}`;

		const url = await s3.getSignedUrl("putObject", {
			Bucket: bucket,
			Key: key,
			Expires: signedUrlExpiryTime,
			ACL: acl,
			ContentType: contentType
		});

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
		return;
	}
	try {
		const url = await s3.getSignedUrl("getObject", {
			Bucket: bucket,
			Key: key,
			Expires: signedUrlExpiryTime
		});

		return {
			key: key,
			signedURL: url
		};
	} catch (error) {
		throw error;
	}
}

// Check object exists in bucket
async function checkObjectExists(bucket, key) {
	if (!config.s3.enabled) {
		return;
	}

	try {
		await s3.headObject({ Bucket: bucket, Key: key }).promise();
		return true;
	} catch (error) {
		return false;
	}
}

// Retrieve an object from a bucket
async function getObject(bucket, key) {
	if (!config.s3.enabled) {
		return;
	}

	try {
		const object = await s3.getObject({ Bucket: bucket, Key: key });
		return object;
	} catch (error) {
		throw error;
	}
}

// Delete an object from a bucket
async function deleteObject(bucket, key) {
	if (!config.s3.enabled) {
		return;
	}
	try {
		await s3.deleteObject({ Bucket: bucket, Key: key }).promise();
		return;
	} catch (error) {
		throw error;
	}
}

module.exports = {
	initialize: initialize,
	presignedPutObject: presignedPutObject,
	presignedGetObject: presignedGetObject,
	checkObjectExists: checkObjectExists,
	getObject: getObject,
	deleteObject: deleteObject
};
