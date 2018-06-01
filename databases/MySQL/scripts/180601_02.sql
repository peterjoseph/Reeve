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