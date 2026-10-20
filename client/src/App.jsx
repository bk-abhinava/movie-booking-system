import MovieDashboard from "./components/MovieDashboard";
import { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import "./App.css";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function App() {
  const [user, setUser] = useState(() => {
    // Temporary for this learning step.
    // We'll implement secure session persistence later.
    return null;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleGoogleSuccess(googleResponse) {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/api/auth/google`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          credential: googleResponse.credential,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Google login failed");
      }

    
const profileResponse = await fetch(`${API_URL}/api/auth/me`, {
  headers: {
    Authorization: `Bearer ${result.token}`,
  },
});

const profileResult = await profileResponse.json();

if (!profileResponse.ok) {
  throw new Error(
    profileResult.message || "Could not verify your session"
  );
}

setUser({
  ...profileResult.user,
  token: result.token,
});

      
    } catch (err) {
      setError(err.message || "Unable to sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  }

if (user) {
  return (
    <MovieDashboard
      user={user}
      onLogout={() => setUser(null)}
    />
  );
}

  return (
    <main className="page-shell">
      <section className="login-card">
        <div className="brand">
          <div className="brand-mark">F</div>
          <span>Flick</span>
        </div>

        <div className="movie-symbol" aria-hidden="true">
          <span>▶</span>
        </div>

        <p className="eyebrow">YOUR NEXT MOVIE NIGHT</p>
        <h1>Every great story starts here.</h1>
        <p className="subtitle">
          Sign in to discover movies, choose your seats,
          and keep all your tickets in one place.
        </p>

        <div className="google-area">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => {
              setError("Google sign-in was unsuccessful.");
            }}
            useOneTap={false}
            theme="outline"
            shape="rectangular"
            size="large"
            text="continue_with"
            width="320"
          />
        </div>

        {loading && (
          <p className="status-message" role="status">
            Verifying your account...
          </p>
        )}

        {error && (
          <p className="error-message" role="alert">
            {error}
          </p>
        )}

        <p className="terms">
          By continuing, you agree to our Terms of Service
          and Privacy Policy.
        </p>
      </section>

      <footer className="page-footer">
        Made for people who love the movies.
      </footer>
    </main>
  );
}
