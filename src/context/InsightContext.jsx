import React, { createContext, useContext, useEffect, useState } from 'react';
import { fetchAuthSession } from 'aws-amplify/auth';

const InsightContext = createContext();

export const useInsights = () => useContext(InsightContext);

export const InsightProvider = ({ children }) => {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const session = await fetchAuthSession();
        const token = session.tokens?.accessToken?.toString();

        const res = await fetch(
          'https://aqaahphwfj.execute-api.us-east-2.amazonaws.com/dev/insights',
          {
            method: 'GET',
            headers: {
              Authorization: token
            }
          }
        );

        if (!res.ok) throw new Error('Failed to fetch insights');
        const data = await res.json();
        console.log("Insights response:", data);
        setInsights(data);
      } catch (err) {
        console.error('Error fetching insights:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchInsights();
  }, []);

  return (
    <InsightContext.Provider value={{ insights, loading }}>
      {children}
    </InsightContext.Provider>
  );
};
