-- 스키마 sw_project 생성 
CREATE DATABASE sw_project;
-- sw_project 사용
use sw_project;

-- 사용자 테이블 생성
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

-- 도서 테이블 생성
CREATE TABLE books (
    book_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    item_page INT NOT NULL,
    author VARCHAR(255) NOT NULL,
    pubdate DATE NOT NULL,
    description TEXT,
    price_standard INT NOT NULL,
    pricesales INT NOT NULL,
    cover VARCHAR(255),
    publisher VARCHAR(255),
    customer_review_rank DECIMAL(3,1),
    genre VARCHAR(100)
);

-- 추천 도서 테이블 생성
CREATE TABLE book_recommended (
    recommendation_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    book_id INT,
    recommended_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (book_id) REFERENCES books(book_id)
);