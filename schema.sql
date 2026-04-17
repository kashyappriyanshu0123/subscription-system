CREATE DATABASE subscription_db;
USE subscription_db;

CREATE TABLE Users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100)
);

CREATE TABLE Plans (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100),
  monthlyQuota INT,
  extraChargePerUnit DECIMAL(10,2)
);

CREATE TABLE Subscriptions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  userId INT,
  planId INT,
  startDate DATE,
  isActive BOOLEAN,
  FOREIGN KEY (userId) REFERENCES Users(id),
  FOREIGN KEY (planId) REFERENCES Plans(id)
);

CREATE TABLE UsageRecords (
  id INT PRIMARY KEY AUTO_INCREMENT,
  userId INT,
  action VARCHAR(100),
  usedUnits INT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES Users(id)
);

INSERT INTO Users (name) VALUES ('Priyanshu');
SELECT * FROM Users;
