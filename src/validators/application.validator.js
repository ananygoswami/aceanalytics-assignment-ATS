const Joi = require('joi');


const createApplicationSchema = Joi.object({
  jobId: Joi.number().integer().required()
});

const validateCreateApplication = (data) => {
  return createApplicationSchema.validate(data);
};

const updateApplicationStatusSchema = Joi.object({
  status: Joi.string()
    .valid('Short_listed', 'Interviewing', 'Offered', 'Hired', 'Rejected')
    .required()
    .messages({
      'any.only': 'Status must be one of: Short_listed, Interviewing, Offered, Hired, Rejected',
      'any.required': 'Status is required'
    })
});

const validateUpdateApplication = (data) => {
  return updateApplicationStatusSchema.validate(data);
};

const listAllApplicationsSchema = Joi.object({
  page: Joi.number().min(1).default(1),
  limit: Joi.number().min(1).max(100).default(10),
  job_id: Joi.string().allow('').default(''),
  status: Joi.string().allow('').default('')
});

const validateListAllApplications = (data) => {
  return listAllApplicationsSchema.validate(data);
};

module.exports = {
  validateCreateApplication,
  validateUpdateApplication,
  validateListAllApplications
}; 