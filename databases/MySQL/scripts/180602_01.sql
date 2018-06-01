INSERT INTO `executedScripts` (`name`, `description`, `createdDate`, `executedDate`)
VALUES
	('180602_01', 'Clean up client table and organize subscriptions', NOW(), NOW());

ALTER TABLE `client`
DROP COLUMN `trial`,
DROP COLUMN `trialExpiry`,
DROP COLUMN `subscription`;

ALTER TABLE `client`
ADD COLUMN `subscriptionEndDate` date DEFAULT NULL;

ALTER TABLE `client`
MODIFY COLUMN `subscriptionId` int(3) DEFAULT 1;

UPDATE `subscriptions`
SET `name` = 'Trial', `description` = 'Default Trial account when a new client is created'
WHERE id = 1;

ALTER TABLE `user`
ADD `lastLoginDate` datetime DEFAULT NULL;