import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/client";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const token = localStorage.getItem("access_token");
      if (token) {
        try {
          const userData = await api("/user/");
          setUser(userData);
        } catch (err) {
          localStorage.removeItem("access_token");
          setUser(null);
        }
      }
      setLoading(false);
    };
    checkUser();
  }, []);

  const login = async (email, password) => {
    try {
      const data = await api("/token/", {
        body: { email, password },
      });
      localStorage.setItem("access_token", data.access);
      localStorage.setItem("refresh_token", data.refresh);
      const userData = await api("/user/");
      setUser(userData);
      return userData;
    } catch (err) {
      throw err;
    }
  };

  const register = async (email, password) => {
    try {
      await api("/register/", {
        body: { email, password },
      });
      return login(email, password);
    } catch (err) {
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
