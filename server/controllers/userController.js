const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Project = require('../models/Project');
const Connection = require('../models/Connection');

// @desc    Get all users (directory search, filter, sort)
// @route   GET /api/users
// @access  Public
const getUsers = async (req, res, next) => {
  try {
    const query = {};

    // 1. Search filter (matches name, username, college, or skills)
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search.trim(), 'i');
      query.$or = [
        { name: searchRegex },
        { username: searchRegex },
        { college: searchRegex },
        { skills: searchRegex },
      ];
    }

    // 2. Direct Skill filtering (comma separated list of skills)
    if (req.query.skills) {
      const skillsArray = req.query.skills.split(',').map(s => s.trim()).filter(Boolean);
      if (skillsArray.length > 0) {
        // Find users that have ALL of the filtered skills
        query.skills = { $all: skillsArray.map(skill => new RegExp(`^${skill}$`, 'i')) };
      }
    }

    // 3. Execution (default sorting is alphabetical by name)
    const users = await User.find(query)
      .select('-password')
      .sort({ name: 1 }); // Sort alphabetically

    return res.status(200).json({
      success: true,
      message: 'Users retrieved successfully',
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single user profile by username
// @route   GET /api/users/username/:username
// @access  Public
const getUserByUsername = async (req, res, next) => {
  const { username } = req.params;

  try {
    const user = await User.findOne({ username: username.toLowerCase() }).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'User profile retrieved successfully',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile details
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found',
      });
    }

    const {
      name,
      profilePicture,
      college,
      location,
      bio,
      skills,
      about,
      github,
      linkedin,
      portfolio,
    } = req.body;

    // Update fields
    if (name) user.name = name.trim();
    user.profilePicture = profilePicture ? profilePicture.trim() : '';
    user.college = college ? college.trim() : '';
    user.location = location ? location.trim() : '';
    user.bio = bio ? bio.trim() : '';
    user.about = about ? about.trim() : '';
    user.github = github ? github.trim() : '';
    user.linkedin = linkedin ? linkedin.trim() : '';
    user.portfolio = portfolio ? portfolio.trim() : '';

    // Handle skills array formatting if sent as comma-separated string
    if (skills) {
      if (Array.isArray(skills)) {
        user.skills = skills.map(s => s.trim()).filter(Boolean);
      } else if (typeof skills === 'string') {
        user.skills = skills.split(',').map(s => s.trim()).filter(Boolean);
      }
    }

    const updatedUser = await user.save();
    
    // Convert to object and omit password
    const userResponse = updatedUser.toObject();
    delete userResponse.password;

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: userResponse,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Change authenticated user password
// @route   PUT /api/users/password
// @access  Private
const changePassword = async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;

  try {
    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Password change failed',
        errors: [{ field: 'form', message: 'Both old and new passwords are required' }],
      });
    }

    const user = await User.findById(req.user._id);

    // Verify old password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Password change failed',
        errors: [{ field: 'oldPassword', message: 'Current password is incorrect' }],
      });
    }

    // Hash and save new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cascade delete user account
// @route   DELETE /api/users
// @access  Private
const deleteAccount = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // 1. Delete all projects created by user
    await Project.deleteMany({ user: userId });

    // 2. Delete all connection records involving user
    await Connection.deleteMany({
      $or: [{ sender: userId }, { receiver: userId }],
    });

    // 3. Delete user profile record
    await User.findByIdAndDelete(userId);

    // 4. Clear HTTP-only auth cookie
    res.cookie('token', '', {
      httpOnly: true,
      expires: new Date(0),
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    });

    return res.status(200).json({
      success: true,
      message: 'Account and all associated portfolios and connection records deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUsers,
  getUserByUsername,
  updateProfile,
  changePassword,
  deleteAccount,
};
