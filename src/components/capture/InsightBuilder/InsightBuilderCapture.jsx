// Imports
import React, { useState, useEffect, useRef } from 'react';
import { Mic, Send, Sparkles, Save, X } from 'lucide-react';
import WellSaidIcon from '../../../assets/icons/WellSaidIcon';
import { fetchAuthSession } from 'aws-amplify/auth';
import toast from 'react-hot-toast';
import ToastMessage from '../../library/BookCreation/ToastMessage';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import Typewriter from '../../landingPage/utils/Typewriter';
import { useInsights } from '../../../context/InsightContext';
import { useSystemCollections } from '../../../context/SystemCollectionsContext';

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

const InsightBuilderCapture = ({ setCurrentView, onComplete }) => {
    const [sessionInsights, setSessionInsights] = useState([]);
    const [hasPostedMessage, setHasPostedMessage] = useState(false);
    const [isSavingExit, setIsSavingExit] = useState(false);
    const [isSavingInsight, setIsSavingInsight] = useState(false);
    const [activeSparklesIndex, setActiveSparklesIndex] = useState(null);
    const [sparklesIntroShown, setSparklesIntroShown] = useState(false);
    const [loadingSparklesIndex, setLoadingSparklesIndex] = useState(null);
    const [showInsightModal, setShowInsightModal] = useState(false);
    const [insightDraft, setInsightDraft] = useState({
      prompt: '',
      response: '',
    });
    const [conversationTranscript, setConversationTranscript] = useState([]);
    const [messages, setMessages] = useState([]);
    const [currentInput, setCurrentInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);
    const promptRef = useRef(null);
    const responseRef = useRef(null);
    const { refreshInsights } = useInsights();
    const { refreshSystemCollections } = useSystemCollections();

    const {
      transcript,
      listening,
      resetTranscript,
      browserSupportsSpeechRecognition
    } = useSpeechRecognition();

    const generateMessageId = () => Date.now() + Math.random().toString(36).substr(2, 9);

    const callOpenAI = async (userPrompt, systemPrompt, history = []) => {
      try {
        const session = await fetchAuthSession();
        const token = session.tokens?.idToken?.toString();

        const response = await fetch('https://2rjszrulkb.execute-api.us-east-2.amazonaws.com/dev/ai', {
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

        return data.reply;

      } catch (err) {
        console.error("Error calling OpenAI Lambda:", err);
        return null;
      }
    };

    const addToTranscript = (text, isBot) => {
      const newEntry = {
        id: generateMessageId(),
        text,
        isBot,
        timestamp: Date.now()
      };

      setConversationTranscript(prev => {
        const lastMessage = prev[prev.length - 1];
        if (lastMessage && lastMessage.text === text && lastMessage.isBot === isBot) {
          return prev;
        }
        return [...prev, newEntry];
      });
    };

    const buildSystemPrompt = () => {
      return `You are a warm, emotionally intelligent assistant named WellSaid. Your role is to help users reflect on meaningful insights and capture wisdom.

      Instructions:
      - Focus on helping the user articulate their thoughts clearly
      - Ask open-ended questions to help them explore their ideas
      - Keep responses concise (2-3 sentences)
      - End each response with a thoughtful question to continue the exploration`;
    };

    const buildHistoryForAI = (messages, limit = 6) => {
      const last = messages.slice(-limit);
      return last.map(m => ({
        role: m.isBot ? 'assistant' : 'user',
        content: m.text
      }));
    };

    const typeMessage = (text, isBot = true, delay = 300) => {
      setIsTyping(true);

      const newMessage = {
        id: generateMessageId(), // Add unique ID
        text,
        isBot,
        timestamp: Date.now(),
        isTyping: isBot
      };

      // Add to transcript only if it's a bot message
      if (isBot) {
        setConversationTranscript(prev => {
          const lastMessage = prev[prev.length - 1];
          if (lastMessage && lastMessage.text === text && lastMessage.isBot === isBot) {
            return prev;
          }
          return [...prev, newMessage];
        });
      }

      setTimeout(() => {
        setMessages(prev => {
          // Check for duplicates before adding
          const lastMessage = prev[prev.length - 1];
          if (lastMessage && lastMessage.text === text && lastMessage.isBot === isBot) {
            return prev;
          }
          return [...prev, newMessage];
        });
        setIsTyping(false);
        scrollToBottom();
      }, delay);
    };

    const scrollToBottom = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

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

        const response = await fetch('https://2rjszrulkb.execute-api.us-east-2.amazonaws.com/dev/ai/promptResponse', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: token,
          },
          body: JSON.stringify({ history }),
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || 'Failed to generate insight');
        }

        return data;
      } catch (error) {
        console.error('Error generating insight:', error);
        return null;
      }
    };

    const handleSparklesClick = async (clickedIndex) => {
      try {
        setLoadingSparklesIndex(clickedIndex);
        if (activeSparklesIndex === null) {
          setActiveSparklesIndex(clickedIndex);
          setSparklesIntroShown(true);
        }

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
          toast.error("Something went wrong creating the insight.");
        }
      } catch (err) {
        console.error("Sparkles generation failed:", err);
        toast.error("Something went wrong creating the insight.");
      } finally {
        setLoadingSparklesIndex(null);
      }
    };

    const shouldShowSparkles = (index) => {
      const message = messages[index];
      if (!message.isBot) return false;

      const isConversationalMessage = !(
        message.text.includes("Let's begin") ||
        message.text.includes("Welcome back")
      );

      const conversationalBotMessages = messages
        .filter(m => m.isBot && isConversationalMessage);

      const messageIndex = conversationalBotMessages.findIndex(m => m.timestamp === message.timestamp);

      return isConversationalMessage &&
             messageIndex >= 2 &&
             (activeSparklesIndex === null || index >= activeSparklesIndex);
    };

    const openInsightEditorModal = ({ autoGeneratedPrompt = '', autoGeneratedResponse = '' }) => {
      setInsightDraft({
        prompt: autoGeneratedPrompt,
        response: autoGeneratedResponse,
      });
      setShowInsightModal(true);
    };

    const handleSaveInsight = async () => {
      if (!insightDraft.prompt.trim() || !insightDraft.response.trim()) {
        toast.error("Prompt and response are required");
        return;
      }

      try {
        const session = await fetchAuthSession();
        const token = session.tokens?.idToken?.toString();
        if (!token) throw new Error("No auth token found");

        // STEP 1 — 🧠 Classify the insight into system collections
        console.log("📤 Sending prompt/response to AI classification Lambda...");

        const classifyRes = await fetch(
          "https://2rjszrulkb.execute-api.us-east-2.amazonaws.com/dev/ai/assignSystemCollections",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: token,
            },
            body: JSON.stringify({
              prompt: insightDraft.prompt,
              response: insightDraft.response,
            }),
          }
        );

        const classifyJson = await classifyRes.json();
        console.log("✅ Classification response:", classifyJson);

        if (!classifyRes.ok) {
          throw new Error(classifyJson.error || "AI classification failed");
        }

        const collectionIds = classifyJson.relatedCollectionIds;
        if (!Array.isArray(collectionIds) || collectionIds.length === 0) {
          throw new Error("AI classification returned no collection IDs");
        }

        // STEP 2 — 💾 Save the insight
        console.log("💾 Saving insight with classified collection IDs:", collectionIds);

        const saveRes = await fetch(
          "https://2rjszrulkb.execute-api.us-east-2.amazonaws.com/dev/insights/insightBuilder",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: token,
            },
            body: JSON.stringify({
              prompt: insightDraft.prompt,
              response: insightDraft.response,
              collectionIds,
            }),
          }
        );

        const savedInsight = await saveRes.json();
        console.log("✅ Insight saved:", savedInsight);

        if (!saveRes.ok) {
          throw new Error(savedInsight.error || "Saving insight failed");
        }

        // STEP 3 — 🎉 Update UI and state
        setSessionInsights((prev) => [
          ...prev,
          {
            prompt: insightDraft.prompt,
            response: insightDraft.response,
          },
        ]);
        setInsightDraft({ prompt: "", response: "" });
        setShowInsightModal(false);
        setActiveSparklesIndex(null);
        setSparklesIntroShown(false);
        setLoadingSparklesIndex(null);
        await refreshInsights();
        await refreshSystemCollections();
        setMessages((prevMessages) => [
          ...prevMessages,
          { isBot: true, text: "Your insight was saved!" },
        ]);

        toast.custom((t) => (
          <ToastMessage
            type="success"
            title="Insight Saved"
            message="This insight has been captured."
            onDismiss={() => toast.dismiss(t.id)}
          />
        ));

        if (onComplete) onComplete(savedInsight);

      } catch (err) {
        console.error("❌ Save Insight error:", err);
        toast.error(err.message || "Something went wrong saving your insight.");
      }
    };

    const handleInputSubmit = async () => {
      const input = currentInput.trim() || "I'm ready to begin";

      if (listening) {
        await SpeechRecognition.stopListening();
        resetTranscript();
      }

      addToTranscript(input, false);
      setMessages(prev => [...prev, {
        text: input,
        isBot: false,
        timestamp: Date.now()
      }]);
      setCurrentInput('');
      setHasPostedMessage(true);
      scrollToBottom();

      try {
        const systemPrompt = buildSystemPrompt();
        const historyForAI = buildHistoryForAI(messages);
        const reply = await callOpenAI(input, systemPrompt, historyForAI);

        if (reply) {
          typeMessage(reply, true);
        } else {
          typeMessage("Hmm, I didn't catch that. Could you try rephrasing?", true);
        }
      } catch (err) {
        console.error("API call error:", err);
        typeMessage("Sorry, I had trouble thinking. Can you try again?", true);
      }
    };

    useEffect(() => {
      if (listening) return;
      if (transcript && transcript !== currentInput) {
        setCurrentInput(transcript);
      }
    }, [transcript, listening]);

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

    // Start with an initial prompt
    useEffect(() => {
      if (messages.length === 0) {
        typeMessage("What insight or thought would you like to explore today?", true);
      }
    }, []);

    return (
      <div className="fixed inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 overflow-y-auto z-50">
        {/* Fixed top header */}
        <div className="fixed top-0 left-0 right-0 bg-gradient-to-br from-blue-50 to-indigo-50 z-20 border-b border-gray-100">
          <div className="max-w-2xl mx-auto px-4 pt-6 pb-2 flex justify-between items-start">
            <div className="flex items-center gap-3">
              <WellSaidIcon size={50} />
              <div>
                <h1 className="text-xl font-bold">Capture Insight</h1>
                <p className="text-sm text-gray-500">Thought Exploration</p>
              </div>
            </div>
            {hasPostedMessage ? (
              <button
                onClick={() => {
                  setIsSavingExit(true);
                  setCurrentView('home');
                }}
                disabled={isSavingExit}
                className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm hover:bg-gray-50 transition-colors disabled:opacity-60"
              >
                {isSavingExit ? (
                  <svg className="animate-spin h-5 w-5 text-gray-600" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8z" />
                  </svg>
                ) : (
                  <X className="w-5 h-5 text-gray-600" />
                )}
                <span className="text-gray-700 font-medium">{isSavingExit ? 'Exiting...' : 'Exit'}</span>
              </button>
            ) : (
              <button
                onClick={() => setCurrentView('home')}
                className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
                <span className="text-gray-700 font-medium">Cancel</span>
              </button>
            )}
          </div>
        </div>

        {/* Scrollable message area - with extra bottom padding */}
        <div className="max-w-2xl mx-auto px-4">
          <div className="pt-[100px] pb-[240px]">
            <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
              {messages.map((message, index) => {
                const showSparkles = shouldShowSparkles(index);
                const isFirstSparkles = showSparkles && activeSparklesIndex === null;
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
                      {message.isBot && message.isTyping && index === messages.length - 1 ? (
                        <>
                          <Typewriter
                            text={message.text}
                            speed={20}
                            onComplete={() => {
                              setMessages(prev => prev.map((msg, i) =>
                                i === index ? {...msg, isTyping: false} : msg
                              ));
                              setIsTyping(false);
                              scrollToBottom();
                            }}
                          />
                          <span className="ml-1 inline-block w-2 h-4 bg-gray-400 animate-pulse align-middle" />
                        </>
                      ) : (
                        message.text
                      )}
                    </div>

                    {/* Sparkles button */}
                    {showSparkles && (
                      <div className="flex items-center gap-1 ml-1">
                        <button
                          onClick={() => {
                            if (isFirstSparkles) {
                              setSparklesIntroShown(true);
                              setActiveSparklesIndex(index);
                            }
                            handleSparklesClick(index);
                          }}
                          className="flex-shrink-0 p-1.5 bg-blue-100 hover:bg-blue-200 rounded-full shadow-sm border border-blue-300 transition"
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
                        {isFirstSparkles && !sparklesIntroShown && (
                          <span className="text-xs text-gray-500 whitespace-nowrap">
                            Click to reveal AI-generated insight
                          </span>
                        )}
                      </div>
                    )}

                    {isLastMessage && <div ref={messagesEndRef} className="h-4" />}
                  </div>
                );
              })}

              {isTyping && messages[messages.length - 1]?.isBot !== true && (
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
        {/* Input Area */}
        <div className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-gray-100 pb-[env(safe-area-inset-bottom)]">
          <div className="max-w-2xl mx-auto w-full px-4 pt-3 pb-4" style={{
            paddingBottom: 'calc(1rem + env(safe-area-inset-bottom))'
          }}>
            <div className="flex gap-2 items-center w-full">
              <div className="flex-1 min-w-0">
                <ChatInput
                  userInput={currentInput}
                  setUserInput={setCurrentInput}
                  onSubmit={handleInputSubmit}
                />
              </div>
              <button
                onClick={toggleRecording}
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
            </div>
          </div>
        </div>

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

export default InsightBuilderCapture;
