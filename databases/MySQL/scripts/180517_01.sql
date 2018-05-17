INSERT INTO `executed_scripts` (`name`, `description`, `created_date`, `executed_date`)
VALUES
	('180517_01', 'Create new client and subscription tables', NOW(), NOW());

CREATE TABLE `client` (
  `ID` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `NAME` varchar(255) NOT NULL DEFAULT '',
  `WORKSPACE_URL` varchar(255) NOT NULL DEFAULT '',
  `TRIAL` tinyint(1) NOT NULL DEFAULT '1',
  `TRIAL_EXPIRY` date DEFAULT NULL,
  `SUBSCRIPTION` tinyint(1) NOT NULL DEFAULT '0',
  `SUBSCRIPTION_ID` int(3) DEFAULT NULL,
  `SUBSCRIPTION_START_DATE` date DEFAULT NULL,
  `BILLING_CYCLE` int(2) DEFAULT NULL,
  `CREATED_DATE` datetime NOT NULL,
  `MODIFIED_DATE` datetime NOT NULL,
  `ACTIVE` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4;

CREATE TABLE `subscriptions` (
  `ID` int(3) unsigned NOT NULL AUTO_INCREMENT,
  `NAME` varchar(255) NOT NULL DEFAULT '',
  `DESCRIPTION` varchar(255) DEFAULT NULL,
  `ACTIVE` tinyint(1) NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;