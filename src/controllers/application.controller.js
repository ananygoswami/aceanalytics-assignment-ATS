const { applicationService } = require('../services');

const createApplication = async (req, res) => {
  try {
    const { jobId } = req.body;
    const userId = req.user.id;

    const application = await applicationService.createApplication(jobId, userId);
    res.status(201).json(application);
  } catch (error) {
    if (error.message === 'Job not found') {
      res.status(404).json({ error: error.message });
    } else if (error.message === 'You have already applied for this job' || 
               error.message === 'Please complete your candidate profile first') {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
};

const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const application = await applicationService.updateApplicationStatus(id, req.body.status);
    res.json(application);
  } catch (error) {
    if (error.message === 'Application not found') {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
};

const getAllApplication = async (req, res) => {
  try {
    const { page = 1, limit = 10, job_id = '', status = '' } = req.query;
    const user = req.user;
    const applications = await applicationService.getAllApplication({
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      job_id,
      status, 
      userId: user.id,
      userRole: user.role
    });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createApplication,
  updateApplicationStatus,
  getAllApplication
}; 