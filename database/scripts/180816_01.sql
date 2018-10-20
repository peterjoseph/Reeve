INSERT INTO `executedScripts` (`name`, `description`, `createdDate`, `executedDate`)
VALUES
	('180816_01', 'Profile photo table column', NOW(), NOW());

ALTER TABLE `user`
ADD COLUMN `profilePhoto` varchar(255) DEFAULT NULL;
