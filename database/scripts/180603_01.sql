INSERT INTO `executedScripts` (`name`, `description`, `createdDate`, `executedDate`)
VALUES
	('180603_01', 'Set subscription id as required', NOW(), NOW());

ALTER TABLE `client`
MODIFY COLUMN `subscriptionId` int(3) NOT NULL DEFAULT 1;