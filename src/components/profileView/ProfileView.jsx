import { useState } from 'react';
import {
  Settings, Bell, Users, BookOpen, Lock, Wand2, X, XCircle
} from 'lucide-react';
import Header from '../appLayout/Header';
import UserProfileCard from './subcomponents/UserProfileCard';
import ProfileMenuItem from './subcomponents/ProfileMenuItem';
import DisclosureAccordion from './subcomponents/DisclosureAccordion';
import UseDisclosureToggle from './utils/UseDisclosureToggle';
import TermsOfUse from './disclosures/TermsOfUse';
import PrivacyPolicy from './disclosures/PrivacyPolicy';
import AIDisclosure from './disclosures/AIDisclosure';
import { SHARED_BOOKS, getRecentBooks, getPublishedBooksCount } from '../../constants/sharedBooks';
import ImageCropperModal from '../library/BookCreation/ImageCropperModal';

const ProfileView = ({ user, insights = [], individuals = [], collections = [], setCurrentView }) => {
  const { expandedId, toggleDisclosure } = UseDisclosureToggle();

  // Add these state variables for avatar cropping
  const [avatarUploadTemp, setAvatarUploadTemp] = useState(null);
  const [showAvatarCropper, setShowAvatarCropper] = useState(false);
  const [croppedAvatarImage, setCroppedAvatarImage] = useState(null);

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

  // Add this handler for saving the cropped avatar
  const handleAvatarSave = (croppedImage) => {
    setCroppedAvatarImage(croppedImage);
    setShowAvatarCropper(false);
    setAvatarUploadTemp(null);
    // Here you would typically also update the user's avatar in your database/state
    console.log('New avatar image:', croppedImage);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-50 to-indigo-50 pb-20">
      <Header />

      <div className="p-4">
        <UserProfileCard
          user={user}
          insightsCount={insights.length}
          peopleCount={individuals.length}
          booksCount={getPublishedBooksCount()}
          className="mb-4"
          onAvatarUpload={(image) => {
            setAvatarUploadTemp(image);
            setShowAvatarCropper(true);
          }}
          croppedAvatarImage={croppedAvatarImage}
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
      {/* Add the ImageCropperModal at the bottom */}
      {showAvatarCropper && avatarUploadTemp && (
        <ImageCropperModal
          image={avatarUploadTemp}
          onCropComplete={handleAvatarSave}
          onClose={() => {
            setShowAvatarCropper(false);
            setAvatarUploadTemp(null);
          }}
        />
      )}
    </div>
  );
};

export default ProfileView;
