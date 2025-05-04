# AceAnalytics API Assignment

This project is a REST API built with Node.js and Express for managing job listings, applications, and candidates, likely as part of the AceAnalytics assignment.

## Table of Contents

*   [Prerequisites](#prerequisites)
*   [Setup](#setup)
*   [Database Setup & Migration](#database-setup--migration)
*   [Configuration](#configuration)
*   [Running the Application](#running-the-application)
    *   [Development Mode](#development-mode)
    *   [Production Mode](#production-mode)
*   [API Documentation](#api-documentation)
*   [Running Tests](#running-tests)

## Prerequisites

Before you begin, ensure you have met the following requirements:

*   **Node.js:** Version 18.x or later (Check with `node -v`)
*   **npm:** Version 9.x or later (Usually comes with Node.js, check with `npm -v`)
*   **Database:** A running instance of PostgreSQL (or specify your database).
*   **Git:** For cloning the repository.

## Setup

To set up the project locally, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd Assignment_AceAnalytics # Or your project directory name
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

## Database Setup & Migration

This project uses Prisma (assuming based on common practices, **please adjust if using something else like Sequelize, Knex, or raw SQL scripts**) for database management and migrations.

1.  **Ensure your database server is running.**

2.  **Configure the database connection URL:**
    *   Make sure the `DATABASE_URL` environment variable is set correctly in your `.env` file (see Configuration). It should look something like this:
        ```
        DATABASE_URL="postgresql://YOUR_DB_USER:YOUR_DB_PASSWORD@YOUR_DB_HOST:YOUR_DB_PORT/YOUR_DB_NAME?schema=public"
        ```

3.  **Run Migrations:**
    *   This command applies any pending database schema changes defined in your `prisma/migrations` folder.
    ```bash
    npx prisma migrate deploy
    ```
    *   *(Optional)* During development, if you make changes to your `prisma/schema.prisma` file, you can create *new* migration files using:
        ```bash
        # Make sure your .env file is configured first!
        npx prisma migrate dev --name your_migration_description
        ```
        This will also apply the migration immediately in a development environment.

4.  **(Optional) Seed the database:** If you have a seed script defined in `prisma/seed.js` (or similar), run:
    ```bash
    npx prisma db seed
    ```

## Configuration

The application requires certain environment variables to be set.

1.  Create a `.env` file in the root of the project directory by copying the example file:
    ```bash
    cp .env.example .env
    ```
2.  Edit the `.env` file and provide the necessary values:
    ```dotenv
    # Application Port
    PORT=3001

    # Database Connection URL (replace with your actual credentials)
    DATABASE_URL="postgresql://user:password@localhost:5432/mydatabase?schema=public"

    # JWT Secrets (generate strong, random secrets)
    JWT_SECRET=your_very_strong_jwt_secret_key
    JWT_REFRESH_SECRET=your_very_strong_jwt_refresh_secret_key

    # JWT Expiration Times (e.g., 15m, 1h, 7d)
    JWT_EXPIRATION=15m
    JWT_REFRESH_EXPIRATION=7d

    # Add any other required variables (e.g., API keys, logging levels)
    ```

## Running the Application

### Development Mode

For development, it's common to use a tool like `nodemon` which automatically restarts the server when file changes are detected.

```bash
npm run dev
```
This typically runs `nodemon app.js` or a similar command defined in your `package.json`. The application will usually be available at `http://localhost:3001` (or the port specified in your `.env` file).

### Production Mode

For production, you should run the application directly using Node.js. Ensure all dependencies are installed (`npm install --production` might be used in a build step).

```bash
npm start
```
This typically runs `node app.js` as defined in your `package.json`. Make sure your environment variables (`.env` or system variables) are correctly configured for the production environment (e.g., database connection, JWT secrets). Consider using a process manager like PM2 for better management in production.

## API Documentation

*   Interactive API documentation (Swagger UI) is available at: `http://localhost:3001/api-docs` (when the server is running).
*   The OpenAPI specification file can be found at: `openapi.json` (if generated and saved).
*   A Postman collection for testing might be available at: `postman/collection.postman_collection.json` (if created).

## Running Tests

*(Optional: Add this section if you have tests)*

To run the automated tests:

```bash
npm test
```

---

*Remember to replace placeholders like `<your-repository-url>` and ensure the commands and variable names match your specific project setup.*