const { check, validationResult } = require('express-validator');

const validateRegister = [
  check('name')
    .notEmpty()
    .withMessage('Name is required')
    .trim(),
  check('username')
    .isLength({ min: 3 })
    .withMessage('Username must be at least 3 characters long')
    .isAlphanumeric()
    .withMessage('Username must contain only letters and numbers')
    .trim()
    .toLowerCase(),
  check('email')
    .isEmail()
    .withMessage('Please include a valid email address')
    .normalizeEmail(),
  check('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
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

const validateLogin = [
  check('email')
    .isEmail()
    .withMessage('Please include a valid email address')
    .normalizeEmail(),
  check('password')
    .notEmpty()
    .withMessage('Password is required'),
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

module.exports = { validateRegister, validateLogin };
