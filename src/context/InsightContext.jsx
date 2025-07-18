import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { fetchAuthSession } from 'aws-amplify/auth';

const InsightContext = createContext();

export const useInsights = () => useContext(InsightContext);

export const InsightProvider = ({ children }) => {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchInsights = useCallback(async () => {
    try {
      setLoading(true);
      const session = await fetchAuthSession();
      const token = session.tokens?.accessToken?.toString();

      if (!token) {
        setInsights([]);
        return;
      }

      const res = await fetch(
        'https://aqaahphwfj.execute-api.us-east-2.amazonaws.com/dev/insights',
        {
          headers: { Authorization: token }
        }
      );

      if (!res.ok) throw new Error('Failed to fetch insights');

      const data = await res.json();
      setInsights(data);
      console.log("Insights loaded:", data.length);
    } catch (err) {
      console.error('Insight fetch error:', err);
      setInsights([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshInsights = useCallback(() => {
    console.log("Manually refreshing insights...");
    return fetchInsights();
  }, [fetchInsights]);

  useEffect(() => {
    const handleAuthChange = () => {
      console.log("Auth change - refreshing insights");
      fetchInsights();
    };

    // Initial load
    handleAuthChange();

    // Listen for auth changes
    window.addEventListener('authChange', handleAuthChange);
    return () => window.removeEventListener('authChange', handleAuthChange);
  }, [fetchInsights]);

  return (
    <InsightContext.Provider value={{
      insights,
      loading,
      refreshInsights,
      setInsights // Optional: if you need direct setting capability
    }}>
      {children}
    </InsightContext.Provider>
  );
};
