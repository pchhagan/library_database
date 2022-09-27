-- Stephanie Benamati & Perrin Chhagan
-- Project 3: Perrinie 
-- Project Step 4 - Data Manipulation Queries


-- LIBRARY PATRONS
-- Add New Patrons
INSERT INTO Library_Patrons (firstName, lastName) VALUES ( :firstName, :lastName) ;

-- Get all attributes from Library_Patrons
SELECT * FROM Library_Patrons;

-- ACTIVE LOANS
-- Add New Loan
INSERT INTO Active_Loans (bookID, patronID, returnDate) VALUES (:bookID, :patronID, :returnDate);

--Update Loan #
UPDATE Active_Loans SET bookID = :bookID, patronID = :patronID, returnDate=:returnDate, isOverdue = :isOverdue WHERE loanID = :loanID;

--Remove Loan
DELETE FROM Active_Loans WHERE loanID = :loanID;

-- Get all attributes from Active_Loans
SELECT * FROM Active_Loans;

-- Search Active Loans by loan id
SELECT * FROM Active_Loans WHERE loanID = :loanID;

-- Search Active Loans by book id
SELECT * FROM Active_Loans WHERE bookID = :bookID;

-- Search Active Loans by patron id
SELECT * FROM Active_Loans WHERE patronID = :patronID;

-- Search Active Loans by return date
SELECT * FROM Active_Loans WHERE returnDate = :returnDate;

-- Search Active Loans by isOverdue
SELECT * FROM Active_Loans WHERE isOverdue = :isOverdue;

-- GENRES
-- Add New Genre
INSERT INTO Genres (name, isFiction) VALUES ( :name, :isFiction);

-- Get all attributes from Genres
SELECT * FROM Genres;

-- BOOKS
-- Add New Book
INSERT INTO Books (genreID, title, publisher, datePublished, copyAmount, amountAvailable, timesRented) VALUES ( :genreID, :title, :publisher, :datePublished, :copyAmount, :amountAvailable, :timesRented); 

-- Search Books by title 
SELECT * FROM Active_Loans WHERE title = :title;

-- Search Books by return date
SELECT * FROM Active_Loans WHERE publisher = :publisher;

-- Search Books by isOverdue
SELECT * FROM Active_Loans WHERE date = :date;

-- Get all attributes from Books
SELECT * FROM Books;

-- Authors
-- Add New Author
INSERT INTO Authors (firstName, lastName) VALUES ( :firstName, :lastName);

-- Get all attributes from Authors
SELECT * FROM Authors;

--Authored Works
--Add Authored Work
INSERT INTO Authored_Works (authorID, bookID) VALUES ( :authorID, :bookID);

-- Get all attributes from Authored Works
SELECT * FROM Authored_Works;
