INSERT INTO `executedScripts` (`name`, `description`, `createdDate`, `executedDate`)
VALUES
	('190104_01', 'Insert 3 new columns in the plans table', NOW(), NOW());

ALTER TABLE `plans`
ADD COLUMN `currency` CHAR(3) NOT NULL DEFAULT 'aud';

ALTER TABLE `plans`
ADD COLUMN `monthlyPrice` decimal(6,2) NOT NULL DEFAULT '0.0';

ALTER TABLE `plans`
ADD COLUMN `yearlyPrice` decimal(6,2) NOT NULL DEFAULT '0.0';