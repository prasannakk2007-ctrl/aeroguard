import React, { useEffect, useState } from 'react';
import axios from 'axios';
import LiveGraph from '../components/LiveGraph';
import { Plane, AlertOctagon, Download, ShieldCheck, FileText } from 'lucide-react';

export default function Accidents() {
  const [accidents, setAccidents] = useState([]);

  useEffect(() => {
    axios.get('/api/accidents').then((res) => setAccidents(res.data)).catch(console.error);
  }, []);

  const handleDownload = (id) => {
    alert(`Downloading Safety Investigation Report for ${id}...`);
  };

  return (
    <div className="space-y-6">
      
      <div className="glass-sky-card p-6 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-sky-950 flex items-center gap-2">
            <AlertOctagon className="w-6 h-6 text-red-500" />
            Accident Analysis Module
          </h1>
          <p className="text-xs font-semibold text-sky-600 mt-1">
            Detailed investigation reports and historical flight hazard analytics.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="glass-sky-card p-5 rounded-3xl space-y-1">
          <span className="text-xs font-bold text-sky-600">Total Accidents</span>
          <div className="text-2xl font-black text-sky-950">7</div>
        </div>
        <div className="glass-sky-card p-5 rounded-3xl space-y-1">
          <span className="text-xs font-bold text-sky-600">Major Incidents</span>
          <div className="text-2xl font-black text-amber-600">3</div>
        </div>
        <div className="glass-sky-card p-5 rounded-3xl space-y-1">
          <span className="text-xs font-bold text-sky-600">Minor Incidents</span>
          <div className="text-2xl font-black text-sky-600">4</div>
        </div>
        <div className="glass-sky-card p-5 rounded-3xl space-y-1">
          <span className="text-xs font-bold text-sky-600">Safety Metric</span>
          <div className="text-2xl font-black text-emerald-600">85% Imp.</div>
        </div>
      </div>

      {/* Accident Trend Graph */}
      <div className="glass-sky-card p-6 rounded-3xl space-y-3">
        <h3 className="text-sm font-extrabold text-sky-900">Historical Accident Frequency (5-Year Trend)</h3>
        <LiveGraph data={[6, 4, 3, 2, 1]} color="#ef4444" height={130} />
      </div>

      {/* Records Table */}
      <div className="glass-sky-card rounded-3xl p-6 overflow-hidden">
        <h3 className="text-base font-extrabold text-sky-900 mb-4">Aviation Accident Records</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-sky-200 text-sky-600 font-extrabold uppercase">
                <th className="py-3 px-4">ID</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Flight No</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Severity</th>
                <th className="py-3 px-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sky-100 font-semibold text-sky-900">
              {accidents.map((acc) => (
                <tr key={acc.id} className="hover:bg-sky-50/60 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-sky-600">{acc.id}</td>
                  <td className="py-3.5 px-4">{acc.date}</td>
                  <td className="py-3.5 px-4 font-extrabold">{acc.flightNo}</td>
                  <td className="py-3.5 px-4">{acc.type}</td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                      acc.severity === 'Critical' || acc.severity === 'High'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}>
                      {acc.severity}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <button
                      onClick={() => handleDownload(acc.id)}
                      className="px-3 py-1 rounded-full bg-sky-100 text-sky-700 hover:bg-sky-200 text-[10px] font-bold flex items-center gap-1"
                    >
                      <Download className="w-3 h-3" /> Report
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}