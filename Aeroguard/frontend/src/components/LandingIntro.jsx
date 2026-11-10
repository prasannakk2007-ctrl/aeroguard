import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { CloudRain, Plane, ArrowRight, ShieldCheck, Activity, Radio, Volume2, VolumeX, Newspaper, HelpCircle, AlertTriangle, Sparkles } from 'lucide-react';

export default function LandingIntro({ onEnter }) {
  const navigate = useNavigate();
  const [stage, setStage] = useState(0); // 0: Doors Closed, 1: Doors Opening & Plane Flying, 2: Full Moving Sky Hub
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  // Toggle Theme Music
  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play().catch(() => {});
        setIsPlaying(true);
      }
    }
  };

  // Trigger Stage 1 -> Stage 2 Door Open & Airplane Fly-by
  const handleLaunchSystem = () => {
    setStage(1);
    if (audioRef.current) {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
    setTimeout(() => {
      setStage(2);
    }, 2200);
  };

  const handleEnterLogin = () => {
    if (onEnter) onEnter();
    navigate('/login');
  };

  const handleNav = (path) => {
    if (onEnter) onEnter();
    navigate(path);
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden font-['Plus_Jakarta_Sans',sans-serif] bg-gradient-to-b from-sky-400 via-sky-300 to-sky-100 text-sky-950 transition-all duration-700">
      
      {/* Background Audio Player */}
      <audio
        ref={audioRef}
        loop
        src="https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=ambient-sky-112187.mp3"
      />

      {/* MOVING WEATHER BACKGROUND (Active in Stage 2) */}
      <div className={`fixed inset-0 pointer-events-none transition-opacity duration-1000 z-0 ${stage === 2 ? 'opacity-100' : 'opacity-40'}`}>
        
        {/* Continuous Drifting Clouds Layer 1 */}
        <div className="absolute top-10 left-0 w-full opacity-60 animate-cloud-drift-slow flex gap-24">
          <svg className="w-72 h-32 fill-white/80 drop-shadow-md" viewBox="0 0 100 40">
            <path d="M10,35 Q25,10 50,20 Q65,5 80,20 Q95,25 90,35 Z" />
          </svg>
          <svg className="w-96 h-40 fill-white/70 drop-shadow-md" viewBox="0 0 100 40">
            <path d="M20,30 Q40,10 60,20 Q75,5 90,20 Q95,25 90,35 Z" />
          </svg>
        </div>

        {/* Continuous Drifting Clouds Layer 2 */}
        <div className="absolute top-48 -left-48 w-full opacity-50 animate-cloud-drift-fast flex gap-32">
          <svg className="w-80 h-36 fill-sky-100/90 drop-shadow-sm" viewBox="0 0 100 40">
            <path d="M15,32 Q35,12 55,22 Q70,8 85,25 Z" />
          </svg>
          <svg className="w-[450px] h-48 fill-white/80 drop-shadow-sm" viewBox="0 0 100 40">
            <path d="M10,35 Q30,8 55,20 Q75,5 95,22 Z" />
          </svg>
        </div>

        {/* Moving Aeroplane Gliding in Background Sky */}
        <div className="absolute top-28 right-10 opacity-30 animate-plane-glide">
          <Plane className="w-24 h-24 text-sky-700 fill-sky-500 drop-shadow-xl" />
        </div>

      </div>

      {/* CLOUD DOOR LEFT PANEL */}
      <div
        className={`fixed top-0 bottom-0 left-0 w-1/2 bg-gradient-to-r from-sky-500 via-sky-400 to-sky-200 shadow-2xl z-40 transition-transform duration-[1800ms] cubic-bezier(0.77, 0, 0.175, 1) flex items-center justify-end pr-8 ${
          stage >= 1 ? '-translate-x-full' : 'translate-x-0'
        }`}
      >
        <svg className="w-72 h-36 fill-white drop-shadow-2xl" viewBox="0 0 100 40">
          <path d="M10,35 Q25,10 50,20 Q65,5 80,20 Q95,25 90,35 Z" />
        </svg>
      </div>

      {/* CLOUD DOOR RIGHT PANEL */}
      <div
        className={`fixed top-0 bottom-0 right-0 w-1/2 bg-gradient-to-l from-sky-500 via-sky-400 to-sky-200 shadow-2xl z-40 transition-transform duration-[1800ms] cubic-bezier(0.77, 0, 0.175, 1) flex items-center justify-start pl-8 ${
          stage >= 1 ? 'translate-x-full' : 'translate-x-0'
        }`}
      >
        <svg className="w-72 h-36 fill-white drop-shadow-2xl" viewBox="0 0 100 40">
          <path d="M10,35 Q25,10 50,20 Q65,5 80,20 Q95,25 90,35 Z" />
        </svg>
      </div>

      {/* FLYING AEROPLANE ANIMATION (Directly comes and goes mela) */}
      <div
        className={`fixed z-30 transition-all duration-[2000ms] ease-out pointer-events-none flex flex-col items-center left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 ${
          stage === 0
            ? 'scale-50 opacity-0'
            : stage === 1
            ? 'scale-150 opacity-100 -translate-y-64 rotate-[-12deg]'
            : 'scale-90 opacity-0 -translate-y-[100vh]'
        }`}
      >
        <Plane className="w-32 h-32 text-sky-600 fill-sky-300 drop-shadow-2xl animate-pulse" />
        <div className="w-3 h-40 bg-gradient-to-b from-white/90 to-transparent mx-auto blur-sm rounded-full -mt-3" />
      </div>

      {/* ================= STAGE 0 & 1: DOOR INITIAL GATE ================= */}
      {stage < 2 && (
        <div className="relative z-50 min-h-screen flex flex-col items-center justify-center p-6 text-center space-y-6">
          <div className="w-20 h-20 rounded-3xl bg-white/90 backdrop-blur-md mx-auto flex items-center justify-center text-sky-600 shadow-2xl ring-4 ring-white/50">
            <CloudRain className="w-10 h-10 animate-bounce" />
          </div>

          <div className="space-y-2">
            <h1 className="text-4xl lg:text-6xl font-black text-sky-950 tracking-tight drop-shadow-sm">
              AeroGuard <span className="text-sky-600">ML</span>
            </h1>
            <p className="text-xs lg:text-sm font-bold text-sky-800 max-w-md mx-auto">
              Real-Time Flight Safety & Weather Sensor Anomaly Detection System
            </p>
          </div>

          <button
            onClick={handleLaunchSystem}
            className="group px-8 py-4 rounded-3xl bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white font-black text-sm shadow-xl shadow-sky-400/60 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-3 border-2 border-white"
          >
            <Radio className="w-5 h-5 text-white animate-ping" />
            <span>OPEN WEATHER CASE PORTAL</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      )}

      {/* ================= STAGE 2: MOVING WEATHER CONTROL HUB ================= */}
      {stage === 2 && (
        <div className="relative z-20 min-h-screen flex flex-col justify-between p-4 lg:p-8 max-w-6xl mx-auto space-y-8 animate-fadeIn">
          
          {/* Top Header with Theme Music Controller */}
          <header className="flex flex-col sm:flex-row items-center justify-between gap-4 glass-sky-card p-4 rounded-3xl border border-white/80 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-sky-500 flex items-center justify-center text-white shadow-md shadow-sky-300">
                <CloudRain className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-black text-sky-950">AEROGUARD ML</h2>
                <span className="text-[10px] font-extrabold text-sky-600 tracking-wider uppercase">DIGITAL WEATHER RADAR HUB</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Play / Pause Theme Music Button */}
              <button
                onClick={toggleAudio}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 border border-sky-300 text-sky-800 text-xs font-extrabold shadow-md hover:bg-sky-50 transition-all"
              >
                {isPlaying ? (
                  <>
                    <div className="flex items-end gap-0.5 h-3.5">
                      <span className="w-1 bg-sky-500 rounded-full bar1"></span>
                      <span className="w-1 bg-sky-500 rounded-full bar2"></span>
                      <span className="w-1 bg-sky-500 rounded-full bar3"></span>
                    </div>
                    <Volume2 className="w-4 h-4 text-sky-600" />
                    <span>Pause Theme Music</span>
                  </>
                ) : (
                  <>
                    <VolumeX className="w-4 h-4 text-sky-400" />
                    <span>Play Theme Music</span>
                  </>
                )}
              </button>

              <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-black">
                ● WEATHER STREAM ACTIVE
              </span>
            </div>
          </header>

          {/* Floating Sky Module Grid Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            
            <button
              onClick={() => handleNav('/incidents')}
              className="glass-sky-card p-5 rounded-3xl hover:bg-white/90 hover:scale-105 transition-all text-center space-y-2 group shadow-md"
            >
              <AlertTriangle className="w-7 h-7 text-amber-500 mx-auto group-hover:scale-110 transition-transform" />
              <span className="block text-xs font-black text-sky-950">INCIDENTS</span>
            </button>

            <button
              onClick={() => handleNav('/accidents')}
              className="glass-sky-card p-5 rounded-3xl hover:bg-white/90 hover:scale-105 transition-all text-center space-y-2 group shadow-md"
            >
              <Activity className="w-7 h-7 text-red-500 mx-auto group-hover:scale-110 transition-transform" />
              <span className="block text-xs font-black text-sky-950">ACCIDENTS</span>
            </button>

            <button
              onClick={() => handleNav('/news')}
              className="glass-sky-card p-5 rounded-3xl hover:bg-white/90 hover:scale-105 transition-all text-center space-y-2 group shadow-md"
            >
              <Newspaper className="w-7 h-7 text-sky-500 mx-auto group-hover:scale-110 transition-transform" />
              <span className="block text-xs font-black text-sky-950">NEWS FEED</span>
            </button>

            <button
              onClick={() => handleNav('/features')}
              className="glass-sky-card p-5 rounded-3xl hover:bg-white/90 hover:scale-105 transition-all text-center space-y-2 group shadow-md"
            >
              <ShieldCheck className="w-7 h-7 text-emerald-500 mx-auto group-hover:scale-110 transition-transform" />
              <span className="block text-xs font-black text-sky-950">FEATURES</span>
            </button>

            <button
              onClick={() => handleNav('/help')}
              className="glass-sky-card p-5 rounded-3xl hover:bg-white/90 hover:scale-105 transition-all text-center space-y-2 group shadow-md col-span-2 sm:col-span-1"
            >
              <HelpCircle className="w-7 h-7 text-indigo-500 mx-auto group-hover:scale-110 transition-transform" />
              <span className="block text-xs font-black text-sky-950">HELP CENTER</span>
            </button>

          </div>

          {/* System Briefing Card Box */}
          <div className="glass-sky-card p-6 rounded-3xl space-y-3 shadow-xl">
            <div className="flex items-center justify-between border-b border-sky-200/80 pb-2">
              <span className="text-[11px] font-extrabold text-sky-600 uppercase tracking-wider">
                SYSTEM BRIEFING // CASE DOSSIER AG-2026
              </span>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                CONFIDENTIAL INTEL
              </span>
            </div>

            <h3 className="text-base font-black text-sky-950">AEROGUARD ML: SYSTEM BRIEFING</h3>
            <p className="text-xs text-sky-800 leading-relaxed font-semibold">
              "Investigate. Detect. Predict. Safeguard." <br />
              AeroGuard ML is an intelligent, real-time flight safety and weather sensor anomaly detection system. It continuously ingests streaming weather telemetry (temperature, wind speed, visibility, and pressure) and evaluates atmospheric risk profiles using an unsupervised Isolation Forest machine learning model.
            </p>
          </div>

          {/* Bottom Ready Box & Login Portal Entry */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-sky-500 via-sky-600 to-sky-500 text-white flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left shadow-2xl border-2 border-white/60">
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold text-sky-100 uppercase tracking-widest">
                SYSTEM ACCESS REQUIRED
              </span>
              <h4 className="text-base font-black text-white">
                READY TO COMMENCE FLIGHT SAFETY MONITORING?
              </h4>
              <p className="text-xs text-sky-100 font-bold">
                Sign in with your admin or user credentials to access live telemetry dashboards & reports.
              </p>
            </div>

            <button
              onClick={handleEnterLogin}
              className="px-6 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-sky-950 font-black text-xs tracking-wider shadow-lg shadow-amber-500/30 hover:scale-105 transition-all shrink-0 flex items-center gap-2"
            >
              <span>SIGN IN TO PORTAL</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Clean 4-Admin Footer */}
          <footer className="text-center text-[11px] font-extrabold text-sky-800 pt-4 border-t border-sky-200">
            Created and Managed by Prasanna K, Keerthi V, Karnika N, and Poonkodi E
          </footer>

        </div>
      )}

    </div>
  );
}