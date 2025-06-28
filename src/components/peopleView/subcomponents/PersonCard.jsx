import { ChevronRight } from 'lucide-react';

const PersonCard = ({ person, insights, onClick }) => {
  const sharedInsightsCount = insights.filter(i =>
    i.recipients?.includes(person.id)
  ).length;

  return (
    <div
      onClick={onClick}
      className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
    >
      <div className="flex items-center">
        <div className={`w-10 h-10 rounded-full ${person.color} flex items-center justify-center mr-3`}>
          <span className="text-white text-sm font-medium">{person.avatar}</span>
        </div>
        <div>
          <div className="font-medium text-gray-800">{person.name}</div>
          <div className="text-xs text-gray-500">
            {sharedInsightsCount} insights shared
          </div>
        </div>
      </div>
      <ChevronRight className="text-gray-400" />
    </div>
  );
};

export default PersonCard;
