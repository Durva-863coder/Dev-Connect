const express = require('express');
const {
  getUsers,
  getUserByUsername,
  updateProfile,
  changePassword,
  deleteAccount,
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { validateProfileUpdate, validatePasswordChange } = require('../validators/userValidators');

const router = express.Router();

router.get('/', getUsers);
router.get('/username/:username', getUserByUsername);
router.put('/profile', protect, validateProfileUpdate, updateProfile);
router.put('/password', protect, validatePasswordChange, changePassword);
router.delete('/', protect, deleteAccount);

module.exports = router;
