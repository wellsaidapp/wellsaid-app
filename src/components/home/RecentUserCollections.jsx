import { Sparkles, Library, ChevronRight } from 'lucide-react';
import { usePeople } from '../../context/PeopleContext';

const RecentUserCollections = ({
  userCollections,
  setQuestionSet,
  setCurrentQuestion,
  setCurrentQuestionIndex,
  setCurrentView,
  setCaptureMode,
  resetForm,
  setSpecialOccasionData
}) => {
  const { people } = usePeople();
  const recentCollections = [...userCollections]
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, 2);
  // console.log("Recent Collections:", recentCollections);
  const handleCollectionClick = (collection) => {

    const person = people.find(p => p.id === collection.personId);
    const questions = [
      "Alright, let's get back to it.", // <- Placeholder question for returning collection
      `What makes this collection special?`,
      `What would you like to remember about ${collection.personName}?`
    ];

    // 🚀 Hydrate context for SpecialOccasionCapture
    setQuestionSet(questions);
    setCurrentQuestion(questions[0] || '');
    setCurrentQuestionIndex(0);
    resetForm();

    // 🧠 Preload occasion context (assuming this sets the occasion state in parent):
    setCaptureMode('milestone');
    setCurrentView('capture');
    setSpecialOccasionData({
      person: {
        id: collection.personId,
        name: collection.personName,
        relationship: person?.relationship || 'Unspecified',
      },
      userCollectionId: collection.id,
      userCollectionName: collection.name,
      collections: collection.systemCollectionIds || [], // ✅ Might be empty array if not defined
      type: 'custom',
      questions,
      isReturning: true,
      currentQuestionIndex: 0,
      reflections: [],
      finalMessage: ''
    });
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
