const { check, validationResult } = require('express-validator');

// Helper to check if a value is a valid absolute URL or empty
const isValidUrlOrEmpty = (value) => {
  if (!value || value.trim() === '') return true; // Optional field
  try {
    const url = new URL(value);
    return ['http:', 'https:'].includes(url.protocol);
  } catch (err) {
    return false;
  }
};

const validateProfileUpdate = [
  check('name')
    .optional()
    .notEmpty()
    .withMessage('Name cannot be empty')
    .trim(),
  check('github')
    .custom(isValidUrlOrEmpty)
    .withMessage('GitHub link must be a valid URL starting with http:// or https://'),
  check('linkedin')
    .custom(isValidUrlOrEmpty)
    .withMessage('LinkedIn link must be a valid URL starting with http:// or https://'),
  check('portfolio')
    .custom(isValidUrlOrEmpty)
    .withMessage('Portfolio website link must be a valid URL starting with http:// or https://'),
  check('profilePicture')
    .custom(isValidUrlOrEmpty)
    .withMessage('Avatar URL must be a valid URL starting with http:// or https://'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array().map(err => ({ field: err.path, message: err.msg })),
      });
    }
    next();
  },
];

const validatePasswordChange = [
  check('oldPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  check('newPassword')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters long'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array().map(err => ({ field: err.path, message: err.msg })),
      });
    }
    next();
  },
];

module.exports = { validateProfileUpdate, validatePasswordChange };
