import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-redux';
import { updateProfile, deleteAccount, loadUser } from '../redux/authSlice';
import { createProject, updateProject, deleteProject, fetchUserProjects } from '../redux/projectSlice';
import { apiFetch } from '../utils/api';
import { FiUser, FiFolder, FiLock, FiPlus, FiTrash2, FiEdit2, FiAlertTriangle, FiCheckCircle } from 'react-icons/fi';

const GRADIENTS = [
  { id: 'gradient-1', class: 'bg-gradient-to-br from-purple-600 to-cyan-500', name: 'Violet Cyan' },
  { id: 'gradient-2', class: 'bg-gradient-to-br from-amber-500 to-rose-500', name: 'Sunset Glow' },
  { id: 'gradient-3', class: 'bg-gradient-to-br from-blue-600 to-emerald-500', name: 'Ocean Green' },
  { id: 'gradient-4', class: 'bg-gradient-to-br from-violet-600 to-fuchsia-600', name: 'Neon Pink' },
  { id: 'gradient-5', class: 'bg-gradient-to-br from-yellow-400 to-pink-500', name: 'Cyberpunk' },
  { id: 'gradient-6', class: 'bg-gradient-to-br from-slate-900 to-blue-900', name: 'Midnight' },
];

const Settings = () => {
  const { user, error: authError } = useSelector((state) => state.auth);
  const { projects } = useSelector((state) => state.projects);
  const dispatch = useDispatch();

  const [activeTab, setActiveTab] = useState('profile');
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Profile Form State
  const [profileForm, setProfileForm] = useState({
    name: '',
    profilePicture: '',
    college: '',
    location: '',
    bio: '',
    skills: '',
    about: '',
    github: '',
    linkedin: '',
    portfolio: '',
  });

  // Password Form State
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Project Form State
  const [projectForm, setProjectForm] = useState({
    title: '',
    description: '',
    techStack: '',
    githubLink: '',
    liveDemoLink: '',
    imageUrl: '',
  });
  
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [selectedGradient, setSelectedGradient] = useState('gradient-1');
  const [useCustomImageUrl, setUseCustomImageUrl] = useState(false);

  // Delete Confirm Dialog State
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteInput, setDeleteInput] = useState('');

  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || '',
        profilePicture: user.profilePicture || '',
        college: user.college || '',
        location: user.location || '',
        bio: user.bio || '',
        skills: user.skills ? user.skills.join(', ') : '',
        about: user.about || '',
        github: user.github || '',
        linkedin: user.linkedin || '',
        portfolio: user.portfolio || '',
      });
      dispatch(fetchUserProjects(user._id));
    }
  }, [user, dispatch]);

  const showNotification = (msg, isError = false) => {
    if (isError) {
      setErrorMsg(msg);
      setSuccessMsg('');
    } else {
      setSuccessMsg(msg);
      setErrorMsg('');
    }
    setTimeout(() => {
      setSuccessMsg('');
      setErrorMsg('');
    }, 4000);
  };

  // ----------------------------------------------------
  // PROFILE HANDLERS
  // ----------------------------------------------------
  const handleProfileSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    dispatch(updateProfile(profileForm))
      .unwrap()
      .then(() => {
        setLoading(false);
        showNotification('Profile updated successfully');
      })
      .catch((err) => {
        setLoading(false);
        const errMsg = Array.isArray(err) ? err[0]?.message : err;
        showNotification(errMsg || 'Failed to update profile', true);
      });
  };

  // ----------------------------------------------------
  // PASSWORD HANDLERS
  // ----------------------------------------------------
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showNotification('Passwords do not match', true);
      return;
    }

    setLoading(true);
    try {
      const res = await apiFetch('/users/password', {
        method: 'PUT',
        body: {
          oldPassword: passwordForm.oldPassword,
          newPassword: passwordForm.newPassword,
        },
      });

      setLoading(false);
      if (res.success) {
        showNotification('Password updated successfully');
        setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
      }
    } catch (err) {
      setLoading(false);
      const errMsg = err.errors && err.errors.length ? err.errors[0]?.message : err.message;
      showNotification(errMsg || 'Failed to update password', true);
    }
  };

  // ----------------------------------------------------
  // PROJECT CRUD HANDLERS
  // ----------------------------------------------------
  const handleOpenAddProject = () => {
    setProjectForm({
      title: '',
      description: '',
      techStack: '',
      githubLink: '',
      liveDemoLink: '',
      imageUrl: '',
    });
    setEditingProjectId(null);
    setSelectedGradient('gradient-1');
    setUseCustomImageUrl(false);
    setIsAddingProject(true);
  };

  const handleOpenEditProject = (proj) => {
    setProjectForm({
      title: proj.title,
      description: proj.description,
      techStack: proj.techStack.join(', '),
      githubLink: proj.githubLink || '',
      liveDemoLink: proj.liveDemoLink || '',
      imageUrl: proj.imageUrl || '',
    });
    setEditingProjectId(proj._id);
    setIsAddingProject(true);

    const isPlaceholder = proj.imageUrl.startsWith('gradient-');
    if (isPlaceholder) {
      setSelectedGradient(proj.imageUrl);
      setUseCustomImageUrl(false);
    } else {
      setUseCustomImageUrl(proj.imageUrl ? true : false);
    }
  };

  const handleProjectSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // If using placeholder, save placeholder ID string as imageUrl
    const projData = {
      ...projectForm,
      imageUrl: useCustomImageUrl ? projectForm.imageUrl : selectedGradient,
    };

    if (editingProjectId) {
      dispatch(updateProject({ id: editingProjectId, projectData: projData }))
        .unwrap()
        .then(() => {
          setLoading(false);
          setIsAddingProject(false);
          setEditingProjectId(null);
          showNotification('Project updated successfully');
        })
        .catch((err) => {
          setLoading(false);
          const errMsg = Array.isArray(err) ? err[0]?.message : err;
          showNotification(errMsg || 'Failed to update project', true);
        });
    } else {
      dispatch(createProject(projData))
        .unwrap()
        .then(() => {
          setLoading(false);
          setIsAddingProject(false);
          showNotification('Project added successfully');
        })
        .catch((err) => {
          setLoading(false);
          const errMsg = Array.isArray(err) ? err[0]?.message : err;
          showNotification(errMsg || 'Failed to create project', true);
        });
    }
  };

  const handleProjectDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      dispatch(deleteProject(id))
        .unwrap()
        .then(() => {
          showNotification('Project deleted successfully');
        })
        .catch(() => {
          showNotification('Failed to delete project', true);
        });
    }
  };

  // ----------------------------------------------------
  // ACCOUNT DELETION
  // ----------------------------------------------------
  const handleDeleteAccountSubmit = (e) => {
    e.preventDefault();
    if (deleteInput !== 'delete my account') {
      showNotification('Confirmation text is incorrect', true);
      return;
    }
    setLoading(true);
    dispatch(deleteAccount())
      .unwrap()
      .then(() => {
        setLoading(false);
        window.location.href = '/login';
      })
      .catch(() => {
        setLoading(false);
        showNotification('Failed to delete account', true);
      });
  };

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="text-3xl font-extrabold tracking-tight text-white mb-6">Settings</h1>

      {/* Tabs & Success Banner */}
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Navigation Sidebar */}
        <div className="w-full md:w-64 flex flex-row md:flex-col gap-2 border-b md:border-b-0 md:border-r border-white/5 pb-4 md:pb-0 md:pr-6 overflow-x-auto">
          <button
            onClick={() => { setActiveTab('profile'); setIsAddingProject(false); }}
            className={`flex items-center px-4 py-3 rounded-lg text-sm font-semibold whitespace-nowrap transition-all ${
              activeTab === 'profile'
                ? 'bg-white/5 text-brand-primary border border-brand-primary/20 shadow-[0_0_15px_rgba(124,58,237,0.1)]'
                : 'text-dark-muted hover:text-dark-text hover:bg-white/5'
            }`}
          >
            <FiUser className="mr-3" size={16} />
            Edit Profile
          </button>
          
          <button
            onClick={() => { setActiveTab('projects'); }}
            className={`flex items-center px-4 py-3 rounded-lg text-sm font-semibold whitespace-nowrap transition-all ${
              activeTab === 'projects'
                ? 'bg-white/5 text-brand-highlight border border-brand-highlight/20 shadow-[0_0_15px_rgba(6,182,212,0.1)]'
                : 'text-dark-muted hover:text-dark-text hover:bg-white/5'
            }`}
          >
            <FiFolder className="mr-3" size={16} />
            Manage Projects
          </button>

          <button
            onClick={() => { setActiveTab('security'); setIsAddingProject(false); }}
            className={`flex items-center px-4 py-3 rounded-lg text-sm font-semibold whitespace-nowrap transition-all ${
              activeTab === 'security'
                ? 'bg-white/5 text-brand-accent border border-brand-accent/20 shadow-[0_0_15px_rgba(168,85,247,0.1)]'
                : 'text-dark-muted hover:text-dark-text hover:bg-white/5'
            }`}
          >
            <FiLock className="mr-3" size={16} />
            Security & Danger
          </button>
        </div>

        {/* Tab Content Canvas */}
        <div className="flex-grow">
          {successMsg && (
            <div className="mb-6 rounded-xl bg-brand-success/10 border border-brand-success/20 p-4 text-sm text-brand-success flex items-center">
              <FiCheckCircle className="mr-2" size={16} />
              {successMsg}
            </div>
          )}

          {errorMsg && (
            <div className="mb-6 rounded-xl bg-brand-error/10 border border-brand-error/20 p-4 text-sm text-brand-error flex items-center">
              <FiAlertTriangle className="mr-2" size={16} />
              {errorMsg}
            </div>
          )}

          {/* EDIT PROFILE TAB */}
          {activeTab === 'profile' && (
            <form onSubmit={handleProfileSubmit} className="glass-panel rounded-2xl p-6 md:p-8 border border-white/5 space-y-6">
              <h2 className="text-xl font-bold text-white mb-2">Profile Details</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Name</label>
                  <input
                    type="text"
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    required
                    className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-brand-primary/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Avatar URL (Optional)</label>
                  <input
                    type="text"
                    value={profileForm.profilePicture}
                    onChange={(e) => setProfileForm({ ...profileForm, profilePicture: e.target.value })}
                    placeholder="https://example.com/avatar.jpg"
                    className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-brand-primary/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">College</label>
                  <input
                    type="text"
                    value={profileForm.college}
                    onChange={(e) => setProfileForm({ ...profileForm, college: e.target.value })}
                    placeholder="e.g. Stanford University"
                    className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-brand-primary/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Location</label>
                  <input
                    type="text"
                    value={profileForm.location}
                    onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
                    placeholder="e.g. San Francisco, CA"
                    className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-brand-primary/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Skills (Comma-separated)</label>
                <input
                  type="text"
                  value={profileForm.skills}
                  onChange={(e) => setProfileForm({ ...profileForm, skills: e.target.value })}
                  placeholder="React, Node, MongoDB, DevOps"
                  className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-brand-primary/50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Brief Bio (1 sentence)</label>
                <input
                  type="text"
                  value={profileForm.bio}
                  onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                  placeholder="Fullstack architect building high throughput developer utilities."
                  className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-brand-primary/50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">About Me (Markdown/Text)</label>
                <textarea
                  value={profileForm.about}
                  onChange={(e) => setProfileForm({ ...profileForm, about: e.target.value })}
                  rows={4}
                  placeholder="Describe your path, interests, and building experiences..."
                  className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-brand-primary/50"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-white/5">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">GitHub URL</label>
                  <input
                    type="text"
                    value={profileForm.github}
                    onChange={(e) => setProfileForm({ ...profileForm, github: e.target.value })}
                    placeholder="https://github.com/username"
                    className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">LinkedIn URL</label>
                  <input
                    type="text"
                    value={profileForm.linkedin}
                    onChange={(e) => setProfileForm({ ...profileForm, linkedin: e.target.value })}
                    placeholder="https://linkedin.com/in/username"
                    className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Portfolio Website</label>
                  <input
                    type="text"
                    value={profileForm.portfolio}
                    onChange={(e) => setProfileForm({ ...profileForm, portfolio: e.target.value })}
                    placeholder="https://portfolio.dev"
                    className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm text-white focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2.5 rounded-lg bg-brand-primary hover:opacity-95 text-white text-sm font-semibold transition-all duration-200"
              >
                {loading ? 'Saving...' : 'Save Profile Changes'}
              </button>
            </form>
          )}

          {/* MANAGE PROJECTS TAB */}
          {activeTab === 'projects' && (
            <div className="space-y-6">
              {!isAddingProject ? (
                <div className="glass-panel rounded-2xl p-6 md:p-8 border border-white/5">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h2 className="text-xl font-bold text-white">Project Portfolios</h2>
                      <p className="text-xs text-dark-muted">Add or manage repositories showcasing your developer skills.</p>
                    </div>
                    <button
                      onClick={handleOpenAddProject}
                      className="px-4 py-2 bg-brand-highlight hover:opacity-95 text-white rounded-lg text-xs font-bold transition-all flex items-center"
                    >
                      <FiPlus className="mr-1" /> Add Project
                    </button>
                  </div>

                  {projects.length === 0 ? (
                    <div className="text-center py-12 border border-dashed border-white/5 rounded-xl">
                      <FiFolder size={36} className="mx-auto text-dark-muted mb-2" />
                      <h3 className="text-sm font-bold text-slate-300">No projects added yet</h3>
                      <p className="text-xs text-dark-muted mt-1 max-w-xs mx-auto">Click "Add Project" to add your first build.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {projects.map((proj) => (
                        <div key={proj._id} className="flex border border-white/5 bg-white/5 rounded-xl p-4 items-center justify-between">
                          <div className="flex items-center space-x-3 overflow-hidden">
                            <div className="h-12 w-12 rounded-lg bg-slate-800 flex-shrink-0 flex items-center justify-center overflow-hidden">
                              {proj.imageUrl.startsWith('gradient-') ? (
                                <div className={`h-full w-full ${GRADIENTS.find(g => g.id === proj.imageUrl)?.class || 'bg-slate-700'}`} />
                              ) : proj.imageUrl ? (
                                <img src={proj.imageUrl} alt={proj.title} className="h-full w-full object-cover" />
                              ) : (
                                <FiFolder size={18} className="text-slate-400" />
                              )}
                            </div>
                            <div className="overflow-hidden">
                              <h3 className="text-sm font-bold text-white truncate">{proj.title}</h3>
                              <p className="text-xs text-dark-muted truncate">{proj.description}</p>
                            </div>
                          </div>
                          <div className="flex space-x-2 ml-4 flex-shrink-0">
                            <button
                              onClick={() => handleOpenEditProject(proj)}
                              className="p-2 border border-white/5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all"
                            >
                              <FiEdit2 size={14} />
                            </button>
                            <button
                              onClick={() => handleProjectDelete(proj._id)}
                              className="p-2 border border-white/5 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all"
                            >
                              <FiTrash2 size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                /* Add / Edit Project Form */
                <form onSubmit={handleProjectSubmit} className="glass-panel rounded-2xl p-6 md:p-8 border border-white/5 space-y-6">
                  <div className="flex justify-between items-center border-b border-white/5 pb-4">
                    <h3 className="text-lg font-bold text-white">
                      {editingProjectId ? 'Edit Project' : 'Add Project'}
                    </h3>
                    <button
                      type="button"
                      onClick={() => setIsAddingProject(false)}
                      className="text-xs text-dark-muted hover:text-white"
                    >
                      Cancel
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Project Title</label>
                      <input
                        type="text"
                        value={projectForm.title}
                        onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                        required
                        placeholder="e.g. Portfolio Tracker"
                        className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-brand-primary/50"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Tech Stack (Comma-separated)</label>
                      <input
                        type="text"
                        value={projectForm.techStack}
                        onChange={(e) => setProjectForm({ ...projectForm, techStack: e.target.value })}
                        required
                        placeholder="React, Node.js, TailwindCSS"
                        className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-brand-primary/50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Project Description</label>
                    <textarea
                      value={projectForm.description}
                      onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                      required
                      rows={3}
                      placeholder="Briefly explain the goal and features of this build..."
                      className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm text-white focus:outline-none focus:border-brand-primary/50"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">GitHub Repository URL (Optional)</label>
                      <input
                        type="text"
                        value={projectForm.githubLink}
                        onChange={(e) => setProjectForm({ ...projectForm, githubLink: e.target.value })}
                        placeholder="https://github.com/username/project"
                        className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm text-white focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Live Demo URL (Optional)</label>
                      <input
                        type="text"
                        value={projectForm.liveDemoLink}
                        onChange={(e) => setProjectForm({ ...projectForm, liveDemoLink: e.target.value })}
                        placeholder="https://project.demo"
                        className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm text-white focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Thumbnail Selection Block */}
                  <div className="pt-4 border-t border-white/5">
                    <div className="flex justify-between items-center mb-4">
                      <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">Project Thumbnail</label>
                      <button
                        type="button"
                        onClick={() => setUseCustomImageUrl(!useCustomImageUrl)}
                        className="text-xs text-brand-highlight font-semibold"
                      >
                        {useCustomImageUrl ? 'Select from Gradient Presets' : 'Paste custom image URL'}
                      </button>
                    </div>

                    {useCustomImageUrl ? (
                      <input
                        type="text"
                        value={projectForm.imageUrl}
                        onChange={(e) => setProjectForm({ ...projectForm, imageUrl: e.target.value })}
                        placeholder="https://images.unsplash.com/photo-example"
                        className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm text-white focus:outline-none"
                      />
                    ) : (
                      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                        {GRADIENTS.map((g) => (
                          <button
                            key={g.id}
                            type="button"
                            onClick={() => setSelectedGradient(g.id)}
                            className={`h-16 rounded-lg relative overflow-hidden border transition-all ${
                              selectedGradient === g.id
                                ? 'border-brand-primary scale-[1.03] ring-1 ring-brand-primary'
                                : 'border-white/10 hover:border-white/20'
                            }`}
                          >
                            <div className={`h-full w-full ${g.class}`} />
                            {selectedGradient === g.id && (
                              <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-[10px] font-bold text-white">
                                Selected
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex space-x-3 pt-4 border-t border-white/5">
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-5 py-2.5 rounded-lg bg-brand-primary text-white text-sm font-semibold"
                    >
                      {loading ? 'Saving...' : editingProjectId ? 'Update Project' : 'Create Project'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsAddingProject(false)}
                      className="px-5 py-2.5 rounded-lg border border-white/10 hover:bg-white/5 text-dark-text text-sm font-semibold"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* SECURITY & DANGER ZONE TAB */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              {/* Change Password */}
              <form onSubmit={handlePasswordSubmit} className="glass-panel rounded-2xl p-6 md:p-8 border border-white/5 space-y-6">
                <h2 className="text-xl font-bold text-white mb-2">Change Password</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Current Password</label>
                    <input
                      type="password"
                      value={passwordForm.oldPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
                      required
                      placeholder="••••••••"
                      className="w-full max-w-md px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">New Password</label>
                    <input
                      type="password"
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                      required
                      placeholder="At least 6 characters"
                      className="w-full max-w-md px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Confirm New Password</label>
                    <input
                      type="password"
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                      required
                      placeholder="Confirm new password"
                      className="w-full max-w-md px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm text-white focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2.5 rounded-lg bg-brand-primary text-white text-sm font-semibold"
                >
                  Update Password
                </button>
              </form>

              {/* Danger Zone */}
              <div className="glass-panel border-red-500/10 rounded-2xl p-6 md:p-8 border bg-red-950/5 space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-red-400 flex items-center">
                    <FiAlertTriangle className="mr-2" /> Danger Zone
                  </h3>
                  <p className="text-xs text-dark-muted mt-1">
                    Permanently delete your account. This action cascades to delete all your project portfolios and connection requests, and cannot be undone.
                  </p>
                </div>

                {!showDeleteConfirm ? (
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(true)}
                    className="px-5 py-2.5 rounded-lg bg-red-500/15 hover:bg-red-500/25 border border-red-500/20 text-red-300 text-sm font-semibold transition-all"
                  >
                    Delete Account...
                  </button>
                ) : (
                  <form onSubmit={handleDeleteAccountSubmit} className="space-y-4 pt-4 border-t border-white/5">
                    <p className="text-xs text-slate-300 font-medium">
                      Please type <span className="text-red-400 font-bold">delete my account</span> below to confirm account destruction:
                    </p>
                    <input
                      type="text"
                      value={deleteInput}
                      onChange={(e) => setDeleteInput(e.target.value)}
                      required
                      placeholder="delete my account"
                      className="w-full max-w-md px-4 py-2.5 rounded-lg bg-red-950/20 border border-red-500/25 text-sm text-red-200 focus:outline-none"
                    />
                    <div className="flex space-x-3">
                      <button
                        type="submit"
                        disabled={loading}
                        className="px-5 py-2.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-sm font-semibold transition-all"
                      >
                        Delete My Profile Permanently
                      </button>
                      <button
                        type="button"
                        onClick={() => { setShowDeleteConfirm(false); setDeleteInput(''); }}
                        className="px-5 py-2.5 rounded-lg border border-white/10 hover:bg-white/5 text-dark-text text-sm font-semibold"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Settings;
export { GRADIENTS };
