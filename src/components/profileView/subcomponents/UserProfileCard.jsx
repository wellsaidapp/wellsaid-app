import PropTypes from 'prop-types';

const UserProfileCard = ({
  user,
  insightsCount,
  peopleCount,
  booksCount,
  className = '',
  avatarInitial = null,
  joinDate = 'June 2025' // Default value
}) => {
  // Use provided initial or first letter of name
  const initial = avatarInitial || user?.name?.charAt(0) || 'U';

  return (
    <div className={`bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-white/50 text-center ${className}`}>
      {/* Avatar Circle */}
      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
        <span className="text-white text-xl font-bold">{initial}</span>
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
