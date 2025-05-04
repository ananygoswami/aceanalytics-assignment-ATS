const { jobService } = require('../services');

const createJob = async (req, res) => {
  try {
    const job = await jobService.createJob(req.body);
    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getJobById = async (req, res) => {
  try {
    const job = await jobService.getJobById(req.params.id);
    res.json(job);
  } catch (error) {
    if (error.message === 'Job not found') {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
};

const getAllJobs = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', location = '' } = req.query;
    const result = await jobService.getAllJobs({
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      search,
      location
    });
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createJob,
  getJobById,
  getAllJobs
}; 