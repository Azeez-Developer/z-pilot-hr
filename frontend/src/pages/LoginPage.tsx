import { useState } from "react";
import { login } from "../auth/authService";
import { Link } from "react-router-dom";
import "../styles/auth.css";

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
      setError("Invalid email or password.");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
  <div className="auth-brand">
    <h1 className="auth-title">Z Pilot HR</h1>
    <p className="auth-subtitle">Employee & Manager Portal</p>
  </div>

  {error && <div className="auth-error">{error}</div>}

  <form className="auth-form" onSubmit={handleSubmit}>
    <div className="auth-field">
      <label className="auth-label">Email</label>
      <input
        className="auth-input"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
    </div>

    <div className="auth-field">
      <label className="auth-label">Password</label>
      <input
        className="auth-input"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
    </div>

    <button className="auth-button" type="submit">
      Sign in
    </button>
  </form>

  <div className="auth-footer">
    New here?{" "}
    <Link className="auth-link" to="/register">
      Create an account
    </Link>
  </div>
</div>

    </div>
  );
}
