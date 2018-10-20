INSERT INTO `executedScripts` (`name`, `description`, `createdDate`, `executedDate`)
VALUES
	('180716_03', 'Updated created at table columns', NOW(), NOW());

ALTER TABLE `subscriptions` ADD COLUMN `createdAt` DATETIME NULL;
ALTER TABLE `subscriptions` ADD COLUMN `updatedAt` DATETIME NULL;

ALTER TABLE `client`
MODIFY COLUMN `createdAt` DATETIME;

ALTER TABLE `client`
MODIFY COLUMN `updatedAt` DATETIME;

ALTER TABLE `clientStyling`
MODIFY COLUMN `createdAt` DATETIME;

ALTER TABLE `clientStyling`
MODIFY COLUMN `updatedAt` DATETIME;

ALTER TABLE `features`
MODIFY COLUMN `createdAt` DATETIME;

ALTER TABLE `features`
MODIFY COLUMN `updatedAt` DATETIME;

ALTER TABLE `roles`
MODIFY COLUMN `createdAt` DATETIME;

ALTER TABLE `roles`
MODIFY COLUMN `updatedAt` DATETIME;

ALTER TABLE `subscriptionFeatures`
MODIFY COLUMN `createdAt` DATETIME;

ALTER TABLE `subscriptionFeatures`
MODIFY COLUMN `updatedAt` DATETIME;

ALTER TABLE `user`
MODIFY COLUMN `createdAt` DATETIME;

ALTER TABLE `user`
MODIFY COLUMN `updatedAt` DATETIME;

ALTER TABLE `userRoles`
MODIFY COLUMN `createdAt` DATETIME;

ALTER TABLE `userRoles`
MODIFY COLUMN `updatedAt` DATETIME;