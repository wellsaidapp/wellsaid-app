// context/PeopleContext.jsx
import { createContext, useState, useEffect, useContext } from 'react';
import { fetchAuthSession } from 'aws-amplify/auth';

export const PeopleContext = createContext();

export const PeopleProvider = ({ children }) => {
  const [people, setPeople] = useState([]);
  const [loadingPeople, setLoadingPeople] = useState(true);

  const fetchPeople = async () => {
    setLoadingPeople(true);
    try {
      const session = await fetchAuthSession();
      const idToken = session.tokens?.idToken?.toString();

      const res = await fetch('https://aqaahphwfj.execute-api.us-east-2.amazonaws.com/dev/people', {
        method: 'GET',
        headers: {
          Authorization: idToken
        }
      });

      if (!res.ok) throw new Error("Failed to fetch people");

      const data = await res.json();
      setPeople(data);
      console.log("✅ People fetched:", data);
    } catch (err) {
      console.error("❌ Failed to load people:", err.message);
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

// Optional hook
export const usePeople = () => useContext(PeopleContext);
