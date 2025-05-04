const express = require('express');
const router = express.Router();
const { candidateController } = require('../controllers');
const { validateRegisterCandidate } = require('../middleware/validation.middleware');
const { checkRole } = require('../middleware/role.middleware');
const USER_ROLES = require('../constants/roles');
const { authenticate } = require('../middleware/auth.middleware');

/**
 * @swagger
 * tags:
 *   name: Candidates
 *   description: Candidate profile management (Requires authentication)
 */

/**
 * @swagger
 * /candidates/register:
 *   post:
 *     summary: Register or update candidate profile details (Candidate only)
 *     description: Allows an authenticated candidate to add or update their profile information like resume, skills, etc. The user must already exist via signup. The candidate ID is derived from the authentication token.
 *     tags: [Candidates]
 *     security:
 *       - bearerAuth: [] # Indicates this endpoint requires authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - resumeUrl # Adjust based on your validation.middleware
 *               - skills    # Adjust based on your validation.middleware
 *             properties:
 *               resumeUrl:
 *                 type: string
 *                 format: url
 *                 description: URL to the candidate's resume (e.g., S3, Google Drive).
 *                 example: https://example.com/resumes/johndoe.pdf
 *               skills:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of candidate's skills.
 *                 example: ["JavaScript", "Node.js", "React", "SQL"]
 *               experienceYears:
 *                 type: integer
 *                 description: Years of professional experience.
 *                 example: 5
 *               # Add other relevant candidate profile fields based on your validation
 *     responses:
 *       200: # Or 201 if creating for the first time
 *         description: Candidate profile registered/updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CandidateProfile' # Reference the schema defined below
 *       400:
 *         description: Bad request (validation error).
 *       401:
 *         description: Unauthorized (Missing or invalid token).
 *       403:
 *         description: Forbidden (Only Candidates can register profile details).
 *       500:
 *         description: Internal server error.
 */
// Note: The candidate ID is derived from the authenticated user (req.user.id)
router.post('/register',authenticate, checkRole([USER_ROLES.CANDIDATE]), validateRegisterCandidate, candidateController.registerCandidate);

/**
 * @swagger
 * components:
 *   schemas:
 *     CandidateProfile:
 *       type: object
 *       properties:
 *         userId: # Foreign key to the User table
 *           type: integer
 *           description: The ID of the user associated with this profile.
 *         resumeUrl:
 *           type: string
 *           format: url
 *           description: URL to the candidate's resume.
 *         skills:
 *           type: array
 *           items:
 *             type: string
 *           description: List of candidate's skills.
 *         experienceYears:
 *           type: integer
 *           description: Years of professional experience.
 *         # Add other profile fields corresponding to your database model/validation
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the profile was created.
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the profile was last updated.
 */

module.exports = router; 