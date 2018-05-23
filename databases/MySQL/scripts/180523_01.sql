INSERT INTO `executedScripts` (`name`, `description`, `createdDate`, `executedDate`)
VALUES
	('180523_01', 'Create new user roles features roleFeatures subscriptionFeatures tables ', NOW(), NOW());

CREATE TABLE `user` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `firstName` varchar(255) NOT NULL DEFAULT '',
  `lastName` varchar(255) NOT NULL DEFAULT '',
  `clientId` int(11) unsigned NOT NULL,
  `emailAddress` varchar(255) NOT NULL DEFAULT '',
  `password` varchar(255) NOT NULL DEFAULT '',
  `createdDate` datetime NOT NULL,
  `ModifiedDate` int(11) NOT NULL,
  `active` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `FK_clientId` (`clientId`),
  CONSTRAINT `FK_clientId` FOREIGN KEY (`clientId`) REFERENCES `client` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

