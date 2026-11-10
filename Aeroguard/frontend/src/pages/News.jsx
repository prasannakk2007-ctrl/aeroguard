import React from 'react';
import { Newspaper, Flame, Compass, Bell } from 'lucide-react';

export default function News() {
  const newsList = [
    {
      id: 1,
      tag: 'Weather',
      title: 'Severe Thunderstorms Disrupt European Flight Corridors',
      date: 'Oct 29, 2026',
      desc: 'Sudden cold front convergence creates high-altitude thermal inversion and wind shear warnings.'
    },
    {
      id: 2,
      tag: 'Aviation Tech',
      title: 'AeroGuard ML Isolation Forest Model Deployed in Smart Airports',
      date: 'Oct 28, 2026',
      desc: 'Real-time multi-sensor telemetry streaming lowers hazard response times by 40%.'
    },
    {
      id: 3,
      tag: 'Safety',
      title: 'Global Aviation Safety Report Highlights Record Low Risks',
      date: 'Oct 25, 2026',
      desc: 'Predictive weather anomaly detection systems boost pilot situational awareness across Asian airspace.'
    }
  ];

  return (
    <div className="space-y-6">
      
      <div className="glass-sky-card p-6 rounded-3xl">
        <h1 className="text-2xl font-extrabold text-sky-950 flex items-center gap-2">
          <Newspaper className="w-6 h-6 text-sky-500" />
          Aviation & Weather News
        </h1>
        <p className="text-xs font-semibold text-sky-600 mt-1">
          Stay updated with real-time global aviation safety and atmospheric research news.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {newsList.map((item) => (
            <div key={item.id} className="glass-sky-card p-6 rounded-3xl space-y-2 hover:shadow-lg transition-all">
              <span className="px-3 py-1 rounded-full bg-sky-100 text-sky-700 text-[10px] font-extrabold uppercase">
                {item.tag}
              </span>
              <h3 className="text-base font-extrabold text-sky-950">{item.title}</h3>
              <p className="text-xs text-sky-700 font-medium">{item.desc}</p>
              <span className="block text-[10px] font-bold text-sky-400 pt-2">{item.date}</span>
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
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full glass-sky-input p-2.5 rounded-2xl text-xs font-medium"
          />
          <button className="w-full py-2.5 rounded-2xl bg-sky-500 text-white font-bold text-xs shadow-md shadow-sky-300 hover:bg-sky-600 transition-all">
            Subscribe Alerts
          </button>
        </div>
      </div>

    </div>
  );
}