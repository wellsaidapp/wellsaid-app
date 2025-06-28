import { ChevronDown } from 'lucide-react';
import PropTypes from 'prop-types';

const DisclosureAccordion = ({ disclosures, expandedId, onToggle }) => {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-white/50 shadow-sm overflow-hidden">
      <h3 className="p-4 text-gray-800 font-medium border-b border-gray-100">
        Legal Disclosures
      </h3>

      {disclosures.map((disclosure) => (
        <div
          key={disclosure.id}
          className="border-b border-gray-100 last:border-b-0 transition-colors"
        >
          <button
            onClick={() => onToggle(disclosure.id)}
            className="w-full p-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
            aria-expanded={expandedId === disclosure.id}
            aria-controls={`disclosure-${disclosure.id}-content`}
          >
            <div className="flex items-center">
              <span className="mr-3 text-gray-600">
                {disclosure.icon}
              </span>
              <span className="text-gray-800 font-medium">
                {disclosure.title}
              </span>
            </div>
            <ChevronDown
              className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                expandedId === disclosure.id ? 'transform rotate-180' : ''
              }`}
              aria-hidden="true"
            />
          </button>

          {expandedId === disclosure.id && (
            <div
              id={`disclosure-${disclosure.id}-content`}
              className="px-4 pb-4 prose prose-sm text-gray-600 max-w-none"
            >
              {disclosure.content}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

DisclosureAccordion.propTypes = {
  disclosures: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      icon: PropTypes.node.isRequired,
      content: PropTypes.node.isRequired
    })
  ).isRequired,
  expandedId: PropTypes.string,
  onToggle: PropTypes.func.isRequired
};

export default DisclosureAccordion;
