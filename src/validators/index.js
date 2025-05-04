const { validateLogin, validateRefreshToken, validateSignup } = require('./auth.validator');
const { validateCreateJob, validateListJobs } = require('./job.validator');
const { validateCreateApplication, validateUpdateApplication, validateListAllApplications } = require('./application.validator');
const { validateRegisterCandidate } = require('./candidate.validator');

module.exports = {
  authValidator: {
    validateLogin,
    validateRefreshToken,
    validateSignup
  },
  jobValidator: {
    validateCreateJob,
    validateListJobs
  },
  applicationValidator: {
    validateCreateApplication,
    validateUpdateApplication,
    validateListAllApplications
  },
  candidateValidator: {
    validateRegisterCandidate
  }
}; 