
import { useEffect, useState } from "react";
import "./MovieDashboard.css";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function MovieDashboard({ user, onLogout }) {
  const [movies, setMovies] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [filters, setFilters] = useState({
    search: "",
    genre: "",
    status: "now_showing",
    page: 1,
    limit: 12,
  });
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedMovie, setSelectedMovie] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadMovies() {
      setLoading(true);
      setError("");

      try {
        const params = new URLSearchParams();

        Object.entries(filters).forEach(([key, value]) => {
          if (value !== "") {
            params.set(key, String(value));
          }
        });

        const response = await fetch(
          `${API_URL}/api/movies?${params.toString()}`,
          { signal: controller.signal }
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Could not load movies");
        }

        setMovies(result.data);
        setPagination(
          result.pagination || {
            page: 1,
            totalPages: 1,
            total: result.data.length,
          }
        );
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message || "Something went wrong");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadMovies();

    return () => controller.abort();
  }, [filters]);

  function searchMovies(event) {
    event.preventDefault();

    setFilters((current) => ({
      ...current,
      search: searchInput.trim(),
      page: 1,
    }));
  }

  function changeFilter(key, value) {
    setFilters((current) => ({
      ...current,
      [key]: value,
      page: 1,
    }));
  }

  return (
    <main className="dashboard">
      <header className="dashboard-nav">
        <a className="dashboard-brand" href="#home">
          <span className="dashboard-logo">F</span>
          Flick
        </a>

        <div className="nav-user">
          {user.avatar && (
            <img
              src={user.avatar}
              alt=""
              className="nav-avatar"
              referrerPolicy="no-referrer"
            />
          )}
          <span className="nav-user-name">{user.name}</span>
          <button className="logout-button" onClick={onLogout}>
            Sign out
          </button>
        </div>
      </header>

      <section className="hero-section" id="home">
        <div className="hero-content">
          <p className="hero-eyebrow">YOUR PERSONAL MOVIE DESTINATION</p>
          <h1>Stories worth<br />leaving home for.</h1>
          <p>
            Find your next favourite film and get ready for
            the big-screen experience.
          </p>

          <a href="#movies" className="hero-button">
            Explore movies <span aria-hidden="true">→</span>
          </a>
        </div>
        <div className="hero-decoration" aria-hidden="true">
          <span>▶</span>
        </div>
      </section>

      <section className="movies-section" id="movies">
        <div className="section-heading">
          <div>
            <p className="section-eyebrow">THE BIG SCREEN AWAITS</p>
            <h2>Explore movies</h2>
          </div>
          <span className="movie-count">
            {pagination.total} titles
          </span>
        </div>

        <form className="movie-filters" onSubmit={searchMovies}>
          <input
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="Search movie titles..."
            aria-label="Search movie titles"
          />

          <select
            value={filters.genre}
            onChange={(event) =>
              changeFilter("genre", event.target.value)
            }
            aria-label="Filter by genre"
          >
            <option value="">All genres</option>
            <option value="Action">Action</option>
            <option value="Adventure">Adventure</option>
            <option value="Comedy">Comedy</option>
            <option value="Drama">Drama</option>
            <option value="Romance">Romance</option>
            <option value="Sci-Fi">Sci-Fi</option>
            <option value="Thriller">Thriller</option>
          </select>

          <select
            value={filters.status}
            onChange={(event) =>
              changeFilter("status", event.target.value)
            }
            aria-label="Filter by release status"
          >
            <option value="now_showing">Now showing</option>
            <option value="upcoming">Coming soon</option>
            <option value="">All movies</option>
          </select>

          <button type="submit" className="search-button">
            Search
          </button>
        </form>

        {loading && (
          <div className="dashboard-message" role="status">
            Discovering movies...
          </div>
        )}

        {!loading && error && (
          <div className="dashboard-error" role="alert">
            <p>{error}</p>
            <button onClick={() => setFilters((current) => ({ ...current }))}>
              Try again
            </button>
          </div>
        )}

        {!loading && !error && movies.length === 0 && (
          <div className="empty-state">
            <span aria-hidden="true">🎞️</span>
            <h3>No movies found</h3>
            <p>Try another title or change your filters.</p>
          </div>
        )}

        {!loading && !error && movies.length > 0 && (
          <>
            <div className="movie-grid">
              {movies.map((movie) => (
                <article className="movie-card" key={movie._id}>
                  <button
                    className="movie-poster-button"
                    onClick={() => setSelectedMovie(movie)}
                    aria-label={`View ${movie.title} details`}
                  >
                    {movie.posterUrl ? (
                      <img
                        className="movie-poster"
                        src={movie.posterUrl}
                        alt={`${movie.title} poster`}
                        loading="lazy"
                      />
                    ) : (
                      <div className="poster-placeholder">
                        <span>▶</span>
                        <small>FLICK</small>
                      </div>
                    )}

                    <span className="poster-status">
                      {movie.status === "now_showing"
                        ? "NOW SHOWING"
                        : movie.status === "upcoming"
                          ? "COMING SOON"
                          : "ARCHIVED"}
                    </span>
                  </button>

                  <div className="movie-card-info">
                    <h3>{movie.title}</h3>
                    <p>
                      {movie.genre?.join(" · ") || "Feature film"}
                    </p>
                    <div className="movie-meta">
                      <span>{movie.language}</span>
                      <span>{movie.durationMinutes} min</span>
                    </div>
                    <button
                      className="details-button"
                      onClick={() => setSelectedMovie(movie)}
                    >
                      View details
                    </button>
                  </div>
                </article>
              ))}
            </div>

            <div className="pagination">
              <button
                disabled={filters.page <= 1}
                onClick={() =>
                  setFilters((current) => ({
                    ...current,
                    page: current.page - 1,
                  }))
                }
              >
                ← Previous
              </button>

              <span>
                Page {pagination.page} of {pagination.totalPages || 1}
              </span>

              <button
                disabled={filters.page >= pagination.totalPages}
                onClick={() =>
                  setFilters((current) => ({
                    ...current,
                    page: current.page + 1,
                  }))
                }
              >
                Next →
              </button>
            </div>
          </>
        )}
      </section>

      {selectedMovie && (
        <div
          className="modal-backdrop"
          onClick={() => setSelectedMovie(null)}
        >
          <section
            className="movie-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="movie-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="modal-close"
              aria-label="Close movie details"
              onClick={() => setSelectedMovie(null)}
            >
              ×
            </button>

            {selectedMovie.posterUrl && (
              <img
                className="modal-poster"
                src={selectedMovie.posterUrl}
                alt=""
              />
            )}

            <p className="section-eyebrow">
              {selectedMovie.status.replace("_", " ").toUpperCase()}
            </p>
            <h2 id="movie-modal-title">{selectedMovie.title}</h2>
            <p className="modal-meta">
              {selectedMovie.genre?.join(" · ")} ·{" "}
              {selectedMovie.language} ·{" "}
              {selectedMovie.durationMinutes} min
            </p>
            <p className="modal-description">
              {selectedMovie.description}
            </p>
            <p className="booking-coming-soon">
              Showtimes and seat booking are coming in the next phase.
            </p>
          </section>
        </div>
      )}

      <footer className="dashboard-footer">
        <span>Flick</span>
        <span>Find your next big-screen experience.</span>
      </footer>
    </main>
  );
}
