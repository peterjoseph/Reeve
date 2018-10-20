INSERT INTO `executedScripts` (`name`, `description`, `createdDate`, `executedDate`)
VALUES
	('180708_01', 'Add createdAt and updatedAt columns', NOW(), NOW());

ALTER TABLE `client` CHANGE `createdDate` `createdAt` date NOT NULL;
ALTER TABLE `client` CHANGE `modifiedDate` `updatedAt` date NOT NULL;
ALTER TABLE `clientStyling` ADD COLUMN `createdAt` date NULL;
ALTER TABLE `clientStyling` ADD COLUMN `updatedAt` date NULL;
ALTER TABLE `features` ADD COLUMN `createdAt` date NULL;
ALTER TABLE `features` ADD COLUMN `updatedAt` date NULL;
ALTER TABLE `roles` CHANGE `createdDate` `createdAt` date NOT NULL;
ALTER TABLE `roles` CHANGE `modifiedDate` `updatedAt` date NOT NULL;
ALTER TABLE `user` CHANGE `createdDate` `createdAt` date NOT NULL;
ALTER TABLE `user` CHANGE `modifiedDate` `updatedAt` date NOT NULL;
ALTER TABLE `userRoles` CHANGE `createdDate` `createdAt` date NOT NULL;
ALTER TABLE `userRoles` CHANGE `modifiedDate` `updatedAt` date NOT NULL;