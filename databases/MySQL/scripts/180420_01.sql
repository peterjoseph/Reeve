CREATE TABLE `executed_scripts` (
  `name` varchar(255) NOT NULL DEFAULT '',
  `description` varchar(255) NOT NULL DEFAULT '',
  `created_date` datetime NOT NULL,
  `executed_date` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `executed_scripts` (`name`, `description`, `created_date`, `executed_date`)
VALUES
	('180420_01', 'Create and populate executed_scripts table', '2018-04-20 07:23:41', NOW());