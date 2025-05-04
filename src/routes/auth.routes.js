const express = require('express');
const router = express.Router();
const { authController } = require('../controllers');
const { validateLogin, validateRefreshToken, validateSignup } = require('../middleware/validation.middleware');

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User authentication and authorization
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Log in a user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address.
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 description: User's password.
 *                 example: StrongP@ssw0rd!
 *     responses:
 *       200:
 *         description: Login successful, returns access and refresh tokens.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 refreshToken:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       400:
 *         description: Bad request (e.g., validation error).
 *       401:
 *         description: Unauthorized (e.g., invalid credentials).
 *       500:
 *         description: Internal server error.
 */
router.post('/login', validateLogin, authController.login);

/**
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - name
 *               - role
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address.
 *                 example: newuser@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 description: User's desired password (min length 8).
 *                 example: AnotherP@ssw0rd
 *               name:
 *                 type: string
 *                 description: User's full name.
 *                 example: John Doe
 *               role:
 *                 type: string
 *                 enum: [ADMIN, CANDIDATE] # Adjust based on your USER_ROLES constant
 *                 description: The role of the user.
 *                 example: CANDIDATE
 *     responses:
 *       201:
 *         description: User created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User registered successfully
 *                 userId:
 *                   type: integer # Or string, depending on your user ID type
 *                   example: 123
 *       400:
 *         description: Bad request (e.g., validation error, email already exists).
 *       500:
 *         description: Internal server error.
 */
router.post('/signup', validateSignup, authController.signup);

/**
 * @swagger
 * /auth/refresh-token:
 *   post:
 *     summary: Obtain a new access token using a refresh token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 description: The refresh token obtained during login.
 *                 example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *     responses:
 *       200:
 *         description: New access token generated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       400:
 *         description: Bad request (e.g., missing refresh token).
 *       401:
 *         description: Unauthorized (e.g., invalid or expired refresh token).
 *       500:
 *         description: Internal server error.
 */
router.post('/refresh-token', validateRefreshToken, authController.refreshToken);

module.exports = router; 