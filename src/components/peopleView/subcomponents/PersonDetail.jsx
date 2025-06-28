import { ChevronLeft } from 'lucide-react';
import InsightCard from './InsightCard';

const PersonDetail = ({ person, insights, collections, onBack }) => {
  const personInsights = insights.filter(i =>
    i.recipients?.includes(person.id)
  );

  const personCollections = collections.filter(c =>
    c.recipient === person.name
  );

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-white/50 shadow-sm">
      {/* Header with Back Button */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={onBack}
          className="text-blue-600 flex items-center gap-1"
        >
          <ChevronLeft size={16} />
          Back
        </button>
        <div className="w-6"></div> {/* Spacer for balance */}
      </div>

      {/* Centered Avatar Section */}
      <div className="flex flex-col items-center mb-6">
        <div className={`w-20 h-20 rounded-full ${person.color} flex items-center justify-center mb-3`}>
          <span className="text-white text-2xl font-medium">{person.avatar}</span>
        </div>
        <div className="text-center">
          <p className="text-gray-800 font-medium">{person.name}</p>
        </div>
      </div>

      {/* Stats Cards - Now centered below the avatar text */}
      <div className="grid grid-cols-3 gap-2 text-center mb-6">
        <StatCard value={personInsights.length} label="Insights" color="blue" />
        <StatCard value={personCollections.length} label="Books" color="green" />
        <StatCard
          value={new Date().toLocaleDateString()}
          label="Last shared"
          color="purple"
        />
      </div>

      {/* Recent Insights Section */}
      <h3 className="font-medium text-gray-800 mb-3">Recent Insights</h3>
      <div className="space-y-3 mb-4">
        {personInsights.slice(0, 3).map(insight => (
          <InsightCard key={insight.id} insight={insight} />
        ))}
      </div>

      {/* Action Button */}
      <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors">
        Share New Insight
      </button>
    </div>
  );
};

// StatCard component remains the same
const StatCard = ({ value, label, color }) => (
  <div className={`bg-${color}-50 rounded-lg p-3`}>
    <div className={`font-bold text-${color}-600`}>{value}</div>
    <div className="text-xs text-gray-600">{label}</div>
  </div>
);

export default PersonDetail;
