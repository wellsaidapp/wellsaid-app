import { useState } from 'react';
import {
  Settings, Bell, Users, BookOpen, Lock, Wand2
} from 'lucide-react';
import Header from '../appLayout/Header';
import UserProfileCard from './subcomponents/UserProfileCard';
import ProfileMenuItem from './subcomponents/ProfileMenuItem';
import DisclosureAccordion from './subcomponents/DisclosureAccordion';
import UseDisclosureToggle from './utils/UseDisclosureToggle';
import TermsOfUse from './disclosures/TermsOfUse';
import PrivacyPolicy from './disclosures/PrivacyPolicy';
import AIDisclosure from './disclosures/AIDisclosure';

const ProfileView = ({ user, insights = [], individuals = [], collections = [], setCurrentView }) => {
  const { expandedId, toggleDisclosure } = UseDisclosureToggle();

  const disclosures = [
    {
      id: 'terms',
      title: 'Terms of Use',
      icon: <BookOpen size={18} />,
      content: <TermsOfUse /> // Using component directly
    },
    {
      id: 'privacy',
      title: 'Privacy Policy',
      icon: <Lock size={18} />,
      content: <PrivacyPolicy /> // Using component directly
    },
    {
      id: 'ai-disclosure',
      title: 'AI Disclosure',
      icon: <Wand2 size={18} />,
      content: <AIDisclosure /> // Using component directly
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-50 to-indigo-50 pb-20">
      <Header />

      <div className="p-4">
        <UserProfileCard
          user={user}
          insightsCount={insights.filter(i => i.shared).length}
          peopleCount={individuals.length}
          booksCount={collections.length}
        />

        <div className="space-y-3">
          <ProfileMenuItem icon={<Settings size={20} />} label="Account Settings" />
          <ProfileMenuItem icon={<Bell size={20} />} label="Notification Preferences" />
          <ProfileMenuItem icon={<Users size={20} />} label="Help & Support" />

          <DisclosureAccordion
            disclosures={disclosures}
            expandedId={expandedId}
            onToggle={toggleDisclosure}
          />

          <button
            onClick={() => window.location.reload()}
            className="w-full bg-white/80 backdrop-blur-sm rounded-xl p-4 text-red-600 text-center border border-white/50 shadow-sm hover:bg-gray-50 transition-colors"
          >
            Sign Out
          </button>
          {/* Copyright message */}
          <p className="text-xs text-gray-400 text-center pt-4 px-6">
            © 2025 The WellSaid App LLC. All rights reserved. “WellSaid App” is an independent product and is not associated with WellSaid Labs or any third-party entity.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
