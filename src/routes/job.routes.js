const express = require('express');
const router = express.Router();
const { jobController } = require('../controllers');
const { validateCreateJob, validateListJobs } = require('../middleware/validation.middleware');
const { authenticate } = require('../middleware/auth.middleware');
const { checkRole } = require('../middleware/role.middleware');
const USER_ROLES = require('../constants/roles');

/**
 * @swagger
 * tags:
 *   name: Jobs
 *   description: Job listing management (Requires authentication)
 */

/**
 * @swagger
 * /jobs:
 *   get:
 *     summary: Retrieve a list of jobs with filtering and pagination
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: [] # Indicates this endpoint requires authentication
 *     parameters:
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         description: Filter jobs by title (partial match)
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *         description: Filter jobs by location (partial match)
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of results per page
 *     responses:
 *       200:
 *         description: A list of jobs.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 jobs:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Job' # Assuming you define a Job schema elsewhere or inline
 *                 totalPages:
 *                   type: integer
 *                 currentPage:
 *                   type: integer
 *       400:
 *         description: Bad request (e.g., invalid query parameters).
 *       401:
 *         description: Unauthorized (Missing or invalid token).
 *       403:
 *         description: Forbidden (User role not allowed - though handled by middleware).
 *       500:
 *         description: Internal server error.
 */
router.get('/', authenticate, checkRole([USER_ROLES.ADMIN, USER_ROLES.CANDIDATE]), validateListJobs, jobController.getAllJobs);

/**
 * @swagger
 * /jobs/{id}:
 *   get:
 *     summary: Retrieve a single job by its ID
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer # Or string, depending on your ID type
 *         description: The ID of the job to retrieve.
 *     responses:
 *       200:
 *         description: Job details.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Job' # Reusing the Job schema
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 *       404:
 *         description: Job not found.
 *       500:
 *         description: Internal server error.
 */
router.get('/:id', authenticate, checkRole([USER_ROLES.ADMIN, USER_ROLES.CANDIDATE]), jobController.getJobById);

/**
 * @swagger
 * /jobs:
 *   post:
 *     summary: Create a new job listing (Admin only)
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - location
 *             properties:
 *               title:
 *                 type: string
 *                 example: Software Engineer
 *               description:
 *                 type: string
 *                 example: Develop and maintain web applications.
 *               location:
 *                 type: string
 *                 example: Remote
 *               companyName:
 *                 type: string
 *                 example: Ace Analytics Inc.
 *               salaryRange:
 *                 type: string
 *                 example: $100,000 - $130,000
 *     responses:
 *       201:
 *         description: Job created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Job' # Response includes the created job
 *       400:
 *         description: Bad request (validation error).
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden (Only Admins can create jobs).
 *       500:
 *         description: Internal server error.
 */
router.post(
  '/',
  authenticate,
  checkRole([USER_ROLES.ADMIN]),
  validateCreateJob,
  jobController.createJob
);

/**
 * @swagger
 * components:
 *   schemas:
 *     Job:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         # Add other job properties here (location, companyName, salaryRange, createdAt, updatedAt etc.)
 */
module.exports = router; 