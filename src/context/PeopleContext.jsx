// context/PeopleContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { fetchAuthSession, getCurrentUser } from 'aws-amplify/auth';
import { getUrl, list } from 'aws-amplify/storage';

export const PeopleContext = createContext();

export const PeopleProvider = ({ children }) => {
  const [people, setPeople] = useState([]);
  const [loadingPeople, setLoadingPeople] = useState(true);

  const fetchPeople = async (suppressSplash = false) => {
    setLoadingPeople(true);

    try {
      // 1. Fetch the user and authentication token
      const user = await getCurrentUser();
      const session = await fetchAuthSession();
      const idToken = session.tokens?.idToken?.toString();
      if (!idToken) throw new Error("Missing ID token");

      // 2. Fetch people data from your API
      const res = await fetch('https://aqaahphwfj.execute-api.us-east-2.amazonaws.com/dev/people', {
        method: 'GET',
        headers: { Authorization: idToken }
      });
      if (!res.ok) throw new Error("Failed to fetch people");
      const data = await res.json();
      console.log("👥 Raw people from API:", data);

      // 3. Enrich each person with avatar URL
      const enriched = await Promise.all(data.map(async person => {
        // Remove the duplicate 'public' from the path
        const avatarKey = `Users/Active/${user.userId}/images/${person.id}.jpg`;

        try {
          const { url } = await getUrl({
            key: avatarKey,
            options: {
              accessLevel: 'public',  // This tells Amplify the file is in public storage
              expiresIn: 3600,
              validateObjectExistence: true
            }
          });

          // Enhanced logging for found avatars
          console.groupCollapsed(`✅ Found avatar for ${person.name}`);
          console.log('Person ID:', person.id);
          console.log('S3 Key:', avatarKey);
          console.log('Generated URL:', url);

          // Try to create a preview in the console
          console.log('%c ', `
            font-size: 100px;
            background: url(${url}) no-repeat;
            background-size: contain;
            padding: 50px;
          `);
          console.groupEnd();

          return { ...person, avatarUrl: url };
        } catch (error) {
          console.log(`❌ No avatar found for ${person.name} (ID: ${person.id})`);
          console.log('Full attempted path:', `public/${avatarKey}`);
          return { ...person, avatarUrl: null };
        }
      }));

      setPeople(enriched);
      console.log("✅ Loaded people data:", enriched);
    } catch (err) {
      console.error("❌ Failed to load people:", err);
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
