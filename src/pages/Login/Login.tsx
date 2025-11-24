import { useState } from "react";
import { Inbox, Lock, Shield } from "lucide-react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please enter both email and password.", {
        description: "Both fields are required.",
        style: {
          background: "#1E1E1E",
          color: "#FFFFFF",
          borderRadius: "10px",
          fontSize: "18px",
        },
        duration: 2000,
      });
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        
        toast.error("Login Failed", {
          description: data.message || "Invalid email or password",
          style: {
            background: "#1E1E1E",
            color: "#FFFFFF",
            borderRadius: "10px",
            fontSize: "18px",
          },
          duration: 2000,
        });
        return;
      }
      localStorage.setItem("userId", data.userId);

      toast.success("Login Successful!", {
        description: "Redirecting to Two-Factor Authentication…",
        style: {
          background: "#1E1E1E",
          color: "#FFFFFF",
          borderRadius: "10px",
          fontSize: "18px",
        },
        duration: 2000,
      });

      setTimeout(() => {
        navigate("/2fa");
      }, 1000);
    } catch (error) {
      toast.error("Server Error", {
        description: "Could not connect to backend",
        style: {
          background: "#1E1E1E",
          color: "#FFFFFF",
          borderRadius: "10px",
          fontSize: "18px",
        },
        duration: 2000,
      });
    }
  };

  return (
    <div className="login-page">
      <header className="branding-header">
        <Shield className="shield-icon" />
        <div className="branding-content">
          <h1 className="brand-name">SecureHub</h1>
          <p className="brand-tagline">Advanced Security Platform</p>
        </div>
      </header>

      <main className="login-card">
        <div className="login-header">
          <h2 className="login-title">Login Securely</h2>
          <p className="login-subtitle">
            Enter your credentials to access the security dashboard
          </p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-field">
            <label htmlFor="email" className="field-label">
              Email Address
            </label>
            <div className="input-wrapper">
              <Inbox className="input-icon" />
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
                className="text-input"
              />
            </div>
          </div>

          <div className="form-field">
            <label htmlFor="password" className="field-label">
              Password
            </label>
            <div className="input-wrapper">
              <Lock className="input-icon" />
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                className="text-input"
              />
            </div>
          </div>

          <button type="submit" className="login-button">
            Login
          </button>
        </form>
      </main>
    </div>
  );
};
