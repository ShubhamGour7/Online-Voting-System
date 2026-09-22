Online Voting System

A secure Online Voting System built with Node.js, Express.js, MongoDB, and JWT authentication. The system supports user registration/login, role-based admin access, candidate management, and secure voting with one vote per user.

🚀 Features
User registration and login
JWT-based authentication
Password hashing with bcrypt
Role-based access control
Single admin system
Admin can:
Add candidates
Update candidates
Delete candidates
Voters can vote for candidates
One vote per voter
Admin cannot vote
Vote count and candidate results
MongoDB database integration
Protected API routes
🛠️ Tech Stack
Node.js
Express.js
MongoDB
Mongoose
JWT (JSON Web Token)
bcrypt
Postman for API testing

⚙️ Installation

Clone the repository:

Go to the project:

cd Online-Voting-System

Install dependencies:

npm install
🔐 Environment Variables

Create a .env file:

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=3000

▶️ Run the Project
node server.js

The server will run on:

http://localhost:3000
🔑 Authentication Flow
Signup
  ↓
First user → Admin
Other users → Voter
  ↓
Login
  ↓
JWT Token
  ↓
Protected Routes
🗳️ Voting Flow
Login
 ↓
JWT Authentication
 ↓
Check User Role
 ↓
Voter?
 ↓
Check isVoted
 ↓
Cast Vote
 ↓
Increase Candidate Vote Count
 ↓
isVoted = true

🔒 Security
Passwords are hashed before storing in MongoDB.
JWT is used to authenticate protected routes.
Admin-only operations use role-based authorization.
Users can vote only once.
Admin users are not allowed to vote.
Sensitive environment variables are stored in .env.
📄 License

This project is created for learning and educational purposes.
