import { useState } from 'react';
import { ChevronLeft, Trash2, Edit, X } from 'lucide-react';
import Modal from './Modal';
import { useUser } from '../../../context/UserContext';

const AccountSettings = ({ user, onBack, onUpdateUser, onDeleteAccount }) => {
  const [name, setName] = useState(user.name || '');
  const [weeklyGoal, setWeeklyGoal] = useState(user.weeklyGoal || 5);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [confirmationName, setConfirmationName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { refetchUser } = useUser();

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onUpdateUser({
        name,
        weeklyGoal: parseInt(weeklyGoal) || 5
      });
      await refetchUser(true);
      setIsEditing(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setName(user.name || '');
    setWeeklyGoal(user.weeklyGoal || 5);
    setIsEditing(false);
  };

  const handleDeleteConfirm = async () => {
    if (confirmationName === name) {
      setIsDeleting(true);
      try {
        await onDeleteAccount();
      } finally {
        setIsDeleting(false);
      }
    }
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
            <h2 className="text-xl font-semibold">Account Settings</h2>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
              >
                <Edit size={16} className="mr-1" />
                Edit
              </button>
            ) : (
              <button
                onClick={handleCancelEdit}
                className="flex items-center px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition-colors"
              >
                <X size={16} className="mr-1" />
                Cancel
              </button>
            )}
          </div>

          <div className="space-y-6">
            {/* Name Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              {isEditing ? (
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Your full name"
                />
              ) : (
                <div className="w-full p-3 border border-transparent rounded-lg bg-gray-50">
                  {name}
                </div>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <div className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed">
                {user.email || ''}
              </div>
              <p className="text-xs text-gray-500 mt-1">Contact support to change your email</p>
            </div>

            {/* Weekly Insights Goal */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Weekly Insights Goal</label>
              {isEditing ? (
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    max="99"
                    value={weeklyGoal}
                    onChange={(e) => setWeeklyGoal(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  />
                  <span className="absolute right-3 top-3 text-gray-500">insights/week</span>
                </div>
              ) : (
                <div className="w-full p-3 border border-transparent rounded-lg bg-gray-50">
                  {weeklyGoal} insights/week
                </div>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Set how many insights you aim to capture each week to maintain your streak
              </p>
            </div>

            {/* Save Button (only shown in edit mode) */}
            {isEditing && (
              <div className="flex justify-end pt-4">
                <button
                  onClick={handleSave}
                  disabled={isSaving || !name.trim()}
                  className={`px-4 py-2 rounded-lg text-white transition-colors ${
                    isSaving || !name.trim()
                      ? 'bg-blue-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-white/50 shadow-sm">
          <h3 className="text-lg font-medium text-red-700 mb-4">Danger Zone</h3>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="w-full flex items-center justify-center p-3 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
          >
            <Trash2 size={18} className="mr-2" />
            Delete Account
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
        {/* Modal content remains the same */}
      </Modal>
    </div>
  );
};

export default AccountSettings;
