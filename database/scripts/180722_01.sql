INSERT INTO `executedScripts` (`name`, `description`, `createdDate`, `executedDate`)
VALUES
	('180722_01', 'Added emailVerified column to user table', NOW(), NOW());

ALTER TABLE `user`
ADD COLUMN `emailVerified` tinyint(1) NOT NULL DEFAULT 0;