INSERT INTO `executedScripts` (`name`, `description`, `createdDate`, `executedDate`)
VALUES
	('180720_02', 'Created email verification code table', NOW(), NOW());

CREATE TABLE `emailVerificationCode` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `verificationCode` varchar(255) NOT NULL DEFAULT '',
  `activated` tinyint(1) NOT NULL,
  `userId` int(11) unsigned NOT NULL,
  `clientId` int(11) unsigned NOT NULL,
  `gracePeriod` int(2) unsigned NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;