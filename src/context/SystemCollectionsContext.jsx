import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { fetchAuthSession } from 'aws-amplify/auth';

const SystemCollectionsContext = createContext();

export const useSystemCollections = () => useContext(SystemCollectionsContext);

export const SystemCollectionsProvider = ({ children }) => {
  const [systemCollections, setSystemCollections] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSystemCollections = useCallback(async () => {
    try {
      setLoading(true);
      const session = await fetchAuthSession();
      const idToken = session.tokens?.idToken?.toString();

      if (!idToken) {
        setSystemCollections([]);
        return;
      }

      const response = await fetch(
        'https://aqaahphwfj.execute-api.us-east-2.amazonaws.com/dev/collections/system',
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': idToken
          }
        }
      );

      const raw = await response.json();
      const collections = Array.isArray(raw) ? raw : raw.collections || [];
      setSystemCollections(collections);
    } catch (err) {
      console.error("Failed to load system collections:", err);
      setSystemCollections([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshSystemCollections = useCallback(() => {
    console.log("Manually refreshing system collections...");
    return fetchSystemCollections();
  }, [fetchSystemCollections]);

  useEffect(() => {
    const handleAuthChange = () => {
      console.log("Auth change - refreshing system collections");
      fetchSystemCollections();
    };

    // Initial load
    handleAuthChange();

    // Listen for auth changes
    window.addEventListener('authChange', handleAuthChange);
    return () => window.removeEventListener('authChange', handleAuthChange);
  }, [fetchSystemCollections]);

  return (
    <SystemCollectionsContext.Provider value={{
      systemCollections,
      loading,
      refreshSystemCollections
    }}>
      {children}
    </SystemCollectionsContext.Provider>
  );
};
