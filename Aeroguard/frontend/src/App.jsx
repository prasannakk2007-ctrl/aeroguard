import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import CloudBg from './components/CloudBg';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingIntro from './components/LandingIntro';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Incidents from './pages/Incidents';
import Accidents from './pages/Accidents';
import News from './pages/News';
import Help from './pages/Help';
import Features from './pages/Features';
import Profile from './pages/Profile';

export default function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('aeroguard_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    if (user) {
      localStorage.setItem('aeroguard_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('aeroguard_user');
    }
  }, [user]);

  useEffect(() => {
    if (audioRef.current) {
      if (isAudioPlaying) {
        audioRef.current.play().catch(() => setIsAudioPlaying(false));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isAudioPlaying]);

  return (
    <BrowserRouter>
      {/* Background Audio Player */}
      <audio
        ref={audioRef}
        loop
        src="https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=ambient-sky-112187.mp3"
      />

      {/* Grand Cloud Curtain Reveal Intro Landing Page */}
      {showIntro ? (
        <LandingIntro onEnter={() => setShowIntro(false)} />
      ) : (
        <div className="relative min-h-screen flex flex-col justify-between overflow-x-hidden">
          <CloudBg />

          <div className="relative z-10 flex flex-col min-h-screen justify-between">
            <Navbar 
              user={user} 
              setUser={setUser} 
              isAudioPlaying={isAudioPlaying}
              setIsAudioPlaying={setIsAudioPlaying}
            />

            <main className="flex-grow max-w-7xl w-full mx-auto px-4 lg:px-8 py-6">
              <Routes>
                <Route path="/login" element={<Login setUser={setUser} />} />
                <Route path="/" element={<Dashboard user={user} />} />
                <Route path="/incidents" element={<Incidents user={user} />} />
                <Route path="/accidents" element={<Accidents user={user} />} />
                <Route path="/news" element={<News />} />
                <Route path="/features" element={<Features />} />
                <Route path="/help" element={<Help user={user} />} />
                <Route path="/profile" element={user ? <Profile user={user} setUser={setUser} /> : <Navigate to="/login" replace />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>

            <Footer />
          </div>
        </div>
      )}
    </BrowserRouter>
  );
}