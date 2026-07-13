import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProfileByUsername, clearSelectedProfile } from '../redux/profileSlice';
import { fetchUserProjects, clearProjects } from '../redux/projectSlice';
import { fetchConnections, sendConnectionRequest, acceptConnectionRequest, rejectConnectionRequest, removeConnection } from '../redux/connectionSlice';
import { GRADIENTS } from './Settings';
import { FiMapPin, FiBookOpen, FiGithub, FiLinkedin, FiGlobe, FiFolder, FiExternalLink, FiUser, FiActivity, FiArrowLeft } from 'react-icons/fi';

const Profile = () => {
  const { username } = useParams();
  const dispatch = useDispatch();
  
  const { user: currentUser } = useSelector((state) => state.auth);
  const { selectedProfile, loading: profileLoading, error: profileError } = useSelector((state) => state.profiles);
  const { projects, loading: projectsLoading } = useSelector((state) => state.projects);
  const { accepted, pendingIncoming, pendingOutgoing } = useSelector((state) => state.connections);

  const [connStatus, setConnStatus] = useState('none'); // 'none', 'self', 'connected', 'incoming', 'outgoing'
  const [connId, setConnId] = useState(null);

  useEffect(() => {
    dispatch(fetchProfileByUsername(username));
    dispatch(fetchConnections());

    return () => {
      dispatch(clearSelectedProfile());
      dispatch(clearProjects());
    };
  }, [dispatch, username]);

  useEffect(() => {
    if (selectedProfile?._id) {
      dispatch(fetchUserProjects(selectedProfile._id));
    }
  }, [dispatch, selectedProfile?._id]);

  // Determine Connection Status
  useEffect(() => {
    if (!currentUser || !selectedProfile) return;

    if (currentUser._id === selectedProfile._id) {
      setConnStatus('self');
      return;
    }

    const activeMatch = accepted.find(c => c.user._id === selectedProfile._id);
    if (activeMatch) {
      setConnStatus('connected');
      setConnId(activeMatch.connectionId);
      return;
    }

    const outgoingMatch = pendingOutgoing.find(c => c.user._id === selectedProfile._id);
    if (outgoingMatch) {
      setConnStatus('outgoing');
      setConnId(outgoingMatch.connectionId);
      return;
    }

    const incomingMatch = pendingIncoming.find(c => c.user._id === selectedProfile._id);
    if (incomingMatch) {
      setConnStatus('incoming');
      setConnId(incomingMatch.connectionId);
      return;
    }

    setConnStatus('none');
    setConnId(null);
  }, [currentUser, selectedProfile, accepted, pendingIncoming, pendingOutgoing]);

  // Actions
  const handleConnect = () => {
    dispatch(sendConnectionRequest(selectedProfile._id));
  };

  const handleAccept = () => {
    dispatch(acceptConnectionRequest(connId));
  };

  const handleReject = () => {
    dispatch(rejectConnectionRequest(connId));
  };

  const handleRemove = () => {
    if (window.confirm(`Are you sure you want to disconnect with ${selectedProfile.name}?`)) {
      dispatch(removeConnection(selectedProfile._id));
    }
  };

  if (profileLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-primary border-t-transparent" />
      </div>
    );
  }

  if (profileError || !selectedProfile) {
    return (
      <div className="text-center py-12 glass-panel rounded-2xl max-w-md mx-auto space-y-4">
        <FiUser size={48} className="mx-auto text-dark-muted" />
        <div>
          <h2 className="text-xl font-bold text-white">Developer Not Found</h2>
          <p className="text-xs text-dark-muted mt-1 px-4">
            The developer profile you are seeking does not exist or has been deleted.
          </p>
        </div>
        <Link to="/directory" className="inline-flex items-center px-4 py-2 rounded-lg bg-brand-primary text-xs font-semibold text-white">
          <FiArrowLeft className="mr-1.5" /> Back to Directory
        </Link>
      </div>
    );
  }

  // Find css gradient matching placeholder
  const getGradientClass = (imgUrl) => {
    const match = GRADIENTS.find(g => g.id === imgUrl);
    return match ? match.class : 'bg-slate-800';
  };

  return (
    <div className="max-w-6xl mx-auto px-4 space-y-8">
      
      {/* Back to Directory link */}
      <div>
        <Link to="/directory" className="inline-flex items-center text-xs font-bold text-dark-muted hover:text-white transition-colors">
          <FiArrowLeft className="mr-1.5" /> Back to Developers Directory
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left Column: Profile Core Detail Card */}
        <div className="space-y-6 lg:col-span-1">
          
          <div className="glass-panel rounded-2xl p-6 border border-white/5 space-y-6 text-center lg:text-left relative overflow-hidden">
            {/* Avatar block */}
            <div className="flex flex-col items-center lg:items-start space-y-4">
              {selectedProfile.profilePicture ? (
                <img
                  src={selectedProfile.profilePicture}
                  alt={selectedProfile.name}
                  className="h-20 w-20 rounded-full border border-dark-border object-cover"
                />
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-brand-primary to-brand-accent text-3xl font-black text-white">
                  {selectedProfile.name[0]}
                </div>
              )}

              <div className="space-y-1">
                <h1 className="text-xl font-bold text-white tracking-tight leading-snug">{selectedProfile.name}</h1>
                <p className="text-xs text-brand-highlight font-medium">@{selectedProfile.username}</p>
              </div>
            </div>

            {/* Quick Bio statement */}
            <p className="text-xs text-slate-300 leading-relaxed">
              {selectedProfile.bio || 'MERN developer building clean applications.'}
            </p>

            {/* Meta facts */}
            <div className="space-y-2 text-[10px] text-dark-muted font-medium pt-4 border-t border-white/5">
              {selectedProfile.college && (
                <div className="flex items-center justify-center lg:justify-start">
                  <span className="mr-2">🏢</span> {selectedProfile.college}
                </div>
              )}
              {selectedProfile.location && (
                <div className="flex items-center justify-center lg:justify-start">
                  <span className="mr-2">📍</span> {selectedProfile.location}
                </div>
              )}
            </div>

            {/* Social connection chips */}
            <div className="flex justify-center lg:justify-start space-x-3 pt-4 border-t border-white/5">
              {selectedProfile.github ? (
                <a href={selectedProfile.github} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-all" title="GitHub">
                  <FiGithub size={15} />
                </a>
              ) : (
                <span className="p-2 rounded-lg bg-white/[0.02] text-slate-600 cursor-not-allowed"><FiGithub size={15} /></span>
              )}

              {selectedProfile.linkedin ? (
                <a href={selectedProfile.linkedin} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-all" title="LinkedIn">
                  <FiLinkedin size={15} />
                </a>
              ) : (
                <span className="p-2 rounded-lg bg-white/[0.02] text-slate-600 cursor-not-allowed"><FiLinkedin size={15} /></span>
              )}

              {selectedProfile.portfolio ? (
                <a href={selectedProfile.portfolio} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-all" title="Website">
                  <FiGlobe size={15} />
                </a>
              ) : (
                <span className="p-2 rounded-lg bg-white/[0.02] text-slate-600 cursor-not-allowed"><FiGlobe size={15} /></span>
              )}
            </div>

            {/* Connection action trigger */}
            <div className="pt-4">
              {connStatus === 'self' && (
                <Link
                  to="/settings"
                  className="block text-center w-full py-2.5 bg-white/5 hover:bg-white/10 border border-dark-border text-xs font-bold text-white rounded-xl transition-all"
                >
                  Edit Profile settings
                </Link>
              )}

              {connStatus === 'none' && (
                <button
                  onClick={handleConnect}
                  className="block text-center w-full py-2.5 bg-brand-primary hover:bg-brand-hover text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-brand-primary/15 active:scale-95"
                >
                  Connect
                </button>
              )}

              {connStatus === 'outgoing' && (
                <button
                  onClick={handleRemove}
                  className="block text-center w-full py-2.5 border border-brand-accent/30 text-brand-accent hover:bg-brand-accent/5 text-xs font-bold rounded-xl transition-all"
                >
                  Request Pending (Cancel)
                </button>
              )}

              {connStatus === 'incoming' && (
                <div className="flex space-x-2">
                  <button
                    onClick={handleAccept}
                    className="flex-grow py-2.5 bg-brand-success text-white text-xs font-bold rounded-xl hover:opacity-90 transition-all"
                  >
                    Accept
                  </button>
                  <button
                    onClick={handleReject}
                    className="flex-grow py-2.5 bg-brand-error text-white text-xs font-bold rounded-xl hover:opacity-90 transition-all"
                  >
                    Decline
                  </button>
                </div>
              )}

              {connStatus === 'connected' && (
                <button
                  onClick={handleRemove}
                  className="block text-center w-full py-2.5 border border-red-500/25 hover:bg-red-500/10 text-xs font-bold text-red-400 rounded-xl transition-all active:scale-95"
                >
                  Remove Connection
                </button>
              )}
            </div>

          </div>

          {/* Tech Skills inventory card */}
          <div className="glass-panel rounded-2xl p-6 border border-white/5 space-y-4">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider">Tech Stack</h2>
            {selectedProfile.skills && selectedProfile.skills.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {selectedProfile.skills.map((skill, i) => (
                  <span key={i} className="text-xs bg-white/5 border border-white/5 text-dark-muted px-2.5 py-1 rounded-lg">
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-dark-muted">No skills listed yet.</p>
            )}
          </div>

        </div>

        {/* Right Column: Portfolio Sections (About, Projects, Recent timeline) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* About Me card */}
          <div className="glass-panel rounded-2xl p-6 md:p-8 border border-white/5 space-y-4">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider">About Me</h2>
            <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
              {selectedProfile.about || 'This developer has not filled out their detailed about section yet.'}
            </p>
          </div>

          {/* Project Showcase */}
          <div className="glass-panel rounded-2xl p-6 md:p-8 border border-white/5 space-y-6">
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">Project Showcases</h2>
              <p className="text-xs text-dark-muted mt-0.5">Developer builds and portfolio highlights</p>
            </div>

            {projectsLoading ? (
              <div className="h-24 w-full bg-slate-800 animate-pulse rounded-xl" />
            ) : projects.length === 0 ? (
              <div className="text-center py-10 border border-dashed border-dark-border rounded-xl">
                <FiFolder size={32} className="mx-auto text-dark-muted mb-2" />
                <h4 className="text-xs font-bold text-slate-300">No project builds listed</h4>
                <p className="text-[10px] text-dark-muted">This developer has not pinned any projects to showcase yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {projects.map((project) => (
                  <div key={project._id} className="border border-dark-border bg-white/[0.01] hover:bg-white/[0.03] rounded-xl p-4 flex flex-col justify-between transition-all">
                    <div>
                      {/* Fixed 16:9 aspect ratio image wrapper */}
                      <div className="w-full aspect-video rounded-lg overflow-hidden border border-dark-border flex items-center justify-center mb-3 bg-slate-800">
                        {project.imageUrl && project.imageUrl.startsWith('gradient-') ? (
                          <div className={`h-full w-full ${getGradientClass(project.imageUrl)}`} />
                        ) : (
                          <img
                            src={project.imageUrl || '/images/project-placeholder.svg'}
                            alt={project.title}
                            className="w-full h-full object-cover rounded-lg"
                            loading="lazy"
                            onError={(e) => {
                              e.currentTarget.src = '/images/project-placeholder.svg';
                            }}
                          />
                        )}
                      </div>
                      <h3 className="text-sm font-bold text-white truncate leading-snug">{project.title}</h3>
                      <p className="text-[11px] text-dark-muted mt-1.5 line-clamp-2 leading-relaxed">
                        {project.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                      <div className="flex flex-wrap gap-1">
                        {project.techStack.slice(0, 2).map((tech, i) => (
                          <span key={i} className="text-[9px] bg-white/5 text-dark-muted px-1.5 py-0.5 rounded">
                            {tech}
                          </span>
                        ))}
                      </div>
                      <div className="flex space-x-3 text-dark-muted">
                        {project.githubLink && (
                          <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                            <FiGithub size={14} />
                          </a>
                        )}
                        {project.liveDemoLink && (
                          <a href={project.liveDemoLink} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                            <FiExternalLink size={14} />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Simulated Activity Timeline Feed */}
          <div className="glass-panel rounded-2xl p-6 md:p-8 border border-white/5 space-y-6">
            <h2 className="text-xs font-bold text-white uppercase tracking-wider flex items-center">
              <FiActivity className="mr-2 text-brand-primary" /> Recent Activity Timeline
            </h2>
            
            <div className="relative pl-6 border-l border-dark-border space-y-6">
              
              {/* Event 1 */}
              <div className="relative">
                <span className="absolute -left-[29px] top-1 flex h-2 w-2 rounded-full bg-brand-primary" />
                <h4 className="text-xs font-bold text-white">Joined DevConnect</h4>
                <p className="text-[10px] text-dark-muted mt-0.5">Created profile and indexed developer credentials.</p>
              </div>

              {/* Event 2 */}
              {projects.length > 0 && (
                <div className="relative">
                  <span className="absolute -left-[29px] top-1 flex h-2 w-2 rounded-full bg-brand-accent" />
                  <h4 className="text-xs font-bold text-white">Pinned Portfolio Builds</h4>
                  <p className="text-[10px] text-dark-muted mt-0.5">Linked repository builds to showcase gallery.</p>
                </div>
              )}

              {/* Event 3 */}
              <div className="relative">
                <span className="absolute -left-[29px] top-1 flex h-2 w-2 rounded-full bg-brand-highlight" />
                <h4 className="text-xs font-bold text-white">Established Network Vector</h4>
                <p className="text-[10px] text-dark-muted mt-0.5">Connected and requested updates with peer developers.</p>
              </div>

            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default Profile;
