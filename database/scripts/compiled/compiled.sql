CREATE TABLE `executedScripts` (
  `name` varchar(255) NOT NULL DEFAULT '',
  `description` varchar(255) NOT NULL DEFAULT '',
  `createdDate` datetime NOT NULL,
  `executedDate` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `executedScripts` (`name`, `description`, `createdDate`, `executedDate`)
VALUES
	('180420_01', 'Create and populate executed_scripts table', NOW(), NOW());

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

INSERT INTO `executedScripts` (`name`, `description`, `createdDate`, `executedDate`)
VALUES
	('180523_01', 'Create new user table', NOW(), NOW());

CREATE TABLE `user` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `firstName` varchar(255) NOT NULL DEFAULT '',
  `lastName` varchar(255) NOT NULL DEFAULT '',
  `clientId` int(11) unsigned NOT NULL,
  `emailAddress` varchar(255) NOT NULL DEFAULT '',
  `password` varchar(255) NOT NULL DEFAULT '',
  `active` tinyint(1) NOT NULL DEFAULT '1',
  `createdDate` datetime NOT NULL,
  `ModifiedDate` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_ClientId` (`clientId`),
  CONSTRAINT `FK_ClientId` FOREIGN KEY (`clientId`) REFERENCES `client` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `executedScripts` (`name`, `description`, `createdDate`, `executedDate`)
VALUES
	('180524_01', 'Create new role tables and foreign keys', NOW(), NOW());

CREATE TABLE `roles` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL DEFAULT '',
  `description` varchar(255) NOT NULL DEFAULT '',
  `createdDate` datetime NOT NULL,
  `modifiedDate` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `roles` (`id`, `name`, `description`, `createdDate`, `modifiedDate`)
VALUES
	(1, 'Owner', 'Highest level role with access to all subscription features', NOW(), NOW());

CREATE TABLE `userRoles` (
  `id` int(21) unsigned NOT NULL AUTO_INCREMENT,
  `userId` int(11) unsigned NOT NULL,
  `roleId` int(11) unsigned NOT NULL,
  `active` tinyint(1) NOT NULL DEFAULT '1',
  `createdDate` datetime NOT NULL,
  `modifiedDate` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_userId` (`userId`),
  KEY `FK_roleId` (`roleId`),
  CONSTRAINT `FK_roleId` FOREIGN KEY (`roleId`) REFERENCES `roles` (`id`),
  CONSTRAINT `FK_userId` FOREIGN KEY (`userId`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

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
  PRIMARY KEY (`id`),
  KEY `FK_clientId_style` (`clientId`),
  CONSTRAINT `FK_clientId_style` FOREIGN KEY (`clientId`) REFERENCES `client` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `executedScripts` (`name`, `description`, `createdDate`, `executedDate`)
VALUES
	('180601_02', 'Create new features table', NOW(), NOW());

CREATE TABLE `features` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL DEFAULT '',
  `description` varchar(255) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `features` (`id`, `name`, `description`)
VALUES
	(1, 'Styling', 'Client can specify their own unique styling, logo image, background, primary and secondary colors');

    INSERT INTO `executedScripts` (`name`, `description`, `createdDate`, `executedDate`)
VALUES
	('180601_03', 'Link features to subscriptionFeatures table', NOW(), NOW());

CREATE TABLE `subscriptionFeatures` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `subscriptionId` int(3) unsigned NOT NULL,
  `featureId` int(11) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_SubscriptionId` (`subscriptionId`),
  KEY `FK_featureId` (`featureId`),
  CONSTRAINT `FK_SubscriptionId` FOREIGN KEY (`subscriptionId`) REFERENCES `subscriptions` (`id`),
  CONSTRAINT `FK_featureId` FOREIGN KEY (`featureId`) REFERENCES `features` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4;

INSERT INTO `subscriptionFeatures` (`id`, `subscriptionId`, `featureId`)
VALUES
	(1, 1, 1);

    INSERT INTO `executedScripts` (`name`, `description`, `createdDate`, `executedDate`)
VALUES
	('180602_01', 'Clean up client table and organize subscriptions', NOW(), NOW());

ALTER TABLE `client`
DROP COLUMN `trial`,
DROP COLUMN `trialExpiry`,
DROP COLUMN `subscription`;

ALTER TABLE `client`
ADD COLUMN `subscriptionEndDate` date DEFAULT NULL;

ALTER TABLE `client`
MODIFY COLUMN `subscriptionId` int(3) DEFAULT 1;

UPDATE `subscriptions`
SET `name` = 'Trial', `description` = 'Default Trial account when a new client is created'
WHERE id = 1;

ALTER TABLE `user`
ADD `lastLoginDate` datetime DEFAULT NULL;

INSERT INTO `executedScripts` (`name`, `description`, `createdDate`, `executedDate`)
VALUES
	('180603_01', 'Set subscription id as required', NOW(), NOW());

ALTER TABLE `client`
MODIFY COLUMN `subscriptionId` int(3) NOT NULL DEFAULT 1;

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

INSERT INTO `executedScripts` (`name`, `description`, `createdDate`, `executedDate`)
VALUES
	('180708_01', 'Added createdAt and updatedAt columns to subscriptionFeatures', NOW(), NOW());

ALTER TABLE `subscriptionFeatures` ADD COLUMN `createdAt` date NULL;
ALTER TABLE `subscriptionFeatures` ADD COLUMN `updatedAt` date NULL;

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

INSERT INTO `executedScripts` (`name`, `description`, `createdDate`, `executedDate`)
VALUES
	('180716_02', 'Added language column to client and user tables', NOW(), NOW());

ALTER TABLE `client` ADD COLUMN `defaultLanguage` int(11) NOT NULL DEFAULT 1;
ALTER TABLE `user` ADD COLUMN `language` int(11) NOT NULL DEFAULT 1;

ALTER TABLE `client` 
ADD FOREIGN KEY (`FK_language_id` ) REFERENCES `languages` (`ID` );

ALTER TABLE `client`
ADD CONSTRAINT `FK_default_language_id`
FOREIGN KEY (`defaultLanguage`)
REFERENCES `languages` (`id` );

ALTER TABLE `user`
ADD CONSTRAINT `FK_language_id`
FOREIGN KEY (`language`)
REFERENCES `languages` (`id` );

ALTER TABLE `client`
MODIFY COLUMN `defaultLanguage` int(11) UNSIGNED NOT NULL DEFAULT 1;

ALTER TABLE `user`
MODIFY COLUMN `language` int(11) UNSIGNED NOT NULL DEFAULT 1;

INSERT INTO `executedScripts` (`name`, `description`, `createdDate`, `executedDate`)
VALUES
	('180716_03', 'Updated created at table columns', NOW(), NOW());

ALTER TABLE `subscriptions` ADD COLUMN `createdAt` DATETIME NULL;
ALTER TABLE `subscriptions` ADD COLUMN `updatedAt` DATETIME NULL;

ALTER TABLE `client`
MODIFY COLUMN `createdAt` DATETIME;

ALTER TABLE `client`
MODIFY COLUMN `updatedAt` DATETIME;

ALTER TABLE `clientStyling`
MODIFY COLUMN `createdAt` DATETIME;

ALTER TABLE `clientStyling`
MODIFY COLUMN `updatedAt` DATETIME;

ALTER TABLE `features`
MODIFY COLUMN `createdAt` DATETIME;

ALTER TABLE `features`
MODIFY COLUMN `updatedAt` DATETIME;

ALTER TABLE `roles`
MODIFY COLUMN `createdAt` DATETIME;

ALTER TABLE `roles`
MODIFY COLUMN `updatedAt` DATETIME;

ALTER TABLE `subscriptionFeatures`
MODIFY COLUMN `createdAt` DATETIME;

ALTER TABLE `subscriptionFeatures`
MODIFY COLUMN `updatedAt` DATETIME;

ALTER TABLE `user`
MODIFY COLUMN `createdAt` DATETIME;

ALTER TABLE `user`
MODIFY COLUMN `updatedAt` DATETIME;

ALTER TABLE `userRoles`
MODIFY COLUMN `createdAt` DATETIME;

ALTER TABLE `userRoles`
MODIFY COLUMN `updatedAt` DATETIME;

INSERT INTO `executedScripts` (`name`, `description`, `createdDate`, `executedDate`)
VALUES
	('180720_01', 'Created Client Welcome Email template', NOW(), NOW());

INSERT INTO `emailTemplates` (`id`, `type`, `language`, `name`, `description`, `subject`, `html`, `createdAt`, `updatedAt`)
VALUES
	(1, 1, 1, 'Client Welcome', 'Introductory email (with activation link) on client registration', 'Welcome to Reeve', '<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Strict//EN\" \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd\">\n<html xmlns=\"http://www.w3.org/1999/xhtml\">\n    <head>\n        <meta name=\"viewport\" content=\"width=device-width\">\n        <meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\">\n        <meta http-equiv=\"Content-Type\" content=\"text/html; charset=UTF-8\">\n        <title>Welcome to Reeve</title>\n        <style>\n            img {max-width: 100%; height: auto;}\n        </style>\n</head>\n    <body>\n        <div id=\"content\">\n		<p>Dear <%= firstName %>,</p>\n		<p>Congratulations! You\'ve just joined a phenominal SaaS company, and an amazing trial product to enjoy for the next 30 days.</p>\n		<p>Please click the following link to verify your email address <a href=\"<%= validationLink %>\"><%= validationLink %></a>.</p>\n		<p>Once your email is verified, you can continue to access your account from the following link <a href=\"<%= workspaceURL %>\"><%= workspaceURL %></a>.</p>\n 		<p>Please reply to this email if you have any suggestions/feedback.</p>\n		<p>Best Regards,<br>Reeve Customer Support</p>\n	</div>\n	<br><br>\n        <div id=\"footer\">\n	&copy; Copyright 2018 Reeve. All Rights Reserved.\n        </div>\n    </body>\n</html>', NOW(), NOW());

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
  PRIMARY KEY (`id`),
  KEY `FK_evc_userId` (`userId`),
  KEY `FK_evc_clientId` (`clientId`),
  CONSTRAINT `FK_evc_clientId` FOREIGN KEY (`clientId`) REFERENCES `client` (`id`),
  CONSTRAINT `FK_evc_userId` FOREIGN KEY (`userId`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `executedScripts` (`name`, `description`, `createdDate`, `executedDate`)
VALUES
	('180722_01', 'Added emailVerified column to user table', NOW(), NOW());

ALTER TABLE `user`
ADD COLUMN `emailVerified` tinyint(1) NOT NULL DEFAULT 0;

INSERT INTO `executedScripts` (`name`, `description`, `createdDate`, `executedDate`)
VALUES
	('180801_01', 'Verify email template', NOW(), NOW());

INSERT INTO `emailTypes` (`id`, `name`, `description`, `createdAt`, `updatedAt`)
VALUES
	(2, 'Verify Email', 'Contains validation link to verify user email (Can be sent multiple times)', NOW(), NOW());

INSERT INTO `emailTemplates` (`id`, `type`, `language`, `name`, `description`, `subject`, `html`, `createdAt`, `updatedAt`)
VALUES
	(2, 2, 1, 'Verify Email', 'User email verification link email', 'Please verify your email address | Reeve', '<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Strict//EN\" \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd\">\n<html xmlns=\"http://www.w3.org/1999/xhtml\">\n    <head>\n        <meta name=\"viewport\" content=\"width=device-width\">\n        <meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\">\n        <meta http-equiv=\"Content-Type\" content=\"text/html; charset=UTF-8\">\n        <title>Please verify your email address | Reeve</title>\n        <style>\n            img {max-width: 100%; height: auto;}\n        </style>\n</head>\n    <body>\n        <div id=\"content\">\n		<p>Dear <%= firstName %>,</p>\n		<p>Please click the following link to verify your email address with Reeve <a href=\"<%= validationLink %>\"><%= validationLink %></a>.</p>\n		<p>A verified email address allows you to receive account notifications and ensures you receive updates relating to our product.</p>\n 		<p>Please reply to this email if you have any suggestions/feedback.</p>\n		<p>Best Regards,<br>Reeve Customer Support</p>\n	</div>\n	<br><br>\n        <div id=\"footer\">\n	&copy; Copyright 2018 Reeve. All Rights Reserved.\n        </div>\n    </body>\n</html>', '2018-08-01 21:45:00', '2018-08-01 21:45:03');

INSERT INTO `executedScripts` (`name`, `description`, `createdDate`, `executedDate`)
VALUES
	('180804_01', 'Forgot Account Details Email', NOW(), NOW());

INSERT INTO `emailTypes` (`id`, `name`, `description`, `createdAt`, `updatedAt`)
VALUES
	(3, 'Forgot Account Details', 'Email with workspace url and reset account links for all users associated with an email address', NOW(), NOW());

INSERT INTO `executedScripts` (`name`, `description`, `createdDate`, `executedDate`)
VALUES
	('180804_02', 'Create password reset table and add null to clientId, UserId in sentEmail table', NOW(), NOW());

ALTER TABLE `sentEmails`
MODIFY COLUMN `userId` int(11) UNSIGNED NULL,
MODIFY COLUMN `clientId` int(11) UNSIGNED NULL;

ALTER TABLE `failedEmails`
MODIFY COLUMN `userId` int(11) UNSIGNED NULL,
MODIFY COLUMN `clientId` int(11) UNSIGNED NULL;

CREATE TABLE `passwordReset` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `resetCode` varchar(255) NOT NULL DEFAULT '',
  `activated` tinyint(1) NOT NULL,
  `userId` int(11) unsigned NOT NULL,
  `clientId` int(11) unsigned NOT NULL,
  `gracePeriod` int(2) unsigned NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_evc_userId` (`userId`),
  KEY `FK_evc_clientId` (`clientId`),
  CONSTRAINT `passwordreset_ibfk_1` FOREIGN KEY (`clientId`) REFERENCES `client` (`id`),
  CONSTRAINT `passwordreset_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `emailTemplates` (`id`, `type`, `language`, `name`, `description`, `subject`, `html`, `createdAt`, `updatedAt`)
VALUES
	(3, 3, 1, 'Forgot Account Details', 'Email containing account details associated with an email address for all clients', 'Forgot Account Details | Reeve', '<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Strict//EN\" \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd\">\n<html xmlns=\"http://www.w3.org/1999/xhtml\">\n    <head>\n        <meta name=\"viewport\" content=\"width=device-width\">\n        <meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\">\n        <meta http-equiv=\"Content-Type\" content=\"text/html; charset=UTF-8\">\n        <title>Forgot Account Details | Reeve</title>\n        <style>\n            img {max-width: 100%; height: auto;}\n        </style>\n</head>\n    <body>\n        <div id=\"content\">\n		<p>Hi there!</p>\n		<p>You recently entered your email address into the forgot account details page on Reeve. We want to help you get back into your account.</p>\n		<p>The accounts linked to this email address include:</p>\n		<div>\n			<% accounts.forEach(function(account){ %>\n				<p>\n					<b>Client:</b> <%= account.clientName %><br>\n					<b>FirstName:</b> <%= account.firstName %><br>\n					<b>LastName:</b> <%= account.lastName %><br>\n					<b>Login Link:</b> <a href=\"<%= account.workspaceLink %>\"><%= account.workspaceLink %></a><br>\n					<b>Reset Password Link:</b> <a href=\"<%= account.resetPasswordLink %>\"><%= account.resetPasswordLink %></a>\n				</p>\n  			<% }); %>\n		</div>\n		<p>Best Regards,<br>Reeve Customer Support</p>\n	</div>\n	<br><br>\n        <div id=\"footer\">\n	&copy; Copyright 2018 Reeve. All Rights Reserved.\n        </div>\n    </body>\n</html>', NOW(), NOW());

INSERT INTO `executedScripts` (`name`, `description`, `createdDate`, `executedDate`)
VALUES
	('180805_01', 'Email with link to reset user password', NOW(), NOW());

INSERT INTO `emailTypes` (`id`, `name`, `description`, `createdAt`, `updatedAt`)
VALUES
	(4, 'Forgot Password', 'Email with link to reset account password', NOW(), NOW());

INSERT INTO `emailTemplates` (`id`, `type`, `language`, `name`, `description`, `subject`, `html`, `createdAt`, `updatedAt`)
VALUES
	(4, 4, 1, 'Reset Password', 'Email with link to reset account password', 'Reset Password | Reeve', '<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Strict//EN\" \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd\">\n<html xmlns=\"http://www.w3.org/1999/xhtml\">\n    <head>\n        <meta name=\"viewport\" content=\"width=device-width\">\n        <meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\">\n        <meta http-equiv=\"Content-Type\" content=\"text/html; charset=UTF-8\">\n        <title>Reset Password | Reeve</title>\n        <style>\n            img {max-width: 100%; height: auto;}\n        </style>\n</head>\n    <body>\n        <div id=\"content\">\n		<p>Dear <%= firstName %>,</p>\n		<p>You recently entered your email address into the forgot account details page of the workspace <b><%= clientName %></b>. We want to help you get back into your account.</p>\n		<p>You can use the following link below to reset the password to your account:</p>\n		<div><a href=\"<%= resetPasswordLink %>\"><%= resetPasswordLink %></a></div>\n		<p>Best Regards,<br>Reeve Customer Support</p>\n	</div>\n	<br><br>\n        <div id=\"footer\">\n	&copy; Copyright 2018 Reeve. All Rights Reserved.\n        </div>\n    </body>\n</html>', NOW(), NOW());

INSERT INTO `executedScripts` (`name`, `description`, `createdDate`, `executedDate`)
VALUES
	('180811_01', 'Reset password success notification email', NOW(), NOW());

INSERT INTO `emailTypes` (`id`, `name`, `description`, `createdAt`, `updatedAt`)
VALUES
	(5, 'Reset Password Success', 'When a users password is reset, send an email notifying the user', NULL, NULL);

INSERT INTO `emailTemplates` (`id`, `type`, `language`, `name`, `description`, `subject`, `html`, `createdAt`, `updatedAt`)
VALUES
	(5, 5, 1, 'Password Reset Success', 'Success email when a user resets their password', 'Your account password has changed | Reeve', '<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Strict//EN\" \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd\">\n<html xmlns=\"http://www.w3.org/1999/xhtml\">\n    <head>\n        <meta name=\"viewport\" content=\"width=device-width\">\n        <meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\">\n        <meta http-equiv=\"Content-Type\" content=\"text/html; charset=UTF-8\">\n        <title>Reset Password | Reeve</title>\n        <style>\n            img {max-width: 100%; height: auto;}\n        </style>\n</head>\n    <body>\n        <div id=\"content\">\n		<p>Dear <%= firstName %>,</p>\n		<p>We are sending you this email to confirm that the password to your account on the workspace <%= workspaceName %> has recently been updated.</p>\n		<p>If you did not make this change. Please contact support immediately by replying to this email.</p>\n		<p>Best Regards,<br>Reeve Customer Support</p>\n	</div>\n	<br><br>\n        <div id=\"footer\">\n	&copy; Copyright 2018 Reeve. All Rights Reserved.\n        </div>\n    </body>\n</html>', NOW(), NOW());

INSERT INTO `executedScripts` (`name`, `description`, `createdDate`, `executedDate`)
VALUES
	('180816_01', 'Profile photo table column', NOW(), NOW());

ALTER TABLE `user`
ADD COLUMN `profilePhoto` varchar(255) DEFAULT NULL;

INSERT INTO `executedScripts` (`name`, `description`, `createdDate`, `executedDate`)
VALUES
	('180821_01', 'New billing features and subscriptions', NOW(), NOW());

INSERT INTO `features` (`id`, `name`, `description`, `createdAt`, `updatedAt`)
VALUES
	(2, 'Billing', 'Client can pay an ongoing fee and receive access to the platform', NOW(), NOW());

INSERT INTO `roles` (`id`, `name`, `description`, `createdAt`, `updatedAt`)
VALUES
	(2, 'Administrator', 'Access to secondary management functions throughout the app', NOW(), NOW()),
	(3, 'Finance', 'Finance and payment specific parts of the app', NOW(), NOW());

INSERT INTO `subscriptions` (`id`, `name`, `description`, `active`, `createdAt`, `updatedAt`)
VALUES
	(2, 'Basic', 'Basic paying customer', 1, NOW(), NOW());

INSERT INTO `subscriptionFeatures` (`id`, `subscriptionId`, `featureId`, `createdAt`, `updatedAt`)
VALUES
	(2, 1, 2, NOW(), NOW()),
	(3, 2, 2, NOW(), NOW());

INSERT INTO `executedScripts` (`name`, `description`, `createdDate`, `executedDate`)
VALUES
	('180825_01', 'Swap subscription start and end dates to dateTime', NOW(), NOW());

ALTER TABLE `client`
MODIFY COLUMN `subscriptionStartDate` DATETIME,
MODIFY COLUMN `subscriptionEndDate` DATETIME;

INSERT INTO `executedScripts` (`name`, `description`, `createdDate`, `executedDate`)
VALUES
	('181003_01', 'Add italian language to default language set', NOW(), NOW());

INSERT INTO `languages` (`id`, `language`, `createdAt`, `updatedAt`)
VALUES
	(2, 'italian', NOW(), NOW());

INSERT INTO `executedScripts` (`name`, `description`, `createdDate`, `executedDate`)
VALUES
	('181006_01', 'Translate emails to italian', NOW(), NOW());

INSERT INTO `emailTemplates` (`id`, `type`, `language`, `name`, `description`, `subject`, `html`, `createdAt`, `updatedAt`)
VALUES
	(6, 1, 2, 'Benvenuto del cliente', 'Email introduttiva (con link di attivazione) sulla registrazione del cliente', 'Benvenuto a Reeve', '<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Strict//EN\" \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd\">\n<html xmlns=\"http://www.w3.org/1999/xhtml\">\n    <head>\n        <meta name=\"viewport\" content=\"width=device-width\">\n        <meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\">\n        <meta http-equiv=\"Content-Type\" content=\"text/html; charset=UTF-8\">\n        <title>Benvenuto a Reeve</title>\n        <style>\n            img {max-width: 100%; height: auto;}\n        </style>\n</head>\n    <body>\n        <div id=\"content\">\n		<p>Caro <%= firstName %>,</p>\n		<p>Congratulazioni! Hai appena aderito a una società fenomenale SaaS e un fantastico prodotto di prova da provare per i prossimi 30 giorni.</p>\n		<p>Fare clic sul seguente collegamento per verificare il proprio indirizzo email <a href=\"<%= validationLink %>\"><%= validationLink %></a>.</p>\n		<p>Una volta verificata la tua email, puoi continuare ad accedere al tuo account dal seguente link <a href=\"<%= workspaceURL %>\"><%= workspaceURL %></a>.</p>\n 		<p>Si prega di rispondere a questa e-mail se avete suggerimenti.</p>\n		<p>I migliori saluti,<br>Reeve Servizio Clienti</p>\n	</div>\n	<br><br>\n        <div id=\"footer\">\n	&copy; Copyright 2018 Reeve. Tutti i diritti riservati.\n        </div>\n    </body>\n</html>', '2018-10-06 10:07:59', '2018-10-06 10:07:59'),
	(7, 2, 2, 'Verifica Email', 'Email del link di verifica email utente', 'Per favore verifica il tuo indirizzo email | Reeve', '<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Strict//EN\" \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd\">\n<html xmlns=\"http://www.w3.org/1999/xhtml\">\n    <head>\n        <meta name=\"viewport\" content=\"width=device-width\">\n        <meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\">\n        <meta http-equiv=\"Content-Type\" content=\"text/html; charset=UTF-8\">\n        <title>Per cortesia verifichi il suo indirizzo email | Reeve</title>\n        <style>\n            img {max-width: 100%; height: auto;}\n        </style>\n</head>\n    <body>\n        <div id=\"content\">\n		<p>Caro <%= firstName %>,</p>\n		<p>Fare clic sul seguente collegamento per verificare il proprio indirizzo email con Reeve <a href=\"<%= validationLink %>\"><%= validationLink %></a>.</p>\n		<p>Un indirizzo email verificato consente di ricevere notifiche sull\'account e garantisce di ricevere aggiornamenti relativi al nostro prodotto.</p>\n 		<p>Si prega di rispondere a questa e-mail se avete qualche suggerimento.</p>\n		<p>I migliori saluti,<br>Reeve Servizio Clienti</p>\n	</div>\n	<br><br>\n        <div id=\"footer\">\n	&copy; Copyright 2018 Reeve. Tutti i diritti riservati.\n        </div>\n    </body>\n</html>', '2018-10-06 10:07:59', '2018-10-06 10:07:59'),
	(8, 3, 2, 'Hai dimenticato i dettagli dell\'account', 'Email contenente i dettagli dell\'account associati a un indirizzo email per tutti i client', 'Hai dimenticato i dettagli del conto | Reeve', '<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Strict//EN\" \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd\">\n<html xmlns=\"http://www.w3.org/1999/xhtml\">\n    <head>\n        <meta name=\"viewport\" content=\"width=device-width\">\n        <meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\">\n        <meta http-equiv=\"Content-Type\" content=\"text/html; charset=UTF-8\">\n        <title>Hai dimenticato i dettagli dell\'account | Reeve</title>\n        <style>\n            img {max-width: 100%; height: auto;}\n        </style>\n</head>\n    <body>\n        <div id=\"content\">\n		<p>Ciao!</p>\n		<p>Di recente hai inserito il tuo indirizzo email nella pagina dei dettagli dell\'account dimenticata su Reeve. Vogliamo aiutarti a tornare nel tuo account.</p>\n		<p>Gli account collegati a questo indirizzo email includono:</p>\n		<div>\n			<% accounts.forEach(function(account){ %>\n				<p>\n					<b>Cliente:</b> <%= account.clientName %><br>\n					<b>Nome di battesimo:</b> <%= account.firstName %><br>\n					<b>Cognome:</b> <%= account.lastName %><br>\n					<b>Link di accesso:</b> <a href=\"<%= account.workspaceLink %>\"><%= account.workspaceLink %></a><br>\n					<b>Reimposta collegamento password:</b> <a href=\"<%= account.resetPasswordLink %>\"><%= account.resetPasswordLink %></a>\n				</p>\n  			<% }); %>\n		</div>\n		<p>I migliori saluti,<br>Reeve Servizio Clienti</p>\n	</div>\n	<br><br>\n        <div id=\"footer\">\n	&copy; Copyright 2018 Reeve. Tutti i diritti riservati.\n        </div>\n    </body>\n</html>', '2018-10-06 10:07:59', '2018-10-06 10:07:59'),
	(9, 4, 2, 'Resetta la password', 'Email con link per reimpostare la password dell\'account', 'Reimposta password | Reeve', '<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Strict//EN\" \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd\">\n<html xmlns=\"http://www.w3.org/1999/xhtml\">\n    <head>\n        <meta name=\"viewport\" content=\"width=device-width\">\n        <meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\">\n        <meta http-equiv=\"Content-Type\" content=\"text/html; charset=UTF-8\">\n        <title>Resetta la password | Reeve</title>\n        <style>\n            img {max-width: 100%; height: auto;}\n        </style>\n</head>\n    <body>\n        <div id=\"content\">\n		<p>Caro <%= firstName %>,</p>\n		<p>Di recente hai inserito il tuo indirizzo email nella pagina dei dettagli dell\'account dimenticata dello spazio di lavoro <b><%= clientName %></b>. Vogliamo aiutarti a tornare nel tuo account.</p>\n		<p>Puoi utilizzare il seguente link qui sotto per reimpostare la password sul tuo account:</p>\n		<div><a href=\"<%= resetPasswordLink %>\"><%= resetPasswordLink %></a></div>\n		<p>I migliori saluti,<br> Reeve Servizio Clienti</p>\n	</div>\n	<br><br>\n        <div id=\"footer\">\n	&copy; Copyright 2018 Reeve. Tutti i diritti riservati.\n        </div>\n    </body>\n</html>', '2018-10-06 10:07:59', '2018-10-06 10:07:59'),
	(10, 5, 2, 'Password reimpostata con successo', 'Email di successo quando un utente reimposta la propria password', 'La password del tuo account è cambiata | Reeve', '<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Strict//EN\" \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd\">\n<html xmlns=\"http://www.w3.org/1999/xhtml\">\n    <head>\n        <meta name=\"viewport\" content=\"width=device-width\">\n        <meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\">\n        <meta http-equiv=\"Content-Type\" content=\"text/html; charset=UTF-8\">\n        <title>Resetta la password | Reeve</title>\n        <style>\n            img {max-width: 100%; height: auto;}\n        </style>\n</head>\n    <body>\n        <div id=\"content\">\n		<p>Caro <%= firstName %>,</p>\n		<p>Ti stiamo inviando questa email per confermare la password del tuo account nell\'area di lavoro <%= workspaceName %> è stato recentemente aggiornato.</p>\n		<p>Se non hai fatto questo cambiamento. Contatta immediatamente l\'assistenza rispondendo a questa email.</p>\n		<p>I migliori saluti,<br>Reeve Servizio Clienti</p>\n	</div>\n	<br><br>\n        <div id=\"footer\">\n	&copy; Copyright 2018 Reeve. Tutti i diritti riservati.\n        </div>\n    </body>\n</html>', '2018-10-06 10:07:59', '2018-10-06 10:07:59');
