INSERT INTO `executedScripts` (`name`, `description`, `createdDate`, `executedDate`)
VALUES
	('190313_02', 'New change email address table', NOW(), NOW());

CREATE TABLE `changeEmailAddress` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `emailCode` varchar(255) NOT NULL DEFAULT '',
  `activated` tinyint(1) NOT NULL,
  `userId` int(11) unsigned NOT NULL,
  `clientId` int(11) unsigned NOT NULL,
  `gracePeriod` int(2) unsigned NOT NULL,
  `oldEmailAddress` varchar(255) NOT NULL,
  `newEmailAddress` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `emailTypes` (`id`, `name`, `description`, `createdAt`, `updatedAt`)
VALUES
	(7, 'Change Email Address', 'If a logged in user attempts to change their email address, a verification email with link is sent to new email address', NOW(), NOW());

INSERT INTO `emailTemplates` (`id`, `type`, `language`, `name`, `description`, `subject`, `html`, `createdAt`, `updatedAt`)
VALUES
	(13, 7, 1, 'Change Email Address', 'Email with link to verify new email address change', 'Change Email Address | Reeve', '<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Strict//EN\" \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd\">\n<html xmlns=\"http://www.w3.org/1999/xhtml\">\n    <head>\n        <meta name=\"viewport\" content=\"width=device-width\">\n        <meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\">\n        <meta http-equiv=\"Content-Type\" content=\"text/html; charset=UTF-8\">\n        <title>Change of Email Address | Reeve</title>\n        <style>\n            img {max-width: 100%; height: auto;}\n        </style>\n</head>\n    <body>\n        <div id=\"content\">\n		<p>Dear <%= firstName %>,</p>\n		<p>You recently changed your email address on the profile page of the workspace <b><%= clientName %></b>. Before we can make this change, we need to verify your new email address.</p>\n		<p>Please click the link below to confirm your change of email address:</p>\n		<div><a href=\"<%= changeEmailLink %>\"><%= changeEmailLink %></a></div>\n		<p>Best Regards,<br>Reeve Customer Support</p>\n	</div>\n	<br><br>\n        <div id=\"footer\">\n	&copy; Copyright 2018 Reeve. All Rights Reserved.\n        </div>\n    </body>\n</html>', '2019-03-13 20:04:54', '2019-03-13 20:04:54'),
	(14, 7, 2, 'Cambia indirizzo email', 'Email con link per verificare la modifica del nuovo indirizzo email', 'Cambia indirizzo email | Reeve', '<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Strict//EN\" \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd\">\n<html xmlns=\"http://www.w3.org/1999/xhtml\">\n    <head>\n        <meta name=\"viewport\" content=\"width=device-width\">\n        <meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\">\n        <meta http-equiv=\"Content-Type\" content=\"text/html; charset=UTF-8\">\n        <title>Modifica dell\'indirizzo email | Reeve</title>\n        <style>\n            img {max-width: 100%; height: auto;}\n        </style>\n</head>\n    <body>\n        <div id=\"content\">\n		<p>Ciao <%= firstName %>,</p>\n		<p>Di recente hai cambiato il tuo indirizzo email nella pagina del profilo dello spazio di lavoro <b><%= clientName %></b>. Prima di poter apportare questa modifica, dobbiamo verificare il tuo nuovo indirizzo email.</p>\n		<p>Fai clic sul link sottostante per confermare la modifica dell\'indirizzo email:</p>\n		<div><a href=\"<%= changeEmailLink %>\"><%= changeEmailLink %></a></div>\n		<p>I migliori saluti,<br>Reeve Servizio Clienti</p>\n	</div>\n	<br><br>\n        <div id=\"footer\">\n	&copy; Copyright 2018 Reeve. Tutti i diritti riservati.\n        </div>\n    </body>\n</html>', '2019-03-13 20:04:54', '2019-03-13 20:04:54');

INSERT INTO `emailTypes` (`id`, `name`, `description`, `createdAt`, `updatedAt`)
VALUES
	(8, 'Change Email Success', 'Email response when a users email address has been successfully changed', '2019-03-13 22:54:43', '2019-03-13 22:54:43');

INSERT INTO `emailTemplates` (`id`, `type`, `language`, `name`, `description`, `subject`, `html`, `createdAt`, `updatedAt`)
VALUES
	(15, 8, 1, 'Change Email Address Success', 'Confirmation email on user email address change', 'Change Email Address Success | Reeve', '<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Strict//EN\" \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd\">\n<html xmlns=\"http://www.w3.org/1999/xhtml\">\n    <head>\n        <meta name=\"viewport\" content=\"width=device-width\">\n        <meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\">\n        <meta http-equiv=\"Content-Type\" content=\"text/html; charset=UTF-8\">\n        <title>Change Email Address Success | Reeve</title>\n        <style>\n            img {max-width: 100%; height: auto;}\n        </style>\n</head>\n    <body>\n        <div id=\"content\">\n		<p>Dear <%= firstName %>,</p>\n		<p>We are sending you this email to confirm that the email address for the workspace <b><%= workspaceName %></b> has successfully been changed from <b><%= oldEmailAddress %></b> to <b><%= newEmailAddress %></b>.</p>\n		<p>If you did not make this change. Please contact support immediately by replying to this email.</p>\n		<p>Best Regards,<br>Reeve Customer Support</p>\n	</div>\n	<br><br>\n        <div id=\"footer\">\n	&copy; Copyright 2018 Reeve. All Rights Reserved.\n        </div>\n    </body>\n</html>', '2019-03-13 23:00:09', '2019-03-13 23:00:09'),
	(16, 8, 2, 'Cambia l\'indirizzo email con successo', 'E-mail di conferma sulla modifica dell\'indirizzo e-mail dell\'utente', 'Cambia l\'indirizzo email con successo | Reeve', '<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Strict//EN\" \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd\">\n<html xmlns=\"http://www.w3.org/1999/xhtml\">\n    <head>\n        <meta name=\"viewport\" content=\"width=device-width\">\n        <meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\">\n        <meta http-equiv=\"Content-Type\" content=\"text/html; charset=UTF-8\">\n        <title>Cambia l\'indirizzo email con successo | Reeve</title>\n        <style>\n            img {max-width: 100%; height: auto;}\n        </style>\n</head>\n    <body>\n        <div id=\"content\">\n		<p>Ciao <%= firstName %>,</p>\n		<p>Ti stiamo inviando questa email per confermare che l\'indirizzo email per lo spazio di lavoro <b> <%= workspaceName %> </b> è stato modificato con successo da <b> <%= oldEmailAddress %> </b> a <b> <%= newEmailAddress %> </b>.</p>\n		<p>Se non hai fatto questo cambiamento. Contatta immediatamente l\'assistenza rispondendo a questa email.</p>\n		<p>I migliori saluti, <br> Reeve Customer Support</p>\n	</div>\n	<br><br>\n        <div id=\"footer\">\n	&copy; Copyright 2018 Reeve. Tutti i diritti riservati.\n        </div>\n    </body>\n</html>', '2019-03-13 23:00:09', '2019-03-13 23:00:09');
