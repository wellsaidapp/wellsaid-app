import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { fetchAuthSession, getCurrentUser } from 'aws-amplify/auth';

const SystemCollectionsContext = createContext();

export const useSystemCollections = () => useContext(SystemCollectionsContext);

export const SystemCollectionsProvider = ({ children }) => {
  const [systemCollections, setSystemCollections] = useState([]);
  const [loading, setLoading] = useState(true);

  const isUserSignedIn = async () => {
    try {
      await getCurrentUser();
      return true;
    } catch {
      return false;
    }
  };

  const fetchSystemCollections = useCallback(async () => {
    try {
      setLoading(true);
      const session = await fetchAuthSession();
      const idToken = session.tokens?.idToken?.toString();

      if (!idToken) {
        console.warn("⚠️ No ID token available yet — delaying systemCollections fetch");
        setTimeout(fetchSystemCollections, 300); // or debounce
        return;
      }

      const response = await fetch(
        'https://2rjszrulkb.execute-api.us-east-2.amazonaws.com/dev/collections/system',
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

      console.log("System Collections from Context:", collections);
    } catch (err) {
      console.error("Failed to load system collections:", err);
      setSystemCollections([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshSystemCollections = useCallback(() => {
    // console.log("Manually refreshing system collections...");
    return fetchSystemCollections();
  }, [fetchSystemCollections]);

  useEffect(() => {
    const maybeFetch = async () => {
      const signedIn = await isUserSignedIn();
      if (signedIn) {
        console.log("✅ User is signed in, fetching system collections");
        fetchSystemCollections();
      } else {
        console.log("⏳ User not signed in yet, skipping system collections fetch");
        setSystemCollections([]);  // Clear if any
        setLoading(false);         // Prevent permanent loading spinner
      }
    };

    maybeFetch();

    const handleAuthChange = () => {
      console.log("🔁 Auth change detected — trying to refetch system collections");
      fetchSystemCollections();
    };

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
