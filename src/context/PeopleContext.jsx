// context/PeopleContext.jsx
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { fetchAuthSession, getCurrentUser } from 'aws-amplify/auth';

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

  const isUserSignedIn = async () => {
    try {
      await getCurrentUser();
      return true;
    } catch {
      return false;
    }
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
        'https://2rjszrulkb.execute-api.us-east-2.amazonaws.com/dev/people',
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: idToken,
          },
        }
      );

      const raw = await response.json();
      const peopleRaw = Array.isArray(raw) ? raw : raw.people || [];
      const timestamp = Date.now();
      const people = peopleRaw.map(p => ({
        ...p,
        avatarUrl: p.avatarUrl ? `${p.avatarUrl}?t=${timestamp}` : null
      }));
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
    // console.log("🔄 [refreshPeople] Starting refresh...");
    try {
      await fetchPeople();
      // console.log("🔄 [refreshPeople] Refresh completed. Current people:", people);

      if (preserveSelectedId) {
        const refreshed = people.find(p => p.id === preserveSelectedId);
        // console.log(`🔄 [refreshPeople] Found refreshed person with ID ${preserveSelectedId}:`, refreshed);
        return refreshed || null;
      }
      return people;
    } catch (error) {
      console.error("❌ [refreshPeople] Error during refresh:", error);
      throw error;
    }
  }, [fetchPeople, people]);

  useEffect(() => {
    const maybeFetch = async () => {
      const signedIn = await isUserSignedIn();
      if (signedIn) {
        console.log("✅ User is signed in, fetching people");
        fetchPeople();
      } else {
        console.log("⏳ User not signed in yet, skipping people fetch");
      }
    };

    maybeFetch();

    const listener = () => {
      console.log("🔁 Auth change detected — refreshing people");
      fetchPeople();
    };

    window.addEventListener('authChange', listener);
    return () => window.removeEventListener('authChange', listener);
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
