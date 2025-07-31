// QuickCreateCapture.jsx
import React, { useState, useEffect, useRef } from 'react';
import { User, Check, Plus, Mic, Send, Home, PlusCircle,
  Library, MicOff, ChevronDown, ChevronUp, Save, Sparkles,
  SendIcon, X, Play } from 'lucide-react';
import WellSaidIcon from '../../../assets/icons/WellSaidIcon';
import { useSystemCollections } from '../../../context/SystemCollectionsContext';
import { fetchAuthSession } from 'aws-amplify/auth';
import toast from 'react-hot-toast';
import ToastMessage from '../../library/BookCreation/ToastMessage';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import Typewriter from '../../landingPage/utils/Typewriter';

const ChatInput = ({ userInput, setUserInput, onSubmit }) => {
  const textareaRef = useRef();

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [userInput]);

  const handleChange = (e) => {
    setUserInput(e.target.value);
  };

  const handleSubmit = () => {
    onSubmit();
    setUserInput('');
    textareaRef.current.style.height = 'auto';
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
        placeholder="Type your response..."
        rows={1}
        className="w-full resize-none overflow-hidden rounded-xl p-3 pr-10 text-[16px] leading-relaxed border focus:outline-none"
      />
    </div>
  );
};

const QuickCreateCapture = ({ setCurrentView, userContext }) => {
  const { systemCollections } = useSystemCollections();
  const [messages, setMessages] = useState([]);
  const [currentInput, setCurrentInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showInsightModal, setShowInsightModal] = useState(false);
  const [insightDraft, setInsightDraft] = useState({
    prompt: '',
    response: '',
  });
  const messagesEndRef = useRef(null);
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();
  const [showContext, setShowContext] = useState(false);
  // Sample quick questions based on context
  const quickQuestions = [
    "What's one lesson you've learned recently that changed your perspective?",
    "If you could share one piece of advice with your younger self, what would it be?",
    "What's something small that brings you joy every day?",
    "What's a value or principle you try to live by?",
    "Who has influenced you the most in your life, and how?",
    "What's something you wish more people understood?",
    "What's a challenge you've overcome that made you stronger?"
  ];

  // Select a random question based on user context
  const getRandomQuestion = () => {
    // TODO: Enhance this with more context-aware questions later
    const randomIndex = Math.floor(Math.random() * quickQuestions.length);
    return quickQuestions[randomIndex];
  };

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
      if (!response.ok) throw new Error(data?.error || 'Failed to get response from AI');
      return data.reply;
    } catch (err) {
      console.error("Error calling OpenAI Lambda:", err);
      return null;
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
      if (!response.ok) throw new Error(data.error || 'Failed to generate insight');
      return data;
    } catch (error) {
      console.error('Error generating insight:', error);
      return null;
    }
  };

  const typeMessage = (text, isBot = true, delay = 300) => {
    setIsTyping(true);

    const newMessage = {
      text,
      isBot,
      timestamp: Date.now(),
      isTyping: isBot
    };

    setTimeout(() => {
      setMessages(prev => [...prev, newMessage]);
      setIsTyping(false);
      scrollToBottom();
    }, delay);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const toggleRecording = async () => {
    if (!browserSupportsSpeechRecognition) {
      toast.error('Speech recognition is not supported in your browser.');
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

  const handleInputSubmit = async () => {
    const input = currentInput.trim();
    if (!input) return;

    if (listening) {
      await SpeechRecognition.stopListening();
      resetTranscript();
    }

    // Add user message
    setMessages(prev => [...prev, {
      text: input,
      isBot: false,
      timestamp: Date.now()
    }]);
    setCurrentInput('');
    scrollToBottom();

    // Generate insight from the conversation
    try {
      const history = [
        { role: 'assistant', content: messages[0].text }, // The initial question
        { role: 'user', content: input } // The user's response
      ];

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
      console.error("Error generating insight:", err);
      toast.error("Something went wrong creating the insight.");
    }
  };

  const openInsightEditorModal = ({ autoGeneratedPrompt = '', autoGeneratedResponse = '' }) => {
    setInsightDraft({
      prompt: autoGeneratedPrompt,
      response: autoGeneratedResponse,
    });
    setShowInsightModal(true);
  };

  const saveInsight = async () => {
    if (!insightDraft.prompt.trim() || !insightDraft.response.trim()) {
      toast.error("Prompt and response are required");
      return;
    }

    try {
      setIsSaving(true);
      const session = await fetchAuthSession();
      const token = session.tokens?.idToken?.toString();

      if (!token) throw new Error("No auth token");

      const response = await fetch(
        'https://2rjszrulkb.execute-api.us-east-2.amazonaws.com/dev/insights',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: token,
          },
          body: JSON.stringify({
            prompt: insightDraft.prompt,
            response: insightDraft.response,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Insight save failed:", errorData);
        throw new Error(errorData.error || "Unknown error");
      }

      const savedInsight = await response.json();
      toast.custom((t) => (
        <ToastMessage
          type="success"
          title="Insight Saved"
          message="Your quick reflection was saved."
          onDismiss={() => toast.dismiss(t.id)}
        />
      ));

      setShowInsightModal(false);
      setCurrentView('home'); // Close the experience after saving
    } catch (err) {
      console.error("Save Insight error:", err);
      toast.error("Something went wrong saving your insight.");
    } finally {
      setIsSaving(false);
    }
  };

  // Initialize with a random question
  useEffect(() => {
    if (messages.length === 0) {
      const question = getRandomQuestion();
      typeMessage(question, true);
    }
  }, []);

  // Sync speech recognition transcript
  useEffect(() => {
    if (listening) return;
    if (transcript && transcript !== currentInput) {
      setCurrentInput(transcript);
    }
  }, [transcript, listening]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 overflow-y-auto">
      {/* Fixed top header - reduced padding */}
      <div className="fixed top-0 left-0 right-0 bg-gradient-to-br from-blue-50 to-indigo-50 z-20 border-b border-gray-100">
        <div className="max-w-2xl mx-auto px-4 pt-4 pb-2 flex justify-between items-start"> {/* Reduced pt-6 to pt-4 */}
          <div className="flex items-center gap-3">
            <WellSaidIcon size={50} />
            <div>
              <h1 className="text-xl font-bold">Quick Reflection</h1>
              <p className="text-sm text-gray-500">Capture a single insight</p>
            </div>
          </div>
          <button
            onClick={() => setCurrentView('home')}
            className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
            <span className="text-gray-700 font-medium">Close</span>
          </button>
        </div>

        {/* Moved Context inside fixed header */}
        <div className="max-w-2xl mx-auto px-4 pb-2"> {/* Removed pt-2 since it's inside fixed container */}
          <div className="bg-white rounded-2xl shadow p-4">
            <button
              onClick={() => setShowContext(!showContext)}
              className="w-full flex justify-between items-center"
            >
              <h3 className="font-semibold text-gray-800">
                Quick Reflection Context
              </h3>
              {showContext ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </button>

            {showContext && (
              <div className="mt-3">
                <div className="bg-gray-100 text-gray-700 rounded-lg px-4 py-3 text-sm shadow-inner">
                  <p className="text-gray-500 italic">
                    This quick reflection will be saved to your insights.
                    Context-aware questions coming soon!
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <div className="inline-flex items-center bg-blue-100 text-blue-800 rounded-full px-3 py-1">
                      <User className="w-4 h-4 mr-1" />
                      <span>Personal Reflection</span>
                    </div>
                    <div className="inline-flex items-center bg-green-100 text-green-800 rounded-full px-3 py-1">
                      <span>Quick Capture</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Message area - adjusted padding */}
      <div className="max-w-2xl mx-auto px-4">
        <div className="pt-[180px] pb-[180px]"> {/* Reduced top padding */}
          <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex flex-col ${message.isBot ? 'items-start' : 'items-end'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                    message.isBot
                      ? 'bg-gray-100 text-gray-800'
                      : 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white'
                  }`}
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
                {index === messages.length - 1 && <div ref={messagesEndRef} className="h-4" />}
              </div>
            ))}

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
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-gray-100">
        <div className="max-w-2xl mx-auto w-full px-4 py-3">
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
              value={insightDraft.prompt}
              onChange={(e) => {
                e.target.style.height = 'auto';
                e.target.style.height = e.target.scrollHeight + 'px';
                setInsightDraft(prev => ({ ...prev, prompt: e.target.value }));
              }}
              className="w-full p-2 mb-4 border rounded-xl resize-none overflow-y-auto leading-snug max-h-40"
              rows={1}
            />

            <label className="block text-sm font-semibold text-gray-700 mb-1">Response</label>
            <textarea
              value={insightDraft.response}
              onChange={(e) => {
                e.target.style.height = 'auto';
                e.target.style.height = e.target.scrollHeight + 'px';
                setInsightDraft(prev => ({ ...prev, response: e.target.value }));
              }}
              className="w-full p-2 mb-4 border rounded-xl resize-none overflow-y-auto leading-snug max-h-56"
              rows={1}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowInsightModal(false)}
                className="px-4 py-2 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={saveInsight}
                disabled={isSaving}
                className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2 disabled:opacity-60"
              >
                {isSaving ? (
                  <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8z" />
                  </svg>
                ) : null}
                <span>{isSaving ? "Saving..." : "Save & Close"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuickCreateCapture;
