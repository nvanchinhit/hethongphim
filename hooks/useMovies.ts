'use client';

import { useState, useEffect } from 'react';
import type { Movie } from '@/types';
import { 
  getFeaturedMovies, 
  getNewUpdateMovies, 
  getTopRatedMovies,
  getMoviesByCategory,
  getMoviesByGenre,
  getMoviesByCountry,
  getMoviesByYear,
  searchMovies,
  getMovieDetail
} from '@/lib/movieApi';

interface UseMoviesOptions {
  page?: number;
  limit?: number;
  category?: string;
  country?: string;
  year?: number;
  isNewUpdate?: boolean;
  search?: string;
}

export function useMovies(options: UseMoviesOptions = {}) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        setError(null);
        
        let response;
        if (options.category) {
          response = await getMoviesByCategory(options.category, options.page || 1);
        } else if (options.country) {
          response = await getMoviesByCountry(options.country, options.page || 1);
        } else if (options.year) {
          response = await getMoviesByYear(options.year.toString(), options.page || 1);
        } else {
          response = await getNewUpdateMovies(options.page || 1);
        }
        
        setMovies(response.items);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch movies');
        setMovies([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [JSON.stringify(options)]);

  return { movies, loading, error };
}

export function useFeaturedMovies() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeaturedMovies = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getFeaturedMovies();
        setMovies(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch featured movies');
        setMovies([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedMovies();
  }, []);

  return { movies, loading, error };
}

export function useNewUpdateMovies(limit = 24) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNewUpdateMovies = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getNewUpdateMovies(1);
        setMovies(response.items.slice(0, limit));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch new update movies');
        setMovies([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNewUpdateMovies();
  }, [limit]);

  return { movies, loading, error };
}

export function useTopRatedMovies(limit = 12) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTopRatedMovies = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getTopRatedMovies();
        setMovies(data.slice(0, limit));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch top rated movies');
        setMovies([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTopRatedMovies();
  }, [limit]);

  return { movies, loading, error };
}

export function useMoviesByCategory(categorySlug: string, limit = 12) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!categorySlug) return;

    const fetchMoviesByCategory = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getMoviesByCategory(categorySlug, 1);
        setMovies(response.items.slice(0, limit));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch movies by category');
        setMovies([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMoviesByCategory();
  }, [categorySlug, limit]);

  return { movies, loading, error };
}

export function useNewMoviesByType(
  type: 'phim-le' | 'phim-bo' | 'tinh-co-trang' | 'hoat-hinh', 
  limit = 12
) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNewMoviesByType = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getMoviesByCategory(type, 1);
        setMovies(response.items.slice(0, limit));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch movies by type');
        setMovies([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNewMoviesByType();
  }, [type, limit]);

  return { movies, loading, error };
}

export function useSearchMovies(query: string, limit = 12) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query.trim()) {
      setMovies([]);
      return;
    }

    const searchMoviesDebounced = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await searchMovies({ keyword: query, limit });
        setMovies(response.items.slice(0, limit));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to search movies');
        setMovies([]);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(searchMoviesDebounced, 300);
    return () => clearTimeout(timeoutId);
  }, [query, limit]);

  return { movies, loading, error };
}

export function useMovie(slug: string) {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;

    const fetchMovie = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getMovieDetail(slug);
        setMovie(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch movie');
        setMovie(null);
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [slug]);

  return { movie, loading, error };
}

// New hooks for additional functionality
export function useMoviesByGenre(genreSlug: string, limit = 12) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!genreSlug) return;

    const fetchMoviesByGenre = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getMoviesByGenre(genreSlug, 1);
        setMovies(response.items.slice(0, limit));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch movies by genre');
        setMovies([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMoviesByGenre();
  }, [genreSlug, limit]);

  return { movies, loading, error };
}

export function useMoviesByCountry(countrySlug: string, limit = 12) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!countrySlug) return;

    const fetchMoviesByCountry = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getMoviesByCountry(countrySlug, 1);
        setMovies(response.items.slice(0, limit));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch movies by country');
        setMovies([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMoviesByCountry();
  }, [countrySlug, limit]);

  return { movies, loading, error };
}

export function useMoviesByYear(year: string, limit = 12) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!year) return;

    const fetchMoviesByYear = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getMoviesByYear(year, 1);
        setMovies(response.items.slice(0, limit));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch movies by year');
        setMovies([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMoviesByYear();
  }, [year, limit]);

  return { movies, loading, error };
}
