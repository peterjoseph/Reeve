INSERT INTO `executedScripts` (`name`, `description`, `createdDate`, `executedDate`)
VALUES
	('180805_01', 'Email with link to reset user password', NOW(), NOW());

INSERT INTO `emailTypes` (`id`, `name`, `description`, `createdAt`, `updatedAt`)
VALUES
	(4, 'Forgot Password', 'Email with link to reset account password', NOW(), NOW());

INSERT INTO `emailTemplates` (`id`, `type`, `language`, `name`, `description`, `subject`, `html`, `createdAt`, `updatedAt`)
VALUES
	(4, 4, 1, 'Reset Password', 'Email with link to reset account password', 'Reset Password | Reeve', '<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Strict//EN\" \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd\">\n<html xmlns=\"http://www.w3.org/1999/xhtml\">\n    <head>\n        <meta name=\"viewport\" content=\"width=device-width\">\n        <meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\">\n        <meta http-equiv=\"Content-Type\" content=\"text/html; charset=UTF-8\">\n        <title>Reset Password | Reeve</title>\n        <style>\n            img {max-width: 100%; height: auto;}\n        </style>\n</head>\n    <body>\n        <div id=\"content\">\n		<p>Dear <%= firstName %>,</p>\n		<p>You recently entered your email address into the forgot account details page of the workspace <b><%= clientName %></b>. We want to help you get back into your account.</p>\n		<p>You can use the following link below to reset the password to your account:</p>\n		<div><a href=\"<%= resetPasswordLink %>\"><%= resetPasswordLink %></a></div>\n		<p>Best Regards,<br>Reeve Customer Support</p>\n	</div>\n	<br><br>\n        <div id=\"footer\">\n	&copy; Copyright 2018 Reeve. All Rights Reserved.\n        </div>\n    </body>\n</html>', NOW(), NOW());
