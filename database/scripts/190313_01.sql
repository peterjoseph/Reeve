INSERT INTO `executedScripts` (`name`, `description`, `createdDate`, `executedDate`)
VALUES
	('190313_01', 'New user profile columns', NOW(), NOW());

ALTER TABLE `user`
ADD COLUMN `bio` varchar(255) NULL;

ALTER TABLE `user`
ADD COLUMN `location` varchar(255) NULL;

ALTER TABLE `user`
ADD COLUMN `website` varchar(255) NULL;

INSERT INTO `subscriptionFeatures` (`id`, `subscriptionId`, `featureId`, `createdAt`, `updatedAt`)
VALUES
	(4, 2, 1, '2019-03-13 11:25:33', '2019-03-13 11:25:33'),
	(5, 3, 1, '2019-03-13 11:25:33', '2019-03-13 11:25:33'),
	(6, 3, 2, '2019-03-13 11:25:33', '2019-03-13 11:25:33'),
	(7, 4, 1, '2019-03-13 11:25:33', '2019-03-13 11:25:33'),
	(8, 4, 2, '2019-03-13 11:25:33', '2019-03-13 11:25:33');