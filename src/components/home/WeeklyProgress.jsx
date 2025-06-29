import { Zap, Trophy } from 'lucide-react';

const WeeklyProgress = ({ weekInsights, weeklyGoal, userStreak }) => {
  const progressPercent = (weekInsights / weeklyGoal) * 100;

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 mb-6 shadow-sm border border-white/50">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Weekly Progress</h3>
        <div className="flex items-center text-orange-500 bg-orange-50 px-3 py-1 rounded-full">
          <Zap size={16} className="mr-1" />
          <span className="font-bold text-sm">{userStreak} week streak!</span>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>{weekInsights} of {weeklyGoal} insights shared this week</span>
          <span>{Math.round(progressPercent)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${Math.min(progressPercent, 100)}%` }}
          ></div>
        </div>
      </div>

      {weekInsights >= weeklyGoal ? (
        <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
          <Trophy className="text-blue-500 mx-auto mb-2" size={24} />
          <p className="text-blue-700 font-medium">Weekly goal achieved! Streak continues!</p>
        </div>
      ) : (
        <p className="text-gray-600 text-center">
          {weeklyGoal - weekInsights} more insight{weeklyGoal - weekInsights !== 1 ? 's' : ''} to maintain your streak
        </p>
      )}
    </div>
  );
};

export default WeeklyProgress;
