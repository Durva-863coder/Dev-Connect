import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUserProjects } from '../redux/projectSlice';
import { fetchProfiles } from '../redux/profileSlice';
import { fetchConnections, sendConnectionRequest, acceptConnectionRequest, rejectConnectionRequest, removeConnection } from '../redux/connectionSlice';
import { FiPlus, FiFolder, FiUsers, FiCompass, FiArrowRight, FiGithub, FiExternalLink, FiSettings, FiGrid, FiUser } from 'react-icons/fi';

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const { profiles, loading: profilesLoading } = useSelector((state) => state.profiles);
  const { projects, loading: projectsLoading } = useSelector((state) => state.projects);
  const { accepted, pendingIncoming, pendingOutgoing, loading: connectionsLoading } = useSelector((state) => state.connections);
  
  const dispatch = useDispatch();

  useEffect(() => {
    if (user?._id) {
      dispatch(fetchUserProjects(user._id));
      dispatch(fetchConnections());
      dispatch(fetchProfiles({}));
    }
  }, [dispatch, user?._id]);

  // Determine Greeting based on current time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  // Compute profile completion percentage dynamically
  const calculateCompletion = () => {
    if (!user) return 0;
    let score = 40; // Default: Name, Username, Email, Password are set at register
    
    if (user.profilePicture) score += 10;
    if (user.college) score += 10;
    if (user.location) score += 10;
    if (user.bio) score += 10;
    if (user.skills && user.skills.length > 0) score += 10;
    if (user.about) score += 10;

    return score;
  };

  const completionPct = calculateCompletion();
  const recentProjects = projects ? projects.slice(0, 3) : [];

  // "People You May Know" Recommendation Engine
  const peopleYouMayKnow = React.useMemo(() => {
    if (!profiles || !user) return [];

    // Construct a set of user IDs to exclude (self, accepted, pending incoming/outgoing)
    const excludeIds = new Set([
      user._id,
      ...accepted.map(c => c.user._id),
      ...pendingIncoming.map(c => c.user._id),
      ...pendingOutgoing.map(c => c.user._id)
    ]);

    return profiles.filter(p => !excludeIds.has(p._id)).slice(0, 3);
  }, [profiles, user, accepted, pendingIncoming, pendingOutgoing]);

  // Trigger quick connect from recommendations
  const handleQuickConnect = (devId) => {
    dispatch(sendConnectionRequest(devId));
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4">
      
      {/* Top Banner Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Greeting Welcome card */}
        <div className="lg:col-span-2 glass-panel rounded-2xl p-6 md:p-8 flex flex-col justify-between relative overflow-hidden">
          <div>
            <span className="text-brand-primary text-xs font-semibold uppercase tracking-wider">
              Workspace Hub
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mt-2 text-white">
              {getGreeting()}, {user?.name}
            </h1>
            <p className="mt-3 text-xs sm:text-sm text-dark-muted max-w-lg leading-relaxed">
              Manage your credentials, update your active projects grid, view pending network connection actions, and review recommended developers.
            </p>
          </div>

          {/* Quick Actions Shortcuts row */}
          <div className="grid grid-cols-3 gap-3 mt-8">
            <Link
              to="/settings"
              className="flex flex-col items-center justify-center p-3 rounded-xl border border-dark-border bg-white/[0.02] hover:bg-white/5 text-slate-300 hover:text-white transition-all text-center group"
            >
              <FiSettings size={18} className="text-brand-primary mb-1.5" />
              <span className="text-[10px] font-bold">Edit Profile</span>
            </Link>
            <Link
              to="/settings?tab=projects"
              className="flex flex-col items-center justify-center p-3 rounded-xl border border-dark-border bg-white/[0.02] hover:bg-white/5 text-slate-300 hover:text-white transition-all text-center group"
            >
              <FiFolder size={18} className="text-brand-accent mb-1.5" />
              <span className="text-[10px] font-bold">Add Project</span>
            </Link>
            <Link
              to="/directory"
              className="flex flex-col items-center justify-center p-3 rounded-xl border border-dark-border bg-white/[0.02] hover:bg-white/5 text-slate-300 hover:text-white transition-all text-center group"
            >
              <FiCompass size={18} className="text-brand-highlight mb-1.5" />
              <span className="text-[10px] font-bold">Find Peers</span>
            </Link>
          </div>
        </div>

        {/* Profile Completion Circle Gauge */}
        <div className="glass-panel rounded-2xl p-6 md:p-8 flex flex-col justify-between relative">
          <div className="flex justify-between items-center">
            <span className="text-brand-accent text-xs font-semibold uppercase tracking-wider">
              Profile Strength
            </span>
            <span className="text-brand-accent text-sm font-bold">
              {completionPct}%
            </span>
          </div>

          <div className="flex items-center justify-center my-4">
            <div className="relative flex items-center justify-center h-24 w-24">
              <svg className="absolute w-full h-full transform -rotate-90">
                <circle
                  cx="48"
                  cy="48"
                  r="38"
                  className="stroke-slate-800 fill-none"
                  strokeWidth="6"
                />
                <circle
                  cx="48"
                  cy="48"
                  r="38"
                  className="stroke-brand-accent fill-none transition-all duration-1000 ease-out"
                  strokeWidth="6"
                  strokeDasharray="238.7"
                  strokeDashoffset={238.7 - (238.7 * completionPct) / 100}
                  strokeLinecap="round"
                />
              </svg>
              <span className="text-xl font-extrabold text-white">{completionPct}%</span>
            </div>
          </div>

          <Link
            to="/settings"
            className="w-full text-center py-2.5 rounded-xl border border-dark-border bg-white/5 hover:bg-white/10 text-xs font-bold text-slate-300 transition-all flex items-center justify-center"
          >
            Complete Profile
            <FiArrowRight className="ml-1.5" />
          </Link>
        </div>
      </div>

      {/* Primary Statistics indicators */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel rounded-2xl p-5 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-dark-muted">Projects</p>
            <h3 className="text-2xl font-black text-white mt-0.5">{projectsLoading ? '...' : projects?.length}</h3>
          </div>
          <div className="p-2.5 bg-brand-primary/10 rounded-lg text-brand-primary">
            <FiFolder size={20} />
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-5 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-dark-muted">Network Members</p>
            <h3 className="text-2xl font-black text-white mt-0.5">{connectionsLoading ? '...' : accepted?.length}</h3>
          </div>
          <div className="p-2.5 bg-brand-highlight/10 rounded-lg text-brand-highlight">
            <FiUsers size={20} />
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-5 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-dark-muted">Incoming Requests</p>
            <h3 className="text-2xl font-black text-white mt-0.5">{connectionsLoading ? '...' : pendingIncoming?.length}</h3>
          </div>
          <div className="p-2.5 bg-brand-accent/10 rounded-lg text-brand-accent">
            <FiUsers size={20} />
          </div>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side 2-Columns (Projects & Networking requests) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Recent Projects list */}
          <div className="glass-panel rounded-2xl p-6 border border-white/5 space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold text-white tracking-tight">Recent Project Builds</h2>
                <p className="text-xs text-dark-muted">Your public portfolios project list</p>
              </div>
              <Link
                to="/settings"
                className="flex items-center text-xs font-bold text-brand-highlight hover:opacity-90"
              >
                <FiPlus className="mr-1" /> Add Build
              </Link>
            </div>

            {projectsLoading ? (
              <div className="space-y-4">
                <div className="h-10 w-full bg-slate-800 animate-pulse rounded-lg" />
                <div className="h-10 w-full bg-slate-800 animate-pulse rounded-lg" />
              </div>
            ) : recentProjects.length === 0 ? (
              <div className="text-center py-10 border border-dashed border-dark-border rounded-xl">
                <FiFolder size={32} className="mx-auto text-dark-muted mb-2" />
                <h4 className="text-xs font-bold text-slate-300">No projects added yet</h4>
                <p className="text-[10px] text-dark-muted mt-0.5">Showcase your developer builds to other users.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {recentProjects.map((project) => (
                  <div key={project._id} className="border border-dark-border bg-white/[0.01] hover:bg-white/[0.03] rounded-xl p-4 flex flex-col justify-between transition-all">
                    <div>
                      <h4 className="text-xs font-bold text-white truncate">{project.title}</h4>
                      <p className="text-[10px] text-dark-muted mt-1.5 line-clamp-2 leading-relaxed">
                        {project.description}
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                      <span className="text-[9px] bg-white/5 text-dark-muted px-1.5 py-0.5 rounded truncate max-w-[80px]">
                        {project.techStack[0]}
                      </span>
                      <div className="flex space-x-2 text-dark-muted">
                        {project.githubLink && (
                          <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                            <FiGithub size={13} />
                          </a>
                        )}
                        {project.liveDemoLink && (
                          <a href={project.liveDemoLink} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                            <FiExternalLink size={13} />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pending connection requests */}
          <div className="glass-panel rounded-2xl p-6 border border-white/5 space-y-6">
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">Pending Requests</h2>
              <p className="text-xs text-dark-muted">Connections waiting for response</p>
            </div>

            <div className="space-y-4">
              {/* Incoming requests */}
              <div>
                <h3 className="text-[10px] font-bold text-brand-primary uppercase tracking-wider mb-2.5">
                  Incoming ({pendingIncoming?.length})
                </h3>
                {connectionsLoading ? (
                  <div className="h-10 w-full bg-slate-800 animate-pulse rounded-lg" />
                ) : pendingIncoming?.length === 0 ? (
                  <p className="text-xs text-dark-muted">No incoming requests pending.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {pendingIncoming.map((conn) => (
                      <div key={conn.connectionId} className="flex items-center justify-between border border-dark-border bg-white/[0.01] rounded-xl p-3">
                        <div className="flex items-center space-x-2.5 overflow-hidden">
                          {conn.user.profilePicture ? (
                            <img src={conn.user.profilePicture} alt={conn.user.name} className="h-7 w-7 rounded-full object-cover" />
                          ) : (
                            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-800 text-[10px] font-bold text-white">
                              {conn.user.name[0]}
                            </div>
                          )}
                          <div className="overflow-hidden">
                            <Link to={`/u/${conn.user.username}`} className="text-xs font-bold text-white hover:text-brand-highlight block truncate">
                              {conn.user.name}
                            </Link>
                            <span className="text-[9px] text-dark-muted block truncate">@{conn.user.username}</span>
                          </div>
                        </div>
                        <div className="flex space-x-1.5 flex-shrink-0">
                          <button
                            onClick={() => dispatch(acceptConnectionRequest(conn.connectionId))}
                            className="px-2.5 py-1 bg-brand-success text-white text-[9px] font-bold rounded-lg hover:opacity-90 active:scale-95"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => dispatch(rejectConnectionRequest(conn.connectionId))}
                            className="px-2.5 py-1 bg-brand-error text-white text-[9px] font-bold rounded-lg hover:opacity-90 active:scale-95"
                          >
                            Decline
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Outgoing requests */}
              <div className="pt-2">
                <h3 className="text-[10px] font-bold text-brand-accent uppercase tracking-wider mb-2.5">
                  Outgoing ({pendingOutgoing?.length})
                </h3>
                {connectionsLoading ? (
                  <div className="h-10 w-full bg-slate-800 animate-pulse rounded-lg" />
                ) : pendingOutgoing?.length === 0 ? (
                  <p className="text-xs text-dark-muted">No pending outgoing requests.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {pendingOutgoing.map((conn) => (
                      <div key={conn.connectionId} className="flex items-center justify-between border border-dark-border bg-white/[0.01] rounded-xl p-3">
                        <div className="flex items-center space-x-2.5 overflow-hidden">
                          {conn.user.profilePicture ? (
                            <img src={conn.user.profilePicture} alt={conn.user.name} className="h-7 w-7 rounded-full object-cover" />
                          ) : (
                            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-800 text-[10px] font-bold text-white">
                              {conn.user.name[0]}
                            </div>
                          )}
                          <div className="overflow-hidden">
                            <Link to={`/u/${conn.user.username}`} className="text-xs font-bold text-white hover:text-brand-highlight block truncate">
                              {conn.user.name}
                            </Link>
                            <span className="text-[9px] text-dark-muted block truncate">@{conn.user.username}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => dispatch(removeConnection(conn.user._id))}
                          className="px-2.5 py-1 border border-dark-border text-dark-text hover:bg-white/5 text-[9px] font-bold rounded-lg active:scale-95"
                        >
                          Cancel
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </div>

        </div>

        {/* Right Side Column (Recommendations & Network list) */}
        <div className="space-y-6 col-span-1">
          
          {/* People You May Know Recommendation Panel */}
          <div className="glass-panel rounded-2xl p-6 border border-white/5 space-y-4">
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">People You May Know</h2>
              <p className="text-[10px] text-dark-muted mt-0.5">Engineers recommended for your network</p>
            </div>

            {profilesLoading ? (
              <div className="space-y-3">
                <div className="h-8 w-full bg-slate-800 animate-pulse rounded-lg" />
                <div className="h-8 w-full bg-slate-800 animate-pulse rounded-lg" />
              </div>
            ) : peopleYouMayKnow.length === 0 ? (
              <p className="text-xs text-dark-muted py-2">No recommended peers available.</p>
            ) : (
              <div className="space-y-3">
                {peopleYouMayKnow.map((dev) => (
                  <div key={dev._id} className="flex items-center justify-between p-2 rounded-xl border border-dark-border bg-white/[0.01]">
                    <div className="flex items-center space-x-2.5 overflow-hidden">
                      {dev.profilePicture ? (
                        <img src={dev.profilePicture} alt={dev.name} className="h-8 w-8 rounded-full object-cover flex-shrink-0" />
                      ) : (
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-[10px] font-bold text-white flex-shrink-0">
                          {dev.name[0]}
                        </div>
                      )}
                      <div className="overflow-hidden">
                        <Link to={`/u/${dev.username}`} className="text-xs font-bold text-white hover:text-brand-highlight block truncate">
                          {dev.name}
                        </Link>
                        <span className="text-[9px] text-dark-muted block truncate">{dev.bio || 'MERN developer'}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleQuickConnect(dev._id)}
                      className="px-2.5 py-1 bg-brand-primary text-white text-[9px] font-bold rounded-lg hover:bg-brand-hover flex-shrink-0 active:scale-95 transition-all"
                    >
                      Connect
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Active Connections Network list */}
          <div className="glass-panel rounded-2xl p-6 border border-white/5 space-y-4">
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">Active Network ({accepted?.length})</h2>
              <p className="text-[10px] text-dark-muted mt-0.5">Your connected developers</p>
            </div>

            {connectionsLoading ? (
              <div className="h-16 w-full bg-slate-800 animate-pulse rounded-lg" />
            ) : accepted?.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-xs text-dark-muted">No connections yet.</p>
                <Link to="/directory" className="inline-block text-[10px] text-brand-highlight font-bold mt-2 hover:opacity-90">
                  Browse Directory
                </Link>
              </div>
            ) : (
              <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
                {accepted.map((conn) => (
                  <div key={conn.connectionId} className="flex items-center justify-between p-2 rounded-xl border border-dark-border bg-white/[0.01]">
                    <div className="flex items-center space-x-2.5 overflow-hidden">
                      {conn.user.profilePicture ? (
                        <img src={conn.user.profilePicture} alt={conn.user.name} className="h-8 w-8 rounded-full object-cover flex-shrink-0" />
                      ) : (
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-[10px] font-bold text-white flex-shrink-0">
                          {conn.user.name[0]}
                        </div>
                      )}
                      <div className="overflow-hidden">
                        <Link to={`/u/${conn.user.username}`} className="text-xs font-bold text-white hover:text-brand-highlight block truncate">
                          {conn.user.name}
                        </Link>
                        <span className="text-[9px] text-dark-muted block truncate">@{conn.user.username}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        if (window.confirm(`Disconnect with ${conn.user.name}?`)) {
                          dispatch(removeConnection(conn.user._id));
                        }
                      }}
                      className="px-2 py-1 border border-red-500/20 text-red-400 hover:bg-red-500/5 text-[9px] font-bold rounded-lg active:scale-95 transition-all"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};

export default Dashboard;
