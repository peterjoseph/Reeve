INSERT INTO `executedScripts` (`name`, `description`, `createdDate`, `executedDate`)
VALUES
	('181003_01', 'Add italian language to default language set', NOW(), NOW());

INSERT INTO `languages` (`id`, `language`, `createdAt`, `updatedAt`)
VALUES
	(2, 'italian', NOW(), NOW());
