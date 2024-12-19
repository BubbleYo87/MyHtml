CREATE DATABASE IF NOT EXISTS portfolio;

USE portfolio;

CREATE TABLE IF NOT EXISTS portfolio_images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    image_path VARCHAR(255) NOT NULL
);



INSERT INTO portfolio_images (title, description, image_path)
VALUES
('作品名稱 1', '這是第一份作品。', '/uploads/01.png'),
('作品名稱 2', '這是第二份作品。', '/uploads/02.png'),
('作品名稱 3', '這是第三份作品。', '/uploads/03.png');
