CREATE DATABASE queue_system;

USE queue_system;

CREATE TABLE queue(
    id INT AUTO_INCREMENT PRIMARY KEY,
    phone VARCHAR(20) NOT NULL,
    stt INT NOT NULL,
    status ENUM('waiting','calling','done') DEFAULT 'waiting',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);