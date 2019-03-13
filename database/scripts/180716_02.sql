INSERT INTO `executedScripts` (`name`, `description`, `createdDate`, `executedDate`)
VALUES
	('180716_02', 'Added language column to client and user tables', NOW(), NOW());

ALTER TABLE `client` ADD COLUMN `defaultLanguage` int(11) NOT NULL DEFAULT 1;
ALTER TABLE `user` ADD COLUMN `language` int(11) NOT NULL DEFAULT 1;

ALTER TABLE `client`
MODIFY COLUMN `defaultLanguage` int(11) UNSIGNED NOT NULL DEFAULT 1;

ALTER TABLE `user`
MODIFY COLUMN `language` int(11) UNSIGNED NOT NULL DEFAULT 1;