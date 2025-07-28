// Imports
import React, { useState, useEffect, useRef } from 'react';
import { User, Check, Plus, Mic, Send, Home, PlusCircle, Library, MicOff, ChevronDown, ChevronUp, Save, Sparkles, SendIcon, X } from 'lucide-react';
import WellSaidIcon from '../../../assets/icons/WellSaidIcon';
import { useSystemCollections } from '../../../context/SystemCollectionsContext';
import { fetchAuthSession } from 'aws-amplify/auth';
import toast from 'react-hot-toast';
import ToastMessage from '../../library/BookCreation/ToastMessage';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

const callOpenAI = async (userPrompt, systemPrompt, history = []) => {
  try {
    const session = await fetchAuthSession();
    const token = session.tokens?.idToken?.toString();

    const response = await fetch('https://aqaahphwfj.execute-api.us-east-2.amazonaws.com/dev/ai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token,
      },
      body: JSON.stringify({
        message: userPrompt,
        systemPrompt: systemPrompt,
        history,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.error || 'Failed to get response from AI');
    }

    console.log("🤖 GPT Response:", data.reply);
    return data.reply;

  } catch (err) {
    console.error("❌ Error calling OpenAI Lambda:", err);
    return null;
  }
};

const ChatInput = ({ userInput, setUserInput, onSubmit }) => {
  const textareaRef = useRef();

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'; // reset height
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [userInput]);

  const handleChange = (e) => {
    setUserInput(e.target.value);
  };

  const handleSubmit = () => {
    onSubmit();
    setUserInput(''); // reset
    textareaRef.current.style.height = 'auto'; // shrink after submission
  };

  return (
    <div className="relative w-full">
      <textarea
        ref={textareaRef}
        value={userInput}
        onChange={handleChange}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
          }
        }}
        placeholder="Type your message..."
        rows={1}
        className="w-full resize-none overflow-hidden rounded-xl p-3 pr-10 text-[16px] leading-relaxed border focus:outline-none"
      />
    </div>
  );
};

const SpecialOccasionCapture = ({ setCurrentView, occasionData = {}, onComplete }) => {
    const { systemCollections } = useSystemCollections();
    const [showContext, setShowContext] = useState(false);
    const [collectionName, setCollectionName] = useState('');
    const [hasAskedForName, setHasAskedForName] = useState(false);
    const [hasPostedMessage, setHasPostedMessage] = useState(false);

    const [occasion, setOccasion] = useState(() => ({
      person: occasionData.person || null,
      userCollectionId: occasionData.userCollectionId || null,
      userCollectionName: occasionData.userCollectionName || null,
      collections: occasionData.collections || [],
      type: '',
      date: '',
      reflections: [],
      currentQuestionIndex: 0,
      questions: [],
      finalMessage: ''
    }));
    // console.log("Occasion Data:", occasionData);
    const [collectionCreated, setCollectionCreated] = useState(false);
    const initialized = useRef(false);
    const [isSavingExit, setIsSavingExit] = useState(false);
    const [isSavingInsight, setIsSavingInsight] = useState(false);

    const contextSummary = `This collection was created to capture meaningful reflections, stories, and wisdom for a special occasion.`;
    const [trackBotPrompts, setTrackBotPrompts] = useState(false);
    const [insightPromptCount, setInsightPromptCount] = useState(0);

    const [botPromptCount, setBotPromptCount] = useState(0);
    const [showInsightModal, setShowInsightModal] = useState(false);
    const [draftPrompt, setDraftPrompt] = useState('');
    const [draftResponse, setDraftResponse] = useState('');

    const [insightDraft, setInsightDraft] = useState({
      prompt: '',
      response: '',
    });

    const promptRef = useRef(null);
    const responseRef = useRef(null);
    const [loadingSparklesIndex, setLoadingSparklesIndex] = useState(null);
    const {
      transcript,
      listening,
      resetTranscript,
      browserSupportsSpeechRecognition
    } = useSpeechRecognition();

    useEffect(() => {
      if (!initialized.current && occasion.person) {
        initialized.current = true;

        if (occasionData.isReturning) {
          setHasAskedForName(true); // ✅ Prevent collection name prompt
          setOccasion((prev) => ({
            ...prev,
            userCollectionName: occasionData.userCollectionName || 'Untitled'
          }));
          typeMessage("Alright, let's get back to it.", true); // 👈 Use your placeholder question here
          setConversationState('milestone_type'); // Or jump to next state directly
        } else {
          setHasAskedForName(true);
          typeMessage("What do you want to name this collection?", true);
        }
      }
    }, [occasion.person, occasion.collections, occasionData.isReturning]);

    const buildSystemPromptFromOccasion = (occasion, systemCollections) => {
      if (!occasion?.person || !occasion?.userCollectionName || !occasion?.collections) return null;

      const name = occasion.person.name;
      const occasionTitle = occasion.userCollectionName;

      const topics = occasion.collections
        .map(id => systemCollections.find(c => c.id === id)?.name)
        .filter(Boolean)
        .join(', ');

        return `You are a warm, emotionally intelligent assistant named WellSaid. Your role is to help users reflect on meaningful life moments and capture wisdom they can later share with someone they love.

        This session centers on **${occasionTitle}**, which is a meaningful moment involving **${name}**.

        Use the following context to guide your response:

        1. **Occasion**: ${occasionTitle}
        2. **Person**: ${name}
        3. **Themes**: ${topics}

        Instructions:
        - Mention either **${name}** or **${occasionTitle}**, but not both in the same sentence unless it adds clarity or flow.
        - Focus on **one theme** at a time and name it explicitly.
        - Ask only **one open-ended question**.
        - Keep responses short (**2–3 sentences**).
        - Briefly explain how the question relates to the occasion or theme.
        - Write like a thoughtful coach or guide — avoid vague or generic language.

        Format:
        - Start with a sentence that references the occasion or person.
        - Follow with a sentence that ties in a theme by name.
        - Finish with a reflective, open-ended question.`;
    };

    const buildHistoryForAI = (messages, limit = 6) => {
      // keep only the last N human/bot turns
      const last = messages.slice(-limit);

      return last.map(m => ({
        role: m.isBot ? 'assistant' : 'user',
        content: m.text
      }));
    };

    const [messages, setMessages] = useState([]);
    const [currentInput, setCurrentInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [conversationState, setConversationState] = useState('init');
    const messagesEndRef = useRef(null);
    const [showPeopleSelection, setShowPeopleSelection] = useState(false);
    const [showOccasionConfirmation, setShowOccasionConfirmation] = useState(false);

    useEffect(() => {
      if (listening) return; // Wait for it to finish
      if (transcript && transcript !== currentInput) {
        setCurrentInput(transcript);
      }
    }, [transcript, listening]);

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
        // console.log("✅ Collection created:", result);
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

      if (listening) {
        await SpeechRecognition.stopListening();
        setIsRecording(false);
        resetTranscript();
      }

      const input = currentInput.trim();

      // Step 1: Handle collection name logic
      if (!occasion.userCollectionName) {
        setCollectionName(input);
        setOccasion(prev => ({
          ...prev,
          userCollectionName: input
        }));
        setMessages(prev => [...prev, { text: input, isBot: false }]);
        setCurrentInput('');

        typeMessage(`Creating "${input}" for ${occasion.person.name}`, true);

        const createdId = await createUserCollection(input, occasion.person, occasion.collections);
        if (createdId) {
          setOccasion(prev => ({ ...prev, userCollectionId: createdId }));
          setTrackBotPrompts(true);
          setCollectionCreated(true);
          toast.custom((t) => (
            <ToastMessage
              type="success"
              title="Collection Created"
              message="Your special occasion collection was saved."
              onDismiss={() => toast.dismiss(t.id)}
            />
          ));

          if (!occasionData.isReturning) {
            const collectionNames = occasion.collections
              .map((id) => systemCollections.find((c) => c.id === id)?.name)
              .filter(Boolean)
              .join(', ');

            const contextString = `${occasion.person.name} (${occasion.person.relationship}) — focus on: ${collectionNames}`;
            typeMessage(`Let's begin. Thinking about ${contextString}, what's something you'd want them to always remember?`, true);
            setConversationState('chatting');
          } else {
            typeMessage("Welcome back! Let's pick up where we left off.", true);
            setConversationState('chatting');
          }
        }

        return;
      }

      // Step 2: Handle chat input and call OpenAI
      setMessages(prev => [...prev, { text: input, isBot: false }]);
      setCurrentInput('');
      setHasPostedMessage(true);
      scrollToBottom();

      try {
        const systemPrompt =
          buildSystemPromptFromOccasion(occasion, systemCollections) ||
          "You are a legacy guide helping users reflect on meaningful life experiences with loved ones. Keep replies brief and end with a thoughtful question.";
        console.log("BUILT SYSTEM PROMPT:", systemPrompt);

        const historyForAI = buildHistoryForAI(messages);
        console.log("MESSAGE HISTORY FOR AI:", historyForAI);

        const reply = await callOpenAI(input, systemPrompt, historyForAI);

        if (reply) {
          typeMessage(reply, true);
        } else {
          typeMessage("Hmm, I didn't catch that. Could you try rephrasing?", true);
        }

      } catch (err) {
        console.error("💥 OpenAI API call error:", err);
        typeMessage("Sorry, I had trouble thinking. Can you try again?", true);
      }
    };

    // Change this:
    const toggleRecording = async () => {
      if (!browserSupportsSpeechRecognition) {
        toast.error('Speech recognition is not supported in this browser.');
        return;
      }

      if (listening) {
        await SpeechRecognition.stopListening();
        resetTranscript();
      } else {
        resetTranscript();
        await SpeechRecognition.startListening({
          continuous: false,
          language: 'en-US'
        });
      }
    };

    const generatePromptAndResponse = async (history) => {
      try {
        const session = await fetchAuthSession();
        const token = session.tokens?.idToken?.toString();

        const response = await fetch('https://aqaahphwfj.execute-api.us-east-2.amazonaws.com/dev/ai/promptResponse', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: token,
          },
          body: JSON.stringify({ history }),
        });

        const data = await response.json();
        console.log("Prompt & Response Data:", data);
        if (!response.ok) {
          throw new Error(data.error || 'Failed to generate insight');
        }

        return data; // { prompt: "...", response: "..." }
      } catch (error) {
        console.error('🛑 Error generating insight:', error);
        return null;
      }
    };

    const handleSparklesClick = async (clickedIndex) => {
      try {
        setLoadingSparklesIndex(clickedIndex); // 👈 show spinner for this Sparkles button

        const history = messages
          .slice(0, clickedIndex + 1)
          .map((m) => ({
            role: m.isBot ? 'assistant' : 'user',
            content: m.text,
          }));

        const result = await generatePromptAndResponse(history);

        if (result) {
          openInsightEditorModal({
            autoGeneratedPrompt: result.prompt,
            autoGeneratedResponse: result.response,
          });
        } else {
          console.warn('⚠️ Failed to generate prompt/response');
          toast.error("Something went wrong creating the insight.");
        }
      } catch (err) {
        console.error("⚠️ Sparkles generation failed:", err);
        toast.error("Something went wrong creating the insight.");
      } finally {
        setLoadingSparklesIndex(null); // 👈 reset spinner
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

    const openInsightEditorModal = ({ autoGeneratedPrompt = '', autoGeneratedResponse = '' }) => {
      setInsightDraft({
        prompt: autoGeneratedPrompt,
        response: autoGeneratedResponse,
      });
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
        toast.custom((t) => (
          <ToastMessage
            type="success"
            title="Context Saved"
            message="Collection summary successfully saved."
            onDismiss={() => toast.dismiss(t.id)}
          />
        ));
        return result;

      } catch (err) {
        toast.custom((t) => (
          <ToastMessage
            type="error"
            title="Save Failed"
            message={err.message || "Something went wrong saving the collection."}
            onDismiss={() => toast.dismiss(t.id)}
          />
        ));
        console.error("💥 Save Exit Error:", err);
      }
    };

    useEffect(() => {
      if (showInsightModal) {
        if (promptRef.current) {
          promptRef.current.style.height = 'auto';
          promptRef.current.style.height = promptRef.current.scrollHeight + 'px';
        }
        if (responseRef.current) {
          responseRef.current.style.height = 'auto';
          responseRef.current.style.height = responseRef.current.scrollHeight + 'px';
        }
      }
    }, [showInsightModal, insightDraft.prompt, insightDraft.response]);

    const handleContinueClick = () => {
      // Optional: Add a confirmation message to the thread
      setMessages((prev) => [
        ...prev,
        {
          isBot: true,
          text: "Great! Let's keep going...",
          type: "system",
        },
      ]);

      // Clear the continuation prompt
      setMessages((prev) => prev.filter((m) => m.type !== 'continuePrompt'));

      // Optionally re-trigger assistant with a new starter question
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            isBot: true,
            text: "What else would you like to reflect on about this occasion?",
          },
        ]);
      }, 300); // slight delay for pacing
    };

    const handleStopClick = async () => {
      try {
        setIsSavingExit(true);
        await handleSaveExit(occasion.userCollectionId, contextSummary);
        setIsSavingExit(false);
        setCurrentView('home');
      } catch (err) {
        console.error("❌ Error in handleStopClick:", err);
        setIsSavingExit(false);
      }
    };

    const handleSaveInsight = async () => {
      if (!insightDraft.prompt.trim() || !insightDraft.response.trim()) {
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
              prompt: insightDraft.prompt,
              response: insightDraft.response,
              collectionId: occasion.userCollectionId,
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
        // console.log("✅ Insight saved:", savedInsight);

        // Reset and close modal
        setInsightDraft({ prompt: '', response: '' });
        setShowInsightModal(false);
        setInsightPromptCount(0);

        // ⬇️ Inject system message after modal closes
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            isBot: true, // 🧠 Make it look like it came from the assistant
            text: "Your insight was saved, would you like to keep going?",
            type: 'continuePrompt', // optional, for cleaner render logic
          },
        ]);

        toast.custom((t) => (
          <ToastMessage
            type="success"
            title="Insight Saved"
            message="This moment is now part of your collection."
            onDismiss={() => toast.dismiss(t.id)}
          />
        ));

        if (onComplete) onComplete(savedInsight);

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
            {(collectionCreated || occasion?.userCollectionName) && (
              hasPostedMessage ? (
                <button
                  onClick={handleStopClick}
                  disabled={isSavingExit}
                  className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm hover:bg-gray-50 transition-colors disabled:opacity-60"
                >
                  {isSavingExit ? (
                    <svg className="animate-spin h-5 w-5 text-gray-600" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8z" />
                    </svg>
                  ) : (
                    <Save className="w-5 h-5 text-gray-600" />
                  )}
                  <span className="text-gray-700 font-medium">{isSavingExit ? 'Saving...' : 'Exit'}</span>
                </button>
              ) : (
                <button
                  onClick={() => setCurrentView('home')}
                  className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-700 font-medium">Cancel</span>
                </button>
              )
            )}
          </div>

          {/* Context */}
          <div className="max-w-2xl mx-auto px-4 pt-2 pb-3">
            <div className="bg-white rounded-2xl shadow p-4">
              <button
                onClick={() => setShowContext(!showContext)}
                className="w-full flex justify-between items-center"
              >
                <h3 className="font-semibold text-gray-800">
                  {occasion.userCollectionName || 'Context'}
                </h3>
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
                        <Library className="w-4 h-4 mr-1" />
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
                if (message.type === 'continuePrompt') {
                  return (
                    <div key={index} className="flex flex-col items-start">
                      <div className="bg-gray-100 text-gray-800 px-4 py-2 rounded-2xl mb-2 max-w-xs lg:max-w-md">
                        {message.text}
                      </div>
                      <div className="flex gap-3 pl-1">
                        <button
                          onClick={handleContinueClick}
                          className="bg-green-100 hover:bg-green-200 text-green-700 p-2 rounded-full"
                          title="Yes, keep going"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={handleStopClick}
                          className="bg-red-100 hover:bg-red-200 text-red-700 p-2 rounded-full"
                          title="No, I'm done"
                          disabled={isSavingExit}
                        >
                          {isSavingExit ? (
                            <svg
                              className="animate-spin h-4 w-4 text-red-700"
                              viewBox="0 0 24 24"
                              fill="none"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              />
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8z"
                              />
                            </svg>
                          ) : (
                            <X className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  );
                }
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
                          onClick={() => handleSparklesClick(index)}
                          className="p-2 bg-blue-100 hover:bg-blue-200 rounded-full shadow-sm border border-blue-300 transition"
                          title="Turn this into an Insight Card"
                          disabled={loadingSparklesIndex === index}
                        >
                          {loadingSparklesIndex === index ? (
                            <svg
                              className="animate-spin h-4 w-4 text-blue-500"
                              viewBox="0 0 24 24"
                              fill="none"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              />
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8z"
                              />
                            </svg>
                          ) : (
                            <Sparkles className="w-4 h-4 text-blue-500" />
                          )}
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
          <div className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-gray-100">
            <div className="max-w-2xl mx-auto w-full px-4 py-3">
              <div className="flex gap-2 items-center w-full">
                <div className="flex-1 min-w-0">
                  {!occasion.userCollectionName ? (
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
                    <ChatInput
                      userInput={currentInput}
                      setUserInput={setCurrentInput}
                      onSubmit={handleInputSubmit}
                    />
                  )}
                </div>
                {occasion.userCollectionName || occasion.collections?.length === 0 ? (
                  <>
                    <button
                      onClick={toggleRecording} // or submit if you choose option 2
                      className={`flex-shrink-0 p-3 rounded-xl transition-colors ${
                        listening
                          ? 'bg-red-500 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {listening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
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
              <textarea
                ref={promptRef}
                value={insightDraft.prompt}
                onChange={(e) => {
                  e.target.style.height = 'auto';
                  e.target.style.height = e.target.scrollHeight + 'px';
                  setInsightDraft((prev) => ({ ...prev, prompt: e.target.value }));
                }}
                className="w-full p-2 mb-4 border rounded-xl resize-none overflow-y-auto leading-snug max-h-40"
                rows={1}
              />

              <label className="block text-sm font-semibold text-gray-700 mb-1">Response</label>
              <textarea
                ref={responseRef}
                value={insightDraft.response}
                onChange={(e) => {
                  e.target.style.height = 'auto';
                  e.target.style.height = e.target.scrollHeight + 'px';
                  setInsightDraft((prev) => ({ ...prev, response: e.target.value }));
                }}
                className="w-full p-2 mb-4 border rounded-xl resize-none overflow-y-auto leading-snug max-h-56"
                rows={1}
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowInsightModal(false)}
                  className="px-4 py-2 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200"
                >
                  Return
                </button>
                <button
                  onClick={async () => {
                    setIsSavingInsight(true);
                    await handleSaveInsight();
                    setIsSavingInsight(false);
                  }}
                  disabled={isSavingInsight}
                  className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2 disabled:opacity-60"
                >
                  {isSavingInsight ? (
                    <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8z" />
                    </svg>
                  ) : null}
                  <span>{isSavingInsight ? "Saving..." : "Save"}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
};

export default SpecialOccasionCapture;
