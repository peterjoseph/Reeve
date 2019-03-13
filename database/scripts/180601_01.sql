INSERT INTO `executedScripts` (`name`, `description`, `createdDate`, `executedDate`)
VALUES
	('180601_01', 'Create new client styling table', NOW(), NOW());

CREATE TABLE `clientStyling` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `clientId` int(11) unsigned NOT NULL,
  `logoImage` varchar(255) DEFAULT NULL,
  `backgroundImage` varchar(255) DEFAULT NULL,
  `backgroundColor` varchar(32) DEFAULT NULL,
  `primaryColor` varchar(32) DEFAULT NULL,
  `secondaryColor` varchar(32) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;