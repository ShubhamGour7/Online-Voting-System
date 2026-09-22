# 🗳️ Online Voting System

A secure **Online Voting System** built with **Node.js, Express.js, MongoDB, and JWT authentication**.

The system supports user registration/login, role-based admin access, candidate management, and secure voting with **one vote per user**.

---

## 🚀 Features

- User registration and login
- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control
- Single admin system
- Admin can:
  - Add candidates
  - Update candidates
  - Delete candidates
- Voters can vote for candidates
- One vote per voter
- Admin cannot vote
- Vote count and candidate results
- MongoDB database integration
- Protected API routes

---

## 🛠️ Tech Stack

- **Node.js**
- **Express.js**
- **MongoDB**
- **Mongoose**
- **JWT (JSON Web Token)**
- **bcrypt**
- **Postman** for API testing

---

## ⚙️ Installation

-**1. Clone the repository**: git clone https://github.com/ShubhamGour7/Online-Voting-System.git
-**2. Go to the project directory**: cd Online-Voting-System
-**3. Install dependencies** : npm install

## 🔐 Environment Variables

-**Create a .env file in the root directory**:
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=3000

## ▶️ Run the Project
node server.js

-**The server will run on**:http://localhost:3000

## 🔑 Authentication Flow
Signup
   ↓
First User → Admin
Other Users → Voter
   ↓
Login
   ↓
JWT Token
   ↓
Protected Routes

##🗳️ Voting Flow
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

##👨‍💼 Admin Features

-**The admin can**:
Create candidates
Update candidate information
Delete candidates
Manage the voting system

The admin is not allowed to vote.

##👤 Voter Features

-**Voters can**:
Register and login
View candidate information
Cast their vote
Vote only once
View voting results

##🔒 Security
-Passwords are hashed using bcrypt
-JWT is used for authentication
-Protected routes require a valid JWT
-Admin operations require admin authorization
-Each voter can vote only once
-Admin users cannot vote
-Sensitive environment variables are stored in .env

##🧪 API Testing

-The APIs can be tested using Postman.
-For protected routes ,send the JWT token using ==>  Authorization: Bearer <your-jwt-token>

##📄 License

--**This project was created for learning and educational purposes.**--



