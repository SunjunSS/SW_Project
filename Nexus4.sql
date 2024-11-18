-- 스키마 sw_project 생성, 인코딩 
CREATE DATABASE sw_project CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- sw_project 사용
use sw_project;

-- 스키마 sw_project 생성, 인코딩 
CREATE DATABASE sw_project CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- sw_project 사용
use sw_project;

-- 사용자 테이블
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    user_password VARCHAR(255) NOT NULL,
    user_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login DATETIME,
    user_birthdate DATE
);

-- 도서 테이블
CREATE TABLE books (
    book_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    title VARCHAR(255) NOT NULL,
    item_page INT NOT NULL,
    author VARCHAR(255) NOT NULL,
    ISBN VARCHAR(100) UNIQUE NOT NULL,
    pubdate DATE NOT NULL,
    description TEXT,
    price_standard DECIMAL(10,2) NOT NULL,
    pricesales DECIMAL(10,2) NOT NULL,
    cover VARCHAR(2000),
    publisher VARCHAR(255),
    customer_review_rank DECIMAL(3,1),
    genre VARCHAR(100),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

