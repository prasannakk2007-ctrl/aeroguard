import React from 'react';
import { CloudRain, ShieldCheck, Activity, Cpu, Bell, CheckCircle } from 'lucide-react';

export default function Features() {
  const features = [
    {
      icon: <CloudRain className="w-8 h-8 text-sky-500" />,
      title: 'Real-Time Weather Monitoring',
      desc: 'Continuous streaming log ingestion tracking rain, wind speed, visibility, and atmospheric pressure.'
    },
    {
      icon: <Cpu className="w-8 h-8 text-indigo-500" />,
      title: 'Isolation Forest Anomaly Detection',
      desc: 'Unsupervised Machine Learning engine evaluating multi-variate metrics against historical baselines.'
    },
    {
      icon: <Bell className="w-8 h-8 text-amber-500" />,
      title: 'Zero-Delay Early Warnings',
      desc: 'Instant alert propagation delivering warnings directly to flight control boards and pilots.'
    },
    {
      icon: <Activity className="w-8 h-8 text-teal-500" />,
      title: 'AI-Powered Flight Insights',
      desc: 'Predictive risk scoring and continuous live tracking graph visualizers.'
    }
  ];

  return (
    <div className="space-y-6">
      
      <div className="glass-sky-card p-6 rounded-3xl text-center max-w-2xl mx-auto space-y-2">
        <h1 className="text-2xl font-extrabold text-sky-950">AeroGuard ML Features</h1>
        <p className="text-xs font-semibold text-sky-600">
          Explore the powerful machine learning and weather monitoring features built for flight safety.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map((f, i) => (
          <div key={i} className="glass-sky-card p-6 rounded-3xl space-y-3 hover:scale-[1.02] transition-transform">
            <div className="p-3 rounded-2xl bg-sky-100/70 w-fit">{f.icon}</div>
            <h3 className="text-base font-extrabold text-sky-950">{f.title}</h3>
            <p className="text-xs text-sky-700 font-medium leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>

    </div>
  );
}