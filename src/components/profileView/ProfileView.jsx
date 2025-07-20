import { useState, useEffect, useContext } from 'react';
import { useUser } from '../../context/UserContext';
import {
  Settings, Bell, Users, BookOpen, Lock, Wand2, X, XCircle
} from 'lucide-react';
import UserProfileCard from './subcomponents/UserProfileCard';
import ProfileMenuItem from './subcomponents/ProfileMenuItem';
import DisclosureAccordion from './subcomponents/DisclosureAccordion';
import UseDisclosureToggle from './utils/UseDisclosureToggle';
import TermsOfUse from './disclosures/TermsOfUse';
import PrivacyPolicy from './disclosures/PrivacyPolicy';
import AIDisclosure from './disclosures/AIDisclosure';
import { useBooks } from '../../context/BooksContext';
import ImageCropperModal from '../library/BookCreation/ImageCropperModal';
import AccountSettings from './subcomponents/AccountSettings';
import NotificationSettings from './subcomponents/NotificationSettings';
import HelpAndSupport from './subcomponents/HelpAndSupport';

import { signOut, getCurrentUser, fetchUserAttributes, fetchAuthSession } from '@aws-amplify/auth';
import { uploadData, getUrl } from 'aws-amplify/storage';

const ProfileView = ({ user, insights = [], individuals = [], collections = [], setCurrentView }) => {
  const { userData, loadingUser, refetchUser } = useUser();
  const {
    loadingBooks,
    getRecentBooks,
    getPublishedBooksCount
  } = useBooks();
  const { expandedId, toggleDisclosure } = UseDisclosureToggle();
  const [currentUser, setCurrentUser] = useState(user);
  const [showAccountSettings, setShowAccountSettings] = useState(false);
  const [avatarUploadTemp, setAvatarUploadTemp] = useState(null);
  const [showAvatarCropper, setShowAvatarCropper] = useState(false);
  const [croppedAvatarImage, setCroppedAvatarImage] = useState(null);
  const [showNotificationSettings, setShowNotificationSettings] = useState(false);
  const [showHelpSupport, setShowHelpSupport] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const disclosures = [
    {
      id: 'terms',
      title: 'Terms of Use',
      icon: <BookOpen size={18} />,
      content: <TermsOfUse />
    },
    {
      id: 'privacy',
      title: 'Privacy Policy',
      icon: <Lock size={18} />,
      content: <PrivacyPolicy />
    },
    {
      id: 'ai-disclosure',
      title: 'AI Disclosure',
      icon: <Wand2 size={18} />,
      content: <AIDisclosure />
    }
  ];

  const handleAddPersonComplete = async (result) => {
    try {
      // Immediately close the modal (instant UX)
      setShowAddPerson(false);

      // Wait for data hydration to complete
      await result.hydrationPromise;

      // Optional: Scroll to/show the new person
      if (result.newPerson.id) {
        setHighlightedPerson(result.newPerson.id);
      }

    } catch (err) {
      // Optional: Reopen modal if needed
      setShowAddPerson(true);
      toast.error("Failed to refresh people list");
    }
  };

  // Add this handler for saving the cropped avatar
  const handleAvatarSave = async (croppedImage) => {
    setCroppedAvatarImage(croppedImage);
    setShowAvatarCropper(false);
    setAvatarUploadTemp(null);
    console.log('New avatar image (Data URL):', croppedImage);

    try {
      const userId = userData?.cognitoId;
      const fileName = `Users/Active/${userId}/images/${userId}.jpg`;

      // ✅ Convert base64 Data URL to Blob
      const base64Data = croppedImage.split(',')[1];
      const byteCharacters = atob(base64Data);
      const byteArrays = [];

      for (let i = 0; i < byteCharacters.length; i += 512) {
        const slice = byteCharacters.slice(i, i + 512);
        const byteNumbers = new Array(slice.length);
        for (let j = 0; j < slice.length; j++) {
          byteNumbers[j] = slice.charCodeAt(j);
        }
        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
      }

      const imageBlob = new Blob(byteArrays, { type: 'image/jpeg' });

      // ✅ Upload Blob to S3
      await uploadData({
        key: fileName,
        data: imageBlob,
        options: {
          contentType: 'image/jpeg',
          accessLevel: 'public'
        }
      }).result;

      const { url: avatarUrl } = await getUrl({
        key: fileName,
        options: {
          accessLevel: 'public'
        }
      });

      console.log("🖼 Avatar uploaded to:", avatarUrl);

      await handleUpdateUser({ avatar: avatarUrl });
      await refetchUser(true); // Refetch context
    } catch (err) {
      console.error("❌ Error uploading avatar to S3:", err);
    }
  };

  const handleUpdateUser = async (updatedData) => {
    try {
      const session = await fetchAuthSession();
      const idToken = session.tokens?.idToken?.toString();

      console.log('🧾 ID Token:', idToken);

      if (!idToken) throw new Error("Could not get user ID token");

      const response = await fetch('https://aqaahphwfj.execute-api.us-east-2.amazonaws.com/dev/users/settings/account', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: idToken
        },
        body: JSON.stringify(updatedData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update user');
      }

      setCurrentUser(prev => ({
        ...prev,
        ...updatedData
      }));
      console.log('✅ User updated on server and locally:', updatedData);
      await refetchUser(true); // Refetch context

    } catch (error) {
      console.error('❌ Failed to update user:', error.message);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      // Here you would typically make an API call to delete the account
      console.log('Account deletion confirmed for user:', currentUser.id);
      // If you had an API call, it would look something like:
      // await api.deleteUser(currentUser.id);
      // Then you would typically redirect to the login/signup page
      // window.location.href = '/login';
    } catch (error) {
      console.error('Failed to delete account:', error);
      // You might want to show an error message to the user here
    }
  };

  if (showAccountSettings) {
    return (
      <AccountSettings
        user={userData}
        onBack={() => setShowAccountSettings(false)}
        onUpdateUser={handleUpdateUser}
        onDeleteAccount={handleDeleteAccount}
      />
    );
  }

  if (showNotificationSettings) {
    return (
      <NotificationSettings
        user={currentUser}
        onBack={() => setShowNotificationSettings(false)}
        onUpdateNotificationSettings={(newSettings) => {
          // Update your user's notification settings here
          console.log('Updating notification settings:', newSettings);
          // Typically you would make an API call here
          setCurrentUser(prev => ({
            ...prev,
            notificationSettings: newSettings
          }));
        }}
      />
    );
  }

  if (showHelpSupport) {
    return <HelpAndSupport onBack={() => setShowHelpSupport(false)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-50 to-indigo-50 pb-20">
      <div className="p-4">
        <UserProfileCard
          user={{ ...userData, avatarImage: userData?.avatarUrl?.href }}
          insightsCount={insights.length}
          peopleCount={individuals.length}
          booksCount={getPublishedBooksCount()}
          className="mb-4"
          onAvatarUpload={(image) => {
            setAvatarUploadTemp(image);
            setShowAvatarCropper(true);
          }}
          croppedAvatarImage={croppedAvatarImage}
          joinDate={userData?.createdAt
            ? new Date(userData.createdAt).toLocaleDateString('en-US', {
                month: 'long',
                year: 'numeric'
              })
            : 'Unknown'}
        />

        <div className="space-y-3">
          <ProfileMenuItem
            icon={<Settings size={20}/>}
            label="Account Settings"
            onClick={() => setShowAccountSettings(true)}
            showChevron={true}
          />
          <ProfileMenuItem
            icon={<Bell size={20}/>}
            label="Notification Preferences"
            onClick={() => setShowNotificationSettings(true)}
          />
          <ProfileMenuItem
            icon={<Users size={20}/>}
            label="Help & Support"
            onClick={() => setShowHelpSupport(true)}
          />

          <DisclosureAccordion
            disclosures={disclosures}
            expandedId={expandedId}
            onToggle={toggleDisclosure}
          />

          <button
            onClick={async () => {
              setIsSigningOut(true); // Start loading
              try {
                await signOut(); // signs out from Cognito
                localStorage.removeItem('wellsaid-auth-state'); // clear your custom flag
                window.location.reload(); // re-triggers App state logic (or route to Splash/Login)
              } catch (err) {
                console.error('Sign out failed:', err);
                setIsSigningOut(false); // Stop loading on error
              }
            }}
            disabled={isSigningOut}
            className={`w-full bg-white/80 backdrop-blur-sm rounded-xl p-4 text-red-600 text-center border border-white/50 shadow-sm hover:bg-gray-50 transition-colors flex items-center justify-center ${isSigningOut ? 'opacity-75' : ''}`}
          >
            {isSigningOut ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing Out...
              </>
            ) : (
              'Sign Out'
            )}
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
