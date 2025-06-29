const LegacyStats = ({ insightsCount, individualsCount, collectionsCount }) => (
  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-white/50 mb-6">
    <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Legacy Stats</h3>
    <div className="grid grid-cols-3 gap-4 text-center">
      <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
        <div className="text-2xl font-bold text-blue-600">{insightsCount}</div>
        <div className="text-sm text-gray-600">Insights</div>
      </div>
      <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
        <div className="text-2xl font-bold text-blue-600">{individualsCount}</div>
        <div className="text-sm text-gray-600">People</div>
      </div>
      <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
        <div className="text-2xl font-bold text-blue-600">{collectionsCount}</div>
        <div className="text-sm text-gray-600">Books</div>
      </div>
    </div>
  </div>
);

export default LegacyStats;
