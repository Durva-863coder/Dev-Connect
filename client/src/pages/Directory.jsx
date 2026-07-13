import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { fetchProfiles } from '../redux/profileSlice';
import { FiSearch, FiCompass, FiUser, FiMapPin, FiBookOpen, FiSliders, FiTrash2 } from 'react-icons/fi';

const Directory = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { profiles, loading } = useSelector((state) => state.profiles);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [skillFilter, setSkillFilter] = useState('');
  const [collegeFilter, setCollegeFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [sortBy, setSortBy] = useState('alphabetical'); // 'alphabetical', 'newest', 'skills'

  // Extract query parameters from URL if present (e.g. from Landing Page click)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const skillParam = params.get('skill');
    if (skillParam) {
      setSkillFilter(skillParam);
    }
  }, [location.search]);

  // Trigger search on parameter changes
  useEffect(() => {
    dispatch(
      fetchProfiles({
        search: searchTerm,
        skills: skillFilter,
      })
    );
  }, [dispatch, searchTerm, skillFilter]);

  // Client-side filtering and sorting for advanced inputs (college, location, sorting)
  const processedProfiles = useMemo(() => {
    if (!profiles) return [];
    
    // 1. Filter locally by college and location
    let list = [...profiles];

    if (collegeFilter.trim()) {
      const colRegex = new RegExp(collegeFilter.trim(), 'i');
      list = list.filter(p => p.college && colRegex.test(p.college));
    }

    if (locationFilter.trim()) {
      const locRegex = new RegExp(locationFilter.trim(), 'i');
      list = list.filter(p => p.location && locRegex.test(p.location));
    }

    // 2. Sort locally
    if (sortBy === 'alphabetical') {
      list.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'newest') {
      list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === 'skills') {
      list.sort((a, b) => (b.skills?.length || 0) - (a.skills?.length || 0));
    }

    return list;
  }, [profiles, collegeFilter, locationFilter, sortBy]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setSkillFilter('');
    setCollegeFilter('');
    setLocationFilter('');
    setSortBy('alphabetical');
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4">
      
      {/* Page Title Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center">
            <FiCompass className="mr-3 text-brand-primary" /> Discover Developers
          </h1>
          <p className="text-sm text-dark-muted mt-1.5">
            Search and connect with fullstack engineers, DevOps builders, and AI researchers.
          </p>
        </div>

        {/* Clear Filters Button */}
        {(searchTerm || skillFilter || collegeFilter || locationFilter) && (
          <button
            onClick={handleResetFilters}
            className="flex items-center justify-center px-4 py-2 text-xs font-bold text-slate-300 hover:text-white border border-dark-border hover:border-red-500/30 hover:bg-red-500/5 rounded-xl transition-all w-fit active:scale-95"
          >
            <FiTrash2 className="mr-1.5" /> Clear All Filters
          </button>
        )}
      </div>

      {/* Advanced SaaS Search & Filter Grid */}
      <div className="glass-panel rounded-2xl p-5 border border-white/5 space-y-4">
        
        {/* Row 1: Search Inputs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Keyword Search */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
              <FiSearch size={16} />
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search name, bio..."
              className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-white/5 border border-dark-border text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-primary transition-all"
            />
          </div>

          {/* Skill Filter */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
              <FiSliders size={16} className="text-slate-500" />
            </span>
            <input
              type="text"
              value={skillFilter}
              onChange={(e) => setSkillFilter(e.target.value)}
              placeholder="Filter by skill (e.g. React)..."
              className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-white/5 border border-dark-border text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-primary transition-all"
            />
          </div>

          {/* College Filter */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
              <FiBookOpen size={16} />
            </span>
            <input
              type="text"
              value={collegeFilter}
              onChange={(e) => setCollegeFilter(e.target.value)}
              placeholder="Filter by college..."
              className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-white/5 border border-dark-border text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-primary transition-all"
            />
          </div>

          {/* Location Filter */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
              <FiMapPin size={16} />
            </span>
            <input
              type="text"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              placeholder="Filter by location..."
              className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-white/5 border border-dark-border text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-primary transition-all"
            />
          </div>

        </div>

        {/* Row 2: Sort Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-white/5 text-xs">
          <span className="text-dark-muted font-medium">
            Showing {processedProfiles.length} developer{processedProfiles.length !== 1 && 's'}
          </span>
          <div className="flex items-center space-x-2">
            <span className="text-dark-muted">Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-dark-card border border-dark-border text-xs text-white px-2.5 py-1.5 rounded-lg focus:outline-none focus:border-brand-primary"
            >
              <option value="alphabetical">Alphabetical</option>
              <option value="newest">Newest Join</option>
              <option value="skills">Most Skills</option>
            </select>
          </div>
        </div>

      </div>

      {/* Profile Cards Grid */}
      {loading ? (
        
        /* Premium Skeleton Loading States */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(n => (
            <div key={n} className="glass-panel rounded-2xl p-6 border border-white/5 space-y-6">
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 rounded-full bg-slate-800 animate-pulse" />
                <div className="space-y-2 flex-grow">
                  <div className="h-3 w-3/4 bg-slate-800 animate-pulse rounded" />
                  <div className="h-2 w-1/2 bg-slate-800 animate-pulse rounded" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-2 w-full bg-slate-800 animate-pulse rounded" />
                <div className="h-2 w-5/6 bg-slate-800 animate-pulse rounded" />
              </div>
              <div className="h-9 w-full bg-slate-800 animate-pulse rounded-lg" />
            </div>
          ))}
        </div>

      ) : processedProfiles.length === 0 ? (
        
        /* Custom Empty State */
        <div className="text-center py-16 glass-panel rounded-2xl max-w-md mx-auto border border-white/5 space-y-4">
          <FiUser size={48} className="mx-auto text-dark-muted" />
          <div className="space-y-1 px-4">
            <h3 className="text-lg font-bold text-white">No Developers Found</h3>
            <p className="text-xs text-dark-muted">
              We couldn't find any profiles matching your search filters. Try updating your keywords or clear the filter attributes.
            </p>
          </div>
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 bg-brand-primary hover:bg-brand-hover text-white text-xs font-bold rounded-lg transition-all"
          >
            Reset Filters
          </button>
        </div>

      ) : (
        
        /* Developer Grid List */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fadeIn">
          {processedProfiles.map((profile) => (
            <div
              key={profile._id}
              className="glass-panel-interactive rounded-2xl p-6 border border-white/5 flex flex-col justify-between"
            >
              <div>
                {/* Developer Headcard */}
                <div className="flex items-center space-x-4 mb-4">
                  {profile.profilePicture ? (
                    <img
                      src={profile.profilePicture}
                      alt={profile.name}
                      className="h-12 w-12 rounded-full border border-dark-border object-cover"
                    />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-brand-primary to-brand-accent text-lg font-semibold text-white">
                      {profile.name[0]}
                    </div>
                  )}
                  <div className="overflow-hidden">
                    <h3 className="text-base font-bold text-white truncate leading-snug">{profile.name}</h3>
                    <p className="text-xs text-brand-highlight font-medium">@{profile.username}</p>
                  </div>
                </div>

                {/* Developer Bio summary */}
                <p className="text-xs text-slate-300 line-clamp-2 min-h-[32px] leading-relaxed">
                  {profile.bio || 'MERN developer building solid applications.'}
                </p>

                {/* Location / College */}
                <div className="space-y-2 mt-4 text-[10px] text-dark-muted font-medium">
                  {profile.college && (
                    <div className="flex items-center">
                      <span className="mr-2">🏢</span>
                      <span className="truncate">{profile.college}</span>
                    </div>
                  )}
                  {profile.location && (
                    <div className="flex items-center">
                      <span className="mr-2">📍</span>
                      <span className="truncate">{profile.location}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Skills Tags list */}
              <div className="mt-6 pt-4 border-t border-white/5">
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {profile.skills && profile.skills.slice(0, 3).map((skill, idx) => (
                    <span
                      key={idx}
                      className="text-[9px] bg-white/5 border border-white/5 text-dark-muted px-2 py-0.5 rounded"
                    >
                      {skill}
                    </span>
                  ))}
                  {profile.skills && profile.skills.length > 3 && (
                    <span className="text-[9px] text-slate-500 px-1 py-0.5">
                      +{profile.skills.length - 3}
                    </span>
                  )}
                </div>

                <Link
                  to={`/u/${profile.username}`}
                  className="block text-center py-2.5 rounded-xl border border-brand-primary/20 bg-brand-primary/10 hover:bg-brand-primary text-xs font-bold text-white tracking-wide transition-all active:scale-95"
                >
                  View Profile
                </Link>
              </div>
            </div>
          ))}
        </div>

      )}
    </div>
  );
};

export default Directory;
