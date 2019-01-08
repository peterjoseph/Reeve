INSERT INTO `executedScripts` (`name`, `description`, `createdDate`, `executedDate`)
VALUES
	('190109_01', 'Removed redundant columns from database', NOW(), NOW());


ALTER TABLE `plans` DROP `monthlyPrice`;
ALTER TABLE `plans` DROP `yearlyPrice`;

ALTER TABLE `plans`
ADD COLUMN `billingInterval` TINYINT(16) UNSIGNED;

CREATE TABLE `billingIntervals` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(11) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4;

INSERT INTO `billingIntervals` (`id`, `name`, `description`, `createdAt`, `updatedAt`)
VALUES
	(1, 'month', 'Clients are billed on a monthly basis (on the same day of each month)', NOW(), NOW()),
	(2, 'year', 'Clients are billed on a yearly basis', NOW(), NOW());

ALTER TABLE `plans`
ADD COLUMN `price` decimal(6,2) NOT NULL DEFAULT '0.0';