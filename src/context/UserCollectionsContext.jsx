import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { fetchAuthSession, getCurrentUser } from 'aws-amplify/auth';

const UserCollectionsContext = createContext();

export const useUserCollections = () => useContext(UserCollectionsContext);

export const UserCollectionsProvider = ({ children }) => {
  const [userCollections, setUserCollections] = useState([]);
  const [loading, setLoading] = useState(true);

  const isUserSignedIn = async () => {
    try {
      await getCurrentUser();
      return true;
    } catch {
      return false;
    }
  };

  const fetchUserCollections = useCallback(async () => {
    try {
      setLoading(true);
      const session = await fetchAuthSession();
      const idToken = session.tokens?.idToken?.toString();

      if (!idToken) {
        setUserCollections([]);
        return;
      }

      const response = await fetch(
        'https://2rjszrulkb.execute-api.us-east-2.amazonaws.com/dev/collections/user',
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': idToken
          }
        }
      );

      const raw = await response.json();
      const collections = Array.isArray(raw) ? raw : raw.collections || [];
      setUserCollections(collections);
      console.log("USER COLLECTIONS LOADED:", collections);
      // console.log("User Collections:", collections);
    } catch (err) {
      console.error("Error fetching user collections:", err);
      setUserCollections([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshUserCollections = useCallback(() => {
    // console.log("Manually refreshing user collections...");
    return fetchUserCollections();
  }, [fetchUserCollections]);

  useEffect(() => {
    const maybeFetch = async () => {
      const signedIn = await isUserSignedIn();
      if (signedIn) {
        console.log("✅ User is signed in, fetching user collections");
        fetchUserCollections();
      } else {
        console.log("⏳ User not signed in yet, skipping user collections fetch");
      }
    };

    maybeFetch();

    const handleAuthChange = () => {
      console.log("🔁 Auth change detected — trying to refetch user collections");
      fetchUserCollections();
    };

    window.addEventListener('authChange', handleAuthChange);
    return () => window.removeEventListener('authChange', handleAuthChange);
  }, [fetchUserCollections]);

  return (
    <UserCollectionsContext.Provider value={{
      userCollections,
      loading,
      refreshUserCollections
    }}>
      {children}
    </UserCollectionsContext.Provider>
  );
};
