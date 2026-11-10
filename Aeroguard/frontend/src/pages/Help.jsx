import React, { useState } from 'react';
import axios from 'axios';
import { HelpCircle, Mail, MessageSquare, Send, CheckCircle2 } from 'lucide-react';

export default function Help({ user }) {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/help/tickets', {
        user: user ? user.name : 'Guest User',
        email: user ? (user.gmail ? user.gmail[0] : user.username) : 'guest@ksrce.ac.in',
        subject,
        message
      });
      setSuccess('Support Ticket submitted successfully! Our team will respond shortly.');
      setSubject('');
      setMessage('');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      
      <div className="glass-sky-card p-6 rounded-3xl">
        <h1 className="text-2xl font-extrabold text-sky-950 flex items-center gap-2">
          <HelpCircle className="w-6 h-6 text-sky-500" />
          Help & Support Center
        </h1>
        <p className="text-xs font-semibold text-sky-600 mt-1">
          Have questions or encountered an anomaly issue? We are here to help.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* FAQs */}
        <div className="glass-sky-card p-6 rounded-3xl space-y-4">
          <h3 className="text-base font-extrabold text-sky-950">Frequently Asked Questions</h3>
          
          <div className="space-y-3 text-xs font-medium text-sky-800">
            <div className="p-4 rounded-2xl bg-sky-50/80 border border-sky-100">
              <strong className="block text-sky-950 mb-1">How does AeroGuard ML detect weather anomalies?</strong>
              It uses an unsupervised Isolation Forest machine learning model that continuously evaluates temperature, wind speed, visibility, and pressure telemetry.
            </div>
            
            <div className="p-4 rounded-2xl bg-sky-50/80 border border-sky-100">
              <strong className="block text-sky-950 mb-1">Who are the system Administrators?</strong>
              Prasanna K, Keerthi V, Karnika N, and Poonkodi E from K.S.R. College of Engineering.
            </div>
            
            <div className="p-4 rounded-2xl bg-sky-50/80 border border-sky-100">
              <strong className="block text-sky-950 mb-1">How do I upload my profile picture?</strong>
              Go to the Profile module and click "Upload Avatar" to select an image from your local file system.
            </div>
          </div>
        </div>

        {/* Support Ticket Form */}
        <div className="glass-sky-card p-6 rounded-3xl space-y-4">
          <h3 className="text-base font-extrabold text-sky-950">Raise a Support Ticket</h3>
          
          {success && (
            <div className="p-3 rounded-2xl bg-emerald-50 text-emerald-700 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-bold text-sky-800">
            <div>
              <label className="block mb-1">Subject</label>
              <input
                type="text"
                required
                placeholder="e.g. Telemetry Streaming Query"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full glass-sky-input p-2.5 rounded-2xl"
              />
            </div>

            <div>
              <label className="block mb-1">Message</label>
              <textarea
                rows="4"
                required
                placeholder="Describe your issue or query..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full glass-sky-input p-2.5 rounded-2xl"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-sky-500 text-white font-bold text-xs shadow-md shadow-sky-300 hover:bg-sky-600 transition-all flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              Submit Ticket
            </button>
          </form>
        </div>
      </div>

    </div>
  );
}