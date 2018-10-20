INSERT INTO `executedScripts` (`name`, `description`, `createdDate`, `executedDate`)
VALUES
	('180716_01', 'New Email and Languages tables', NOW(), NOW());

CREATE TABLE `languages` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `language` varchar(11) NOT NULL DEFAULT '',
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4;

INSERT INTO `languages` (`id`, `language`)
VALUES
	(1, 'english');

CREATE TABLE `emailTypes` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL DEFAULT '',
  `description` varchar(255) NOT NULL DEFAULT '',
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4;

INSERT INTO `emailTypes` (`id`, `name`, `description`, `createdAt`, `updatedAt`)
VALUES
	(1, 'Client Welcome Email', 'Introductory email when a new client account is created', '2018-07-16 22:05:10', '2018-07-16 22:05:15');

CREATE TABLE `emailTemplates` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `type` int(11) unsigned NOT NULL,
  `language` int(11) unsigned NOT NULL,
  `name` varchar(255) NOT NULL DEFAULT '',
  `description` varchar(255) DEFAULT NULL,
  `subject` varchar(255) NOT NULL DEFAULT '',
  `html` text NOT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_Email_Type` (`type`),
  KEY `FK_Email_Language` (`language`),
  CONSTRAINT `FK_Email_Language` FOREIGN KEY (`language`) REFERENCES `languages` (`id`),
  CONSTRAINT `FK_Email_Type` FOREIGN KEY (`type`) REFERENCES `emailTypes` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `sentEmails` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `clientId` int(11) unsigned NOT NULL,
  `userId` int(11) unsigned NOT NULL,
  `emailType` int(11) unsigned NOT NULL,
  `emailLanguage` int(11) unsigned NOT NULL,
  `to` varchar(255) NOT NULL DEFAULT '',
  `from` varchar(255) NOT NULL DEFAULT '',
  `subject` varchar(255) NOT NULL DEFAULT '',
  `contents` text NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_se_clientId` (`clientId`),
  KEY `FK_se_userId` (`userId`),
  KEY `FK_se_emailType` (`emailType`),
  KEY `FK_se_language` (`emailLanguage`),
  CONSTRAINT `FK_se_clientId` FOREIGN KEY (`clientId`) REFERENCES `client` (`id`),
  CONSTRAINT `FK_se_emailType` FOREIGN KEY (`emailType`) REFERENCES `emailTypes` (`id`),
  CONSTRAINT `FK_se_language` FOREIGN KEY (`emailLanguage`) REFERENCES `languages` (`id`),
  CONSTRAINT `FK_se_userId` FOREIGN KEY (`userId`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `failedEmails` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `clientId` int(11) unsigned NOT NULL,
  `userId` int(11) unsigned NOT NULL,
  `emailType` int(11) unsigned NOT NULL,
  `emailLanguage` int(11) unsigned NOT NULL,
  `to` varchar(255) NOT NULL DEFAULT '',
  `from` varchar(255) NOT NULL DEFAULT '',
  `subject` varchar(255) NOT NULL DEFAULT '',
  `contents` text NOT NULL,
  `reason` text NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_fe_userId` (`userId`),
  KEY `FK_fe_clientId` (`clientId`),
  KEY `FK_fe_emailType` (`emailType`),
  KEY `FK_fe_language` (`emailLanguage`),
  CONSTRAINT `FK_fe_clientId` FOREIGN KEY (`clientId`) REFERENCES `client` (`id`),
  CONSTRAINT `FK_fe_emailType` FOREIGN KEY (`emailType`) REFERENCES `emailTypes` (`id`),
  CONSTRAINT `FK_fe_language` FOREIGN KEY (`emailLanguage`) REFERENCES `languages` (`id`),
  CONSTRAINT `FK_fe_userId` FOREIGN KEY (`userId`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;