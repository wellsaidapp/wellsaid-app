import { createContext, useContext, useEffect, useState } from 'react';
import { fetchAuthSession } from 'aws-amplify/auth';

const UserCollectionsContext = createContext();

export const useUserCollections = () => useContext(UserCollectionsContext);

export const UserCollectionsProvider = ({ children }) => {
  const [userCollections, setUserCollections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserCollections = async () => {
      try {
        const session = await fetchAuthSession();
        const idToken = session.tokens?.idToken?.toString();

        if (!idToken) throw new Error("No ID token found");

        const response = await fetch(
          'https://aqaahphwfj.execute-api.us-east-2.amazonaws.com/dev/collections/user',
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': idToken // 🔄 Matches SystemCollections style
            }
          }
        );

        const raw = await response.json();
        console.log("📦 User collections response:", raw);

        const collections = Array.isArray(raw) ? raw : raw.collections || [];
        setUserCollections(collections);
      } catch (err) {
        console.error("❌ Error fetching user collections:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserCollections();
  }, []);

  return (
    <UserCollectionsContext.Provider value={{ userCollections, loading }}>
      {children}
    </UserCollectionsContext.Provider>
  );
};
