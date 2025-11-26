import { useState } from "react";
import api from "../api/client";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

export default function LoginSignupPage() {
  const [mode, setMode] = useState("login"); 
  const [loginData, setLoginData] = useState({ identifier: "", password: "" });
  const [signupData, setSignupData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  async function submitLogin(e) {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", loginData);
      login(res.data.token, res.data.user);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  }

  async function submitSignup(e) {
    e.preventDefault();
    try {
      const res = await api.post("/auth/signup", signupData);
      login(res.data.token, res.data.user);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={{ marginBottom: "0.5rem" }}>AfroMedia</h1>
        <p>{mode === "login" ? "Login to continue" : "Create an account"}</p>

        <div style={styles.tabContainer}>
          <button
            style={mode === "login" ? styles.activeTab : styles.tab}
            onClick={() => setMode("login")}
          >
            Login
          </button>
          <button
            style={mode === "signup" ? styles.activeTab : styles.tab}
            onClick={() => setMode("signup")}
          >
            Sign Up
          </button>
        </div>

        {error && <div style={styles.error}>{error}</div>}

        {mode === "login" ? (
          <form onSubmit={submitLogin}>
            <input
              placeholder="Username or Email"
              style={styles.input}
              value={loginData.identifier}
              onChange={(e) =>
                setLoginData({ ...loginData, identifier: e.target.value })
              }
            />
            <input
              type="password"
              placeholder="Password"
              style={styles.input}
              value={loginData.password}
              onChange={(e) =>
                setLoginData({ ...loginData, password: e.target.value })
              }
            />
            <button style={styles.primaryButton}>Login</button>
          </form>
        ) : (
          <form onSubmit={submitSignup}>
            <input
              placeholder="Username"
              style={styles.input}
              value={signupData.username}
              onChange={(e) =>
                setSignupData({ ...signupData, username: e.target.value })
              }
            />
            <input
              placeholder="Email"
              style={styles.input}
              value={signupData.email}
              onChange={(e) =>
                setSignupData({ ...signupData, email: e.target.value })
              }
            />
            <input
              type="password"
              placeholder="Password"
              style={styles.input}
              value={signupData.password}
              onChange={(e) =>
                setSignupData({ ...signupData, password: e.target.value })
              }
            />
            <button style={styles.primaryButton}>Create Account</button>
          </form>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    height: "100vh",
    background: "#000",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: "350px",
    background: "#111",
    padding: "20px",
    borderRadius: "12px",
    textAlign: "center",
  },
  tabContainer: {
    display: "flex",
    marginTop: "15px",
    marginBottom: "15px",
    background: "#222",
    borderRadius: "30px",
  },
  tab: {
    flex: 1,
    padding: "8px",
    border: "none",
    background: "transparent",
    color: "white",
    cursor: "pointer",
  },
  activeTab: {
    flex: 1,
    padding: "8px",
    border: "none",
    background: "white",
    color: "black",
    cursor: "pointer",
    borderRadius: "30px",
  },
  input: {
    width: "100%",
    marginTop: "10px",
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #333",
    background: "#000",
    color: "white",
  },
  primaryButton: {
    width: "100%",
    marginTop: "15px",
    padding: "10px",
    background: "white",
    color: "black",
    borderRadius: "30px",
    border: "none",
    cursor: "pointer",
  },
  error: {
    background: "#331111",
    padding: "8px",
    borderRadius: "8px",
    color: "#ffaaaa",
    marginBottom: "10px",
  },
};
