DROP TABLE IF EXISTS `interactions`;
DROP TABLE IF EXISTS `users`;
DROP TABLE IF EXISTS `items`;

--
-- Drop Tables
--
SET foreign_key_checks = 0;
DROP TABLE if exists users;
SET foreign_key_checks = 1;

-- the order of the tables is important in the migration file because of the foreign key constraints



CREATE TABLE `interactions` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `borrower_id` INT NOT NULL,
    `owner_id` INT NOT NULL,
    `item_id` INT NOT NULL,
    `status` ENUM('requested', 'borrowed', 'returned') NOT NULL,
    `start_date` DATE NOT NULL,
    `end_date` DATE NOT NULL,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`borrower_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`owner_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`item_id`) REFERENCES `items`(`id`) ON DELETE CASCADE
);