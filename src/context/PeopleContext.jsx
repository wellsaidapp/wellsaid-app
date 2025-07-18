// context/PeopleContext.jsx
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { fetchAuthSession } from 'aws-amplify/auth';

export const PeopleContext = createContext();

export const PeopleProvider = ({ children }) => {
  const [people, setPeople] = useState([]);
  const [loadingPeople, setLoadingPeople] = useState(true);

  const updatePerson = (updatedPerson) => {
    setPeople(prev =>
      prev.map(p => (p.id === updatedPerson.id ? { ...p, ...updatedPerson } : p))
    );
  };

  const removePerson = (personId) => {
    setPeople((prevPeople) => prevPeople.filter(p => p.id !== personId));
  };

  const fetchPeople = useCallback(async () => {
    setLoadingPeople(true);
    try {
      const session = await fetchAuthSession();
      const idToken = session.tokens?.idToken?.toString();
      if (!idToken) {
        setPeople([]);
        return;
      }

      const res = await fetch('https://aqaahphwfj.execute-api.us-east-2.amazonaws.com/dev/people', {
        headers: { Authorization: idToken }
      });

      const data = await res.json();
      setPeople(data);
    } catch (err) {
      console.error("People fetch error:", err);
      setPeople([]);
    } finally {
      setLoadingPeople(false);
    }
  }, []);

  // Add event listener for auth changes
  useEffect(() => {
    const handleAuthChange = () => fetchPeople();
    window.addEventListener('authChange', handleAuthChange);
    return () => window.removeEventListener('authChange', handleAuthChange);
  }, [fetchPeople]);

  // Initial fetch
  useEffect(() => {
    fetchPeople();
  }, [fetchPeople]);

  return (
    <PeopleContext.Provider value={{
      people,
      loadingPeople,
      refetchPeople: fetchPeople, // Expose fetch function
      updatePerson,
      removePerson
    }}>
      {children}
    </PeopleContext.Provider>
  );
};

export const usePeople = () => useContext(PeopleContext);
