// Imports
import React, { useState, useEffect, useRef } from 'react';
import { User, Check, Plus, Mic, Send, Home, PlusCircle, Library, MicOff, ChevronDown, ChevronUp, Save, Sparkles } from 'lucide-react';
import WellSaidIcon from '../../../assets/icons/WellSaidIcon';
import { useSystemCollections } from '../../../context/SystemCollectionsContext';
import { fetchAuthSession } from 'aws-amplify/auth';
import toast from 'react-hot-toast';
import ToastMessage from '../../library/BookCreation/ToastMessage';

const SpecialOccasionCapture = ({ setCurrentView, occasionData = {}, onComplete }) => {
    const { systemCollections } = useSystemCollections();
    const [showContext, setShowContext] = useState(false);
    const [collectionName, setCollectionName] = useState('');
    const [hasAskedForName, setHasAskedForName] = useState(false);
    console.log("Occasion Data:", occasionData);
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
    const [collectionCreated, setCollectionCreated] = useState(false);
    const initialized = useRef(false);

    const contextSummary = `This collection was created to capture meaningful reflections, stories, and wisdom for a special occasion.`;
    const [trackBotPrompts, setTrackBotPrompts] = useState(false);
    const [insightPromptCount, setInsightPromptCount] = useState(0);

    const [botPromptCount, setBotPromptCount] = useState(0);
    const [showInsightModal, setShowInsightModal] = useState(false);
    const [draftPrompt, setDraftPrompt] = useState('');
    const [draftResponse, setDraftResponse] = useState('');
    useEffect(() => {
      if (!initialized.current && occasion.person) {
        initialized.current = true;

        if (occasionData.isReturning) {
          setHasAskedForName(true); // ✅ Prevent collection name prompt
          setOccasion((prev) => ({
            ...prev,
            collectionName: occasionData.collectionName || 'Untitled'
          }));
          typeMessage("Alright, let's get back to it.", true); // 👈 Use your placeholder question here
          setConversationState('milestone_type'); // Or jump to next state directly
        } else {
          setHasAskedForName(true);
          typeMessage("What do you want to name this collection?", true);
        }
      }
    }, [occasion.person, occasion.collections, occasionData.isReturning]);

    const [messages, setMessages] = useState([]);
    const [currentInput, setCurrentInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [conversationState, setConversationState] = useState('init');
    const messagesEndRef = useRef(null);
    const [showPeopleSelection, setShowPeopleSelection] = useState(false);
    const [showOccasionConfirmation, setShowOccasionConfirmation] = useState(false);

    const createUserCollection = async (collectionName, person, systemCollectionIds = []) => {
      try {
        const session = await fetchAuthSession();
        const token = session.tokens?.idToken?.toString();

        if (!token) throw new Error("Missing auth token");

        const response = await fetch("https://aqaahphwfj.execute-api.us-east-2.amazonaws.com/dev/collections/user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify({
            name: collectionName,
            personId: person.id,
            personName: person.name,
            systemCollectionIds,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error("❌ Failed to create collection:", errorData);
          throw new Error(errorData.error || "Unknown error creating collection");
        }

        const result = await response.json();
        console.log("✅ Collection created:", result);
        return result.collectionId;

      } catch (err) {
        console.error("❌ Error in createUserCollection:", err);
        return null;
      }
    };

    const typeMessage = (text, isBot = true, delay = 1000) => {
      setIsTyping(true);
      setTimeout(() => {
        setMessages((prev) => {
          const newMessages = [...prev, { text, isBot, timestamp: Date.now() }];

          // 🧠 Start counting only after collection is created and tracking is enabled
          if (isBot && trackBotPrompts && !text.startsWith("Creating") && !text.includes("What do you want to name")) {
            setInsightPromptCount((count) => count + 1);
          }

          return newMessages;
        });

        setIsTyping(false);
        scrollToBottom();
      }, delay);
    };

    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleCardSave = () => {
      setInsightPromptCount(0); // 🧹 Reset after card save
    };

    const handleInputSubmit = async () => {
      if (!currentInput.trim()) return;

      const input = currentInput.trim();

      // 👣 First step: handle collection name
      if (!occasion.collectionName) {
        setCollectionName(input);
        setOccasion(prev => ({
          ...prev,
          collectionName: input
        }));
        setMessages(prev => [...prev, { text: input, isBot: false }]);
        setCurrentInput('');

        typeMessage(`Creating "${input}" for ${occasion.person.name}`, true);

        // 📦 Create the collection in RDS
        const createdId = await createUserCollection(input, occasion.person, occasion.collections);
        if (createdId) {
          console.log("📦 Stored collectionId:", createdId);
          setOccasion(prev => ({
            ...prev,
            userCollectionId: createdId
          }));
          setTrackBotPrompts(true);
          setCollectionCreated(true);
          toast.custom((t) => (
            <ToastMessage
              type="success"
              title="Collection Created"
              message="Your special occasion collection was saved."
              onDismiss={() => toast.dismiss(t.id)}
            />
          ), {
            duration: 5000
          });

          // 🎯 Differentiate paths
          if (!occasionData.isReturning) {
            // 🧠 NEW COLLECTION: Inject AI-assisted starter question
            const collectionNames = occasion.collections
              .map((id) => systemCollections.find((c) => c.id === id)?.name)
              .filter(Boolean)
              .join(', ');

            const contextString = `${occasion.person.name} (${occasion.person.relationship}) — focus on: ${collectionNames}`;
            typeMessage(`Let's begin. Thinking about ${contextString}, what's something you'd want them to always remember?`, true);

            // Optional: store this in a system prompt or use it to kick off a Lambda call
            setConversationState('chatting');
          } else {
            // 🔁 RETURNING SESSION: continue conversation
            typeMessage("Welcome back! Let's pick up where we left off.", true);
            setConversationState('chatting');
          }
        }

        return;
      }

      // 🗣 Handle normal chat input
      setMessages(prev => [...prev, { text: input, isBot: false }]);
      setCurrentInput('');
      scrollToBottom();

      // 🤖 Placeholder bot reply (can be replaced with OpenAI call)
      typeMessage("That's a great thought. Want to expand on that?", true);
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

    const shouldShowSparkles = (index) => {
      const botMessages = messages.filter((m) => m.isBot && !m.text.includes("Creating") && !m.text.includes("What do you want to name"));
      const currentMessage = messages[index];

      const eligibleIndex = botMessages.indexOf(currentMessage);
      return eligibleIndex >= 2; // Show after 3rd eligible bot message
    };

    const isThirdBotMessage = (index) => {
      const botMessages = messages.filter((m) => m.isBot);
      return botMessages[2] && messages[index] === botMessages[2];
    };

    const openInsightEditorModal = (triggerMessage) => {
      const priorUserMessage = messages.findLast((m, i) => i < messages.indexOf(triggerMessage) && !m.isBot);
      const prompt = triggerMessage.text;
      const response = priorUserMessage?.text || '';

      setDraftPrompt(prompt);
      setDraftResponse(response);
      setShowInsightModal(true);
    };

    const handleSaveExit = async (userCollectionId, contextSummary) => {
      try {
        const session = await fetchAuthSession();
        const token = session.tokens?.idToken?.toString();
        if (!token) throw new Error("Missing auth token");

        const response = await fetch(
          `https://aqaahphwfj.execute-api.us-east-2.amazonaws.com/dev/collections/user/${userCollectionId}/context`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: token
            },
            body: JSON.stringify({
              userCollectionId,
              context: contextSummary
            })
          }
        );

        if (!response.ok) {
          const error = await response.json();
          console.error("❌ Save Context failed:", error);
          throw new Error(error.message || "Failed to save context");
        }

        const result = await response.json();
        console.log("✅ Context saved:", result);
        return result;

      } catch (err) {
        console.error("💥 Save Exit Error:", err);
        // You can show a toast here
      }
    };

    const handleSaveInsight = async () => {
      if (!draftPrompt.trim() || !draftResponse.trim()) {
        toast.error("Prompt and response are required");
        return;
      }

      if (!occasion?.userCollectionId) {
        toast.error("Missing collection ID");
        return;
      }

      try {
        const session = await fetchAuthSession();
        const token = session.tokens?.idToken?.toString();

        if (!token) throw new Error("No auth token");

        const response = await fetch(
          `https://aqaahphwfj.execute-api.us-east-2.amazonaws.com/dev/collections/user/${occasion.userCollectionId}/insight`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: token,
            },
            body: JSON.stringify({
              prompt: draftPrompt,
              response: draftResponse,
              collectionId: occasion.userCollectionId
            }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          console.error("❌ Insight save failed:", errorData);
          toast.custom((t) => (
            <ToastMessage
              type="error"
              title="Error Saving Insight"
              message={errorData.error || "Unknown error"}
              onDismiss={() => toast.dismiss(t.id)}
            />
          ));
          return;
        }

        const savedInsight = await response.json();
        console.log("✅ Insight saved:", savedInsight);

        // Reset and close modal
        setDraftPrompt('');
        setDraftResponse('');
        setShowInsightModal(false);
        setInsightPromptCount(0);

        toast.custom((t) => (
          <ToastMessage
            type="success"
            title="Insight Saved"
            message="This moment is now part of your collection."
            onDismiss={() => toast.dismiss(t.id)}
          />
        ));

        if (onComplete) onComplete(savedInsight); // optional callback

      } catch (err) {
        console.error("💥 Save Insight error:", err);
        toast.error("Something went wrong saving your insight.");
      }
    };

    return (
      <div className="fixed inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 overflow-y-auto">
        {/* Fixed top header */}
        <div className="fixed top-0 left-0 right-0 bg-gradient-to-br from-blue-50 to-indigo-50 z-20 border-b border-gray-100">
          <div className="max-w-2xl mx-auto px-4 pt-6 pb-2 flex justify-between items-start">
            {/* Header */}
            <div className="flex items-center gap-3">
              <WellSaidIcon size={50} />
              <div>
                <h1 className="text-xl font-bold">Capture Wisdom</h1>
                <p className="text-sm text-gray-500">Special Occasion</p>
              </div>
            </div>
            {(collectionCreated || occasion?.collectionName) && (
              <button
                onClick={async () => {
                  // Only attempt to save if collection exists
                  if (occasion?.userCollectionId) {
                    const contextSummary = `This collection captures thoughts and memories for ${occasion.person?.name || "someone special"}.`;

                    await handleSaveExit(occasion.userCollectionId, contextSummary);
                  }

                  // Then exit
                  setCurrentView('home');
                }}
                className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
              >
                <Save className="w-5 h-5 text-gray-600" />
                <span className="text-gray-700 font-medium">Exit</span>
              </button>
            )}
          </div>

          {/* Context */}
          <div className="max-w-2xl mx-auto px-4 pt-2 pb-3">
            <div className="bg-white rounded-2xl shadow p-4">
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
                  {occasion.person && (
                    <div className="inline-flex items-center bg-blue-100 text-blue-800 rounded-full px-3 py-1 mr-2 mb-2">
                      <User className="w-4 h-4 mr-1" />
                      <span>{occasion.person.name}</span>
                    </div>
                  )}
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
        </div>

        {/* Scrollable message area (no overflow-y-auto here) */}
        <div className="max-w-2xl mx-auto px-4">
          <div className="pt-[160px] pb-[240px]">
            <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
              {messages.map((message, index) => {
                const showSparkles = shouldShowSparkles(index);
                const isLastMessage = index === messages.length - 1;

                return (
                  <div
                    key={index}
                    className={`flex flex-col relative ${message.isBot ? 'items-start' : 'items-end'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                        message.isBot
                          ? 'bg-gray-100 text-gray-800'
                          : 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white'
                      } ${showSparkles ? 'mb-4' : ''}`}
                    >
                      {message.text}
                    </div>

                    {showSparkles && (
                      <div className="-mt-2 ml-1">
                        <button
                          onClick={() => openInsightEditorModal(message)}
                          className="p-2 bg-blue-100 hover:bg-blue-200 rounded-full shadow-sm border border-blue-300 transition"
                          title="Turn this into an Insight Card"
                        >
                          <Sparkles className="w-4 h-4 text-blue-500" />
                        </button>
                      </div>
                    )}

                    {isLastMessage && <div ref={messagesEndRef} className="h-4" />}
                  </div>
                );
              })}

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
        </div>

        {/* Input Area */}
        {conversationState !== 'milestone_init' && (
          <div className="fixed bottom-[60px] left-0 right-0 z-30 bg-white border-t border-gray-100">
            <div className="max-w-2xl mx-auto w-full px-4 py-3">
              <div className="flex gap-2 items-end w-full">
                <div className="flex-1 min-w-0">
                  {!occasion.collectionName ? (
                    <input
                      type="text"
                      value={currentInput}
                      onChange={(e) => setCurrentInput(e.target.value)}
                      placeholder="Enter collection name"
                      className="w-full p-2 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && currentInput.trim()) {
                          e.preventDefault();
                          handleInputSubmit();
                        }
                      }}
                    />
                  ) : (
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
                  )}
                </div>
                {occasion.collectionName || occasion.collections?.length === 0 ? (
                  <>
                    <button
                      onClick={toggleRecording}
                      className={`flex-shrink-0 p-3 rounded-xl transition-colors ${
                        isRecording
                          ? 'bg-red-500 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                    </button>
                    <button
                      onClick={handleInputSubmit}
                      disabled={!currentInput.trim()}
                      className={`flex-shrink-0 p-3 rounded-xl transition-colors ${
                        currentInput.trim()
                          ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600'
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleInputSubmit}
                    disabled={!currentInput.trim()}
                    className={`flex-shrink-0 p-3 rounded-xl transition-colors ${
                      currentInput.trim()
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <Send className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Insight Modal */}
        {showInsightModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl relative z-50">
              <h2 className="text-xl font-bold mb-4">Save Insight</h2>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Prompt</label>
              <input
                type="text"
                value={draftPrompt}
                onChange={(e) => setDraftPrompt(e.target.value)}
                className="w-full p-2 mb-4 border rounded-xl"
                maxLength={255}
              />
              <label className="block text-sm font-semibold text-gray-700 mb-1">Response</label>
              <textarea
                value={draftResponse}
                onChange={(e) => setDraftResponse(e.target.value)}
                className="w-full p-2 mb-4 border rounded-xl resize-none"
                rows={3}
                maxLength={255}
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowInsightModal(false)}
                  className="px-4 py-2 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200"
                >
                  Return
                </button>
                <button
                  onClick={handleSaveInsight}
                  className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
};

export default SpecialOccasionCapture;
