import { ChevronRight } from 'lucide-react';

const PersonCard = ({ person, insights, onClick }) => {
  // console.log("Person Received:", person);
  console.log(`📇 Rendering PersonCard: ${person.name}`, {
    insightCount: person.insightCount,
    systemCollectionCount: person.systemCollectionCount,
  });
  const sharedInsightsCount = person.insightCount ?? 0;

  const totalInsights = insights.length;
  const insightPercentage = totalInsights
    ? Math.round((sharedInsightsCount / totalInsights) * 100)
    : 0;

  const activeCollections = person.systemCollectionCount ?? 0;
  const totalCollections = person.totalCollectionsCount ?? 1;
  const collectionPercentage = Math.round((activeCollections / totalCollections) * 100);

  return (
    <div
      onClick={onClick}
      className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors border border-gray-100 shadow"
    >
      <div className="flex items-start">
        <div className="w-20 h-20 rounded-full overflow-hidden mr-4 self-center">
          {person.avatarUrl?.toString?.().trim() ? (
            <img
              src={person.avatarUrl}
              alt="Avatar"
              className="w-20 h-20 object-cover rounded-full"
            />
          ) : (
            <div className={`w-20 h-20 rounded-full bg-gray-400 flex items-center justify-center`}>
              <span className="text-white text-2xl font-medium">{person.avatar}</span>
            </div>
          )}
        </div>

        {/* ⬇️ Updated block */}
        <div className="flex flex-col justify-center">
          <div className="font-medium text-gray-800">{person.name}</div>

          <div className="flex items-center text-[10px] text-gray-400 mt-1 mb-0.5">Insights</div>
          <div className="w-32 h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500"
              style={{ width: `${insightPercentage}%` }}
            />
          </div>

          <div className="flex items-center text-[10px] text-gray-400 mt-1 mb-0.5">Collections</div>
          <div className="w-32 h-1.5 bg-gray-200 rounded-full overflow-hidden">
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
