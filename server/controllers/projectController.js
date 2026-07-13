const Project = require('../models/Project');

// @desc    Create a new project
// @route   POST /api/projects
// @access  Private
const createProject = async (req, res, next) => {
  const { title, description, techStack, githubLink, liveDemoLink, imageUrl } = req.body;

  try {
    let formattedTechStack = [];
    if (techStack) {
      if (Array.isArray(techStack)) {
        formattedTechStack = techStack.map(s => s.trim()).filter(Boolean);
      } else if (typeof techStack === 'string') {
        formattedTechStack = techStack.split(',').map(s => s.trim()).filter(Boolean);
      }
    }

    const project = await Project.create({
      user: req.user._id,
      title: title ? title.trim() : '',
      description: description ? description.trim() : '',
      techStack: formattedTechStack,
      githubLink: githubLink ? githubLink.trim() : '',
      liveDemoLink: liveDemoLink ? liveDemoLink.trim() : '',
      imageUrl: imageUrl ? imageUrl.trim() : '',
    });

    return res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a project details
// @route   PUT /api/projects/:id
// @access  Private
const updateProject = async (req, res, next) => {
  const { id } = req.params;
  const { title, description, techStack, githubLink, liveDemoLink, imageUrl } = req.body;

  try {
    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    // Verify ownership
    if (project.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to edit this project',
      });
    }

    // Update fields
    if (title) project.title = title.trim();
    if (description) project.description = description.trim();
    if (githubLink !== undefined) project.githubLink = githubLink.trim();
    if (liveDemoLink !== undefined) project.liveDemoLink = liveDemoLink.trim();
    if (imageUrl !== undefined) project.imageUrl = imageUrl.trim();

    if (techStack) {
      if (Array.isArray(techStack)) {
        project.techStack = techStack.map(s => s.trim()).filter(Boolean);
      } else if (typeof techStack === 'string') {
        project.techStack = techStack.split(',').map(s => s.trim()).filter(Boolean);
      }
    }

    const updatedProject = await project.save();

    return res.status(200).json({
      success: true,
      message: 'Project updated successfully',
      data: updatedProject,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a project
// @route   DELETE /api/projects/:id
// @access  Private
const deleteProject = async (req, res, next) => {
  const { id } = req.params;

  try {
    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    // Verify ownership
    if (project.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this project',
      });
    }

    await Project.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: 'Project deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all projects by user ID
// @route   GET /api/projects/user/:userId
// @access  Public
const getProjectsByUser = async (req, res, next) => {
  const { userId } = req.params;

  try {
    const projects = await Project.find({ user: userId }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: 'Projects retrieved successfully',
      data: projects,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createProject,
  updateProject,
  deleteProject,
  getProjectsByUser,
};
