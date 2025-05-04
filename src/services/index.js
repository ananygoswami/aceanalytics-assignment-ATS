const { login, refreshToken, signup } = require('./auth.service');
const { createJob, getJobById, getAllJobs } = require('./job.service');
const { createApplication, updateApplicationStatus, getAllApplication } = require('./application.service');
const { registerCandidate } = require('./candidate.service');

module.exports = {
  authService: {
    login,
    refreshToken,
    signup
  },
  jobService: {
    createJob,
    getJobById,
    getAllJobs
  },
  applicationService: {
    createApplication,
    updateApplicationStatus,
    getAllApplication
  },
  candidateService: {
    registerCandidate
  }
}; 