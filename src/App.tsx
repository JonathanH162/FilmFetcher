import { useEffect, useState } from "react";
import "./App.css";

interface NavbarProps {
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
}
interface MovieListProps {
  movies: Movie[];
  onSelectMovie: (movie: string) => void;
}
interface MovieProps {
  movie: Movie;
  onSelectMovie: (movie: string) => void;
}
interface MovieDetailsProps {
  selectedId: string;
  onCloseMovie: () => void;
  onAddToWatch: (movie?: Movie) => void;
}
interface Movie {
  imdbID: string;
  Title: string;
  Poster: string;
  Year: string;
  Released: string;
  Runtime: string;
  Genre: string;
  imdbRating: string;
  Plot: string;
  Actors: string;
  Director: string;
}

const OMDBKey = "335fbc45";
// const OMDBKey: string | undefined = process.env.OMDBKey;

function App() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedId, setSelectId] = useState<string>("");
  const watchedArray = [];

  function handleSelectMovie(id: string) {
    setSelectId(selectedId === id ? "" : id);
  }
  function handleCloseMovie() {
    setSelectId("");
  }
  function handleAddToWatchList(movie?: Movie) {
    watchedArray.push(movie);
  }

  useEffect(function () {
    async function fetchMovies() {
      const res = await fetch(
        `http://www.omdbapi.com/?i=tt3896198&apikey=${OMDBKey}&s=${query}`
      );

      const data = await res.json();
      setMovies(data.Search);
    }

    fetchMovies();
  });

  return (
    <>
      <Navbar query={query} setQuery={setQuery} />
      <div className="content-div">
        <MovieList movies={movies} onSelectMovie={handleSelectMovie} />

        <MovieDetails
          selectedId={selectedId}
          onCloseMovie={handleCloseMovie}
          onAddToWatch={handleAddToWatchList}
        />
      </div>
    </>
  );
}

function Navbar({ query, setQuery }: NavbarProps) {
  return (
    <div className="nav-div">
      <h1>FilmFetcher</h1>
      <input
        type="text"
        placeholder="Search movies..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="searchBox"
      />
    </div>
  );
}

function MovieList({ movies, onSelectMovie }: MovieListProps) {
  return (
    <div className="movie-div">
      <h3>Search results -</h3>
      <ul className="movie-list">
        {movies?.map((movie) => (
          <Movie
            movie={movie}
            key={`search${movie?.imdbID}`}
            onSelectMovie={onSelectMovie}
          />
        ))}
      </ul>
    </div>
  );
}

function Movie({ movie, onSelectMovie }: MovieProps) {
  return (
    <li className="movie-item">
      <img
        onClick={() => onSelectMovie(movie.imdbID)}
        className="movie-poster"
        src={movie.Poster}
        alt={`${movie.Title} poster`}
      />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}
function MovieDetails({
  selectedId,
  onCloseMovie,
  onAddToWatch,
}: MovieDetailsProps) {
  const [movie, setMovie] = useState<Movie>();

  useEffect(
    function () {
      async function getMovieDetails() {
        const res = await fetch(
          `http://www.omdbapi.com/?&apikey=${OMDBKey}&i=${selectedId}`
        );
        const data = await res.json();
        setMovie(data!);
      }
      getMovieDetails();
    },
    [selectedId]
  );

  return (
    <div className="movieDetails-div">
      <h3>More info - </h3>
      {selectedId !== "" ? (
        <>
          <header>
            <img
              onClick={onCloseMovie}
              src={movie?.Poster}
              alt={`Poster of ${movie?.Title}`}
            ></img>

            <div>
              <h2>{movie?.Title}</h2>
              <p>
                {movie?.Released} &bull; {movie?.Runtime}
              </p>
              <p>{movie?.Genre}</p>
              <p>
                <span>⭐️</span>
                {movie?.imdbRating} IMDB Rating
              </p>
            </div>
          </header>

          <section>
            <em>{movie?.Plot}</em>
            <p>Starring - {movie?.Actors}</p>
            <p>Directed by - {movie?.Director}</p>
          </section>
          <button className="watchButton" onClick={() => onAddToWatch(movie)}>
            Add to watch-list
          </button>
        </>
      ) : (
        ""
      )}
    </div>
  );
}

export default App;
