import axios from "axios";

const tmdbApi = axios.create({
  baseURL: process.env.EXPO_PUBLIC_TMDB_BASE_URL,
  timeout: 10000,
  params: {
    api_key: process.env.EXPO_PUBLIC_TMDB_API_KEY,
    language: "en-US",
  },
});

tmdbApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error("[TMDB] API Error:", error.response.status, error.response.data);
    } else if (error.request) {
      console.error("[TMDB] No response received.");
    } else {
      console.error("[TMDB] Error:", error.message);
    }
    return Promise.reject(error);
  }
);

export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  release_date: string;
  genre_ids: number[];
}

export interface MovieDetail extends Movie {
  genres: { id: number; name: string }[];
  runtime: number;
  tagline: string;
  status: string;
}

export const getPosterUrl = (path: string | null, size = "w500") =>
  path ? `https://image.tmdb.org/t/p/${size}${path}` : null;

export const fetchPopularMovies = async (page = 1): Promise<Movie[]> => {
  const res = await tmdbApi.get("/movie/popular", { params: { page } });
  return res.data.results;
};

export const fetchTrendingMovies = async (): Promise<Movie[]> => {
  const res = await tmdbApi.get("/trending/movie/day");
  return res.data.results;
};

export const searchMovies = async (query: string, page = 1): Promise<Movie[]> => {
  if (!query.trim()) return [];
  const res = await tmdbApi.get("/search/movie", { params: { query, page } });
  return res.data.results;
};

export const fetchMovieDetail = async (id: number): Promise<MovieDetail> => {
  const res = await tmdbApi.get(`/movie/${id}`);
  return res.data;
};

export default tmdbApi;