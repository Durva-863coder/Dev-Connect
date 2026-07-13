import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProfiles } from '../redux/profileSlice';
import { FiArrowRight, FiCompass, FiUsers, FiFolder, FiEye, FiHeart, FiCode, FiAward } from 'react-icons/fi';

const POPULAR_SKILLS = [
  'Java', 'Spring Boot', 'React', 'Node.js', 'MongoDB', 
  'Docker', 'AWS', 'Python', 'TypeScript', 'Git', 'Tailwind', 'Express'
];

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { profiles, loading } = useSelector((state) => state.profiles);

  useEffect(() => {
    dispatch(fetchProfiles({}));
  }, [dispatch]);

  // Handle clicking on a popular skill tag -> redirect to directory with filter
  const handleSkillClick = (skill) => {
    navigate(`/directory?skill=${encodeURIComponent(skill)}`);
  };

  const featuredDevs = profiles ? profiles.slice(0, 4) : [];

  return (
    <div className="space-y-20 pb-12">
      
      {/* Hero Section */}
      <section className="text-center pt-8 max-w-4xl mx-auto space-y-6 px-4">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-brand-primary/10 text-brand-primary border border-brand-primary/20">
          <FiAward className="mr-1.5" /> Introducing DevConnect 1.0
        </span>
        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-[1.1] text-balance">
          Build your developer identity. <br />
          <span className="text-brand-primary bg-clip-text">Showcase your builds.</span>
        </h1>
        <p className="text-base sm:text-lg text-dark-muted max-w-2xl mx-auto leading-relaxed">
          The professional network engineered exclusively for developers. Connect with creators, share collaborative project builds, and showcase your portfolio to the world.
        </p>

        <div className="flex flex-wrap justify-center gap-4 pt-4">
          <Link
            to="/register"
            className="px-6 py-3 rounded-xl bg-brand-primary hover:bg-brand-hover text-white text-sm font-bold transition-all shadow-md shadow-brand-primary/15 flex items-center group active:scale-[0.98]"
          >
            Get Started
            <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            to="/directory"
            className="px-6 py-3 rounded-xl border border-dark-border hover:border-brand-primary/30 hover:bg-white/5 text-slate-300 hover:text-white text-sm font-bold transition-all flex items-center active:scale-[0.98]"
          >
            <FiCompass className="mr-2" />
            Explore Developers
          </Link>
        </div>
      </section>

      {/* Platform Statistics */}
      <section className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel rounded-2xl p-6 text-center border border-white/5 relative overflow-hidden">
          <p className="text-xs uppercase tracking-wider font-semibold text-dark-muted">Verified Creators</p>
          <h3 className="text-4xl font-extrabold text-white mt-2">1,200+</h3>
          <p className="text-xs text-dark-muted mt-1">Full stack engineers & systems architects</p>
        </div>
        <div className="glass-panel rounded-2xl p-6 text-center border border-white/5 relative overflow-hidden">
          <p className="text-xs uppercase tracking-wider font-semibold text-dark-muted">Deployed Projects</p>
          <h3 className="text-4xl font-extrabold text-white mt-2">3,800+</h3>
          <p className="text-xs text-dark-muted mt-1">Real-world repositories & live demos</p>
        </div>
        <div className="glass-panel rounded-2xl p-6 text-center border border-white/5 relative overflow-hidden">
          <p className="text-xs uppercase tracking-wider font-semibold text-dark-muted">Connected Developers</p>
          <h3 className="text-4xl font-extrabold text-white mt-2">9,500+</h3>
          <p className="text-xs text-dark-muted mt-1">Colleague interactions established</p>
        </div>
      </section>

      {/* Featured Developers Section */}
      <section className="max-w-6xl mx-auto px-4 space-y-8">
        <div className="text-center md:text-left">
          <h2 className="text-2xl font-bold text-white tracking-tight">Featured Developers</h2>
          <p className="text-xs text-dark-muted mt-1.5">Top trending engineers on DevConnect this week</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-pulse">
            {[1, 2, 3, 4].map(n => (
              <div key={n} className="h-64 bg-dark-card rounded-2xl border border-dark-border" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {featuredDevs.map((dev) => (
              <div key={dev._id} className="glass-panel-interactive rounded-2xl p-5 flex flex-col justify-between border border-white/5">
                <div>
                  <div className="flex items-center space-x-3.5 mb-4">
                    {dev.profilePicture ? (
                      <img src={dev.profilePicture} alt={dev.name} className="h-10 w-10 rounded-full border border-dark-border object-cover" />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-brand-primary to-brand-accent text-white font-bold text-sm">
                        {dev.name[0]}
                      </div>
                    )}
                    <div className="overflow-hidden">
                      <h4 className="text-sm font-bold text-white truncate leading-snug">{dev.name}</h4>
                      <p className="text-[10px] text-brand-highlight">@{dev.username}</p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-300 line-clamp-3 min-h-[48px] leading-relaxed mb-4">
                    {dev.bio || 'MERN developer building solid applications.'}
                  </p>
                  
                  {dev.college && (
                    <div className="text-[10px] text-dark-muted mb-1 truncate">
                      🏢 {dev.college}
                    </div>
                  )}
                  {dev.location && (
                    <div className="text-[10px] text-dark-muted mb-4 truncate">
                      📍 {dev.location}
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-white/5 space-y-3">
                  <div className="flex flex-wrap gap-1">
                    {dev.skills && dev.skills.slice(0, 3).map((skill, idx) => (
                      <span key={idx} className="text-[9px] bg-white/5 border border-white/5 text-dark-muted px-1.5 py-0.5 rounded">
                        {skill}
                      </span>
                    ))}
                  </div>
                  <Link
                    to={`/u/${dev.username}`}
                    className="block text-center py-2 bg-brand-primary/10 hover:bg-brand-primary text-white text-[10px] font-bold rounded-lg transition-all"
                  >
                    View Profile
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Trending Projects Section */}
      <section className="max-w-6xl mx-auto px-4 space-y-8">
        <div className="text-center md:text-left">
          <h2 className="text-2xl font-bold text-white tracking-tight">Trending Projects</h2>
          <p className="text-xs text-dark-muted mt-1.5">Most active developer builds in the network</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1 */}
          <div className="glass-panel rounded-2xl p-5 border border-white/5 flex flex-col justify-between hover:border-brand-primary/30 transition-all duration-300">
            <div>
              <div className="w-full h-36 rounded-lg overflow-hidden mb-4 border border-dark-border">
                <img src="https://images.unsplash.com/photo-1472851294608-062f824d296e?auto=format&fit=crop&w=600&q=80" alt="ShopEase storefront" className="w-full h-full object-cover" />
              </div>
              <h3 className="text-base font-bold text-white tracking-tight">ShopEase</h3>
              <p className="text-xs text-dark-muted mt-2 leading-relaxed">
                A responsive e-commerce storefront featuring Stripe checkout, dynamic inventory search grids, and cart context hooks.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-white/5 flex items-center justify-between">
              <div className="flex flex-wrap gap-1">
                <span className="text-[9px] bg-white/5 text-dark-muted px-1.5 py-0.5 rounded">React</span>
                <span className="text-[9px] bg-white/5 text-dark-muted px-1.5 py-0.5 rounded">Stripe</span>
              </div>
              <div className="flex space-x-3 text-xs text-dark-muted">
                <span className="flex items-center"><FiHeart className="mr-1 text-red-500" /> 142</span>
                <span className="flex items-center"><FiEye className="mr-1" /> 580</span>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="glass-panel rounded-2xl p-5 border border-white/5 flex flex-col justify-between hover:border-brand-primary/30 transition-all duration-300">
            <div>
              <div className="w-full h-36 rounded-lg overflow-hidden mb-4 border border-dark-border">
                <img src="https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=600&q=80" alt="EventEase stage" className="w-full h-full object-cover" />
              </div>
              <h3 className="text-base font-bold text-white tracking-tight">EventEase</h3>
              <p className="text-xs text-dark-muted mt-2 leading-relaxed">
                A Dockerized event registry and scheduling system supporting ticket generation, automated email reminders queues, and Redis schedules.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-white/5 flex items-center justify-between">
              <div className="flex flex-wrap gap-1">
                <span className="text-[9px] bg-white/5 text-dark-muted px-1.5 py-0.5 rounded">Docker</span>
                <span className="text-[9px] bg-white/5 text-dark-muted px-1.5 py-0.5 rounded">Python</span>
              </div>
              <div className="flex space-x-3 text-xs text-dark-muted">
                <span className="flex items-center"><FiHeart className="mr-1 text-red-500" /> 98</span>
                <span className="flex items-center"><FiEye className="mr-1" /> 410</span>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="glass-panel rounded-2xl p-5 border border-white/5 flex flex-col justify-between hover:border-brand-primary/30 transition-all duration-300">
            <div>
              <div className="w-full h-36 rounded-lg overflow-hidden mb-4 border border-dark-border">
                <img src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80" alt="StudySphere nodes" className="w-full h-full object-cover" />
              </div>
              <h3 className="text-base font-bold text-white tracking-tight">StudySphere</h3>
              <p className="text-xs text-dark-muted mt-2 leading-relaxed">
                An AI-powered academic helper that scans slide PDFs and generates structured flashcards, quizzes, and semantic summaries.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-white/5 flex items-center justify-between">
              <div className="flex flex-wrap gap-1">
                <span className="text-[9px] bg-white/5 text-dark-muted px-1.5 py-0.5 rounded">LangChain</span>
                <span className="text-[9px] bg-white/5 text-dark-muted px-1.5 py-0.5 rounded">FastAPI</span>
              </div>
              <div className="flex space-x-3 text-xs text-dark-muted">
                <span className="flex items-center"><FiHeart className="mr-1 text-red-500" /> 210</span>
                <span className="flex items-center"><FiEye className="mr-1" /> 890</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Popular Skills Section */}
      <section className="max-w-4xl mx-auto px-4 text-center space-y-6">
        <h2 className="text-2xl font-bold text-white tracking-tight">Popular Tech Skills</h2>
        <p className="text-xs text-dark-muted max-w-md mx-auto">
          Click on any technology tag below to instantly query and filter active developers in the network
        </p>

        <div className="flex flex-wrap justify-center gap-2 max-w-2xl mx-auto pt-2">
          {POPULAR_SKILLS.map((skill) => (
            <button
              key={skill}
              onClick={() => handleSkillClick(skill)}
              className="text-xs px-3.5 py-2 rounded-full border border-dark-border bg-dark-card text-slate-300 hover:text-white hover:border-brand-primary hover:bg-brand-primary/5 transition-all duration-200"
            >
              {skill}
            </button>
          ))}
        </div>
      </section>

    </div>
  );
};

export default Home;
