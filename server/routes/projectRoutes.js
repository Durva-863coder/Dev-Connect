const express = require('express');
const {
  createProject,
  updateProject,
  deleteProject,
  getProjectsByUser,
} = require('../controllers/projectController');
const { protect } = require('../middleware/authMiddleware');
const { validateProject } = require('../validators/projectValidators');

const router = express.Router();

router.post('/', protect, validateProject, createProject);
router.put('/:id', protect, validateProject, updateProject);
router.delete('/:id', protect, deleteProject);
router.get('/user/:userId', getProjectsByUser);

module.exports = router;
