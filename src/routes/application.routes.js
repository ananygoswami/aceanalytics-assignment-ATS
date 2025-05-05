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
 *             properties:
 *               jobId:
 *                 type: integer # Or string
 *                 description: The ID of the job being applied for.
 *                 example: 5
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
 *                 enum: [Short_listed, Interviewing, Offered, Hired, Rejected]
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
 *         name: job_id
 *         schema:
 *           type: string
 *           default: ''
 *         description: Filter applications by Job ID (Admin only).
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [Applied, Short_listed, Interviewing, Offered, Hired, Rejected]
 *           default: ''
 *         description: Filter applications by status.
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of results per page.
 *     responses:
 *       200:
 *         description: A list of applications.
 *         content:
 *           application/json:
 *             schema:
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
 *         job_id:
 *           type: integer
 *         candidateId:
 *           type: integer
 *         status:
 *           type: string
 *           enum: [Applied, Short_listed, Interviewing, Offered, Hired, Rejected]
 *         # Add other application properties (appliedAt, updatedAt etc.)
 *         # You might want nested Job and Candidate details here too
 */
module.exports = router;
