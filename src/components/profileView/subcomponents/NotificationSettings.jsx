import { useState } from 'react';
import { ChevronLeft, Bell, BellOff, Mail, Smartphone } from 'lucide-react';
import { fetchAuthSession } from 'aws-amplify/auth';
import { useUser } from '../../../context/UserContext';

const NotificationSettings = ({ user, onBack, onUpdateNotificationSettings }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [settings, setSettings] = useState({
    emailNotifications: user.emailNotifications ?? true,
    pushNotifications: user.pushNotifications ?? true,
    weeklyDigest: user.weeklyDigest ?? true,
    goalReminders: user.goalReminders ?? true,
  });
  const { refetchUser } = useUser();
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true); // start loading

    try {
      const token = (await fetchAuthSession()).tokens?.idToken?.toString();
      if (!token) throw new Error("Missing ID token");

      const patchResponse = await fetch(
        "https://2rjszrulkb.execute-api.us-east-2.amazonaws.com/dev/users/preferences",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify({
            emailNotifications: settings.emailNotifications,
            pushNotifications: settings.pushNotifications,
            weeklyDigest: settings.weeklyDigest,
            goalReminders: settings.goalReminders,
          }),
        }
      );

      if (!patchResponse.ok) {
        const error = await patchResponse.text();
        throw new Error(`Preference update failed: ${error}`);
      }

      await refetchUser(true); // optional if you're using user context
      setIsEditing(false);
      console.log("✅ Preferences updated");
    } catch (err) {
      console.error("❌ Error updating notification preferences:", err);
    } finally {
      setIsSaving(false); // stop loading
    }
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
                disabled={isSaving}
                className={`px-4 py-2 rounded-lg transition-colors flex items-center justify-center
                  ${isSaving ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
              >
                {isSaving ? (
                  <>
                    <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
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
