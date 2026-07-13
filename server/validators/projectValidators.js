const { check, validationResult } = require('express-validator');

const isValidUrlOrEmpty = (value) => {
  if (!value || value.trim() === '') return true; // Optional field
  try {
    const url = new URL(value);
    return ['http:', 'https:'].includes(url.protocol);
  } catch (err) {
    return false;
  }
};

const validateProject = [
  check('title')
    .notEmpty()
    .withMessage('Title is required')
    .trim(),
  check('description')
    .notEmpty()
    .withMessage('Description is required')
    .trim(),
  check('techStack')
    .notEmpty()
    .withMessage('Tech Stack is required'),
  check('githubLink')
    .custom(isValidUrlOrEmpty)
    .withMessage('GitHub link must be a valid URL starting with http:// or https://'),
  check('liveDemoLink')
    .custom(isValidUrlOrEmpty)
    .withMessage('Live demo link must be a valid URL starting with http:// or https://'),
  check('imageUrl')
    .custom(isValidUrlOrEmpty)
    .withMessage('Image link must be a valid URL starting with http:// or https://'),
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

module.exports = { validateProject };
