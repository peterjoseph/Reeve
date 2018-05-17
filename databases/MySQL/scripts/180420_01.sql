CREATE TABLE `executed_scripts` (
  `name` varchar(255) NOT NULL DEFAULT '',
  `description` varchar(255) NOT NULL DEFAULT '',
  `created_date` datetime NOT NULL,
  `executed_date` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `executed_scripts` (`name`, `description`, `created_date`, `executed_date`)
VALUES
	('180420_01', 'Create and populate executed_scripts table', NOW(), NOW());