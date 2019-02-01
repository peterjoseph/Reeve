INSERT INTO `executedScripts` (`name`, `description`, `createdDate`, `executedDate`)
VALUES
	('190201_01', 'Add new subscriptionID column to plans table', NOW(), NOW());

ALTER TABLE `plans`
ADD COLUMN `subscriptionId` INT(11) UNSIGNED;

INSERT INTO `subscriptions` (`id`, `name`, `description`, `active`, `createdAt`, `updatedAt`)
VALUES
	(2, 'Basic', 'Basic paying customer', 1, NOW(), NOW()),
	(3, 'Standard', 'Standard plan paying customer', 1, NOW(), NOW()),
	(4, 'Professional', 'Professional plan paying customer', 1, NOW(), NOW());

UPDATE `plans` SET `subscriptionId` = '2' WHERE `id` = 1;
UPDATE `plans` SET `subscriptionId` = '3' WHERE `id` = 2;
UPDATE `plans` SET `subscriptionId` = '4' WHERE `id` = 3;
UPDATE `plans` SET `subscriptionId` = '2' WHERE `id` = 4;
UPDATE `plans` SET `subscriptionId` = '3' WHERE `id` = 5;
UPDATE `plans` SET `subscriptionId` = '4' WHERE `id` = 6;
