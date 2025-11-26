import { useState, useEffect } from "react";
import api from "../api/client";
import { useAuth } from "../context/AuthContext.jsx";

export default function HomeLayout() {
  const { user, logout } = useAuth();
  const [posts, setPosts] = useState([]);
  const [suggested, setSuggested] = useState([]);

  useEffect(() => {
    api.get("/posts/feed").then((res) => setPosts(res.data));
    api.get("/users/suggested").then((res) => setSuggested(res.data));
  }, []);

  return (
    <div style={{ display: "flex", height: "100vh", background: "#000" }}>
      {/* LEFT SIDEBAR */}
      <aside style={styles.sidebar}>
        <h2 style={{ marginBottom: "20px" }}>AfroMedia</h2>

        <div style={styles.menuItem}>🏠 Home</div>
        <div style={styles.menuItem}>🔍 Search</div>
        <div style={styles.menuItem}>🧭 Explore</div>
        <div style={styles.menuItem}>✉ Messages</div>
        <div style={styles.menuItem}>⚙ Settings</div>

        <button onClick={logout} style={styles.logoutButton}>
          Logout
        </button>
      </aside>

      {/* FEED */}
      <main style={styles.feed}>
        <h2>Feed</h2>
        {posts.map((p) => (
          <div key={p.id} style={styles.post}>
            <b>@{p.username}</b>
            <p>{p.content}</p>
          </div>
        ))}
      </main>

      {/* RIGHT PANEL */}
      <aside style={styles.rightPanel}>
        <h3>Suggested</h3>
        {suggested.map((u) => (
          <div key={u.id} style={styles.suggestItem}>
            <span>@{u.username}</span>
          </div>
        ))}
      </aside>
    </div>
  );
}

const styles = {
  sidebar: {
    width: "220px",
    padding: "20px",
    borderRight: "1px solid #222",
    color: "white",
  },
  menuItem: {
    padding: "10px 0",
    cursor: "pointer",
    color: "#ddd",
  },
  logoutButton: {
    marginTop: "30px",
    padding: "10px",
    background: "white",
    color: "black",
    width: "100%",
    borderRadius: "8px",
    cursor: "pointer",
  },
  feed: {
    flex: 1,
    padding: "20px",
    overflowY: "scroll",
    color: "white",
  },
  post: {
    background: "#111",
    padding: "15px",
    borderRadius: "8px",
    marginBottom: "15px",
  },
  rightPanel: {
    width: "250px",
    padding: "20px",
    borderLeft: "1px solid #222",
    color: "white",
  },
  suggestItem: {
    padding: "8px 0",
    fontSize: "0.9rem",
  },
};
