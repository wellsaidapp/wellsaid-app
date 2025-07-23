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
    try {
      setLoadingPeople(true);
      const session = await fetchAuthSession();
      const idToken = session.tokens?.idToken?.toString();

      if (!idToken) {
        setPeople([]); // Clear if unauthenticated
        return;
      }

      const response = await fetch(
        'https://aqaahphwfj.execute-api.us-east-2.amazonaws.com/dev/people',
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: idToken,
          },
        }
      );

      const raw = await response.json();
      const people = Array.isArray(raw) ? raw : raw.people || [];
      setPeople(people);
      console.log('👥 People Loaded:', people);
    } catch (err) {
      console.error('❌ Failed to load people:', err);
      setPeople([]);
    } finally {
      setLoadingPeople(false);
    }
  }, []);

  const refreshPeople = useCallback(async (preserveSelectedId = null) => {
    console.log("🔄 Manually refreshing people...");
    await fetchPeople();

    if (preserveSelectedId) {
      const refreshed = people.find(p => p.id === preserveSelectedId);
      return refreshed || null;
    }
  }, [fetchPeople, people]);

  useEffect(() => {
    const checkAuthAndFetch = async () => {
      try {
        const session = await fetchAuthSession();
        if (session.tokens?.idToken) {
          await fetchPeople();
        }
      } catch (err) {
        console.error('Auth check failed (People):', err);
      }
    };

    checkAuthAndFetch();

    const listener = () => checkAuthAndFetch();
    window.addEventListener('authChange', listener);
    return () => window.removeEventListener('authChange', listener);
  }, [fetchPeople]);

  // Initial fetch
  useEffect(() => {
    fetchPeople();
  }, [fetchPeople]);

  return (
    <PeopleContext.Provider value={{
      people,
      loadingPeople,
      refreshPeople,
      refetchPeople: fetchPeople, // Expose fetch function
      updatePerson,
      removePerson
    }}>
      {children}
    </PeopleContext.Provider>
  );
};

export const usePeople = () => useContext(PeopleContext);
