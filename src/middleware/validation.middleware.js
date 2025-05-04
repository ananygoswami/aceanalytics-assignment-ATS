const { authValidator, jobValidator, applicationValidator, candidateValidator } = require('../validators');

const validateSignup = (req, res, next) => {
  const { error } = authValidator.validateSignup(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });
  next();
};

const validateLogin = (req, res, next) => {
  const { error } = authValidator.validateLogin(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });
  next();
};

const validateRefreshToken = (req, res, next) => {
  const { error } = authValidator.validateRefreshToken(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });
  next();
};

const validateCreateJob = (req, res, next) => {
  const { error } = jobValidator.validateCreateJob(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });
  next();
};

const validateListJobs = (req, res, next) => {
  const { error } = jobValidator.validateListJobs(req.query);
  if (error) return res.status(400).json({ error: error.details[0].message });
  next();
};

const validateCreateApplication = (req, res, next) => {
  const { error } = applicationValidator.validateCreateApplication(req.body);
  if(error) return res.status(400).json({ error: error.details[0].message });
  next()
}

const validateRegisterCandidate = (req, res, next) => {
  const { error } = candidateValidator.validateRegisterCandidate(req.body);
  if(error) return res.status(400).json({ error: error.details[0].message });
  next()
}

const validateUpdateApplication = (req, res, next) => {
  const { error } = applicationValidator.validateUpdateApplication(req.body);
  if(error) return res.status(400).json({ error: error.details[0].message });
  next() 
}

const validateListAllApplications = (req, res, next) => {
  const { error } = applicationValidator.validateListAllApplications(req.query);
  if(error) return res.status(400).json({ error: error.details[0].message });
  next() 
}
module.exports = {
  validateSignup,
  validateLogin,
  validateRefreshToken,
  validateCreateJob,
  validateListJobs,
  validateCreateApplication,
  validateRegisterCandidate,
  validateUpdateApplication,
  validateListAllApplications
}; 