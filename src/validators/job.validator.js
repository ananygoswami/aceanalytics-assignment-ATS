const Joi = require('joi');

const createJobSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  location: Joi.string().required(),
  salaryRange: Joi.string().required()
});

const listJobsSchema = Joi.object({
  page: Joi.number().min(1).default(1),
  limit: Joi.number().min(1).max(100).default(10),
  search: Joi.string().allow('').default(''),
  location: Joi.string().allow('').default('')
});

const validateCreateJob = (data) => {
  return createJobSchema.validate(data);
};

const validateListJobs = (data) => {
  return listJobsSchema.validate(data);
};

module.exports = {
  validateCreateJob,
  validateListJobs
}; 