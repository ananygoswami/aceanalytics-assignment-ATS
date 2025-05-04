const express = require('express');
const router = express.Router();
const { applicationController } = require('../controllers');
const { validateCreateApplication, validateUpdateApplication, validateListAllApplications } = require('../middleware/validation.middleware');
const { authenticate } = require('../middleware/auth.middleware');
const { checkRole } = require('../middleware/role.middleware');
const USER_ROLES = require('../constants/roles');

/**
 * @swagger
 * tags:
 *   name: Applications
 *   description: Job application management (Requires authentication)
 */

/**
 * @swagger
 * /applications:
 *   post:
 *     summary: Submit a new job application (Candidate only)
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - jobId
 *               - coverLetter
 *             properties:
 *               jobId:
 *                 type: integer # Or string
 *                 description: The ID of the job being applied for.
 *                 example: 5
 *               coverLetter:
 *                 type: string
 *                 description: The candidate's cover letter text.
 *                 example: I am very interested in this position...
 *               # Add other fields if needed, like resume link/ID
 *     responses:
 *       201:
 *         description: Application submitted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Application submitted successfully
 *                 applicationId:
 *                   type: integer # Or string
 *                   example: 101
 *       400:
 *         description: Bad request (validation error, already applied, job not found).
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden (Only Candidates can apply).
 *       404:
 *         description: Job not found.
 *       500:
 *         description: Internal server error.
 */
// Note: The actual candidate ID is usually derived from the authenticated user (req.user.id)
// So it doesn't need to be in the request body typically.
router.post(
  '/',
  authenticate,
  checkRole([USER_ROLES.CANDIDATE]),
  validateCreateApplication,
  applicationController.createApplication
);

/**
 * @swagger
 * /applications/{id}:
 *   patch:
 *     summary: Update the status of a job application (Admin only)
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer # Or string
 *         description: The ID of the application to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [PENDING, REVIEWED, INTERVIEWING, OFFERED, REJECTED] # Adjust based on your actual statuses
 *                 description: The new status for the application.
 *                 example: REVIEWED
 *     responses:
 *       200:
 *         description: Application status updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Application' # Response includes the updated application
 *       400:
 *         description: Bad request (validation error, invalid status).
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden (Only Admins can update status).
 *       404:
 *         description: Application not found.
 *       500:
 *         description: Internal server error.
 */
router.patch('/:id', authenticate, checkRole([USER_ROLES.ADMIN]), validateUpdateApplication, applicationController.updateApplicationStatus);

/**
 * @swagger
 * /applications:
 *   get:
 *     summary: Retrieve a list of applications (Admin sees all, Candidate sees own)
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: jobId
 *         schema:
 *           type: integer # Or string
 *         description: Filter applications by Job ID (Admin only).
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDING, REVIEWED, INTERVIEWING, OFFERED, REJECTED] # Adjust based on your actual statuses
 *         description: Filter applications by status.
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
 *         description: A list of applications.
 *         content:
 *           application/json:
 *             schema:
 *               # Define response structure similar to GET /jobs (with pagination)
 *               # but items should reference '#/components/schemas/Application'
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Application'
 *       400:
 *         description: Bad request (invalid query parameters).
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 *       500:
 *         description: Internal server error.
 */
router.get('/', authenticate, checkRole([USER_ROLES.CANDIDATE, USER_ROLES.ADMIN]), validateListAllApplications, applicationController.getAllApplication);

/**
 * @swagger
 * components:
 *   schemas:
 *     Application:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         jobId:
 *           type: integer
 *         candidateId:
 *           type: integer
 *         status:
 *           type: string
 *           enum: [PENDING, REVIEWED, INTERVIEWING, OFFERED, REJECTED]
 *         coverLetter:
 *           type: string
 *         # Add other application properties (appliedAt, updatedAt etc.)
 *         # You might want nested Job and Candidate details here too
 */
module.exports = router;
