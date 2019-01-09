INSERT INTO `executedScripts` (`name`, `description`, `createdDate`, `executedDate`)
VALUES
	('190109_02', 'Added 6 plans to plans table', NOW(), NOW());

INSERT INTO `plans` (`id`, `name`, `description`, `stripeProductId`, `billingInterval`, `currency`, `price`, `newSubscriptionsAllowed`, `active`, `createdAt`, `updatedAt`)
VALUES
	(1, 'Basic Plan Monthly', 'Description of stripe basic plan', 'xxxxxxxxx_stripe', 1, 'aud', 0.00, 1, 1, NOW(), NOW()),
	(2, 'Standard Plan Monthly', 'Description of stripe standard plan', 'xxxxxxxxx_stripe', 1, 'aud', 0.00, 1, 1, NOW(), NOW()),
	(3, 'Professional Plan Monthly', 'Description of stripe professional plan', 'xxxxxxxxx_stripe', 1, 'aud', 0.00, 1, 1, NOW(), NOW()),
	(4, 'Basic Plan Yearly', 'Description of stripe basic plan', 'xxxxxxxxx_stripe', 2, 'aud', 0.00, 1, 1, NOW(), NOW()),
	(5, 'Standard Plan Yearly', 'Description of stripe strandard plan', 'xxxxxxxxx_stripe', 2, 'aud', 0.00, 1, 1, NOW(), NOW()),
	(6, 'Professional Plan Yearly', 'Description of stripe professional plan', 'xxxxxxxxx_stripe', 2, 'aud', 0.00, 1, 1, NOW(), NOW());
