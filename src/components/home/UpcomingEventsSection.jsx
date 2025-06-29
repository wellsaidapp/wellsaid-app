import { Sparkles, Calendar } from 'lucide-react';

const UpcomingEventsSection = ({
  events,
  occasionQuestions,
  setQuestionSet,
  setCurrentQuestion,
  setCurrentQuestionIndex,
  setCurrentView,
  setCaptureMode,
  resetForm
}) => {
  const handleEventClick = (event) => {
    let occasionType = 'milestone';
    if (event.name.includes('Birthday')) occasionType = 'milestone-birthday';
    if (event.name.includes('Graduation')) occasionType = 'graduation';
    if (event.name.includes('Wedding')) occasionType = 'wedding';

    const questions = occasionQuestions[occasionType] || [
      `What do you want to share about ${event.name}?`,
      `What makes ${event.name} special?`,
      `What advice would you give about ${event.name}?`
    ];

    setQuestionSet(questions);
    setCurrentQuestion(questions[0] || '');
    setCurrentQuestionIndex(0);
    resetForm();
    setCurrentView('capture');
    setCaptureMode('milestone');
  };

  return (
    <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-6 text-white mb-6 shadow-lg">
      <div className="flex items-center mb-4">
        <Calendar size={20} className="mr-2 text-white/90" />
        <h3 className="font-semibold text-white drop-shadow-md">Upcoming Occasions</h3>
      </div>
      <div className="space-y-3">
        {events.slice(0, 2).map(event => (
          <button
            key={event.id}
            onClick={() => handleEventClick(event)}
            className="w-full bg-white/10 hover:bg-white/20 rounded-xl p-4 backdrop-blur-sm transition-all text-left"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{event.name}</p>
                <p className="text-purple-100 text-sm">{event.daysAway} days away</p>
              </div>
              <div className="flex items-center text-purple-100">
                <Sparkles size={16} className="mr-1" />
                <span className="text-sm">Prepare</span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default UpcomingEventsSection;
