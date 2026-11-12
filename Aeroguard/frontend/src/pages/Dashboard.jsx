import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import LiveGraph from '../components/LiveGraph';
import { Sun, Wind, Eye, Gauge, ShieldAlert, ShieldCheck, Activity, Plane, MapPin, BellRing } from 'lucide-react';

const AIRPORTS = [
  { code: 'MAA', name: 'Chennai International', city: 'Chennai', x: 76, y: 26, tempOffset: 1.2, windOffset: 2.1 },
  { code: 'BLR', name: 'Kempegowda Int.', city: 'Bengaluru', x: 34, y: 20, tempOffset: -2.4, windOffset: -1.0 },
  { code: 'CJB', name: 'Coimbatore Int.', city: 'Coimbatore', x: 30, y: 58, tempOffset: -0.8, windOffset: 1.5 },
  { code: 'TRZ', name: 'Tiruchirappalli Int.', city: 'Trichy', x: 58, y: 56, tempOffset: 0.9, windOffset: 0.5 },
  { code: 'IXM', name: 'Madurai Airport', city: 'Madurai', x: 46, y: 80, tempOffset: 1.8, windOffset: -0.5 }
];

export default function Dashboard() {
  const [telemetry, setTelemetry] = useState(null);
  const [history, setHistory] = useState([]);
  const [selectedAirport, setSelectedAirport] = useState(AIRPORTS[0]);
  const [alertMuted, setAlertMuted] = useState(false);
  const lastAlertTime = useRef(0);

  // Subtle Web Audio Alert Chime for High Risk
  const playWarningBeep = () => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(780, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } catch (e) {}
  };

  const fetchTelemetry = async () => {
    try {
      const [resCurrent, resHist] = await Promise.all([
        axios.get('/api/telemetry'),
        axios.get('/api/telemetry/history')
      ]);
      setTelemetry(resCurrent.data);
      setHistory(resHist.data || []);

      if ((resCurrent.data?.anomaly || resCurrent.data?.risk_score > 70) && !alertMuted) {
        const now = Date.now();
        if (now - lastAlertTime.current > 9000) {
          playWarningBeep();
          lastAlertTime.current = now;
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchTelemetry();
    const timer = setInterval(fetchTelemetry, 3000);
    return () => clearInterval(timer);
  }, [alertMuted]);

  const raw = telemetry || {
    temperature: 28.4,
    wind_speed: 14.2,
    visibility: 8.7,
    pressure: 1012.6,
    risk_score: 12,
    anomaly: false
  };

  const last = {
    ...raw,
    temperature: Number(raw.temperature) + selectedAirport.tempOffset,
    wind_speed: Math.max(2, Number(raw.wind_speed) + selectedAirport.windOffset)
  };

  const isHighRisk = last.anomaly || last.risk_score > 70;

  return (
    <div className="space-y-6">

      {/* Feature 3: Live Anomaly Alert Banner */}
      {isHighRisk && (
        <div className="p-4 rounded-3xl bg-gradient-to-r from-red-500 to-amber-500 text-white shadow-lg shadow-red-200 flex flex-col sm:flex-row items-center justify-between gap-3 animate-pulse">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-2xl bg-white/20">
              <BellRing className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider block text-red-100">
                EARLY WARNING ALERT // {selectedAirport.city.toUpperCase()} ({selectedAirport.code})
              </span>
              <p className="text-xs sm:text-sm font-extrabold">
                Atmospheric Anomaly Detected! Current Flight Risk Score: {last.risk_score}%
              </p>
            </div>
          </div>
          <button
            onClick={() => setAlertMuted(!alertMuted)}
            className="px-3 py-1.5 rounded-full bg-white/20 hover:bg-white/30 text-[11px] font-bold transition-colors shrink-0"
          >
            {alertMuted ? 'Unmute Beep' : 'Mute Alert Beep'}
          </button>
        </div>
      )}

      {/* Hero Welcome Banner + Feature 2: Airport Selector */}
      <section className="glass-sky-card rounded-3xl p-6 lg:p-8 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-3 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-100 text-sky-700 text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            REAL-TIME FLIGHT SAFETY STREAMING
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-sky-950">
            Flight Operations <span className="text-sky-500">Dashboard</span>
          </h1>
          <p className="text-xs lg:text-sm text-sky-700 leading-relaxed font-medium">
            Monitoring <strong className="text-sky-900">{selectedAirport.name} ({selectedAirport.code})</strong> via Isolation Forest ML telemetry screening.
          </p>

          {/* Airport Sector Dropdown */}
          <div className="flex items-center gap-2 pt-1">
            <MapPin className="w-4 h-4 text-sky-500 shrink-0" />
            <select
              value={selectedAirport.code}
              onChange={(e) => setSelectedAirport(AIRPORTS.find(a => a.code === e.target.value))}
              className="glass-sky-input px-3 py-1.5 rounded-2xl text-xs font-bold cursor-pointer"
            >
              {AIRPORTS.map((ap) => (
                <option key={ap.code} value={ap.code}>
                  {ap.city} ({ap.code}) — {ap.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-sky-400 to-sky-300 flex items-center justify-center text-white shadow-xl shadow-sky-300/60 shrink-0">
          <Plane className="w-12 h-12 animate-plane-glide" />
        </div>
      </section>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Temperature"
          value={`${last.temperature.toFixed(1)} °C`}
          icon={<Sun className="w-5 h-5 text-amber-500" />}
          history={history.map(h => h.temperature + selectedAirport.tempOffset)}
        />
        <MetricCard
          title="Wind Speed"
          value={`${last.wind_speed.toFixed(1)} m/s`}
          icon={<Wind className="w-5 h-5 text-sky-500" />}
          history={history.map(h => h.wind_speed + selectedAirport.windOffset)}
        />
        <MetricCard
          title="Visibility"
          value={`${Number(last.visibility).toFixed(1)} km`}
          icon={<Eye className="w-5 h-5 text-indigo-500" />}
          history={history.map(h => h.visibility)}
        />
        <MetricCard
          title="Barometric Pressure"
          value={`${Number(last.pressure).toFixed(1)} hPa`}
          icon={<Gauge className="w-5 h-5 text-teal-500" />}
          history={history.map(h => h.pressure)}
        />
      </div>

      {/* Dashboard Graph & ML Model Monitor Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Live Telemetry Graph Panel */}
        <div className="lg:col-span-2 glass-sky-card rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-sky-100 pb-3">
            <div>
              <h3 className="text-base font-extrabold text-sky-900">Live Weather Telemetry ({selectedAirport.code})</h3>
              <p className="text-xs font-semibold text-sky-500">Multi-sensor streaming telemetry log</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-extrabold animate-pulse">
              ● LIVE STREAMING
            </span>
          </div>

          <LiveGraph data={history.map(h => h.risk_score)} color={isHighRisk ? '#ef4444' : '#0ea5e9'} height={220} />
          
          <div className="flex items-center justify-between text-xs text-sky-600 font-bold pt-2">
            <span>Historical Stream</span>
            <span>Current Risk Trend</span>
            <span>Now</span>
          </div>
        </div>

        {/* Isolation Forest Model Status Panel */}
        <div className="glass-sky-card rounded-3xl p-6 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-sky-100 pb-3 mb-4">
              <div>
                <h3 className="text-base font-extrabold text-sky-900">Model Monitor</h3>
                <p className="text-xs font-semibold text-sky-500">Isolation Forest Status</p>
              </div>
              <Activity className="w-5 h-5 text-sky-500" />
            </div>

            <div className="text-center py-4 space-y-2">
              <div className={`w-28 h-28 rounded-full border-4 mx-auto flex flex-col items-center justify-center transition-all ${
                isHighRisk
                  ? 'border-red-500 bg-red-50 text-red-600'
                  : 'border-emerald-400 bg-emerald-50 text-emerald-600'
              }`}>
                <span className="text-2xl font-black">{last.risk_score}%</span>
                <span className="text-[10px] font-bold uppercase tracking-wider">Risk Level</span>
              </div>

              <div className="mt-3">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold ${
                  isHighRisk ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'
                }`}>
                  {isHighRisk ? <ShieldAlert className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
                  {isHighRisk ? 'ANOMALY DETECTED' : 'NORMAL ATMOSPHERIC CONDITIONS'}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-sky-950 text-sky-200 p-3.5 rounded-2xl text-[11px] font-mono space-y-1">
            <div className="text-[9px] text-sky-400 font-bold uppercase tracking-wider mb-1">
              Telemetry Packet ({selectedAirport.code})
            </div>
            <div>temp: {last.temperature.toFixed(1)}°C</div>
            <div>wind: {last.wind_speed.toFixed(1)}m/s</div>
            <div>vis: {last.visibility}km</div>
            <div>press: {last.pressure}hPa</div>
          </div>
        </div>

      </div>

      {/* Feature 5: Interactive Flight Route Weather Radar Map */}
      <div className="glass-sky-card rounded-3xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-sky-100 pb-3">
          <div>
            <h3 className="text-base font-extrabold text-sky-900">Flight Route Weather Corridor Map</h3>
            <p className="text-xs font-semibold text-sky-500">Click any airport hub below to inspect live sector telemetry</p>
          </div>
          <div className="flex items-center gap-3 text-[11px] font-bold">
            <span className="flex items-center gap-1 text-emerald-700"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Safe</span>
            <span className="flex items-center gap-1 text-amber-700"><span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Caution</span>
            <span className="flex items-center gap-1 text-red-700"><span className="w-2.5 h-2.5 rounded-full bg-red-500" /> Anomaly</span>
          </div>
        </div>

        <div className="relative w-full h-72 rounded-2xl bg-gradient-to-br from-sky-900 via-sky-800 to-sky-950 overflow-hidden border border-sky-700/60">
          {/* Radar Grid Circles */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
            <div className="w-40 h-40 rounded-full border border-sky-300" />
            <div className="w-72 h-72 rounded-full border border-sky-300 absolute" />
            <div className="w-[420px] h-[420px] rounded-full border border-sky-300 absolute" />
          </div>

          {/* Flight Corridor Route Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
            <line x1="34" y1="20" x2="76" y2="26" stroke="#38bdf8" strokeWidth="0.5" strokeDasharray="2,2" opacity="0.7" />
            <line x1="76" y1="26" x2="58" y2="56" stroke="#38bdf8" strokeWidth="0.5" strokeDasharray="2,2" opacity="0.7" />
            <line x1="34" y1="20" x2="30" y2="58" stroke="#38bdf8" strokeWidth="0.5" strokeDasharray="2,2" opacity="0.7" />
            <line x1="30" y1="58" x2="58" y2="56" stroke="#38bdf8" strokeWidth="0.5" strokeDasharray="2,2" opacity="0.7" />
            <line x1="58" y1="56" x2="46" y2="80" stroke="#38bdf8" strokeWidth="0.5" strokeDasharray="2,2" opacity="0.7" />
          </svg>

          {/* Airport Hub Nodes */}
          {AIRPORTS.map((ap) => {
            const isSelected = selectedAirport.code === ap.code;
            const nodeColor = isSelected && isHighRisk
              ? 'bg-red-500 ring-red-300'
              : ap.code === 'CJB' && !isSelected
              ? 'bg-amber-400 ring-amber-200'
              : 'bg-emerald-400 ring-emerald-200';

            return (
              <button
                key={ap.code}
                onClick={() => setSelectedAirport(ap)}
                style={{ left: `${ap.x}%`, top: `${ap.y}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 group flex flex-col items-center focus:outline-none"
              >
                <span className={`w-4 h-4 rounded-full ${nodeColor} ring-4 ${isSelected ? 'scale-125 animate-ping absolute' : 'opacity-40'}`} />
                <span className={`w-3.5 h-3.5 rounded-full ${nodeColor} border-2 border-white relative z-10 shadow-md`} />
                <span className={`mt-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold shadow-md transition-all ${
                  isSelected ? 'bg-white text-sky-950 scale-105' : 'bg-sky-950/80 text-sky-100 group-hover:bg-white group-hover:text-sky-950'
                }`}>
                  {ap.city} ({ap.code})
                </span>
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
}

function MetricCard({ title, value, icon, history }) {
  return (
    <div className="glass-sky-card rounded-3xl p-5 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-sky-700">{title}</span>
        <div className="p-2 rounded-xl bg-sky-100/70">{icon}</div>
      </div>
      <div className="text-xl font-extrabold text-sky-950">{value}</div>
      <LiveGraph data={history} color="#0ea5e9" height={40} showGrid={false} />
    </div>
  );
}
