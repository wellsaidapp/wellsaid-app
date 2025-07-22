// context/UserContext.jsx
import { createContext, useState, useEffect, useContext } from 'react';
import { fetchAuthSession, getCurrentUser } from 'aws-amplify/auth';
import { getUrl } from 'aws-amplify/storage';
import { jwtDecode } from 'jwt-decode';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const fetchUserData = async (suppressSplash = false) => {

    if (!suppressSplash) {
      setLoadingUser(true);
    }
    try {
      const user = await getCurrentUser();
      console.log("🧑 Current Cognito user:", user);
      if (!user) throw new Error("No signed-in user");

      const session = await fetchAuthSession();
      console.log("🪪 Session tokens:", session.tokens);
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

      const cognitoId = user.userId; // or data.cognitoId if your API returns it now

      // 🖼 Try loading avatar image from S3
      const avatarKey = `Users/Active/${cognitoId}/images/${cognitoId}.jpg`;

      try {
        const { url } = await getUrl({
          key: avatarKey,
          options: {
            accessLevel: 'public', // or 'private' if using that
            expiresIn: 3600
          }
        });

        data.avatarUrl = url;
      } catch (avatarErr) {
        console.warn("⚠️ No avatar found or failed to load:", avatarErr.message);
        data.avatarUrl = null;
      }

      setUserData(data);
      console.log("✅ Loaded user data:", data);
    } catch (err) {
      console.error("❌ Failed to load user data:", err.message);
    } finally {
      setLoadingUser(false);
    }
  };

  // Run once on mount
  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <UserContext.Provider value={{ userData, loadingUser, refetchUser: fetchUserData }}>
      {children}
    </UserContext.Provider>
  );
};

// Optional helper for consuming
export const useUser = () => useContext(UserContext);
