INSERT INTO `executedScripts` (`name`, `description`, `createdDate`, `executedDate`)
VALUES
	('190321_01', 'Added description on client table', NOW(), NOW());

ALTER TABLE `client`
ADD COLUMN `description` varchar(255) NULL;