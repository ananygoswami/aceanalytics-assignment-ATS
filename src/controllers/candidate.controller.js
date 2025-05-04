const { candidateService } = require('../services');

const registerCandidate = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!userId) {
      return res.status(400).json({ error: 'User ID not found in request' });
    }

    const result = await candidateService.registerCandidate(userId, req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  registerCandidate
}; 