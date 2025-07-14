// context/UserContext.jsx
import { createContext, useState, useEffect, useContext } from 'react';
import { fetchAuthSession, getCurrentUser } from 'aws-amplify/auth';
import { jwtDecode } from 'jwt-decode';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // ✅ Only continue if user is signed in
        const user = await getCurrentUser();
        if (!user) throw new Error("No signed-in user");

        const session = await fetchAuthSession();
        const idToken = session.tokens?.idToken?.toString();

        if (!idToken) throw new Error("Missing ID token");

        const res = await fetch("https://aqaahphwfj.execute-api.us-east-2.amazonaws.com/dev/users/me", {
          method: "GET",
          headers: {
            Authorization: idToken
          }
        });

        if (!res.ok) throw new Error("Failed to fetch user");

        const data = await res.json();
        setUserData(data);
        console.log("✅ Loaded user data:", data);
      } catch (err) {
        console.error("❌ Failed to load user data:", err.message);
      } finally {
        setLoadingUser(false);
      }
    };

    fetchUserData();
  }, []);

  return (
    <UserContext.Provider value={{ userData, loadingUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Optional helper for consuming
export const useUser = () => useContext(UserContext);
