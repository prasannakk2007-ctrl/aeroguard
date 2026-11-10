import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { CloudRain, ShieldCheck, User, LogOut, Volume2, VolumeX, ShieldAlert } from 'lucide-react';

export default function Navbar({ user, setUser, isAudioPlaying, setIsAudioPlaying }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('aeroguard_user');
    navigate('/login');
  };

  const navLinks = [
    { name: 'Dashboard', path: '/' },
    { name: 'Incidents', path: '/incidents' },
    { name: 'Accidents', path: '/accidents' },
    { name: 'News', path: '/news' },
    { name: 'Features', path: '/features' },
    { name: 'Help', path: '/help' },
    { name: 'Profile', path: '/profile' },
  ];

  return (
    <header className="sticky top-0 z-40 glass-sky-card border-b border-sky-200/80 px-4 lg:px-8 py-3 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-500 to-sky-400 flex items-center justify-center text-white shadow-md shadow-sky-300/50 group-hover:scale-105 transition-transform">
            <CloudRain className="w-6 h-6 animate-pulse-subtle" />
          </div>
          <div>
            <span className="text-xl font-extrabold bg-gradient-to-r from-sky-700 via-sky-600 to-sky-800 bg-clip-text text-transparent">
              AeroGuard <span className="text-sky-500 font-bold">ML</span>
            </span>
            <span className="block text-[10px] font-semibold text-sky-500 tracking-wider uppercase">
              Weather Anomaly System
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-sky-100/60 p-1.5 rounded-full border border-sky-200/60">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-white text-sky-600 shadow-sm shadow-sky-200/60'
                    : 'text-sky-700 hover:text-sky-900 hover:bg-white/50'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Right Section: Audio Waveform Toggle & User Status */}
        <div className="flex items-center gap-3">
          
          {/* Audio Waveform Toggle Button */}
          <button
            onClick={() => setIsAudioPlaying(!isAudioPlaying)}
            title={isAudioPlaying ? "Mute Sky Theme Music" : "Play Sky Theme Music"}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 border border-sky-200 text-sky-700 hover:bg-sky-100/60 transition-all text-xs font-semibold shadow-sm"
          >
            {isAudioPlaying ? (
              <>
                <div className="flex items-end gap-0.5 h-4">
                  <span className="w-1 bg-sky-500 rounded-full bar1"></span>
                  <span className="w-1 bg-sky-500 rounded-full bar2"></span>
                  <span className="w-1 bg-sky-500 rounded-full bar3"></span>
                  <span className="w-1 bg-sky-500 rounded-full bar4"></span>
                </div>
                <Volume2 className="w-4 h-4 text-sky-600" />
              </>
            ) : (
              <>
                <VolumeX className="w-4 h-4 text-sky-400" />
                <span className="hidden sm:inline">Theme Audio</span>
              </>
            )}
          </button>

          {/* User Auth Status */}
          {user ? (
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-xs font-bold text-sky-900">{user.name}</span>
                <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                  user.role === 'admin' 
                    ? 'bg-amber-100 text-amber-800 border border-amber-300' 
                    : 'bg-sky-100 text-sky-700'
                }`}>
                  {user.role === 'admin' ? '⚡ Admin' : 'User'}
                </span>
              </div>
              
              <button
                onClick={handleLogout}
                title="Logout"
                className="p-2 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 transition-colors border border-red-200"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="px-4 py-2 rounded-full bg-gradient-to-r from-sky-500 to-sky-600 text-white font-semibold text-xs shadow-md shadow-sky-300/50 hover:from-sky-600 hover:to-sky-700 transition-all flex items-center gap-1.5"
            >
              <User className="w-3.5 h-3.5" />
              Sign In
            </Link>
          )}

        </div>

      </div>
    </header>
  );
}