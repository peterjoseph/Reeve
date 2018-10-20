INSERT INTO `executedScripts` (`name`, `description`, `createdDate`, `executedDate`)
VALUES
	('180825_01', 'Swap subscription start and end dates to dateTime', NOW(), NOW());

ALTER TABLE `client`
MODIFY COLUMN `subscriptionStartDate` DATETIME,
MODIFY COLUMN `subscriptionEndDate` DATETIME;