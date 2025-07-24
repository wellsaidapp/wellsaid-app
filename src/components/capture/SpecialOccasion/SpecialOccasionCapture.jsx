// Imports
import React, { useState, useEffect, useRef } from 'react';
import { User, Check, Plus, Mic, Send, Home, PlusCircle, Library, MicOff, ChevronDown, ChevronUp } from 'lucide-react';
import WellSaidIcon from '../../../assets/icons/WellSaidIcon';
import { useSystemCollections } from '../../../context/SystemCollectionsContext';

const SpecialOccasionCapture = ({ setCurrentView, occasionData = {}, onComplete }) => {
    const { systemCollections } = useSystemCollections();
    console.log("System Collections:", systemCollections);
    const [showContext, setShowContext] = useState(false);
    const [collectionName, setCollectionName] = useState('');
    const [hasAskedForName, setHasAskedForName] = useState(false);

    const [occasion, setOccasion] = useState(() => ({
      person: occasionData.person || null,
      collections: occasionData.collections || [],
      type: '',
      date: '',
      reflections: [],
      currentQuestionIndex: 0,
      questions: [],
      finalMessage: ''
    }));

    const initialized = useRef(false);

    useEffect(() => {
      if (!initialized.current && occasion.person && occasion.collections?.length > 0) {
        initialized.current = true;
        setHasAskedForName(true);
        typeMessage("What do you want to name this collection?", true);
      }
    }, [occasion.person, occasion.collections]);

    const [messages, setMessages] = useState([]);
    const [currentInput, setCurrentInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [conversationState, setConversationState] = useState('init');
    const messagesEndRef = useRef(null);
    const [showPeopleSelection, setShowPeopleSelection] = useState(false);
    const [showOccasionConfirmation, setShowOccasionConfirmation] = useState(false);


    const typeMessage = (text, isBot = true, delay = 1000) => {
      setIsTyping(true);
      setTimeout(() => {
        setMessages(prev => [...prev, { text, isBot, timestamp: Date.now() }]);
        setIsTyping(false);
        scrollToBottom();
      }, delay);
    };

    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleMilestoneComplete = (input) => {
        const normalizedInput = input.toLowerCase().trim();

        if (normalizedInput.includes('save') || normalizedInput.includes('keep')) {
            // In a real app, you would save to database here
            typeMessage("Your reflection has been saved to your library!", true);
            typeMessage("You can find it in your Milestones collection.", true, 1000);
            setTimeout(() => setCurrentView('home'), 2000);
        }
        else if (normalizedInput.includes('share')) {
            // In a real app, you would implement sharing logic here
            typeMessage("Ready to share this meaningful reflection!", true);
            typeMessage("Would you like to send it via message, email, or create a shareable link?", true, 1500);
            setConversationState('milestone_sharing');
        }
        else if (normalizedInput.includes('edit')) {
            setConversationState('milestone_editing');
            typeMessage("Let's edit your reflection. What would you like to change?", true);
            typeMessage("You can edit: 1) Occasion details 2) Reflections 3) Final message", true, 1500);
        }
        else {
            typeMessage("I didn't quite catch that. Please choose 'save', 'share', or 'edit'.", true);
        }
    };

    const handleMilestoneEditing = (input) => {
        // Handle editing flow
        if (input.includes('1') || input.includes('details')) {
            setConversationState('milestone_confirm');
            typeMessage("Let's update the occasion details. What should we change?", true);
        }
        else if (input.includes('2') || input.includes('reflect')) {
            setConversationState('milestone_editing_reflections');
            showReflectionsForEditing();
        }
        else if (input.includes('3') || input.includes('message')) {
            setConversationState('milestone_editing_message');
            typeMessage("What would you like your final message to say instead?", true);
        }
    };

    const handleSpecialOccasionResponse = (input) => {
      const entry = {
        text: input,
        author: 'user',
        date: new Date().toISOString(),
        collection: 'milestone',
        occasionDetails: occasion,
      };

      // Wrap up and return to neutral state
      typeMessage(`Got it — your message for ${occasion.person.name} has been saved.`, true);
      setConversationState('confirming');
      typeMessage(`Thanks for sharing that — it's been added to your collection.`, true);

      // Give it a moment before transitioning
      setTimeout(() => {
        setCurrentView('home');
      }, 4000);
    };


    const beginGuidedReflection = () => {
        const questions = occasionTypes[occasion.type]?.questions || [
            "What makes this occasion special?",
            "What's your favorite memory with this person?",
            "What hopes do you have for them in this next chapter?"
        ];

        setOccasion(prev => ({
            ...prev,
            currentQuestionIndex: 0,
            questions
        }));

        typeMessage("Of course. Let's start here:", true);
        typeMessage(questions[0], true, 1000);
    };

    const handleGuidedReflectionResponse = (input) => {
        const { currentQuestionIndex, questions } = occasion;

        // Save reflection
        setOccasion(prev => ({
            ...prev,
            reflections: [
                ...prev.reflections,
                {
                    question: questions[currentQuestionIndex],
                    answer: input
                }
            ]
        }));

        // Check if we have more questions
        if (currentQuestionIndex < questions.length - 1) {
            setOccasion(prev => ({
                ...prev,
                currentQuestionIndex: currentQuestionIndex + 1
            }));
            typeMessage(questions[currentQuestionIndex + 1], true, 1500);
        } else {
            setConversationState('milestone_summary');
            generateSummary();
        }
    };

    const generateSummary = () => {
        const { person, reflections } = occasion;
        const themes = extractThemes(reflections);

        setConversationState('milestone_summary');

        typeMessage("Here's what we've gathered so far:", true);
        typeMessage(`• Occasion: ${person.name}'s ${occasionTypes[occasion.type]?.name || 'Special Event'}`, true, 500);
        typeMessage(`• Relationship: ${person.relationship}`, true, 500);
        typeMessage(`• Themes: ${themes.join(', ')}`, true, 500);

        // Show one example reflection
        if (reflections.length > 0) {
            typeMessage(`• Reflection: "${reflections[0].answer.substring(0, 50)}${reflections[0].answer.length > 50 ? '...' : ''}"`, true, 500);
        }

        typeMessage("Would you like to add a final message or wrap up?", true, 1000);
    };

    const handleInputSubmit = () => {
      if (!currentInput.trim()) return;

      const input = currentInput.trim();

      // Handle collection name input first
      if (!occasion.collectionName && occasion.collections?.length > 0) {
        setCollectionName(input);
        setOccasion(prev => ({
          ...prev,
          collectionName: input
        }));
        setMessages(prev => [...prev, { text: input, isBot: false }]);
        setCurrentInput('');

        // Then proceed with normal flow
        typeMessage(`Creating "${input}" for ${occasion.person.name}`, true);

        // Move to occasion type selection
        setConversationState('milestone_type');
        return;
      }

      setMessages(prev => [...prev, { text: input, isBot: false }]);
      setCurrentInput('');
      scrollToBottom();

      // Person management states
      if (conversationState === 'milestone_type') {
          handleOccasionTypeSelection(input);
      }
      else if (conversationState === 'milestone_date') {
          handleOccasionDateSelection(input);
      }
      else if (conversationState === 'occasion_confirmation') {
          handleOccasionConfirmation(input);
      }
      else if (conversationState === 'milestone_complete') {
          handleMilestoneComplete(input);
      }
      else if (conversationState === 'milestone_sharing') {
          handleMilestoneSharing(input);
      }
      else if (conversationState === 'milestone_editing') {
          handleMilestoneEditing(input);
      }
      else if (conversationState === 'milestone_summary') {
          handleMilestoneSummary(input);
      }
      else if (conversationState === 'milestone_freeform') {
          handleMilestoneFreeform(input);
      }
      else if (conversationState === 'milestone_init') {
          handleMilestoneInit(input);
      } else if (conversationState === 'milestone_confirm') {
          handleMilestoneConfirm(input);
      } else if (conversationState === 'milestone_relationship') {
          handleMilestoneRelationship(input);
      } else if (conversationState === 'milestone_theme') {
          handleMilestoneTheme(input);
      } else if (conversationState === 'milestone_guided') {
          handleGuidedReflectionResponse(input);
      }
      else if (conversationState === 'special_occasion_active') {
          handleSpecialOccasionResponse(input);
      }
    };

    const startOccasionFlow = (occasion) => {
      if (!occasion?.person?.name || !occasion?.type) return;

      // Step 1: Friendly intro
      typeMessage(`Thanks! Let's start capturing something meaningful for ${occasion.person.name}.`, true);

      // Step 2: Occasion-specific question
      const promptByOccasionType = {
        wedding: `What advice or wisdom would you want ${occasion.person.name} to carry with them into marriage?`,
        birthday: `What do you appreciate most about ${occasion.person.name} at this stage in life?`,
        graduation: `What do you hope ${occasion.person.name} remembers as they begin this next chapter?`,
        anniversary: `What memories stand out to you from the journey with ${occasion.person.name}?`,
        birth: `What values or truths do you hope will shape ${occasion.person.name} as they grow up?`,
        other: `What insight or reflection do you want to share with ${occasion.person.name} during this milestone?`
      };

      const nextPrompt = promptByOccasionType[occasion.type] || promptByOccasionType.other;
      typeMessage(nextPrompt, true);

      // Step 3: Set conversation state
      setConversationState('special_occasion_active');
      setShowOccasionConfirmation(false);
      setShowPeopleSelection(false);
    };

    const handleConfirmation = () => {
      if (!occasion?.person?.name || !occasion?.type) return;

      const promptByOccasionType = {
        wedding: `What advice or wisdom would you want ${occasion.person.name} to carry with them into marriage?`,
        birthday: `What do you appreciate most about ${occasion.person.name} at this stage in life?`,
        graduation: `What do you hope ${occasion.person.name} remembers as they begin this next chapter?`,
        anniversary: `What memories stand out to you from the journey with ${occasion.person.name}?`,
        birth: `What values or truths do you hope will shape ${occasion.person.name} as they grow up?`,
        other: `What insight or reflection do you want to share with ${occasion.person.name} during this milestone?`
      };

      const occasionLabel = promptByOccasionType[occasion.type] ? occasion.type : 'other';
      const followUpPrompt = promptByOccasionType[occasionLabel];

      setShowOccasionConfirmation(false);
      setConversationState('special_occasion_active');
      typeMessage(`Thanks! Let's start capturing something meaningful for ${occasion.person.name}.`, true);
      typeMessage(followUpPrompt, true);

      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    };

    const toggleRecording = () => {
      setIsRecording(!isRecording);
      if (!isRecording) {
        setTimeout(() => {
          setCurrentInput("This would be transcribed speech...");
          setIsRecording(false);
        }, 3000);
      }
    };

    return (
      <div className="fixed inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 overflow-y-auto">
        {/* Main content area */}
        <div className="max-w-2xl mx-auto min-h-screen flex flex-col">
          {/* Header */}
          <div className="p-4 pt-6">
            <div className="flex items-center gap-3">
              <WellSaidIcon size={50} />
              <div>
                <h1 className="text-xl font-bold">Capture Wisdom</h1>
                <p className="text-sm text-gray-500">Special Occasion</p>
              </div>
            </div>
          </div>

          {/* Context Container */}
          <div className="px-4 pt-2">
            <div className="bg-white rounded-2xl shadow-lg p-4 mb-4">
              <button
                onClick={() => setShowContext(!showContext)}
                className="w-full flex justify-between items-center"
              >
                <h3 className="font-semibold text-gray-800">Context</h3>
                {showContext ? (
                  <ChevronUp className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                )}
              </button>

              {showContext && (
                <div className="mt-3">
                  {/* Person chip */}
                  {occasion.person && (
                    <div className="inline-flex items-center bg-blue-100 text-blue-800 rounded-full px-3 py-1 mr-2 mb-2">
                      <User className="w-4 h-4 mr-1" />
                      <span>{occasion.person.name}</span>
                    </div>
                  )}

                  {/* Collection chips with actual names and colors */}
                  {occasion.collections?.map((collectionId) => {
                    const collection = systemCollections.find(c => c.id === collectionId);
                    if (!collection) return null;

                    return (
                      <div
                        key={collectionId}
                        className={`inline-flex items-center ${collection.color} text-white rounded-full px-3 py-1 mr-2 mb-2`}
                      >
                        <span>{collection.name}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Messages container */}
          <div className="flex-1 overflow-y-auto pb-[136px] px-4">
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-4">
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div key={index} className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}>
                    <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                      message.isBot ? 'bg-gray-100 text-gray-800' : 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white'
                    }`}>
                      {message.text}
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 px-4 py-2 rounded-2xl">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area - Fixed positioning */}
        {conversationState !== 'milestone_init' && (
          <div className="fixed bottom-[72px] left-0 right-0 px-4 z-20">
            <div className="max-w-2xl mx-auto">
              <div className="bg-white rounded-xl shadow-md p-3">
                <div className="flex gap-2 items-end">
                  <div className="flex-1">
                    <textarea
                      value={currentInput}
                      onChange={(e) => setCurrentInput(e.target.value)}
                      className="w-full p-2 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 resize-none"
                      rows={2}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleInputSubmit();
                        }
                      }}
                    />
                  </div>
                  <button
                    onClick={toggleRecording}
                    className={`p-3 rounded-xl transition-colors ${
                      isRecording ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                  </button>
                  <button
                    onClick={handleInputSubmit}
                    disabled={!currentInput.trim()}
                    className={`p-3 rounded-xl transition-colors ${
                      currentInput.trim()
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
};

export default SpecialOccasionCapture;
