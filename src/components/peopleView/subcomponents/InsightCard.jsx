const InsightCard = ({ insight }) => {
  return (
    <div className="bg-gray-50 rounded-lg p-3">
      <div className="text-sm text-gray-800 line-clamp-2">
        {insight.question && (
          <span className="font-medium">Q: {insight.question}</span>
        )}
        {insight.text && <p>{insight.text}</p>}
      </div>
      <div className="text-xs text-gray-500 mt-1">
        {new Date(insight.date).toLocaleDateString()}
      </div>
    </div>
  );
};

export default InsightCard;
