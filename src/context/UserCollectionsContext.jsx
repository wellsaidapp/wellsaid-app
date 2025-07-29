import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { fetchAuthSession } from 'aws-amplify/auth';

const UserCollectionsContext = createContext();

export const useUserCollections = () => useContext(UserCollectionsContext);

export const UserCollectionsProvider = ({ children }) => {
  const [userCollections, setUserCollections] = useState([]);
  const [loading, setLoading] = useState(true);

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
    const handleAuthChange = () => {
      // console.log("Auth change - refreshing user collections");
      fetchUserCollections();
    };

    // Initial load
    handleAuthChange();

    // Listen for auth changes
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
