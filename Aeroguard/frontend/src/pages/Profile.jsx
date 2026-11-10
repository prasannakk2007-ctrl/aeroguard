import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { User, Upload, ShieldCheck, Mail, Phone, GraduationCap, FileText, UserPlus, CheckCircle } from 'lucide-react';

export default function Profile({ user, setUser }) {
  const [adminsList, setAdminsList] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [auditReport, setAuditReport] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  // Admins Static Info fallback
  const staticAdmins = [
    {
      id: "admin_prasanna",
      name: "Prasanna K",
      regNo: "73152513701",
      gmail: ["prasannakcse2529@ksrce.ac.in", "prasannakk2007@gmail.com"],
      mobile: "7010661415",
      college: "K.S.R. College of Engineering"
    },
    {
      id: "admin_keerthi",
      name: "Keerthi V",
      regNo: "73152513076",
      gmail: ["keerthivcse25_29@ksrce.ac.in", "keerthivenkatesh208@gmail.com"],
      mobile: "9922545462",
      college: "K.S.R. College of Engineering"
    },
    {
      id: "admin_karnika",
      name: "Karnika N",
      regNo: "73152513067",
      gmail: ["karnikancse25_29@ksrce.ac.in"],
      mobile: "9344633198",
      college: "K.S.R. College of Engineering"
    },
    {
      id: "admin_poonkodi",
      name: "Poonkodi E",
      regNo: "73152513122",
      gmail: ["poonkodiecse25_29@ksrce.ac.in"],
      mobile: "9361407017",
      college: "K.S.R. College of Engineering"
    }
  ];

  const fetchData = async () => {
    try {
      const [resUsers, resReport] = await Promise.all([
        axios.get('/api/users'),
        axios.get('/api/admin/report')
      ]);
      setUsersList(resUsers.data || []);
      setAuditReport(resReport.data || []);

      const admins = resUsers.data.filter(u => u.role === 'admin');
      setAdminsList(admins.length > 0 ? admins : staticAdmins);
    } catch (e) {
      console.error(e);
      setAdminsList(staticAdmins);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Avatar Upload Handler
  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('avatar', file);
    formData.append('userId', user.id);

    setUploading(true);
    try {
      const res = await axios.post('/api/profile/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setUser({ ...user, avatar: res.data.avatarUrl });
      setMessage('Profile photo updated successfully!');
      fetchData();
    } catch (err) {
      alert('Photo upload failed!');
    } finally {
      setUploading(false);
    }
  };

  // Promote User to Admin
  const handlePromote = async (userId) => {
    try {
      const res = await axios.post('/api/users/promote', { userId });
      alert(res.data.message);
      fetchData();
    } catch (err) {
      alert('Failed to promote user!');
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Current User Card & Photo Upload */}
      <div className="glass-sky-card p-6 lg:p-8 rounded-3xl flex flex-col md:flex-row items-center gap-6">
        <div className="relative group">
          <div className="w-24 h-24 rounded-full bg-sky-200 border-4 border-white shadow-md overflow-hidden flex items-center justify-center text-sky-600 font-extrabold text-2xl">
            {user.avatar ? (
              <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              user.name.charAt(0)
            )}
          </div>
          <label className="absolute bottom-0 right-0 p-2 rounded-full bg-sky-500 text-white shadow-md cursor-pointer hover:bg-sky-600 transition-colors">
            <Upload className="w-3.5 h-3.5" />
            <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
          </label>
        </div>

        <div className="space-y-1 text-center md:text-left flex-1">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <h2 className="text-xl font-extrabold text-sky-950">{user.name}</h2>
            <span className={`px-3 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
              user.role === 'admin' ? 'bg-amber-100 text-amber-800' : 'bg-sky-100 text-sky-700'
            }`}>
              {user.role}
            </span>
          </div>
          <p className="text-xs text-sky-600 font-semibold">{user.gmail ? user.gmail.join(' | ') : user.username}</p>
          <p className="text-xs text-sky-500 font-medium">K.S.R. College of Engineering</p>
          {message && <p className="text-xs text-emerald-600 font-bold mt-1">{message}</p>}
        </div>
      </div>

      {/* Admin Profiles Grid */}
      <div className="space-y-4">
        <h3 className="text-lg font-extrabold text-sky-950 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-amber-500" />
          System Administrators
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {(adminsList.length > 0 ? adminsList : staticAdmins).map((admin) => (
            <div key={admin.id || admin.regNo} className="glass-sky-card p-6 rounded-3xl space-y-3 relative overflow-hidden">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-400 to-sky-300 flex items-center justify-center text-white font-extrabold text-xl shadow-md">
                  {admin.avatar ? <img src={admin.avatar} className="w-full h-full object-cover rounded-2xl" /> : admin.name.charAt(0)}
                </div>
                <div>
                  <h4 className="text-base font-extrabold text-sky-950">{admin.name}</h4>
                  <span className="text-xs font-bold text-sky-500">Reg No: {admin.regNo}</span>
                </div>
              </div>

              <div className="space-y-1.5 text-xs font-semibold text-sky-700 border-t border-sky-100 pt-3">
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                  <span>{Array.isArray(admin.gmail) ? admin.gmail.join(' , ') : admin.gmail}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                  <span>+91 {admin.mobile}</span>
                </div>
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                  <span>{admin.college || 'K.S.R. College of Engineering'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Admin Data Audit Report & Promote User Section (Visible to Admins) */}
      {user.role === 'admin' && (
        <div className="glass-sky-card p-6 rounded-3xl space-y-4">
          <h3 className="text-base font-extrabold text-sky-950 flex items-center gap-2">
            <FileText className="w-5 h-5 text-sky-500" />
            Admin Audit Data Report (User Accounts & Filed Reports)
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-sky-200 text-sky-600 font-extrabold uppercase">
                  <th className="py-3 px-4">User Name</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Incidents Filed</th>
                  <th className="py-3 px-4">Tickets Filed</th>
                  <th className="py-3 px-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sky-100 font-semibold text-sky-900">
                {auditReport.map((row) => (
                  <tr key={row.id} className="hover:bg-sky-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-bold">{row.name}</td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                        row.role === 'admin' ? 'bg-amber-100 text-amber-800' : 'bg-sky-100 text-sky-700'
                      }`}>
                        {row.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-sky-600">{row.email}</td>
                    <td className="py-3.5 px-4 font-bold text-amber-600">{row.incidentsFiled}</td>
                    <td className="py-3.5 px-4 font-bold text-sky-600">{row.ticketsFiled}</td>
                    <td className="py-3.5 px-4">
                      {row.role !== 'admin' && (
                        <button
                          onClick={() => handlePromote(row.id)}
                          className="px-3 py-1 rounded-full bg-amber-500 text-white hover:bg-amber-600 text-[10px] font-bold flex items-center gap-1 shadow-sm"
                        >
                          <UserPlus className="w-3 h-3" /> Make Admin
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}