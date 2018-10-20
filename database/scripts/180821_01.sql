INSERT INTO `executedScripts` (`name`, `description`, `createdDate`, `executedDate`)
VALUES
	('180821_01', 'New billing features and subscriptions', NOW(), NOW());

INSERT INTO `features` (`id`, `name`, `description`, `createdAt`, `updatedAt`)
VALUES
	(2, 'Billing', 'Client can pay an ongoing fee and receive access to the platform', NOW(), NOW());

INSERT INTO `roles` (`id`, `name`, `description`, `createdAt`, `updatedAt`)
VALUES
	(2, 'Administrator', 'Access to secondary management functions throughout the app', NOW(), NOW()),
	(3, 'Finance', 'Finance and payment specific parts of the app', NOW(), NOW());

INSERT INTO `subscriptions` (`id`, `name`, `description`, `active`, `createdAt`, `updatedAt`)
VALUES
	(2, 'Basic', 'Basic paying customer', 1, NOW(), NOW());

INSERT INTO `subscriptionFeatures` (`id`, `subscriptionId`, `featureId`, `createdAt`, `updatedAt`)
VALUES
	(2, 1, 2, NOW(), NOW()),
	(3, 2, 2, NOW(), NOW());
