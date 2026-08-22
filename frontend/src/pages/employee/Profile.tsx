import React, { useState, useRef } from 'react';
import {
  UserCheck,
  Phone,
  MapPin,
  Mail,
  Calendar,
  Shield,
  Save,
  CheckCircle2,
  Camera,
  Upload,
  CreditCard,
  ShieldAlert,
  FileCheck,
  User,
  HeartHandshake,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

export const Profile: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [activeTab, setActiveTab] = useState<'personal' | 'statutory' | 'bank' | 'emergency'>('personal');

  // Form Fields
  const [phone, setPhone] = useState<string>(user?.employee_profile?.phone || '');
  const [address, setAddress] = useState<string>(user?.employee_profile?.address || '');
  const [profilePic, setProfilePic] = useState<string>(user?.employee_profile?.profile_picture || '');
  const [panNumber, setPanNumber] = useState<string>(user?.employee_profile?.pan_number || '');
  const [aadhaarNumber, setAadhaarNumber] = useState<string>(user?.employee_profile?.aadhaar_number || '');
  const [uanNumber, setUanNumber] = useState<string>(user?.employee_profile?.uan_number || '');
  const [bankAccount, setBankAccount] = useState<string>(user?.employee_profile?.bank_account || '');
  const [ifscCode, setIfscCode] = useState<string>(user?.employee_profile?.ifsc_code || '');
  const [emergencyContact, setEmergencyContact] = useState<string>(user?.employee_profile?.emergency_contact || '');

  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Direct File Photo Upload Handler
  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert('Photo size should be less than 2MB.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setProfilePic(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMsg(null);
    try {
      await api.patch('/employees/me', {
        phone,
        address,
        profile_picture: profilePic,
        pan_number: panNumber,
        aadhaar_number: aadhaarNumber,
        uan_number: uanNumber,
        bank_account: bankAccount,
        ifsc_code: ifscCode,
        emergency_contact: emergencyContact,
      });
      await refreshUser();
      setSuccessMsg('Employee Profile updated and synchronized successfully!');
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const displayName = user?.employee_profile?.first_name
    ? `${user.employee_profile.first_name} ${user.employee_profile.last_name || ''}`.trim()
    : user?.email
    ? user.email.split('@')[0]
    : 'Employee';

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <UserCheck className="w-6 h-6 text-indigo-600 dark:text-indigo-400" /> Employee Profile Vault
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
            Manage your personal details, photo avatar, Indian statutory IDs, and bank account for payroll.
          </p>
        </div>

        <Badge variant="success">SELF-SERVICE SYNCHRONIZED</Badge>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 flex items-center gap-3 text-emerald-800 dark:text-emerald-400 text-sm font-bold animate-fade-in shadow-xs">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* ========================================================================= */}
        {/* LEFT COLUMN: AVATAR PHOTO UPLOADER & OFFICIAL HR SUMMARY (4 Cols) */}
        {/* ========================================================================= */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="flex flex-col items-center text-center p-6 border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] shadow-md">
            {/* AVATAR PHOTO CIRCLE WITH DIRECT UPLOAD TRIGGER */}
            <div className="relative group mb-4">
              <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 border-4 border-white dark:border-slate-800 flex items-center justify-center text-4xl font-extrabold text-white shadow-xl overflow-hidden">
                {profilePic ? (
                  <img src={profilePic} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  displayName.charAt(0).toUpperCase()
                )}
              </div>

              {/* Upload Overlay Button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 rounded-full bg-slate-900/60 text-white opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-xs font-bold transition-opacity cursor-pointer backdrop-blur-xs"
                title="Click to Upload Profile Photo"
              >
                <Camera className="w-6 h-6 mb-1" />
                <span>Upload Photo</span>
              </button>

              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handlePhotoSelect}
                className="hidden"
              />
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              leftIcon={<Upload className="w-3.5 h-3.5" />}
              className="mb-4 text-xs font-bold"
            >
              Choose Photo File
            </Button>

            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">{displayName}</h2>
            <p className="text-xs text-indigo-600 dark:text-indigo-400 font-bold mt-0.5">
              {user?.employee_profile?.job_title || 'Software Engineer'}
            </p>

            <div className="mt-4 flex flex-wrap gap-1.5 justify-center">
              <Badge variant="info">{user?.employee_profile?.department?.name || 'Engineering'}</Badge>
              <Badge variant="neutral">ID: {user?.employee_id || 'EMP-001'}</Badge>
              <Badge variant="warning">{user?.role}</Badge>
            </div>

            <div className="w-full border-t border-slate-200 dark:border-slate-800 mt-6 pt-5 text-left space-y-3 text-xs font-medium">
              <div className="flex items-center gap-2.5 text-slate-700 dark:text-slate-300">
                <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="truncate">{user?.email}</span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-700 dark:text-slate-300">
                <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                <span>Joining Date: {user?.employee_profile?.joining_date || '2026-01-15'}</span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-700 dark:text-slate-300">
                <Shield className="w-4 h-4 text-slate-400 shrink-0" />
                <span>Account Status: Active</span>
              </div>
            </div>
          </Card>

          {/* Protected HR Administrative Card */}
          <div className="p-5 rounded-2xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 text-xs space-y-2">
            <div className="flex items-center gap-2 font-bold text-amber-900 dark:text-amber-300 uppercase tracking-wider">
              <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>HR Administrative Governance</span>
            </div>
            <p className="text-amber-800 dark:text-amber-300/90 leading-relaxed font-medium">
              Job Title, Department Assignment, Base CTC Salary, and Employee ID are protected fields modifiable only by HR Managers & System Admins.
            </p>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* RIGHT COLUMN: MULTI-TAB EDITABLE ESS PROFILE VAULT (8 Cols) */}
        {/* ========================================================================= */}
        <div className="lg:col-span-8">
          <Card className="p-6 sm:p-8 border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] shadow-md">
            {/* TAB SELECTOR HEADER */}
            <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-4 mb-6">
              <button
                type="button"
                onClick={() => setActiveTab('personal')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'personal'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                <User className="w-4 h-4" />
                <span>Personal Details</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('statutory')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'statutory'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                <FileCheck className="w-4 h-4" />
                <span>Statutory Vault (PAN/Aadhaar)</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('bank')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'bank'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span>Bank & Payroll</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('emergency')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'emergency'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                }`}
              >
                <HeartHandshake className="w-4 h-4" />
                <span>Emergency Contact</span>
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
              {/* TAB 1: PERSONAL DETAILS */}
              {activeTab === 'personal' && (
                <div className="space-y-5 animate-fade-in">
                  <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200 pb-2 border-b border-slate-100 dark:border-slate-800">
                    Contact & Residential Information
                  </h3>

                  <div>
                    <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                      Phone Number
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 pl-10 font-medium"
                        placeholder="+91 98765 43210"
                      />
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                      Residential Home Address
                    </label>
                    <div className="relative">
                      <textarea
                        rows={3}
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 pl-10 font-medium"
                        placeholder="Flat 402, Green Ridge Apartments, HSR Layout, Bengaluru, Karnataka 560102"
                      />
                      <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: INDIAN STATUTORY VAULT */}
              {activeTab === 'statutory' && (
                <div className="space-y-5 animate-fade-in">
                  <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200 pb-2 border-b border-slate-100 dark:border-slate-800">
                    Indian Statutory Compliance & Identifiers
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                        PAN Card Number
                      </label>
                      <input
                        type="text"
                        value={panNumber}
                        onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
                        maxLength={10}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 uppercase font-mono font-medium"
                        placeholder="ABCDE1234F"
                      />
                      <p className="text-[10px] text-slate-400 mt-1">Required for TDS income tax compliance.</p>
                    </div>

                    <div>
                      <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                        Aadhaar Card Number
                      </label>
                      <input
                        type="text"
                        value={aadhaarNumber}
                        onChange={(e) => setAadhaarNumber(e.target.value)}
                        maxLength={14}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 font-mono font-medium"
                        placeholder="XXXX-XXXX-1234"
                      />
                      <p className="text-[10px] text-slate-400 mt-1">Stored securely under DPDP privacy rules.</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                      Universal Account Number (UAN / EPF)
                    </label>
                    <input
                      type="text"
                      value={uanNumber}
                      onChange={(e) => setUanNumber(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 font-mono font-medium"
                      placeholder="101234567890"
                    />
                    <p className="text-[10px] text-slate-400 mt-1">12-digit EPF Provident Fund tracking identifier.</p>
                  </div>
                </div>
              )}

              {/* TAB 3: BANK ACCOUNT & PAYROLL */}
              {activeTab === 'bank' && (
                <div className="space-y-5 animate-fade-in">
                  <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200 pb-2 border-b border-slate-100 dark:border-slate-800">
                    Bank Credit Details for Monthly Salary
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                        Bank Account Number
                      </label>
                      <input
                        type="text"
                        value={bankAccount}
                        onChange={(e) => setBankAccount(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 font-mono font-medium"
                        placeholder="9876543210123"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                        Bank IFSC Code
                      </label>
                      <input
                        type="text"
                        value={ifscCode}
                        onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 uppercase font-mono font-medium"
                        placeholder="SBIN0001234"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: EMERGENCY CONTACT & NOMINEE */}
              {activeTab === 'emergency' && (
                <div className="space-y-5 animate-fade-in">
                  <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200 pb-2 border-b border-slate-100 dark:border-slate-800">
                    Primary Emergency Contact & Nominee
                  </h3>

                  <div>
                    <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                      Emergency Contact Details
                    </label>
                    <input
                      type="text"
                      value={emergencyContact}
                      onChange={(e) => setEmergencyContact(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 font-medium"
                      placeholder="Jane Doe (Spouse) - +91 91234 56789"
                    />
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end">
                <Button
                  type="submit"
                  isLoading={isSaving}
                  leftIcon={<Save className="w-4 h-4" />}
                  className="px-6 py-3 font-bold text-sm shadow-md shadow-indigo-600/30 cursor-pointer"
                >
                  Save Profile Changes
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};
