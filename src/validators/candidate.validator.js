const Joi = require('joi');

const registerCandidateSchema = Joi.object({
  fullName: Joi.string().required(),
  phone: Joi.string().allow('').optional(),
  resumeUrl: Joi.string().uri().allow('').optional()
});

const validateRegisterCandidate = (data) => {
  return registerCandidateSchema.validate(data);
};

module.exports = {
  validateRegisterCandidate
}; 