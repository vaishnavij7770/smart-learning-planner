import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { setToken } from "../utils/auth";

export default function Login({ setIsAuth }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);
    try {
      const res = await api.post("/auth/login", {
        email,
        password,
      });

      // ✅ SAVE TOKEN
      setToken(res.data.access_token);

      // optional auth state
      if (setIsAuth) setIsAuth(true);

      alert("Login successful ✅");
      navigate("/study");
    } catch (error) {
      console.error(error);
      alert(
        error.response?.data?.detail || "Invalid credentials ❌"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>

      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleLogin} disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </button>

      <p>
        New user? <Link to="/signup">Create an account</Link>
      </p>
    </div>
  );
}
