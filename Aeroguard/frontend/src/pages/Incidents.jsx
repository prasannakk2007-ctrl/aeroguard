import React, { useEffect, useState } from 'react';
import axios from 'axios';
import LiveGraph from '../components/LiveGraph';
import { AlertTriangle, Plus, ShieldAlert, CheckCircle, Clock, MapPin } from 'lucide-react';

export default function Incidents({ user }) {
  const [incidents, setIncidents] = useState([]);
  const [showModal, setShowModal] = useState(false);

  // Form State
  const [type, setType] = useState('Wind Speed Spike');
  const [riskLevel, setRiskLevel] = useState('Warning');
  const [location, setLocation] = useState('Chennai Airspace');
  const [description, setDescription] = useState('');

  const fetchIncidents = async () => {
    try {
      const res = await axios.get('/api/incidents');
      setIncidents(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchIncidents();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/incidents', {
        type,
        riskLevel,
        location,
        description,
        filedBy: user ? user.name : 'Guest User'
      });
      setShowModal(false);
      setDescription('');
      fetchIncidents();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-sky-card p-6 rounded-3xl">
        <div>
          <h1 className="text-2xl font-extrabold text-sky-950 flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-amber-500" />
            Incident Management Module
          </h1>
          <p className="text-xs font-semibold text-sky-600 mt-1">
            Monitor, track, and log atmospheric weather anomalies in real time.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-sky-500 to-sky-600 text-white text-xs font-bold shadow-md shadow-sky-300 flex items-center gap-2 hover:from-sky-600 hover:to-sky-700 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Report Weather Incident
        </button>
      </div>

      {/* Incident Trends Chart */}
      <div className="glass-sky-card p-6 rounded-3xl space-y-3">
        <h3 className="text-sm font-extrabold text-sky-900">Incident Severity Trends</h3>
        <LiveGraph data={[12, 15, 8, 22, 19, 28, 14, 32, 20]} color="#f59e0b" height={140} />
      </div>

      {/* Incidents Table */}
      <div className="glass-sky-card rounded-3xl p-6 overflow-hidden">
        <h3 className="text-base font-extrabold text-sky-900 mb-4">Active Incident Log</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-sky-200 text-sky-600 font-extrabold uppercase">
                <th className="py-3 px-4">ID</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Risk Level</th>
                <th className="py-3 px-4">Filed By</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sky-100 font-semibold text-sky-900">
              {incidents.map((inc) => (
                <tr key={inc.id} className="hover:bg-sky-50/60 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-sky-600">{inc.id}</td>
                  <td className="py-3.5 px-4">{inc.type}</td>
                  <td className="py-3.5 px-4 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-sky-400" />
                    {inc.location}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                      inc.riskLevel === 'Critical'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}>
                      {inc.riskLevel}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-sky-600">{inc.filedBy || 'System'}</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-extrabold">
                      {inc.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Report Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-sky-950/40 backdrop-blur-sm">
          <div className="glass-sky-card w-full max-w-lg rounded-3xl p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-extrabold text-sky-950">File Weather Incident Report</h3>
            <form onSubmit={handleCreate} className="space-y-4 text-xs font-bold text-sky-800">
              <div>
                <label className="block mb-1">Incident Type</label>
                <input
                  type="text"
                  required
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full glass-sky-input p-2.5 rounded-2xl"
                />
              </div>

              <div>
                <label className="block mb-1">Location / Airspace</label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full glass-sky-input p-2.5 rounded-2xl"
                />
              </div>

              <div>
                <label className="block mb-1">Description</label>
                <textarea
                  rows="3"
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full glass-sky-input p-2.5 rounded-2xl"
                  placeholder="Details regarding wind shear, visibility drop, etc."
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 rounded-2xl bg-sky-100 text-sky-700 hover:bg-sky-200 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-2xl bg-sky-500 text-white hover:bg-sky-600 shadow-md shadow-sky-300 transition-all"
                >
                  Submit Incident
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}