// Imports
import React, { useState, useEffect, useRef } from 'react';
import { User, Check, Plus, Mic, Send, Home, PlusCircle, Library, MicOff } from 'lucide-react';
import WellSaidIcon from '../../../assets/icons/WellSaidIcon';

const SpecialOccasionCapture = ({ setCurrentView }) => {
    // Chat state
    const [messages, setMessages] = useState([]);
    const [currentInput, setCurrentInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [conversationState, setConversationState] = useState('init');
    const messagesEndRef = useRef(null);
    const [showPeopleSelection, setShowPeopleSelection] = useState(false);
    const [showOccasionConfirmation, setShowOccasionConfirmation] = useState(false);
    const [userProfile, setUserProfile] = useState({
      topics: [
        {
          name: 'Relationships',
          prompt: "What's one moment that challenged how you show love—and what did it teach you about staying connected?",
          tags: ['Love', 'Connection', 'Growth']
        },
        {
          name: 'Health',
          prompt: "When did you realize your approach to health needed to change—and what's stuck with you since?",
          tags: ['Wellness', 'Habits', 'Self-care']
        },
        {
          name: 'Money',
          prompt: "What's a financial decision you struggled with—but now see as a turning point in how you manage money?",
          tags: ['Finance', 'Lessons', 'Decision-making']
        }
      ],
      people: [
        { id: '1', name: 'Sage', relationship: 'daughter' },
        { id: '2', name: 'Cohen', relationship: 'son' }
      ]
    });

    // Sample data
    const people = [
      { id: '1', name: 'Sage', relationship: 'daughter', interests: 'ballet, dance' },
      { id: '2', name: 'Cohen', relationship: 'son', interests: 'business, basketball' }
    ];

    // Person creation state
    const [newPersonData, setNewPersonData] = useState({
        name: '',
        relationship: '',
        interests: '',
        collections: []
    });

    // Special Occasion state
    const [occasion, setOccasion] = useState({
        type: '',
        date: '',
        person: null,
        reflections: [],
        currentQuestionIndex: 0,
        questions: [],
        finalMessage: ''
    });

    // Occasion types with suggested questions
    const occasionTypes = {
        wedding: {
            name: "Wedding",
            questions: [
                "What's one childhood memory with them that feels especially meaningful now?",
                "What quality do you most admire in their partnership?",
                "What advice would you give about maintaining a strong relationship?"
            ]
        },
        birthday: {
            name: "Milestone Birthday",
            questions: [
                "What's something you appreciate about them at this stage of life?",
                "How have you seen them grow in the past decade?",
                "What hope do you have for their next chapter?"
            ]
        },
        graduation: {
            name: "Graduation",
            questions: [
                "What's been their most impressive accomplishment during this time?",
                "How have you seen them overcome challenges?",
                "What advice would you give as they start this new phase?"
            ]
        }
    };

    const hasInitialized = useRef(false);

    useEffect(() => {
      if (!hasInitialized.current && messages.length === 0) {
        hasInitialized.current = true;
        startMilestoneSelection();
      }
    }, []);

    // Start person creation flow
    const startPersonCreation = () => {
        setConversationState('person_creation_name');
        typeMessage("Let's add someone new to your circle.", true);
        typeMessage("First, what's their name?", true, 1000);
    };

    // Handle person creation responses
    const handlePersonCreation = (input) => {
        if (conversationState === 'person_creation_name') {
            setNewPersonData(prev => ({ ...prev, name: input }));
            setConversationState('person_creation_relationship');
            typeMessage(`Thanks. How are you related to ${input}?`, true);
            typeMessage("(e.g., 'daughter', 'friend', 'colleague')", true, 1000);
        }
        else if (conversationState === 'person_creation_relationship') {
            setNewPersonData(prev => ({ ...prev, relationship: input }));
            setConversationState('person_creation_interests');
            typeMessage("What topics or interests would you like to share with them?", true);
            typeMessage("(e.g., 'parenting advice', 'life lessons', 'funny stories')", true, 1000);
        }
        else if (conversationState === 'person_creation_interests') {
            setNewPersonData(prev => ({ ...prev, interests: input }));
            setConversationState('person_creation_complete');

            // Generate a simple ID for the new person
            const newId = `person-${Date.now()}`;
            const newPerson = {
                id: newId,
                name: newPersonData.name,
                relationship: newPersonData.relationship,
                interests: input
            };

            // Update user profile with new person
            setUserProfile(prev => ({
                ...prev,
                people: [...prev.people, newPerson]
            }));

            // Clear the new person data
            setNewPersonData({
                name: '',
                relationship: '',
                interests: '',
                collections: []
            });

            typeMessage(`Great! ${newPersonData.name} has been added to your circle.`, true);
            typeMessage("Now, let's continue with the special occasion.", true, 1000);

            // Assign this person to the occasion
            setOccasion(prev => ({
                ...prev,
                person: newPerson
            }));

            // Move to occasion type selection
            setConversationState('milestone_type');
            typeMessage("What type of occasion is this for them?", true);
            typeMessage("(e.g., 'birthday', 'wedding', 'graduation')", true, 1000);
        }
    };

    // Show person selection UI
    const showPersonSelection = () => {
        if (userProfile.people.length === 0) {
            startPersonCreation();
            return;
        }

        setConversationState('person_selection');
        typeMessage("Who is this special occasion for?", true);

        // Create a message showing all people with their relationships
        let peopleList = "Your circle:\n";
        userProfile.people.forEach((person, index) => {
            peopleList += `${index + 1}. ${person.name} (${person.relationship})\n`;
        });
        peopleList += "\nType the number or name, or say 'new' to add someone.";

        typeMessage(peopleList, true, 500);
    };

    const handlePersonSelect = (person) => {
      setOccasion(prev => ({
        ...prev,
        person: person
      }));
      setShowPeopleSelection(false);
      setConversationState('milestone_type');
      typeMessage(`Got it. This is for ${person.name}.`, true);
      typeMessage("What type of occasion is this?", true, 1000);
      typeMessage("(e.g., 'birthday', 'wedding', 'graduation')", true, 1500);
    };

    // Start adding new person
    const startAddNewPerson = () => {
        setShowPeopleSelection(false);
        startPersonCreation();
    };

    // Show occasion confirmation card
    const triggerOccasionConfirmation = () => {
        if (!occasion.person || !occasion.type) return;

        const occasionName = occasionTypes[occasion.type]?.name || occasion.type;
        let confirmationMessage = `\n**Special Occasion Details**\n`;
        confirmationMessage += `• For: ${occasion.person.name} (${occasion.person.relationship})\n`;
        confirmationMessage += `• Occasion: ${occasionName}\n`;
        confirmationMessage += occasion.date ? `• Date: ${occasion.date}\n` : `• Date: Sometime in the future\n`;
        confirmationMessage += `\nType 'confirm' to continue or edit any detail.`;

        setConversationState('occasion_confirmation');
        typeMessage(confirmationMessage, true);
    };

    // Handle occasion confirmation
    const handleOccasionConfirmation = (input) => {
        const normalizedInput = input.toLowerCase().trim();

        if (normalizedInput === 'confirm') {
            setConversationState('milestone_theme');
            typeMessage("Occasion confirmed! Would you like help reflecting on something specific?", true);
            typeMessage("Like a memory, advice, or how you've seen them grow? Or should I guide you with questions?", true, 1500);
            return;
        }

        // Check for edit requests
        if (normalizedInput.includes('for') || normalizedInput.includes('person')) {
            showPersonSelection();
        }
        else if (normalizedInput.includes('type') || normalizedInput.includes('occasion')) {
            setConversationState('milestone_type');
            typeMessage("What type of occasion is this?", true);
            typeMessage("(e.g., 'birthday', 'wedding', 'graduation')", true, 1000);
        }
        else if (normalizedInput.includes('date') || normalizedInput.includes('when')) {
            setConversationState('milestone_date');
            typeMessage("When is this occasion happening? (e.g., 'next month', 'June 15th', 'sometime next year')", true);
        }
        else {
            typeMessage("I didn't understand that. Please say 'confirm' to continue or specify what to edit.", true);
        }
    };

    const extractThemes = (reflections) => {
        // Simple theme extraction from responses
        const commonThemes = [
            'love', 'growth', 'support', 'memory',
            'pride', 'advice', 'family', 'change',
            'celebration', 'achievement', 'future'
        ];

        // Combine all reflection answers
        const allText = reflections.map(r => r.answer.toLowerCase()).join(' ');

        // Find matching themes
        const foundThemes = commonThemes.filter(theme =>
            allText.includes(theme)
        );

        // Fallback themes if none detected
        return foundThemes.length > 0
            ? foundThemes.slice(0, 3)
            : ['meaningful occasion'];
    };

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

    const startMilestoneSelection = () => {
      setConversationState('milestone_init');
      setShowPeopleSelection(true);

      typeMessage("Let's create something meaningful for a special occasion.", true);

      if (userProfile.people.length > 0) {
        typeMessage("Who is this special occasion for? Tap on a person below or add someone new.", true);
      } else {
        typeMessage("You haven't added anyone to your circle yet. Let's add someone first.", true);
      }
    };

    // Modified handleMilestoneInit to handle person selection
    const handleMilestoneInit = (input) => {
        showPersonSelection();
    };

    const handleOccasionTypeSelection = (input) => {
      const detectedType =
        input.includes('wedding') ? 'wedding' :
        input.includes('birthday') ? 'birthday' :
        input.includes('graduation') ? 'graduation' :
        input.toLowerCase().trim();

      setOccasion(prev => ({
        ...prev,
        type: detectedType
      }));

      setConversationState('milestone_date');
      typeMessage(`Got it. This is a ${detectedType === 'custom' ? 'special occasion' : detectedType}.`, true);
      typeMessage("When is it happening? (e.g., 'next month', 'June 15th', or 'sometime in the future')", true, 1500);
    };

    const handleOccasionDateSelection = (input) => {
      setOccasion(prev => ({
        ...prev,
        date: input
      }));

      // Now show the confirmation card after all questions are answered
      setConversationState('occasion_confirmation');
      setShowOccasionConfirmation(true);
      typeMessage("Here's what we have so far:", true);
    };

    const handleMilestoneConfirm = (input) => {
        // Extract date and name from input
        const dateMatch = input.match(/(January|February|March|April|May|June|July|August|September|October|November|December)/i);
        const nameMatch = input.match(/(\b[A-Z][a-z]*'s\b|\bmy\s[A-Z][a-z]*\b)/i);

        const date = dateMatch ? dateMatch[0] : '';
        const name = nameMatch ? nameMatch[0].replace("'s", "").replace("my ", "") : '';

        setOccasion(prev => ({
            ...prev,
            date,
            person: {
                ...prev.person,
                name: name || ''
            }
        }));

        setConversationState('milestone_relationship');
        typeMessage("Got it. What's your relationship with them?", true);
        typeMessage("(e.g., 'older sibling', 'parent', 'close friend')", true, 1000);
    };

    const handleMilestoneRelationship = (input) => {
        setOccasion(prev => ({
            ...prev,
            person: {
                ...prev.person,
                relationship: input
            }
        }));

        setConversationState('milestone_theme');
        typeMessage("Beautiful. Would you like help reflecting on something specific?", true);
        typeMessage("Like a memory, advice, or how you've seen them grow? Or should I guide you with questions?", true, 1500);
    };

    const handleMilestoneTheme = (input) => {
        if (input.includes('guide') || input.includes('questions')) {
            setConversationState('milestone_guided');
            beginGuidedReflection();
        } else {
            setConversationState('milestone_freeform');
            typeMessage("What would you like to share about this occasion?", true);
        }
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

    const handleMilestoneSharing = (input) => {
        // Handle sharing method selection
        typeMessage(`Great! Preparing your reflection for ${input}.`, true);
        typeMessage("Your shareable content is ready. We'll return you to the home screen.", true, 1500);
        setTimeout(() => setCurrentView('home'), 3000);
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

    const handleMilestoneFreeform = (input) => {
        setOccasion(prev => ({
            ...prev,
            reflections: [
                ...prev.reflections,
                {
                    question: "Freeform reflection",
                    answer: input
                }
            ]
        }));

        setConversationState('milestone_summary');
        generateSummary();
    };

    // Helper function for editing
    const showReflectionsForEditing = () => {
        typeMessage("Here are your reflections:", true);
        occasion.reflections.forEach((reflection, index) => {
            typeMessage(`${index + 1}. ${reflection.question}`, true, 500);
            typeMessage(`   "${reflection.answer}"`, true, 500);
        });
        typeMessage("Which number would you like to edit? Or say 'back' to return.", true, 1000);
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

    // State handler for the summary phase
    const handleMilestoneSummary = (input) => {
        if (input.toLowerCase().includes('done') || input.toLowerCase().includes('wrap')) {
            typeMessage("Your milestone reflection is complete!", true);
            typeMessage("Would you like to save this, share it, or keep editing?", true, 1500);
            setConversationState('milestone_complete');
        } else {
            // Treat as final message
            setOccasion(prev => ({
                ...prev,
                finalMessage: input
            }));
            typeMessage("Beautiful message. I've added that as the closing thought.", true);
            generateSummary(); // Show updated summary
        }
    };

    const handleInputSubmit = () => {
      if (!currentInput.trim()) return;

      const input = currentInput.trim();
      setMessages(prev => [...prev, { text: input, isBot: false }]);
      setCurrentInput('');
      scrollToBottom();

      // Person management states
      if (conversationState === 'person_selection') {
          handlePersonSelection(input);
      }
      else if (conversationState.startsWith('person_creation')) {
          handlePersonCreation(input);
      }
      // Occasion creation states
      else if (conversationState === 'milestone_type') {
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

    // Handle edit action
    const handleEdit = (field) => {
        setShowOccasionConfirmation(false);

        switch(field) {
            case 'person':
                setShowPeopleSelection(true);
                break;
            case 'type':
                setConversationState('milestone_type');
                typeMessage("What type of occasion is this?", true);
                typeMessage("(e.g., 'birthday', 'wedding', 'graduation')", true, 1000);
                break;
            case 'date':
                setConversationState('milestone_date');
                typeMessage("When is this occasion happening?", true);
                typeMessage("(e.g., 'next month', 'June 15th', 'sometime in the future')", true, 1000);
                break;
        }
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

    const getPlaceholderText = () => {
      switch (conversationState) {
        // Person management states
        case 'person_selection':
            return "Type the number or name, or 'new' to add someone";
        case 'person_creation_name':
            return "Enter their name...";
        case 'person_creation_relationship':
            return "Describe your relationship...";
        case 'person_creation_interests':
            return "What topics would you share with them?";

        // Milestone states
        case 'milestone_summary':
            return "Add final message or say 'done'";
        case 'milestone_complete':
            return "Choose 'save', 'share', or 'edit'";
        case 'milestone_init':
            return "e.g., 'My daughter's wedding'";
        case 'milestone_confirm':
            return "Tell me who and when (e.g., 'Sage's wedding in October')";
        case 'milestone_relationship':
            return "Describe your relationship...";
        case 'milestone_theme':
            return "Choose 'specific memory' or 'guide me'";
        case 'milestone_guided':
            return "Share your thoughts...";
        case 'milestone_sharing':
            return "Select sharing method (message/email/link)";
        case 'milestone_editing':
            return "What would you like to edit? (1/2/3)";
        case 'milestone_editing_reflections':
            return "Enter number to edit or 'back'";
        case 'milestone_editing_message':
            return "Enter your revised final message";
        case 'special_occasion_active':
            return "Share your thoughts...";
        default:
          return "Type your response...";
      }
    };

    useEffect(() => {
      const ready =
        occasion.person &&
        occasion.type &&
        (occasion.date || occasion.date === null);

      if (ready) {
        setShowOccasionConfirmation(true);
      }
    }, [occasion]);

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

          {/* Scrollable content area */}
          <div className="flex-1 overflow-y-auto pb-[136px] px-4">
            {/* Messages container */}
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

            {/* People Selection UI - appears below messages */}
            {showPeopleSelection && (
              <div className="bg-white rounded-2xl shadow-lg p-6 mb-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-gray-800">People in your circle</h3>
                  <span className="text-sm text-gray-500">{userProfile.people.length} added</span>
                </div>

                {userProfile.people.length > 0 ? (
                  userProfile.people.map((person, index) => (
                    <div
                      key={person.id}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg mb-2 cursor-pointer hover:bg-gray-100 transition-colors"
                      onClick={() => handlePersonSelect(person)}
                    >
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">
                          {person.name || `Person ${index + 1}`}
                        </p>
                        <p className="text-sm text-gray-500">
                          {person.relationship} {person.age && `• ${person.age} years old`}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    No people added yet
                  </div>
                )}

                <button
                  onClick={startAddNewPerson}
                  className="w-full mt-4 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add New Person
                </button>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Occasion Confirmation Card - appears below messages or people selection */}
        {showOccasionConfirmation &&
          occasion.person &&
          occasion.type &&
          (occasion.date || occasion.date === null) && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30">
            <div className="bg-white rounded-2xl shadow-lg p-6 mx-4 w-full max-w-md">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-4">Special Occasion Details</h2>

              <div className="text-left mb-6">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg mb-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">
                      {occasion.person.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {occasion.person.relationship}
                    </p>
                  </div>
                  <button
                    onClick={() => handleEdit('person')}
                    className="text-blue-500 text-sm font-medium"
                  >
                    Edit
                  </button>
                </div>

                <div className="p-3 bg-gray-50 rounded-lg mb-2">
                  <p className="font-medium text-gray-800">
                    {occasionTypes[occasion.type]?.name || occasion.type}
                  </p>
                  <button
                    onClick={() => handleEdit('type')}
                    className="text-blue-500 text-sm font-medium mt-1"
                  >
                    Edit
                  </button>
                </div>

                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="font-medium text-gray-800">
                    {occasion.date || "Sometime in the future"}
                  </p>
                  <button
                    onClick={() => handleEdit('date')}
                    className="text-blue-500 text-sm font-medium mt-1"
                  >
                    Edit
                  </button>
                </div>
              </div>

              <button
                onClick={handleConfirmation}
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-3 px-8 rounded-xl font-medium hover:from-blue-600 hover:to-indigo-600 transition-colors"
              >
                Confirm & Continue
              </button>
              </div>
          </div>
        )}

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
                      placeholder={getPlaceholderText()}
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

        {/* Bottom navigation - fixed position */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow z-10 h-[56px]">
          <div className="max-w-2xl mx-auto flex justify-around items-center h-full">
            <button onClick={() => setCurrentView('home')} className="text-gray-600 hover:text-blue-500 flex flex-col items-center">
              <Home className="w-6 h-6" />
              <span className="text-xs mt-1">Home</span>
            </button>
            <button onClick={() => setCurrentView('capture')} className="text-blue-500 flex flex-col items-center">
              <PlusCircle className="w-6 h-6" />
              <span className="text-xs mt-1">Capture</span>
            </button>
            <button onClick={() => setCurrentView('library')} className="text-gray-600 hover:text-blue-500 flex flex-col items-center">
              <Library className="w-6 h-6" />
              <span className="text-xs mt-1">Library</span>
            </button>
          </div>
        </div>
      </div>
    );
};

export default SpecialOccasionCapture;
