INSERT INTO `executedScripts` (`name`, `description`, `createdDate`, `executedDate`)
VALUES
	('190110_01', 'Created currencies table', NOW(), NOW());

CREATE TABLE `currencies` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `identifier` char(3) NOT NULL DEFAULT '',
  `description` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `currencies` (`id`, `identifier`, `description`, `createdAt`, `updatedAt`)
VALUES
	(1, 'aud', 'Australian Dollar', NOW(), NOW());

UPDATE `plans` SET `currency` = '1' WHERE `id` = 1;
UPDATE `plans` SET `currency` = '1' WHERE `id` = 2;
UPDATE `plans` SET `currency` = '1' WHERE `id` = 3;
UPDATE `plans` SET `currency` = '1' WHERE `id` = 4;
UPDATE `plans` SET `currency` = '1' WHERE `id` = 5;
UPDATE `plans` SET `currency` = '1' WHERE `id` = 6;

ALTER TABLE `plans` MODIFY `currency` int(11) unsigned NOT NULL DEFAULT 1;