'use client';

import { useState, useEffect } from 'react';
import type { Movie } from '@/types';
import { 
  getMovies, 
  getFeaturedMovies, 
  getNewUpdateMovies, 
  getTopRatedMovies,
  getMoviesByCategory,
  getNewMoviesByType,
  searchMovies,
  getMovieById
} from '@/lib/mockData';

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
        const response = await getMovies(options);
        setMovies(response.data);
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
        const data = await getNewUpdateMovies(limit);
        setMovies(data);
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
        const data = await getTopRatedMovies(limit);
        setMovies(data);
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
        const data = await getMoviesByCategory(categorySlug, limit);
        setMovies(data);
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
        const data = await getNewMoviesByType(type, limit);
        setMovies(data);
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
        const data = await searchMovies(query, limit);
        setMovies(data);
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
        const data = await getMovieById(slug);
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
