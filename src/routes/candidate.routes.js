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
 *     description: Allows an authenticated candidate to add or update their profile information. The user must already exist via signup. The candidate ID is derived from the authentication token.
 *     tags: [Candidates]
 *     security:
 *       - bearerAuth: []  # Requires Bearer Token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fullName
 *             properties:
 *               fullName:
 *                 type: string
 *                 description: Full name of the candidate.
 *                 example: John Doe
 *               phone:
 *                 type: string
 *                 description: Contact phone number (optional).
 *                 example: "+1-555-1234"
 *               resumeUrl:
 *                 type: string
 *                 format: uri
 *                 description: URL to the candidate's resume (optional).
 *                 example: https://example.com/resume/john-doe.pdf
 *     responses:
 *       200:
 *         description: Candidate profile registered/updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CandidateProfile'
 *       400:
 *         description: Bad request (validation error).
 *       401:
 *         description: Unauthorized (Missing or invalid token).
 *       403:
 *         description: Forbidden (Only Candidates can register profile details).
 *       500:
 *         description: Internal server error.
 */
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