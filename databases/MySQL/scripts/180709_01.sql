INSERT INTO `executedScripts` (`name`, `description`, `createdDate`, `executedDate`)
VALUES
	('180708_01', 'Added createdAt and updatedAt columns to subscriptionFeatures', NOW(), NOW());

ALTER TABLE `subscriptionFeatures` ADD COLUMN `createdAt` date NULL;
ALTER TABLE `subscriptionFeatures` ADD COLUMN `updatedAt` date NULL;