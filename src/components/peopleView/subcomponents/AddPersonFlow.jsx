// Revised AddPersonFlow.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useUser } from '../../../context/UserContext';
import { fetchAuthSession } from 'aws-amplify/auth';
import { Send, Mic, MicOff, X, User, ArrowRight } from 'lucide-react';
import WellSaidIconOnboarding from '../../../assets/icons/WellSaidIconOnboarding';
import Typewriter from '../../landingPage/utils/Typewriter';
import logo from '../../../assets/wellsaid.svg';

const RelationshipModal = ({ name, onSelect, onClose }) => {
  const relationships = [
    'Daughter',
    'Son',
    'Relative',
    'Student',
    'Friend',
    'Other'
  ];

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[100] flex items-end">
      <div className="w-full bg-white rounded-t-3xl p-6 animate-slide-up">
        <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-6"></div>

        <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">
          Who is {name} to you?
        </h2>
        <p className="text-gray-500 text-center mb-6">Choose the closest option</p>

        <div className="space-y-3">
          {relationships.map((relationship) => (
            <button
              key={relationship}
              onClick={() => onSelect(relationship)}
              className="w-full p-4 text-left border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-800">{relationship}</span>
                <ArrowRight size={18} className="text-gray-400" />
              </div>
            </button>
          ))}
        </div>

        <button
          onClick={onClose}
          className="w-full mt-6 py-3 text-gray-500 font-medium rounded-xl hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

const AddPersonFlow = ({ onComplete, onCancel }) => {
  const { userData } = useUser();
  const [conversationState, setConversationState] = useState('ask_name');
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [newPerson, setNewPerson] = useState({ name: '', relationship: '', context: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const hasInitialized = useRef(false);
  const [showRelationshipModal, setShowRelationshipModal] = useState(false);

  const BOTTOM_NAV_HEIGHT = '64px';

  useEffect(() => {
    console.log('🎯 AddPersonFlow mounted');
    console.log('✅ hasInitialized.current:', hasInitialized.current);
    console.log('✅ messages.length:', messages.length);

    if (!hasInitialized.current && messages.length === 0) {
      hasInitialized.current = true;
      typeMessage("Let's add someone important to you.", true, 500);
      typeMessage("What's their name?", true, 1500);
    }

    return () => {
      console.log('🧹 Cleaning up AddPersonFlow');
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const typeMessage = (message, isBot = true, delay = 0) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setIsTyping(true);
        setTimeout(() => {
          setMessages(prev => [...prev, { text: message, isBot, timestamp: Date.now() }]);
          setIsTyping(false);
          resolve();
        }, Math.min(1500, message.length * 30));
      }, delay);
    });
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      setTimeout(() => {
        setIsRecording(false);
        setInputValue("This would be transcribed speech...");
      }, 2000);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const value = inputValue.trim();
    if (!value) return;

    setMessages(prev => [...prev, { text: value, isBot: false, timestamp: Date.now() }]);
    setInputValue('');

    if (conversationState === 'ask_name') {
      setNewPerson(prev => ({ ...prev, name: value }));
      // Immediately show the modal while the bot message is typing
      setShowRelationshipModal(true);
      await typeMessage(`Got it. What's your relationship with ${value}?`, true, 0);
    } else if (conversationState === 'ask_relationship') {
      // This will now handle the "Other" case where user needs to describe
      setNewPerson(prev => ({ ...prev, relationship: value }));
      await typeMessage(`Thanks. Anything else you'd like us to know about ${newPerson.name}?`, true, 500);
      setConversationState('ask_context');
    } else if (conversationState === 'ask_context') {
      setNewPerson(prev => ({ ...prev, context: value }));
      setConversationState('saving');
      await savePerson({ ...newPerson, context: value });
    }
  };

  // Add this new handler for relationship selection
  const handleRelationshipSelect = async (relationship) => {
    setShowRelationshipModal(false);

    // Add the selection to messages as if user submitted it
    setMessages(prev => [...prev, { text: relationship, isBot: false, timestamp: Date.now() }]);

    if (relationship === 'Other') {
      // For "Other", ask for description
      setConversationState('ask_relationship');
      await typeMessage(`How would you describe who ${newPerson.name} is to you?\n(For example: friend’s child, youth group member, athlete, etc.)`, true, 500);
      // Stay in 'ask_relationship' state until they provide description
    } else {
      // For predefined options, set relationship and move to next question
      setNewPerson(prev => ({ ...prev, relationship }));
      await typeMessage(`Thanks. Anything else you'd like us to know about ${newPerson.name}?`, true, 500);
      setConversationState('ask_context');
    }
  };

  const savePerson = async (personData) => {
    try {
      setIsSubmitting(true);
      await typeMessage("Saving...", true, 0);

      const session = await fetchAuthSession();
      const idToken = session.tokens?.idToken?.toString();

      const response = await fetch('https://aqaahphwfj.execute-api.us-east-2.amazonaws.com/dev/people', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': idToken
        },
        body: JSON.stringify({
          name: personData.name,
          relationship: personData.relationship,
          context: personData.context
        })
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const newPerson = await response.json();

      await typeMessage(`All set! ${personData.name} has been added.`, true, 500);

      setTimeout(() => {
        setMessages([]);
        setInputValue('');
        setNewPerson({ name: '', relationship: '', context: '' });
        setConversationState('ask_name');
        onComplete?.(newPerson); // Trigger UI refresh or navigation
      }, 1500);

    } catch (err) {
      console.error('❌ Error adding person:', err);
      await typeMessage("Something went wrong. Please try again later.", true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPlaceholderText = () => {
    if (isTyping) return '';
    switch (conversationState) {
      case 'ask_name': return "Enter their name";
      case 'ask_relationship': return `What's your relationship with ${newPerson.name}?`;
      case 'ask_context': return "Anything else we should know?";
      default: return "Type your response...";
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 z-40 overflow-y-auto">
      <div className="max-w-2xl mx-auto p-4 flex flex-col" style={{ paddingBottom: BOTTOM_NAV_HEIGHT }}>
        {/* Header section */}
        <div className="flex items-center justify-between mb-6 pt-4">
          <div className="flex items-center gap-3">
            <WellSaidIconOnboarding size={50} />
            <div>
              <img src={logo} alt="WellSaid" className="h-7 w-25" />
              <p className="text-sm text-gray-500">AI Assistant</p>
            </div>
          </div>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Chat messages section */}
        <div className="flex-1 bg-white rounded-2xl shadow-lg p-6 mb-4 overflow-y-auto">
          <div className="space-y-4">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}>
                <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl text-sm ${
                  msg.isBot ? 'bg-gray-100 text-gray-800' : 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white'
                }`}>
                  {msg.isBot ? (
                    <Typewriter text={msg.text} />
                  ) : (
                    msg.text
                  )}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 px-4 py-2 rounded-2xl">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input form section - now with conditional name input */}
        {conversationState !== 'saving' && !(conversationState === 'ask_name' && showRelationshipModal) && (
          <form
            onSubmit={handleSubmit}
            className={`fixed bottom-16 left-0 right-0 max-w-2xl mx-auto px-4 z-50 transition-opacity duration-100 ${
              conversationState === 'ask_name' && showRelationshipModal ? 'opacity-0 pointer-events-none' : 'opacity-100'
            }`}
            style={{ bottom: BOTTOM_NAV_HEIGHT }}
          >
            <div className="bg-white rounded-2xl shadow-lg p-4">
              <div className="flex gap-2 items-end">
                {conversationState === 'ask_name' ? (
                  <>
                    <div className="flex-1 relative">
                      <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Enter their name"
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey && inputValue.trim()) {
                            e.preventDefault();
                            handleSubmit(e);
                          }
                        }}
                        autoFocus
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={!inputValue.trim() || isSubmitting}
                      className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
                    >
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </>
                ) : (
                  <>
                    <textarea
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder={getPlaceholderText()}
                      className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 resize-none"
                      rows={2}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSubmit(e);
                        }
                      }}
                      disabled={isSubmitting}
                    />
                    {/* Show microphone only for context question */}
                    {conversationState === 'ask_context' && (
                      <button
                        type="button"
                        onClick={toggleRecording}
                        className={`p-3 rounded-xl ${
                          isRecording ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                        disabled={isSubmitting}
                      >
                        {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                      </button>
                    )}
                    <button
                      type="submit"
                      disabled={!inputValue.trim() || isSubmitting}
                      className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>
            </div>
          </form>
        )}

        {/* Relationship modal */}
        {showRelationshipModal && (
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[100] flex items-end transition-opacity duration-100">
            <div className="w-full bg-white rounded-t-3xl p-6 animate-slide-up">
            <RelationshipModal
              name={newPerson.name}
              onSelect={handleRelationshipSelect}
              onClose={() => setShowRelationshipModal(false)}
            />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddPersonFlow;
