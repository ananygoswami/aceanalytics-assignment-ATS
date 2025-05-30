# AceAnalytics API Assignment

This project is a REST API built with Node.js and Express for managing job listings, applications, and candidates, likely as part of the AceAnalytics assignment.

## Table of Contents

*   [Prerequisites](#prerequisites)
*   [Setup](#setup)
*   [Configuration](#configuration)
*   [Configuration](#configuration)
*   [Running the Application](#running-the-application)
    *   [Development Mode](#development-mode)
    *   [Production Mode](#production-mode)
*   [API Documentation](#api-documentation)
*   [Running Tests](#running-tests)

## Prerequisites

Before you begin, ensure you have met the following requirements:

*   **Node.js:** Version 18.18.x or later (Check with `node -v`)
*   **npm:** Version 9.x or later (Usually comes with Node.js, check with `npm -v`)
*   **Git:** For cloning the repository
*   **PostgreSQL:** For running the database
*   **Redis:** Required for token management

## Setup

To set up the project locally, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/ananygoswami/aceanalytics-assignment-ATS.git
    cd Assignment_AceAnalytics
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```

## Configuration

The application requires certain environment variables to be set.
Before proceeding with database migrations or starting the app, set up your environment variables.

1.  Create a `.env` file in the root directory by copying the example:
    ```bash
    cp .env.example .env
    ```
2.  Edit the `.env` file and fill in your environment-specific values:
    ```dotenv
    # Application Port
    PORT=3001

    # Database Connection URL (replace with your actual credentials)
    DATABASE_URL="postgresql://user:password@localhost:5432/mydatabase?schema=public"

    # JWT Secrets (generate strong, random secrets)
    JWT_SECRET=your_very_strong_jwt_secret_key
    JWT_REFRESH_SECRET=your_very_strong_jwt_refresh_secret_key

    # JWT Expiration Durations (e.g., 15m, 1h, 7d)
    JWT_EXPIRATION=15m
    JWT_REFRESH_EXPIRATION=7d

    # Redis URL
    REDIS_URL=redis://localhost:6379
    ```
    
## Database Setup & Migration

This project uses Prisma for database management and migrations.

1.  **Ensure your PostgreSQL database server is running.**

2.  **Run Migrations:**
    Apply existing migrations to initialize your database schema:
    ```bash
    npx prisma migrate deploy
    ```

3.  **(Optional)** If you're actively developing and modifying the schema, create and apply new migrations with:
    ```bash
    npx prisma migrate dev --name descriptive_migration_name
    ```

4.  **(Optional)** If needed, generate the Prisma client again, This will generate an ER diagram named ERD.png in /prisma directory:
    ```bash
    npx prisma generate
    ```

## Running the Application

Create Admin Script (This will create an admin user with email = admin@gmail.com and password = admin123):
``` bash
node create_admin/create.js
```

### Development Mode

Run the application in development mode using `nodemon`, which automatically restarts the server when file changes are detected:
 ```bash
 npm run dev
```
This typically runs `nodemon app.js` or a similar command defined in your `package.json`. The application will usually be available at `http://localhost:3001` (or the port specified in your `.env` file).

### Production Mode

For production, you should run the application directly using Node.js. Ensure all dependencies are installed (`npm install --production` might be used in a build step).
Consider using a process manager like PM2 for better management in production.
```bash
npm start
```
This typically runs `node app.js` as defined in your `package.json`. Make sure your environment variables (`.env` or system variables) are correctly configured for the production environment (e.g., database connection, JWT secrets). Consider using a process manager like PM2 for better management in production.

## API Documentation

*   Interactive API documentation (Swagger UI) is available at: `http://localhost:3001/api-docs` (when the server is running).
*   The OpenAPI specification file can be found at: `openapi.json` (if generated and saved).
*   A Postman collection for testing might be available at: `postman/collection.postman_collection.json` (if created).

## Design Decisions

* The schema cleanly separates user roles by associating candidates with extended profile data, enabling flexible user management and job application tracking. It ensures referential integrity and supports a structured recruitment workflow through enums for role and application status.
* Candidate profile flow: There is a Candidate profile flow, which each candidate must complete before submitting any application, for now candidate profile only contains resume url and other important fields, I kept the candidate profile saperate from user table as an option for future flow having multiple roles like Interviewer or HR etc. Canditate profile table has a user refrence relation which can be utilised later and seen in the prisma schema.

## Time Spent
* I spent around 12-16 hours on this project, worked few hours every day, I was assigned the project on Thursday 1st of may 2025 and I started working on it from staurday 3rd of may 2025.
---