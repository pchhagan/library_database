DROP TABLE IF EXISTS Authors;
CREATE TABLE Authors(
	`authorID` INT NOT NULL AUTO_INCREMENT,
    `firstName` VARCHAR(30) NOT NULL,
    `lastName` VARCHAR(30) NOT NULL,
    CONSTRAINT PK_authorID PRIMARY KEY (`authorID`)
);
INSERT INTO Authors (`firstName`, `lastName`) 
	VALUES ('Aleron', 'Kong');
INSERT INTO Authors (`firstName`, `lastName`) 
	VALUES ( 'JK', 'Rowling');
INSERT INTO Authors (`firstName`, `lastName`) 
	VALUES ( 'William', 'Shakespeare');

DROP TABLE IF EXISTS Genres;
CREATE TABLE Genres(
	`genreID` INT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(30) NOT NULL,
    `isFiction` BOOLEAN,
    CONSTRAINT PK_Date PRIMARY KEY (`genreID`)
);
INSERT INTO Genres (`name`, `isFiction`) 
	VALUES ("LitRPG", TRUE);
INSERT INTO Genres (`name`, `isFiction`) 
	VALUES ("Autobiography", FALSE);

DROP TABLE IF EXISTS Books;
CREATE TABLE Books(
	`bookID` INT NOT NULL AUTO_INCREMENT,
    `genreID` INT,
    `title` VARCHAR(50) NOT NULL,
    `publisher` VARCHAR(30) NOT NULL,
    `datePublished` DATE NOT NULL,
    `copyAmount` INT NOT NULL,
    `amountAvailable` INT NOT NULL,
    `timesRented` INT NOT NULL,
    CONSTRAINT PK_bookID
		PRIMARY KEY (`bookID`),
    CONSTRAINT FOREIGN KEY FK_genreID (`genreID`) 
		REFERENCES Genres (`genreID`)
);
INSERT INTO Books (genreID, title, publisher, datePublished, copyAmount, amountAvailable, timesRented) 
	VALUES ( 1, "Harry Potter and the Chamber of Secrets",'Bloomsbury' , '1998-07-02' , 50,  37, 123);
INSERT INTO Books (title, publisher, datePublished, copyAmount, amountAvailable, timesRented) 
	VALUES ("The Great Gatsby","Charles Scribner's Sons", '1925-04-10' , 32, 29, 65);

DROP TABLE IF EXISTS Authored_Works;
CREATE TABLE Authored_Works(
	`authorID` INT NOT NULL,
    `bookID` INT NOT NULL,
    CONSTRAINT FOREIGN KEY FK_authorID (`authorID`) 
		REFERENCES Authors (`authorID`),
	CONSTRAINT FOREIGN KEY FK_bookID (`bookID`) 
		REFERENCES Books (`bookID`),
	CONSTRAINT PK_bookID
		PRIMARY KEY (`authorID`, `bookID`)
);
INSERT INTO Authored_Works (`authorID`, `bookID`) 
	VALUES ( (SELECT `authorID` FROM Authors WHERE `firstName` = 'JK' AND `lastName` = 'Rowling'), 
    (SELECT `bookID` FROM Books WHERE `title` = 'Harry Potter and the Chamber of Secrets' AND `datePublished` = '1998-07-02'));
INSERT INTO Authored_Works (`authorID`, `bookID`) 
	VALUES ( (SELECT `authorID` FROM Authors WHERE `firstName` = 'William' AND `lastName` = 'Shakespeare'), 
    (SELECT `bookID` FROM Books WHERE `title` = 'The Great Gatsby' AND `datePublished` = '1925-04-10'));

DROP TABLE IF EXISTS Library_Patrons;
CREATE TABLE Library_Patrons(
	`patronID` INT NOT NULL AUTO_INCREMENT,
    `firstName` VARCHAR(30) NOT NULL,
    `lastName` VARCHAR(30) NOT NULL,
    CONSTRAINT PK_patronID PRIMARY KEY (`patronID`)
);
INSERT INTO Library_Patrons (`firstName`, `lastName`) 
	VALUES ( 'Stephanie', 'Catlett');
INSERT INTO Library_Patrons (`firstName`, `lastName`) 
	VALUES ( 'Perrin', 'Chhagan');

DROP TABLE IF EXISTS Active_Loans;
CREATE TABLE Active_Loans(
	`loanID` INT NOT NULL AUTO_INCREMENT,
    `bookID` INT NOT NULL,
    `patronID` INT NOT NULL,
    `returnDate` DATE NOT NULL,
    `isOverdue` BOOLEAN NOT NULL,
    CONSTRAINT PK_loanID PRIMARY KEY (`loanID`),
    CONSTRAINT FOREIGN KEY FK_bookIDAL (`bookID`) 
		REFERENCES Books (`bookID`),
	CONSTRAINT FOREIGN KEY FK_patronID (`patronID`) 
		REFERENCES Library_Patrons (`patronID`)
);
INSERT INTO Active_Loans (`bookID`, `patronID`, `returnDate`, `isOverdue`) 
	VALUES ( (SELECT `bookID` FROM Books WHERE `title` = 'Harry Potter and the Chamber of Secrets' AND `datePublished` = '1998-07-02'), 
    (SELECT `patronID` FROM Library_Patrons WHERE `firstName` = 'Perrin' AND `lastName` = 'Chhagan'), '2021-12-25', FALSE);
INSERT INTO Active_Loans (`bookID`, `patronID`, `returnDate`, `isOverdue`) 
	VALUES ( (SELECT `bookID` FROM Books WHERE `title` = 'The Great Gatsby' AND `datePublished` = '1925-04-10'), 
    (SELECT `patronID` FROM Library_Patrons WHERE `firstName` = 'Perrin' AND `lastName` = 'Chhagan'), '2020-06-01', TRUE);
    