import React, { useEffect, useState } from 'react';
import axios from 'axios';
import LiveGraph from '../components/LiveGraph';
import { Sun, Wind, Eye, Gauge, ShieldAlert, ShieldCheck, Activity, Plane } from 'lucide-react';

export default function Dashboard() {
  const [telemetry, setTelemetry] = useState(null);
  const [history, setHistory] = useState([]);

  const fetchTelemetry = async () => {
    try {
      const [resCurrent, resHist] = await Promise.all([
        axios.get('/api/telemetry'),
        axios.get('/api/telemetry/history')
      ]);
      setTelemetry(resCurrent.data);
      setHistory(resHist.data || []);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchTelemetry();
    const timer = setInterval(fetchTelemetry, 3000);
    return () => clearInterval(timer);
  }, []);

  const last = telemetry || {
    temperature: 28.4,
    wind_speed: 14.2,
    visibility: 8.7,
    pressure: 1012.6,
    risk_score: 12,
    anomaly: false
  };

  return (
    <div className="space-y-6">
      
      {/* Hero Welcome Banner */}
      <section className="glass-sky-card rounded-3xl p-6 lg:p-8 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-100 text-sky-700 text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            REAL-TIME FLIGHT SAFETY STREAMING
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-sky-950">
            Flight Operations <span className="text-sky-500">Dashboard</span>
          </h1>
          <p className="text-xs lg:text-sm text-sky-700 leading-relaxed font-medium">
            Continuous multi-sensor telemetry screening powered by an unsupervised Isolation Forest machine learning model.
          </p>
        </div>
        
        <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-sky-400 to-sky-300 flex items-center justify-center text-white shadow-xl shadow-sky-300/60 shrink-0">
          <Plane className="w-12 h-12 animate-plane-glide" />
        </div>
      </section>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <MetricCard
          title="Temperature"
          value={`${Number(last.temperature).toFixed(1)} °C`}
          icon={<Sun className="w-5 h-5 text-amber-500" />}
          history={history.map(h => h.temperature)}
        />
        
        <MetricCard
          title="Wind Speed"
          value={`${Number(last.wind_speed).toFixed(1)} m/s`}
          icon={<Wind className="w-5 h-5 text-sky-500" />}
          history={history.map(h => h.wind_speed)}
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
              <h3 className="text-base font-extrabold text-sky-900">Live Weather Telemetry</h3>
              <p className="text-xs font-semibold text-sky-500">Multi-sensor streaming telemetry log</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-extrabold animate-pulse">
              ● LIVE STREAMING
            </span>
          </div>

          <LiveGraph data={history.map(h => h.risk_score)} color="#0ea5e9" height={220} />
          
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

            {/* Risk Gauge Circle */}
            <div className="text-center py-4 space-y-2">
              <div className={`w-28 h-28 rounded-full border-4 mx-auto flex flex-col items-center justify-center transition-all ${
                last.anomaly
                  ? 'border-red-500 bg-red-50 text-red-600'
                  : 'border-emerald-400 bg-emerald-50 text-emerald-600'
              }`}>
                <span className="text-2xl font-black">{last.risk_score}%</span>
                <span className="text-[10px] font-bold uppercase tracking-wider">Risk Level</span>
              </div>

              <div className="mt-3">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold ${
                  last.anomaly ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'
                }`}>
                  {last.anomaly ? <ShieldAlert className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
                  {last.anomaly ? 'ANOMALY DETECTED' : 'NORMAL ATMOSPHERIC CONDITIONS'}
                </span>
              </div>
            </div>
          </div>

          {/* Raw JSON Packet View */}
          <div className="bg-sky-950 text-sky-200 p-3.5 rounded-2xl text-[11px] font-mono space-y-1">
            <div className="text-[9px] text-sky-400 font-bold uppercase tracking-wider mb-1">Incoming Telemetry Packet</div>
            <div>temp: {last.temperature}°C</div>
            <div>wind: {last.wind_speed}m/s</div>
            <div>vis: {last.visibility}km</div>
            <div>press: {last.pressure}hPa</div>
          </div>
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