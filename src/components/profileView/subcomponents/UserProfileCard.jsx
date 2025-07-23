import PropTypes from 'prop-types';
import { Camera } from 'lucide-react'; // Add this import

const UserProfileCard = ({
  user,
  insightsCount,
  peopleCount,
  booksCount,
  className = '',
  avatarInitial = null,
  joinDate = 'June 2025',
  onAvatarUpload,
  croppedAvatarImage
}) => {

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && onAvatarUpload) {
      const reader = new FileReader();
      reader.onload = (event) => {
        onAvatarUpload(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className={`bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-white/50 text-center ${className}`}>
      {/* Avatar Circle - Modified to support image */}
      <div className="relative w-20 h-20 mx-auto mb-3">
        {croppedAvatarImage || user?.avatarImage ? (
          <img
            src={croppedAvatarImage || user.avatarImage}
            className="w-full h-full rounded-full object-cover border-2 border-white shadow"
            alt="User avatar"
            onError={() => console.error("❌ Failed to load avatar image:", user.avatarImage)}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white text-xl font-bold">{initial}</span>
          </div>
        )}

        {/* Updated camera button to match PeopleView style */}
        <button
          className="absolute bottom-0 right-0 bg-white p-1 rounded-full shadow-sm hover:bg-gray-100 transition-colors"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            document.getElementById('avatar-upload-input').click();
          }}
        >
          <Camera className="w-4 h-4 text-gray-600" />
        </button>
        <input
          id="avatar-upload-input"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageUpload}
        />
      </div>

      {/* User Info */}
      <div className="font-semibold text-gray-800 truncate px-2">
        {user?.name || 'User Name'}
      </div>
      <div className="text-sm text-gray-500 mb-4">
        Member since {joinDate}
      </div>

      {/* Stats Row */}
      <div className="flex justify-around pt-4 border-t border-gray-100">
        <StatItem value={insightsCount} label="Insights" />
        <StatItem value={peopleCount} label="People" />
        <StatItem value={booksCount} label="Books" />
      </div>
    </div>
  );
};

// Sub-component for stats
const StatItem = ({ value, label }) => (
  <div className="text-center">
    <div className="font-bold text-gray-800">{value || 0}</div>
    <div className="text-xs text-gray-500">{label}</div>
  </div>
);

UserProfileCard.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string.isRequired,
    // Add other user properties as needed
  }).isRequired,
  insightsCount: PropTypes.number,
  peopleCount: PropTypes.number,
  booksCount: PropTypes.number,
  className: PropTypes.string,
  avatarInitial: PropTypes.string,
  joinDate: PropTypes.string
};

StatItem.propTypes = {
  value: PropTypes.number,
  label: PropTypes.string.isRequired
};

export default UserProfileCard;
