import PropTypes from 'prop-types';
import { ChevronRight } from 'lucide-react';

const ProfileMenuItem = ({
  icon,
  label,
  onClick,
  showChevron = true,
  className = ''
}) => {
  return (
    <button
      onClick={onClick}
      className={`w-full bg-white/80 backdrop-blur-sm rounded-xl p-4 flex items-center justify-between border border-white/50 shadow-sm hover:bg-gray-50 transition-colors ${className}`}
    >
      <div className="flex items-center">
        <span className="text-gray-600 mr-3">{icon}</span>
        <span className="text-gray-800">{label}</span>
      </div>
      {showChevron && (
        <ChevronRight
          size={20}
          className="text-gray-400"
          aria-hidden="true"
        />
      )}
    </button>
  );
};

ProfileMenuItem.propTypes = {
  icon: PropTypes.node.isRequired,
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  showChevron: PropTypes.bool,
  className: PropTypes.string
};

export default ProfileMenuItem;
