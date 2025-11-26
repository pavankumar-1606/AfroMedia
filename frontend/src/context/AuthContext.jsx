import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("afro_token"));
  const [loading, setLoading] = useState(!!token);

  useEffect(() => {
    async function loadUser() {
      if (!token) return setLoading(false);

      try {
        const res = await api.get("/users/me");
        setUser(res.data);
      } catch (err) {
        localStorage.removeItem("afro_token");
        setToken(null);
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, [token]);

  function login(token, user) {
    localStorage.setItem("afro_token", token);
    setToken(token);
    setUser(user);
  }

  function logout() {
    localStorage.removeItem("afro_token");
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
