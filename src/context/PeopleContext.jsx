// context/PeopleContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { fetchAuthSession, getCurrentUser } from 'aws-amplify/auth';
import { getUrl, list } from 'aws-amplify/storage';


export const PeopleContext = createContext();

export const PeopleProvider = ({ children }) => {
  const [people, setPeople] = useState([]);
  const [loadingPeople, setLoadingPeople] = useState(true);

  const fetchPeople = async () => {
    setLoadingPeople(true);

    const avatarExists = async (key) => {
      try {
        const result = await list({
          path: key,
          options: { accessLevel: 'public' }
        });

        return result.items.length > 0;
      } catch (err) {
        console.warn("❌ Failed to check avatar existence:", err.message);
        return false;
      }
    };

    try {
      const user = await getCurrentUser();
      const session = await fetchAuthSession();
      const idToken = session.tokens?.idToken?.toString();
      if (!idToken) throw new Error("Missing ID token");

      const res = await fetch('https://aqaahphwfj.execute-api.us-east-2.amazonaws.com/dev/people', {
        method: 'GET',
        headers: {
          Authorization: idToken
        }
      });

      if (!res.ok) throw new Error("Failed to fetch people");

      const data = await res.json();
      console.log("👥 Raw people from API:", data);

      // 🔄 Enrich each person with avatar URL if it exists in S3
      const enriched = await Promise.all(data.map(async person => {
        const userId = user?.userId; // Cognito userId
        const folderPath = `public/Users/Active/${userId}/images/`;
        const avatarKey = `${folderPath}${person.id}.jpg`;

        try {
          const result = await list({
            path: folderPath,
            options: { accessLevel: 'public' }
          });

          const keys = result.items.map(item => {
            console.log("🔎 Raw item:", item);
            return item?.path || item;
          });
          console.log(`🧾 Files in S3 for ${person.name}:`, keys);
          console.log(`🔍 Looking for:`, avatarKey);

          const fileExists = keys.includes(avatarKey);

          if (fileExists) {
            const { url } = await getUrl({
              key: avatarKey,
              options: {
                accessLevel: 'public',
                expiresIn: 3600
              }
            });

            console.log(`✅ Found avatar for ${person.name}:`, url);
            return { ...person, avatarImage: url };
          } else {
            console.warn(`❌ No avatar found for ${person.name}`);
            return { ...person, avatarImage: null };
          }
        } catch (err) {
          console.warn(`⚠️ Error checking avatar for ${person.name}:`, err.message);
          return { ...person, avatarImage: null };
        }
      }));

      console.log("✅ All enriched people:", enriched);
      setPeople(enriched);
    } catch (err) {
      console.error("❌ Failed to load people:", err.message);
      setPeople([]);
    } finally {
      setLoadingPeople(false);
    }
  };

  useEffect(() => {
    fetchPeople();
  }, []);

  return (
    <PeopleContext.Provider value={{ people, loadingPeople, refetchPeople: fetchPeople }}>
      {children}
    </PeopleContext.Provider>
  );
};

export const usePeople = () => useContext(PeopleContext);
