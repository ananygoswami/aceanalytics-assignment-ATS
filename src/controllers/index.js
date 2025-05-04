const { login, refreshToken, signup } = require('./auth.controller');
const { createJob, getJobById, getAllJobs } = require('./job.controller');
const { createApplication, updateApplicationStatus, getAllApplication } = require('./application.controller');
const { registerCandidate } = require('./candidate.controller');

module.exports = {
  authController: {
    login,
    signup,
    refreshToken
  },
  jobController: {
    createJob,
    getJobById,
    getAllJobs
  },
  applicationController: {
    createApplication,
    updateApplicationStatus,
    getAllApplication
  },
  candidateController: {
    registerCandidate
  }
}; 