Library Management System API
=============================

A RESTful API built with Express, TypeScript, and MongoDB (using Mongoose) to manage a library's book inventory and borrowing system. This project implements CRUD operations for books, book borrowing functionality, and an aggregated summary of borrowed books, adhering to strict validation and error handling requirements.

Features
--------

*   Book Management:
    *   Create, read, update, and delete books with validated fields (title, author, genre, isbn, description, copies, available).
    *   Filter books by genre and sort by fields like createdAt (ascending/descending).
    *   Ensure unique ISBNs and enforce valid genres (FICTION, NON\_FICTION, SCIENCE, HISTORY, BIOGRAPHY, FANTASY).
*   Borrowing System:
    *   Borrow books with quantity and due date, updating available copies and book availability.
    *   Business logic ensures borrowing doesn’t exceed available copies and sets available to false when copies reach zero.
*   Borrowed Books Summary:
    *   Aggregates borrow records using MongoDB’s aggregation pipeline to display total borrowed quantity per book with title and ISBN.
*   Validation & Error Handling:
    *   Comprehensive input validation using express-validator.
    *   Custom error responses for validation failures, including duplicate ISBNs, invalid genres, and insufficient copies.
    *   Standardized error format: { success: false, message: "Validation failed", error: {...} }.
*   Mongoose Features:
    *   Instance method (updateAvailability) to manage book availability.
    *   Pre-save middleware to update timestamps (updatedAt).
    *   Schema-level validations for data integrity.
*   TypeScript:
    *   Strong typing with interfaces for Book and Borrow models.
    *   Type-safe routes, controllers, and middleware.

Prerequisites
-------------

*   Node.js: Version 16.x or higher (recommended: 18.x).
*   MongoDB: Local instance or MongoDB Atlas account.
*   Postman: For testing API endpoints.
*   Git: For cloning the repository.
*   NPM: Package manager (comes with Node.js).

Installation
------------

1.  Clone the Repository:
    
    git clone https://github.com/mahadi-zulfiker/Library-Management-API
    cd library-management-api
    
2.  Install Dependencies:
    
    npm install
    
3.  Set Up Environment Variables:
    
    Create a .env file in the project root with:
    
    MONGODB\_URI=mongodb://localhost:27017/library
    PORT=3000
    
    For MongoDB Atlas, replace MONGODB\_URI with your Atlas connection string.
    
4.  Start MongoDB:
    
    Local MongoDB: Ensure MongoDB is running (mongod command).
    
    Atlas: Verify your connection string and whitelist your IP.
    

Running the Application
-----------------------

1.  Development Mode (with auto-restart):
    
    npm run dev
    
    Uses ts-node-dev to watch for changes and restart the server. The API runs at http://localhost:3000.
    
2.  Production Mode (optional):
    
    npm run build
    npm start
    
3.  Verify:
    
    Check terminal logs for:
    
    Server running on port 3000
    MongoDB Connected: localhost
    

Testing the API
---------------

1.  Using Postman:
    
    Set the baseUrl variable to http://localhost:3000 or If you want to just test the CRUD operations you can use the live link I have provided below.
    
2.  Sample Data:
    
    Create books to populate the database:
    
    {
      "title": "Pride and Prejudice",
      "author": "Jane Austen",
      "genre": "FICTION",
      "isbn": "9780141439518",
      "description": "A classic novel of love and social class.",
      "copies": 6
    }
    {
      "title": "The Hobbit",
      "author": "J.R.R. Tolkien",
      "genre": "FANTASY",
      "isbn": "9780547928227",
      "description": "A fantasy adventure about Bilbo Baggins.",
      "copies": 7
    }
    
3.  MongoDB Verification:
    
    Use MongoDB Compass or the MongoDB shell:
    
    use library
    db.books.find().pretty()
    db.borrows.find().pretty()

Deployment
------------
Backend LINK: https://library-management-drab-xi.vercel.app/

Frontend LINK: https://library-frontend-lac.vercel.app/

Video Explanation
-----------------
Youtube Link: https://www.youtube.com/watch?v=OR9f8A-dWqg

Contributing
------------

1.  Fork the repository.
2.  Create a feature branch: git checkout -b feature-name.
3.  Commit changes: git commit -m "Add feature".
4.  Push to branch: git push origin feature-name.
5.  Open a pull request.

License
-------

MIT License. See [LICENSE](LICENSE) for details.

Contact
-------

*   Email: [mahade.adib45@gmail.com](mailto:mahade.adib45@gmail.com)