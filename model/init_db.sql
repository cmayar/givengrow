--
-- Drop Tables
--

--
-- Drop Tables
--
SET foreign_key_checks = 0;
DROP TABLE if exists trips;
DROP TABLE if exists destinations;
SET foreign_key_checks = 1;

-- the order of the tables is important in the migration file because of the foreign key constraints
CREATE TABLE `trips`(
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `title` VARCHAR(255) NOT NULL,
    `start_date` DATE NULL,
    `end_date` DATE NULL,
    `description` TEXT,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP  DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
CREATE TABLE `destinations`(
    `id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `trip_id` INT NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `country` VARCHAR(255) NOT NULL,
    `city` VARCHAR(255) NOT NULL,
    `type` ENUM('transport', 'accommodation', 'activity', 'restaurant', 'shop') NOT NULL,
    `details` TEXT,
    `latitude` DECIMAL(8, 2),
    `longitude` DECIMAL(8, 2) ,
    `transport_type` ENUM('flight', 'train ', 'other') ,
    `outbound_departure_date` DATE,
    `outbound_departure_time` TIME,
    `outbound_arrival_date` DATE,
    `outbound_arrival_time` TIME,
    `return_departure_date` DATE,
    `return_departure_time` TIME,
    `return_arrival_date` DATE,
    `return_arrival_time` TIME,
    `check_in_date` DATE,
    `check_in_time` TIME,
    `check_out_date` DATE,
    `check_out_time` TIME,
    `date` DATE,
    `time` TIME,
    `activity_category` ENUM('must-see', 'optional'),
    `has_ticket` BOOLEAN,
    `ticket_price` DECIMAL(8, 2),
    `cuisine_type` VARCHAR(255),
    `date_to_visit` DATE,
    `reservation_date` DATE,
    `reservation_time` TIME,
    `number_of_people` INT,
    `address` VARCHAR(255),
    `created_at` TIMESTAMP DEFAULT  CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT  CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
     CONSTRAINT fk_trip_id FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE

);
-- SELECT trips.*, destinations.name, destinations.created_at
-- FROM trips
-- LEFT JOIN destinations ON trips.id = destinations.trip_id
-- WHERE trips.id = 11;

-- SELECT trips.*, destinations.name, destinations.created_at, destinations.id AS destination_id
-- FROM trips
-- LEFT JOIN purchase ON trips.id = destinations.trip_id WHERE trips.id = 11


