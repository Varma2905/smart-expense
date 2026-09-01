import React, { useState } from 'react';
import { User, Shield, Bell, Palette, Upload, Trash2, Camera } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useTheme } from '../context/ThemeContext';
import { CURRENCIES } from '../constants/constants';
import { settingsService } from '../services/settingsService';

export const Settings = () => {
  const { user, updateUserState } = useAuth();
  const { showToast } = useToast();
  const { theme, toggleTheme } = useTheme();

  const [activeTab, setActiveTab] = useState('profile');

  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    currency: user?.currency || 'INR',
    avatar: user?.avatar || '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [notifications, setNotifications] = useState({
    budgetAlerts: true,
    recurringReminders: true,
    monthlySummary: true,
  });

  const [loading, setLoading] = useState(false);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file', 'error');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast('Image size should be less than 5MB', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setProfileData((prev) => ({ ...prev, avatar: reader.result }));
      showToast('Profile image selected! Click Save to apply.', 'info');
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setProfileData((prev) => ({ ...prev, avatar: '' }));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await settingsService.updateSettings(profileData);
      if (res.success && res.data) {
        updateUserState(res.data);
        showToast('Profile settings updated successfully!', 'success');
      }
    } catch (err) {
      showToast(err.message || 'Update failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showToast('New passwords do not match', 'error');
      return;
    }

    try {
      setLoading(true);
      await settingsService.updateSettings({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      showToast('Password changed successfully!', 'success');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      showToast(err.message || 'Password update failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Settings & Preferences</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">Manage account profile, security, and application preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Settings Navigation Tabs */}
        <div className="glass-card p-2 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1 h-fit">
          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'profile'
                ? 'bg-brand-600/10 dark:bg-brand-600/20 text-brand-600 dark:text-brand-400 border border-brand-500/30'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/40'
            }`}
          >
            <User className="w-4 h-4" />
            Profile & Currency
          </button>

          <button
            onClick={() => setActiveTab('appearance')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'appearance'
                ? 'bg-brand-600/10 dark:bg-brand-600/20 text-brand-600 dark:text-brand-400 border border-brand-500/30'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/40'
            }`}
          >
            <Palette className="w-4 h-4" />
            Appearance
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'security'
                ? 'bg-brand-600/10 dark:bg-brand-600/20 text-brand-600 dark:text-brand-400 border border-brand-500/30'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/40'
            }`}
          >
            <Shield className="w-4 h-4" />
            Security & Password
          </button>

          <button
            onClick={() => setActiveTab('notifications')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'notifications'
                ? 'bg-brand-600/10 dark:bg-brand-600/20 text-brand-600 dark:text-brand-400 border border-brand-500/30'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/40'
            }`}
          >
            <Bell className="w-4 h-4" />
            Notifications
          </button>
        </div>

        {/* Tab Content Panel */}
        <div className="lg:col-span-3">
          {activeTab === 'profile' && (
            <div className="glass-card p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-3">Profile & Preferences</h3>

              <form onSubmit={handleUpdateProfile} className="space-y-6">
                {/* Profile Image Upload Section */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-3">Profile Photo</label>
                  <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-2xl bg-slate-100/60 dark:bg-navy-900/60 border border-slate-200 dark:border-slate-800/80">
                    {/* Avatar Preview */}
                    <div className="relative group shrink-0">
                      <img
                        src={
                          profileData.avatar ||
                          `https://api.dicebear.com/7.x/avataaars/svg?seed=${profileData.name || 'User'}`
                        }
                        alt="Profile Preview"
                        className="w-24 h-24 rounded-full object-cover border-2 border-brand-500 shadow-xl bg-slate-200 dark:bg-slate-800"
                      />
                      <label
                        htmlFor="profile-image-input"
                        className="absolute inset-0 rounded-full bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                      >
                        <Camera className="w-6 h-6 text-white" />
                      </label>
                    </div>

                    <div className="space-y-2 text-center sm:text-left">
                      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                        <label
                          htmlFor="profile-image-input"
                          className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-md shadow-brand-600/20 cursor-pointer transition-all flex items-center gap-2"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          Upload New Photo
                        </label>
                        <input
                          id="profile-image-input"
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />

                        {profileData.avatar && (
                          <button
                            type="button"
                            onClick={handleRemoveImage}
                            className="px-3 py-2 rounded-xl border border-rose-500/30 text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 text-xs font-semibold transition-colors flex items-center gap-1.5"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Remove
                          </button>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Supports JPG, PNG or WEBP (Max file size: 5MB)
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Full Name</label>
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    className="w-full max-w-md px-4 py-2.5 rounded-xl glass-input text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Default Currency</label>
                  <select
                    value={profileData.currency}
                    onChange={(e) => setProfileData({ ...profileData, currency: e.target.value })}
                    className="w-full max-w-md px-4 py-2.5 rounded-xl glass-input text-sm font-medium bg-white dark:bg-navy-900"
                  >
                    {CURRENCIES.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-sm shadow-lg shadow-brand-600/30 transition-all"
                >
                  {loading ? 'Saving...' : 'Save Profile Changes'}
                </button>
              </form>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="glass-card p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-3">Appearance Theme</h3>

              <div className="space-y-4">
                <p className="text-xs text-slate-500 dark:text-slate-400">Select application visual color mode</p>
                <div className="grid grid-cols-2 gap-4 max-w-md">
                  <div
                    onClick={() => theme !== 'dark' && toggleTheme()}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      theme === 'dark'
                        ? 'bg-navy-900 border-brand-500 ring-2 ring-brand-500/20'
                        : 'bg-slate-100 border-slate-300'
                    }`}
                  >
                    <p className="font-bold text-slate-900 dark:text-white text-sm">Dark Navy Mode (Default)</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">SaaS Glassmorphism</p>
                  </div>

                  <div
                    onClick={() => theme === 'dark' && toggleTheme()}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      theme !== 'dark'
                        ? 'bg-white border-brand-500 ring-2 ring-brand-500/20'
                        : 'bg-slate-900/40 border-slate-800'
                    }`}
                  >
                    <p className="font-bold text-slate-900 dark:text-white text-sm">Light Mode</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Clean High Contrast</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="glass-card p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-3">Security & Password</h3>

              <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Current Password</label>
                  <input
                    type="password"
                    required
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">New Password</label>
                  <input
                    type="password"
                    required
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Confirm New Password</label>
                  <input
                    type="password"
                    required
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl glass-input text-sm"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-sm shadow-lg shadow-brand-600/30 transition-all"
                >
                  {loading ? 'Updating...' : 'Update Password'}
                </button>
              </form>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="glass-card p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-3">Notification Preferences</h3>

              <div className="space-y-4 max-w-lg">
                <div className="flex items-center justify-between p-4 rounded-xl bg-slate-100/60 dark:bg-navy-900/60 border border-slate-200 dark:border-slate-800">
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">Budget Limit Alerts</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Receive warnings when category spending exceeds 80%</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifications.budgetAlerts}
                    onChange={(e) => setNotifications({ ...notifications, budgetAlerts: e.target.checked })}
                    className="w-5 h-5 rounded border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-brand-600"
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-slate-100/60 dark:bg-navy-900/60 border border-slate-200 dark:border-slate-800">
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">Recurring Bill Reminders</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Notify 3 days before recurring subscriptions are due</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifications.recurringReminders}
                    onChange={(e) => setNotifications({ ...notifications, recurringReminders: e.target.checked })}
                    className="w-5 h-5 rounded border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-brand-600"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
