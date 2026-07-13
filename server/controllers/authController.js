const bcrypt = require('bcryptjs');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res, next) => {
  const { name, username, email, password } = req.body;

  try {
    // Check if user email already exists
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(400).json({
        success: false,
        message: 'Registration failed',
        errors: [{ field: 'email', message: 'Email address is already registered' }],
      });
    }

    // Check if username is already taken
    const usernameExists = await User.findOne({ username });
    if (usernameExists) {
      return res.status(400).json({
        success: false,
        message: 'Registration failed',
        errors: [{ field: 'username', message: 'Username is already taken' }],
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      name,
      username,
      email,
      password: hashedPassword,
    });

    if (user) {
      // Generate token and set HTTP-only cookie
      const token = generateToken(res, user._id);

      return res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
          _id: user._id,
          name: user.name,
          username: user.username,
          email: user.email,
          profilePicture: user.profilePicture,
          token, // return token as a fallback for authorization headers
        },
      });
    } else {
      res.status(400);
      throw new Error('Invalid user data provided');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate a user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      // Generate token and set HTTP-only cookie
      const token = generateToken(res, user._id);

      return res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
          _id: user._id,
          name: user.name,
          username: user.username,
          email: user.email,
          profilePicture: user.profilePicture,
          token, // fallback token
        },
      });
    } else {
      return res.status(401).json({
        success: false,
        message: 'Authentication failed',
        errors: [{ field: 'form', message: 'Invalid email or password' }],
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Log user out & clear cookie
// @route   POST /api/auth/logout
// @access  Public
const logoutUser = (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0),
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  });

  return res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  });
};

// @desc    Get current user profile info
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'User profile retrieved successfully',
    data: req.user,
  });
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getMe,
};
