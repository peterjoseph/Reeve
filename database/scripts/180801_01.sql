INSERT INTO `executedScripts` (`name`, `description`, `createdDate`, `executedDate`)
VALUES
	('180801_01', 'Verify email template', NOW(), NOW());

INSERT INTO `emailTypes` (`id`, `name`, `description`, `createdAt`, `updatedAt`)
VALUES
	(2, 'Verify Email', 'Contains validation link to verify user email (Can be sent multiple times)', NOW(), NOW());

INSERT INTO `emailTemplates` (`id`, `type`, `language`, `name`, `description`, `subject`, `html`, `createdAt`, `updatedAt`)
VALUES
	(2, 2, 1, 'Verify Email', 'User email verification link email', 'Please verify your email address | Reeve', '<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Strict//EN\" \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd\">\n<html xmlns=\"http://www.w3.org/1999/xhtml\">\n    <head>\n        <meta name=\"viewport\" content=\"width=device-width\">\n        <meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\">\n        <meta http-equiv=\"Content-Type\" content=\"text/html; charset=UTF-8\">\n        <title>Please verify your email address | Reeve</title>\n        <style>\n            img {max-width: 100%; height: auto;}\n        </style>\n</head>\n    <body>\n        <div id=\"content\">\n		<p>Dear <%= firstName %>,</p>\n		<p>Please click the following link to verify your email address with Reeve <a href=\"<%= validationLink %>\"><%= validationLink %></a>.</p>\n		<p>A verified email address allows you to receive account notifications and ensures you receive updates relating to our product.</p>\n 		<p>Please reply to this email if you have any suggestions/feedback.</p>\n		<p>Best Regards,<br>Reeve Customer Support</p>\n	</div>\n	<br><br>\n        <div id=\"footer\">\n	&copy; Copyright 2018 Reeve. All Rights Reserved.\n        </div>\n    </body>\n</html>', '2018-08-01 21:45:00', '2018-08-01 21:45:03');

