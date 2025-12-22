import { useState } from "react";
import { login } from "../auth/authService";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await login({ email, password });
      window.location.href = "/dashboard";
    } catch {
      setError("Invalid email or password");
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2 style={styles.title}>z-pilot-hr</h2>

        {error && <p style={styles.error}>{error}</p>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={styles.input}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={styles.input}
        />

        <button type="submit" style={styles.button}>
          Login
        </button>
      </form>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "1rem",
    backgroundColor: "#f5f6fa",
  },
  form: {
    width: "100%",
    maxWidth: "400px",
    padding: "2rem",
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
  },
  title: {
    textAlign: "center",
    marginBottom: "1.5rem",
  },
  input: {
    width: "100%",
    padding: "0.75rem",
    marginBottom: "1rem",
    fontSize: "1rem",
  },
  button: {
    width: "100%",
    padding: "0.75rem",
    fontSize: "1rem",
    cursor: "pointer",
  },
  error: {
    color: "red",
    marginBottom: "1rem",
    textAlign: "center",
  },
};
