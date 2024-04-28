import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState(null);

  async function login(username, password) {
    if (username === 'raman' && password === 'raman') {
      setIsAuthenticated(true);
      setUsername(username);
      return true;
    } else {
      logout();
      return false;
    }
  }

  function logout() {
    setIsAuthenticated(false);
    setUsername(null);
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, username }}>
      {children}
    </AuthContext.Provider>
  );
}
