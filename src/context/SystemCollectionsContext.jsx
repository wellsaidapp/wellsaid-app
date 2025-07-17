import { createContext, useContext, useEffect, useState } from 'react';
import { fetchAuthSession } from 'aws-amplify/auth';

const SystemCollectionsContext = createContext();

export const useSystemCollections = () => useContext(SystemCollectionsContext);

export const SystemCollectionsProvider = ({ children }) => {
  const [systemCollections, setSystemCollections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSystemCollections = async () => {
      try {
        const session = await fetchAuthSession();
        const idToken = session.tokens?.idToken?.toString();

        if (!idToken) throw new Error("No ID token found");

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
        console.log("📦 System collections response:", raw);
        const collections = Array.isArray(raw) ? raw : raw.collections || [];

        setSystemCollections(collections);
      } catch (err) {
        console.error("❌ Failed to load system collections:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSystemCollections();
  }, []);

  return (
    <SystemCollectionsContext.Provider value={{ systemCollections, loading }}>
      {children}
    </SystemCollectionsContext.Provider>
  );
};
