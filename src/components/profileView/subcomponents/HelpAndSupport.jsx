import { useState } from 'react';
import { ChevronLeft, Mail, MessageSquare, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import Header from '../../appLayout/Header';

const HelpAndSupport = ({ onBack }) => {
  const [expandedFaq, setExpandedFaq] = useState(null);

  const toggleFaq = (id) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  const faqs = [
    {
      id: 1,
      question: "How do I reset my password?",
      answer: "You can reset your password from the login screen by clicking 'Forgot Password'. You'll receive an email with instructions to create a new password."
    },
    {
      id: 2,
      question: "How are insights calculated?",
      answer: "Insights are generated based on your reading activity and patterns. The more you read and engage with content, the more personalized your insights become."
    },
    {
      id: 3,
      question: "Can I use WellSaid on multiple devices?",
      answer: "Yes! Your account syncs across all devices. Just log in with the same credentials on each device to access your library."
    },
    {
      id: 4,
      question: "How do I set reading goals?",
      answer: "Navigate to Account Settings > Weekly Insights Goal to set your target. You can adjust this anytime based on your reading habits."
    },
    {
      id: 5,
      question: "Is there a mobile app available?",
      answer: "Yes, WellSaid is available on both iOS and Android. Download it from the App Store or Google Play Store."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-50 to-indigo-50 pb-20">
      <Header />
      <div className="p-4">
        <button
          onClick={onBack}
          className="flex items-center mb-4 text-blue-600 hover:text-blue-800 transition-colors"
        >
          <ChevronLeft size={20} className="mr-1" />
          Back to Profile
        </button>

        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 mb-4 border border-white/50 shadow-sm">
          <div className="flex items-center mb-6">
            <HelpCircle size={24} className="mr-2 text-blue-600" />
            <h2 className="text-xl font-semibold">Help & Support</h2>
          </div>

          {/* Contact Support Card */}
          <div className="bg-blue-50 rounded-lg p-4 mb-8 border border-blue-100">
            <div className="flex items-start">
              <Mail size={20} className="mt-1 mr-3 text-blue-600" />
              <div>
                <h3 className="font-medium text-gray-800 mb-1">Contact Support</h3>
                <p className="text-gray-600 mb-3">
                  Can't find what you're looking for? Our team is happy to help!
                </p>
                <a
                  href="mailto:hello@wellsaidapp.com"
                  className="inline-flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <MessageSquare size={16} className="mr-2" />
                  Email hello@wellsaidapp.com
                </a>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mb-6">
            <h3 className="font-medium text-gray-800 mb-4">Frequently Asked Questions</h3>
            <div className="space-y-3">
              {faqs.map((faq) => (
                <div key={faq.id} className="border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full flex justify-between items-center p-4 text-left hover:bg-gray-50 transition-colors"
                  >
                    <span className="font-medium text-gray-800">{faq.question}</span>
                    {expandedFaq === faq.id ? (
                      <ChevronUp size={20} className="text-gray-500" />
                    ) : (
                      <ChevronDown size={20} className="text-gray-500" />
                    )}
                  </button>
                  {expandedFaq === faq.id && (
                    <div className="p-4 pt-0 text-gray-600 bg-gray-50">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Resources Section */}
          <div>
            <h3 className="font-medium text-gray-800 mb-3">Additional Resources</h3>
            <div className="grid gap-3">
              <a href="#" className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors block">
                <div className="font-medium text-gray-800">User Guide</div>
                <div className="text-sm text-gray-500">Learn how to get the most from WellSaid</div>
              </a>
              <a href="#" className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors block">
                <div className="font-medium text-gray-800">Community Forum</div>
                <div className="text-sm text-gray-500">Connect with other users</div>
              </a>
              <a href="#" className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors block">
                <div className="font-medium text-gray-800">Video Tutorials</div>
                <div className="text-sm text-gray-500">Watch step-by-step guides</div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpAndSupport;
