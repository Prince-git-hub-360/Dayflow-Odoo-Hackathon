import React, { useState } from 'react';
import { UserCheck, Phone, MapPin, Mail, Calendar, Shield, Save, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

export const Profile: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const [phone, setPhone] = useState<string>(user?.employee_profile?.phone || '');
  const [address, setAddress] = useState<string>(user?.employee_profile?.address || '');
  const [profilePic, setProfilePic] = useState<string>(user?.employee_profile?.profile_picture || '');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMsg(null);
    try {
      await api.patch('/employees/me', {
        phone,
        address,
        profile_picture: profilePic,
      });
      await refreshUser();
      setSuccessMsg('Profile details updated successfully!');
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
          <UserCheck className="w-6 h-6 text-indigo-400" /> Employee Profile
        </h1>
        <p className="text-sm text-slate-400">
          Manage your personal details and view your official employment record.
        </p>
      </div>

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3 text-emerald-400 text-sm">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="flex flex-col items-center text-center p-8">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 border-4 border-slate-800 flex items-center justify-center text-3xl font-extrabold text-white shadow-xl mb-4 overflow-hidden">
            {profilePic ? (
              <img src={profilePic} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              user?.employee_profile?.first_name?.[0] || 'E'
            )}
          </div>
          <h2 className="text-xl font-bold text-white">
            {user?.employee_profile?.first_name} {user?.employee_profile?.last_name}
          </h2>
          <p className="text-xs text-indigo-400 font-medium mt-1">{user?.employee_profile?.job_title}</p>
          <div className="mt-4 flex flex-wrap gap-2 justify-center">
            <Badge variant="info">{user?.employee_profile?.department?.name || 'Engineering'}</Badge>
            <Badge variant="neutral">ID: {user?.employee_id}</Badge>
            <Badge variant="warning">{user?.role}</Badge>
          </div>

          <div className="w-full border-t border-slate-800/80 mt-6 pt-6 text-left space-y-3 text-xs">
            <div className="flex items-center gap-2.5 text-slate-400">
              <Mail className="w-4 h-4 text-slate-500" />
              <span>{user?.email}</span>
            </div>
            <div className="flex items-center gap-2.5 text-slate-400">
              <Calendar className="w-4 h-4 text-slate-500" />
              <span>Joined {user?.employee_profile?.joining_date}</span>
            </div>
            <div className="flex items-center gap-2.5 text-slate-400">
              <Shield className="w-4 h-4 text-slate-500" />
              <span>Account Status: Active</span>
            </div>
          </div>
        </Card>

        <Card className="md:col-span-2 p-8">
          <h3 className="text-lg font-semibold text-slate-200 mb-6 pb-3 border-b border-slate-800">
            Editable Personal Information
          </h3>

          <form onSubmit={handleSave} className="space-y-6">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Phone Number
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-900/80 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 pl-10"
                  placeholder="+1 (555) 000-0000"
                />
                <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Home Address
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-slate-900/80 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 pl-10"
                  placeholder="123 Corporate Blvd, City, State"
                />
                <MapPin className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Profile Picture URL
              </label>
              <input
                type="text"
                value={profilePic}
                onChange={(e) => setProfilePic(e.target.value)}
                className="w-full bg-slate-900/80 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                placeholder="https://images.unsplash.com/photo-..."
              />
            </div>

            <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 text-xs text-slate-400 space-y-1">
              <p className="font-semibold text-slate-300">Protected Administrative Fields</p>
              <p>Job Title, Department, Salary, and Employee ID can only be modified by HR/Admin.</p>
            </div>

            <Button
              type="submit"
              isLoading={isSaving}
              leftIcon={<Save className="w-4 h-4" />}
            >
              Save Profile Changes
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};
