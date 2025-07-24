import { Sparkles, Library, ChevronRight } from 'lucide-react';

const RecentUserCollections = ({
  userCollections,
  occasionQuestions,
  setQuestionSet,
  setCurrentQuestion,
  setCurrentQuestionIndex,
  setCurrentView,
  setCaptureMode,
  resetForm
}) => {
  const recentCollections = [...userCollections]
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, 2);

  const handleCollectionClick = (collection) => {
    let occasionType = 'custom';
    if (collection.name.includes('Birthday')) occasionType = 'milestone-birthday';
    if (collection.name.includes('Graduation')) occasionType = 'graduation';
    if (collection.name.includes('Wedding')) occasionType = 'wedding';

    const questions = occasionQuestions[occasionType] || [
      `What do you want to add to "${collection.name}"?`,
      `What makes this collection special?`,
      `What would you like to remember about ${collection.personName}?`
    ];

    setQuestionSet(questions);
    setCurrentQuestion(questions[0] || '');
    setCurrentQuestionIndex(0);
    resetForm();
    setCurrentView('capture');
    setCaptureMode('collection');
  };

  const handleViewAll = () => {
    setCurrentView('library');
  };

  if (recentCollections.length === 0) {
    return null;
  }

  return (
    <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-6 text-white mb-6 shadow-lg relative">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Library size={20} className="mr-2 text-white/90" />
          <h3 className="font-semibold text-white drop-shadow-md">Recent Collections</h3>
        </div>
        <button
          onClick={handleViewAll}
          className="text-purple-100 hover:text-white text-sm flex items-center transition-colors"
        >
          View All
          <ChevronRight size={16} className="ml-1" />
        </button>
      </div>
      <div className="space-y-3">
        {recentCollections.map(collection => (
          <button
            key={collection.id}
            onClick={() => handleCollectionClick(collection)}
            className="w-full bg-white/10 hover:bg-white/20 rounded-xl p-4 backdrop-blur-sm transition-all text-left"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{collection.name}</p>
                <p className="text-purple-100 text-sm">For {collection.personName}</p>
              </div>
              <div className="flex items-center text-purple-100">
                <Sparkles size={16} className="mr-1" />
                <span className="text-sm">Add to</span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default RecentUserCollections;
