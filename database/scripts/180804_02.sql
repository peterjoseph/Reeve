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
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `emailTemplates` (`id`, `type`, `language`, `name`, `description`, `subject`, `html`, `createdAt`, `updatedAt`)
VALUES
	(3, 3, 1, 'Forgot Account Details', 'Email containing account details associated with an email address for all clients', 'Forgot Account Details | Reeve', '<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Strict//EN\" \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd\">\n<html xmlns=\"http://www.w3.org/1999/xhtml\">\n    <head>\n        <meta name=\"viewport\" content=\"width=device-width\">\n        <meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\">\n        <meta http-equiv=\"Content-Type\" content=\"text/html; charset=UTF-8\">\n        <title>Forgot Account Details | Reeve</title>\n        <style>\n            img {max-width: 100%; height: auto;}\n        </style>\n</head>\n    <body>\n        <div id=\"content\">\n		<p>Hi there!</p>\n		<p>You recently entered your email address into the forgot account details page on Reeve. We want to help you get back into your account.</p>\n		<p>The accounts linked to this email address include:</p>\n		<div>\n			<% accounts.forEach(function(account){ %>\n				<p>\n					<b>Client:</b> <%= account.clientName %><br>\n					<b>FirstName:</b> <%= account.firstName %><br>\n					<b>LastName:</b> <%= account.lastName %><br>\n					<b>Login Link:</b> <a href=\"<%= account.workspaceLink %>\"><%= account.workspaceLink %></a><br>\n					<b>Reset Password Link:</b> <a href=\"<%= account.resetPasswordLink %>\"><%= account.resetPasswordLink %></a>\n				</p>\n  			<% }); %>\n		</div>\n		<p>Best Regards,<br>Reeve Customer Support</p>\n	</div>\n	<br><br>\n        <div id=\"footer\">\n	&copy; Copyright 2018 Reeve. All Rights Reserved.\n        </div>\n    </body>\n</html>', NOW(), NOW());
