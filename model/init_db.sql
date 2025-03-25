DROP TABLE IF EXISTS `interactions`;
DROP TABLE IF EXISTS `items`;
DROP TABLE IF EXISTS `users`;

CREATE TABLE `users`(
    `id` INT NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(255) UNIQUE NOT NULL,
    `email` VARCHAR(255) UNIQUE NOT NULL,
    `phonenumber` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    PRIMARY KEY(`id`)
);

CREATE TABLE `items`(
    `id` INT NOT NULL AUTO_INCREMENT,
    `created_at` TIMESTAMP DEFAULT  CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT  CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    `title` VARCHAR(255) NOT NULL,
    `image` VARCHAR(255) NOT NULL,
    `description` TEXT NOT NULL,
    `category` ENUM(
        'tools',
        'outdoor',
        'kitchenware',
        'cleaning',
        'electronics',
        'sports',
        'furniture',
        'events',
        'childrens',
        'seasonal',
        'crafts',
        'media',
        'vehicles',
        'misc'
    ) NOT NULL,
    `owner_id` INT NOT NULL,
    `status` ENUM('available', 'unavailable') NOT NULL, DEFAULT 'available',
    `latitude` INT NULL,
    `longitude` INT NULL,
    PRIMARY KEY(`id`),
    FOREIGN KEY (`owner_id`) REFERENCES `users`(`id`) ON DELETE CASCADE 
);

CREATE TABLE `interactions` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `borrower_id` INT NOT NULL,
    `owner_id` INT NOT NULL,
    `item_id` INT NOT NULL,
    `status` ENUM('requested', 'borrowed', 'borrower-returned', 'returned') NOT NULL,
    `start_date` DATE NOT NULL,
    `end_date` DATE NOT NULL,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`borrower_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`owner_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`item_id`) REFERENCES `items`(`id`) ON DELETE CASCADE
);