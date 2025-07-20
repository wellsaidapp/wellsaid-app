import { useState } from 'react';
import { ChevronLeft, Bell, BellOff, Mail, Smartphone } from 'lucide-react';

const NotificationSettings = ({ user, onBack, onUpdateNotificationSettings }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [settings, setSettings] = useState({
    emailNotifications: user.notificationSettings?.emailNotifications ?? true,
    pushNotifications: user.notificationSettings?.pushNotifications ?? true,
    messageAlerts: user.notificationSettings?.messageAlerts ?? true,
    weeklyDigest: user.notificationSettings?.weeklyDigest ?? true,
    goalReminders: user.notificationSettings?.goalReminders ?? true,
    soundEnabled: user.notificationSettings?.soundEnabled ?? false,
    quietHoursEnabled: user.notificationSettings?.quietHoursEnabled ?? false,
    quietHoursStart: user.notificationSettings?.quietHoursStart ?? '22:00',
    quietHoursEnd: user.notificationSettings?.quietHoursEnd ?? '07:00',
  });

  const handleSave = async () => {
    await onUpdateNotificationSettings(settings);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setSettings(user.notificationSettings || {
      emailNotifications: true,
      pushNotifications: true,
      // ... other defaults
    });
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-50 to-indigo-50 pb-20">
      <div className="p-4">
        <button
          onClick={onBack}
          className="flex items-center mb-4 text-blue-600 hover:text-blue-800 transition-colors"
        >
          <ChevronLeft size={20} className="mr-1" />
          Back to Profile
        </button>

        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 mb-4 border border-white/50 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold flex items-center">
              <Bell size={20} className="mr-2 text-blue-600" />
              Notification Preferences
            </h2>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center px-3 py-1 text-sm bg-gray-50 text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
              >
                <Bell size={16} className="mr-1" />
                Edit
              </button>
            ) : (
              <button
                onClick={handleCancel}
                className="flex items-center px-3 py-1 text-sm bg-gray-50 text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
              >
                <BellOff size={16} className="mr-1" />
                Cancel
              </button>
            )}
          </div>

          <div className="space-y-6">
            {/* Notification Channels */}
            <div className="space-y-4">
              <h3 className="font-medium text-gray-700">Notification Channels</h3>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Mail size={18} className="mr-2 text-gray-500" />
                  <span>Email Notifications</span>
                </div>
                {isEditing ? (
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.emailNotifications}
                      onChange={(e) => setSettings({...settings, emailNotifications: e.target.checked})}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                ) : (
                  <span className={`px-2 py-1 text-xs rounded-full ${settings.emailNotifications ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {settings.emailNotifications ? 'Enabled' : 'Disabled'}
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Smartphone size={18} className="mr-2 text-gray-500" />
                  <span>Push Notifications</span>
                </div>
                {isEditing ? (
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.pushNotifications}
                      onChange={(e) => setSettings({...settings, pushNotifications: e.target.checked})}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                ) : (
                  <span className={`px-2 py-1 text-xs rounded-full ${settings.pushNotifications ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {settings.pushNotifications ? 'Enabled' : 'Disabled'}
                  </span>
                )}
              </div>
            </div>

            {/* Notification Types */}
            <div className="space-y-4">
              <h3 className="font-medium text-gray-700">Notification Types</h3>


              <div className="flex items-center justify-between">
                <span>Weekly Digest</span>
                {isEditing ? (
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.weeklyDigest}
                      onChange={(e) => setSettings({...settings, weeklyDigest: e.target.checked})}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                ) : (
                  <span className={`px-2 py-1 text-xs rounded-full ${settings.weeklyDigest ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {settings.weeklyDigest ? 'Enabled' : 'Disabled'}
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between">
                <span>Goal Reminders</span>
                {isEditing ? (
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.goalReminders}
                      onChange={(e) => setSettings({...settings, goalReminders: e.target.checked})}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                ) : (
                  <span className={`px-2 py-1 text-xs rounded-full ${settings.goalReminders ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {settings.goalReminders ? 'Enabled' : 'Disabled'}
                  </span>
                )}
              </div>
            </div>


            {isEditing && (
              <div className="flex justify-end pt-4">
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings;
