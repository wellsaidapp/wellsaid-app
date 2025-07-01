import { ChevronRight } from 'lucide-react';

const PersonCard = ({ person, insights, onClick }) => {
  const sharedInsightsCount = insights.filter(i =>
    i.recipients?.includes(person.id)
  ).length;

  const totalInsights = insights.length;
  const insightPercentage = totalInsights
    ? Math.round((sharedInsightsCount / totalInsights) * 100)
    : 0;

  const activeCollections = person.activeCollectionsCount ?? 0;
  const totalCollections = person.totalCollectionsCount ?? 1;
  const collectionPercentage = Math.round((activeCollections / totalCollections) * 100);

  return (
    <div
      onClick={onClick}
      className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
    >
      <div className="flex items-center">
        <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
          {person.avatarImage ? (
            <img
              src={person.avatarImage}
              alt="Avatar"
              className="w-10 h-10 object-cover rounded-full"
            />
          ) : (
            <div className={`w-10 h-10 rounded-full ${person.color} flex items-center justify-center`}>
              <span className="text-white text-sm font-medium">{person.avatar}</span>
            </div>
          )}
        </div>

        <div>
          <div className="font-medium text-gray-800">{person.name}</div>

          {/* Insight Progress Bar */}
          <div className="w-32 h-1.5 bg-gray-200 rounded-full mt-1 overflow-hidden">
            <div
              className="h-full bg-blue-500"
              style={{ width: `${insightPercentage}%` }}
            />
          </div>

          {/* Collection Progress Bar */}
          <div className="w-32 h-1.5 bg-gray-200 rounded-full mt-1 overflow-hidden">
            <div
              className="h-full bg-indigo-400"
              style={{ width: `${collectionPercentage}%` }}
            />
          </div>
        </div>
      </div>
      <ChevronRight className="text-gray-400" />
    </div>
  );
};

export default PersonCard;
