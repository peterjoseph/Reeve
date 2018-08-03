INSERT INTO `executedScripts` (`name`, `description`, `createdDate`, `executedDate`)
VALUES
	('180804_01', 'Forgot Account Details Email', NOW(), NOW());

INSERT INTO `emailTypes` (`id`, `name`, `description`, `createdAt`, `updatedAt`)
VALUES
	(3, 'Forgot Account Details', 'Email with workspace url and reset account links for all users associated with an email address', NOW(), NOW());

