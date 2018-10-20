INSERT INTO `executedScripts` (`name`, `description`, `createdDate`, `executedDate`)
VALUES
	('180517_01', 'Create new client and subscription tables', NOW(), NOW());

CREATE TABLE `client` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL DEFAULT '',
  `workspaceURL` varchar(255) NOT NULL DEFAULT '',
  `trial` tinyint(1) NOT NULL DEFAULT '1',
  `trialExpiry` date DEFAULT NULL,
  `subscription` tinyint(1) NOT NULL DEFAULT '0',
  `subscriptionId` int(3) DEFAULT NULL,
  `subscriptionStartDate` date DEFAULT NULL,
  `billingCycle` int(2) DEFAULT NULL,
  `createdDate` datetime NOT NULL,
  `modifiedDate` datetime NOT NULL,
  `active` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4;

CREATE TABLE `subscriptions` (
  `id` int(3) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL DEFAULT '',
  `description` varchar(255) DEFAULT NULL,
  `active` tinyint(1) NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;