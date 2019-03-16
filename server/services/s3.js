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
		region: config.s3.region,
		useAccelerateEndpoint: config.s3.useAccelerateEndpoint
	});
}

// Generate pre-signed url for put object into bucket
function generateSignedURL(contentType, bucket, signedUrlExpiryTime, acl, clientId, userId) {
	if (!config.s3.enabled) {
		return;
	}

	return s3.getSignedUrl(
		"putObject",
		{
			Bucket: bucket,
			Key: `${Date.now().toString()}_${clientId}_${userId}`,
			Expires: signedUrlExpiryTime,
			ACL: acl,
			ContentType: contentType
		},
		function(err, url) {
			if (err) {
				throw err;
			} else {
				return url;
			}
		}
	);
}

// Retrieve an object from a bucket
function getObject(bucket, key) {
	if (!config.s3.enabled) {
		return;
	}

	return s3.getObject({ Bucket: bucket, Key: key }, function(err, object) {
		if (err) {
			throw err;
		}
		return object;
	});
}

// Delete an object from a bucket
function deleteObject(bucket, key) {
	if (!config.s3.enabled) {
		return;
	}

	return s3.deleteObjects({ Bucket: bucket, Key: key }, function(err, object) {
		if (err) {
			throw err;
		}
		return object;
	});
}

module.exports = {
	initialize: initialize,
	generateSignedURL: generateSignedURL,
	getObject: getObject,
	deleteObject: deleteObject
};
