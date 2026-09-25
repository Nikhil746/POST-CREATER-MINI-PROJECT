# Post Creator - Mini Project

A full-stack Node.js web app for creating and managing posts, with user authentication and a like/unlike system. Server-rendered using EJS, with MongoDB as the data store.

## Features

- User signup, login, and logout
- Authentication middleware to protect routes
- Create, edit, and delete posts
- Like / unlike posts
- Server-side rendering with EJS

## Tech Stack

- **Backend:** Node.js, Express.js
- **Templating:** EJS (SSR)
- **Database:** MongoDB (Mongoose)
- **Auth:** Session/cookie-based authentication middleware

## Getting Started

### Prerequisites
- Node.js installed
- MongoDB running locally or a MongoDB Atlas connection string

### Installation

```bash
git clone https://github.com/Nikhil746/POST-CREATER-MINI-PROJECT.git
cd POST-CREATER-MINI-PROJECT
git checkout post-create-mini-project
npm install
```

### Environment Variables

Create a `.env` file in the root directory:

```
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

### Run the App

```bash
npm start
```

App will be running at `http://localhost:3000`

## Project Structure

```
├── models/         # Mongoose schemas (User, Post)
├── routes/         # Express routes
├── views/          # EJS templates
├── middleware/     # Auth middleware
├── public/         # Static assets
└── app.js          # Entry point
```

## Usage

1. Sign up for a new account
2. Log in
3. Create, edit, or delete your posts
4. Like/unlike posts from other users
5. Log out when done