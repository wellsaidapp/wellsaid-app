// context/PeopleContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { fetchAuthSession, getCurrentUser } from 'aws-amplify/auth';

export const PeopleContext = createContext();

export const PeopleProvider = ({ children }) => {
  const [people, setPeople] = useState([]);
  const [loadingPeople, setLoadingPeople] = useState(true);

  const fetchPeople = async () => {
    setLoadingPeople(true);
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
      console.log("👥 Loaded people:", data);
      setPeople(data);
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
