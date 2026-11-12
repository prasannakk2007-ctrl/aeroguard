import React, { useState } from 'react';
import { Newspaper, Bell, X, Calendar, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function News() {
  const [selectedNews, setSelectedNews] = useState(null);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const newsList = [
    {
      id: 1,
      tag: 'Weather',
      title: 'Severe Thunderstorms Disrupt European Flight Corridors',
      date: 'Oct 29, 2026',
      desc: 'Sudden cold front convergence creates high-altitude thermal inversion and wind shear warnings.',
      fullBrief: [
        'A fast-moving atmospheric trough across Central and Western Europe triggered severe convective thunderstorms and sudden microbursts along major commercial flight corridors.',
        'Air traffic control centers reported rapid barometric pressure drops exceeding 18 hPa within 45 minutes alongside crosswind gusts above 45 knots, forcing over 140 flight diversions.',
        'Multi-sensor anomaly detection models like AeroGuard ML help dispatchers spot these coupled temperature-wind-pressure shifts 12–15 minutes earlier than static single-variable threshold alarms.'
      ]
    },
    {
      id: 2,
      tag: 'Aviation Tech',
      title: 'AeroGuard ML Isolation Forest Model Deployed in Smart Airports',
      date: 'Oct 28, 2026',
      desc: 'Real-time multi-sensor telemetry streaming lowers hazard response times by 40%.',
      fullBrief: [
        'Modern smart airport weather stations generate continuous multi-variate telemetry streams covering ambient temperature, wind velocity, runway visibility, and barometric pressure.',
        'By applying an unsupervised Isolation Forest machine learning pipeline, AeroGuard ML isolates abnormal multi-dimensional weather signatures without requiring pre-labeled storm datasets.',
        'Field validation shows a 40% reduction in pilot warning latency while filtering out harmless seasonal baseline noise that causes alert fatigue.'
      ]
    },
    {
      id: 3,
      tag: 'Safety',
      title: 'Global Aviation Safety Report Highlights Record Low Risks',
      date: 'Oct 25, 2026',
      desc: 'Predictive weather anomaly detection systems boost pilot situational awareness across Asian airspace.',
      fullBrief: [
        'According to the 2026 Global Aviation Weather Safety Review, weather-related approach and landing incidents dropped significantly across regional airports adopting automated telemetry analytics.',
        'Real-time risk scoring (0–100%) allows cockpit crews and ground dispatchers to evaluate combined visibility fog and wind shear threats before aircraft enter final approach.',
        'Continuous post-flight incident logging and centralized safety dashboards further strengthen coordination between regional weather stations and air traffic control.'
      ]
    }
  ];

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <div className="space-y-6">
      
      <div className="glass-sky-card p-6 rounded-3xl">
        <h1 className="text-2xl font-extrabold text-sky-950 flex items-center gap-2">
          <Newspaper className="w-6 h-6 text-sky-500" />
          Aviation & Weather News
        </h1>
        <p className="text-xs font-semibold text-sky-600 mt-1">
          Click any article below to read the complete weather & safety briefing.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {newsList.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedNews(item)}
              className="glass-sky-card p-6 rounded-3xl space-y-2 hover:shadow-xl hover:scale-[1.01] transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-sky-100 text-sky-700 text-[10px] font-extrabold uppercase">
                  {item.tag}
                </span>
                <span className="text-[10px] font-bold text-sky-400 flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> {item.date}
                </span>
              </div>
              <h3 className="text-base font-extrabold text-sky-950 group-hover:text-sky-600 transition-colors">
                {item.title}
              </h3>
              <p className="text-xs text-sky-700 font-medium">{item.desc}</p>
              <div className="pt-2 flex items-center gap-1 text-xs font-extrabold text-sky-600">
                <span>Read Full Brief</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar */}
        <div className="glass-sky-card p-6 rounded-3xl space-y-4 h-fit">
          <h3 className="text-sm font-extrabold text-sky-900 flex items-center gap-2">
            <Bell className="w-4 h-4 text-amber-500" />
            Stay Updated
          </h3>
          <p className="text-xs text-sky-700 font-medium">
            Subscribe to real-time email warning alerts when severe weather anomalies are detected.
          </p>
          {subscribed ? (
            <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-700 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              Subscribed to weather alerts!
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="space-y-3">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full glass-sky-input p-2.5 rounded-2xl text-xs font-medium"
              />
              <button
                type="submit"
                className="w-full py-2.5 rounded-2xl bg-sky-500 text-white font-bold text-xs shadow-md shadow-sky-300 hover:bg-sky-600 transition-all"
              >
                Subscribe Alerts
              </button>
            </form>
          )}
        </div>
      </div>

      {/* News Brief Explanation Modal */}
      {selectedNews && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-sky-950/40 backdrop-blur-sm">
          <div className="glass-sky-card w-full max-w-xl rounded-3xl p-6 lg:p-8 space-y-4 shadow-2xl relative">
            <button
              onClick={() => setSelectedNews(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-sky-100 text-sky-700 hover:bg-sky-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-sky-100 text-sky-700 text-[10px] font-extrabold uppercase">
                {selectedNews.tag}
              </span>
              <span className="text-xs font-bold text-sky-500">{selectedNews.date}</span>
            </div>

            <h2 className="text-xl font-extrabold text-sky-950 pr-6">{selectedNews.title}</h2>

            <div className="space-y-3 text-xs lg:text-sm text-sky-800 font-medium leading-relaxed border-t border-sky-100 pt-4">
              {selectedNews.fullBrief.map((para, idx) => (
                <p key={idx}>{para}</p>
              ))}
            </div>

            <div className="pt-2">
              <button
                onClick={() => setSelectedNews(null)}
                className="w-full py-2.5 rounded-2xl bg-sky-500 text-white font-bold text-xs hover:bg-sky-600 transition-all"
              >
                Close Brief
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
