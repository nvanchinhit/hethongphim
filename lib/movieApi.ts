import { apiClient } from './api';
import { API_BASE_URL, API_ENDPOINTS, CATEGORY_MAPPINGS, GENRE_MAPPINGS, COUNTRY_MAPPINGS } from '../constants/api';
import type { Movie, ApiResponse, PaginatedResponse, MovieDetailResponse, SearchParams } from '../types';

// Helper function to normalize movie data
const normalizeMovie = (movie: any): Movie => {
  return {
    ...movie,
    // Add compatibility properties
    originalName: movie.original_name,
    thumbUrl: movie.thumb_url,
    posterUrl: movie.poster_url,
    totalEpisodes: movie.total_episodes,
    currentEpisode: movie.current_episode,
    episodeTime: movie.time,
    cast: movie.casts ? movie.casts.split(', ') : [],
    director: movie.director ? movie.director.split(', ') : [],
    year: movie.created ? new Date(movie.created).getFullYear() : 2024,
    view: movie.view || 0,
    isCopyright: false,
    isNewUpdate: movie.modified && new Date(movie.modified) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    createdAt: movie.created,
    updatedAt: movie.modified,
    // Extract country and category from category object if available
    country: movie.category?.['4']?.list ? movie.category['4'].list.map((c: any) => ({ 
      id: c.id || c.name,
      name: c.name,
      slug: generateSlug(c.name)
    })) : [],
    category: movie.category?.['2']?.list ? movie.category['2'].list.map((c: any) => ({
      id: c.id || c.name,
      name: c.name,
      slug: generateSlug(c.name)
    })) : [],
  };
};

// Helper function to generate slug from name
const generateSlug = (name: string): string => {
  return name.toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

// Get new update movies
export const getNewUpdateMovies = async (page: number = 1): Promise<PaginatedResponse<Movie>> => {
  try {
    const response = await apiClient.get<ApiResponse<Movie[]>>(
      API_ENDPOINTS.MOVIES.NEW_UPDATES,
      { params: { page } }
    );

    if (response.status === 'success' && response.items) {
      return {
        items: response.items.map(normalizeMovie),
        paginate: response.paginate || {
          current_page: page,
          total_page: 1,
          total_items: response.items.length,
          items_per_page: 10
        }
      };
    }

    return { items: [], paginate: { current_page: 1, total_page: 1, total_items: 0, items_per_page: 10 } };
  } catch (error) {
    console.error('Error fetching new update movies:', error);
    return { items: [], paginate: { current_page: 1, total_page: 1, total_items: 0, items_per_page: 10 } };
  }
};

// Get movies by category
export const getMoviesByCategory = async (categorySlug: string, page: number = 1): Promise<PaginatedResponse<Movie>> => {
  try {
    // Map category slug to API category
    const mappedSlug = CATEGORY_MAPPINGS[categorySlug as keyof typeof CATEGORY_MAPPINGS] || categorySlug;
    
    const response = await apiClient.get<ApiResponse<Movie[]>>(
      API_ENDPOINTS.MOVIES.BY_CATEGORY(mappedSlug),
      { params: { page } }
    );

    if (response.status === 'success' && response.items) {
      return {
        items: response.items.map(normalizeMovie),
        paginate: response.paginate || {
          current_page: page,
          total_page: 1,
          total_items: response.items.length,
          items_per_page: 10
        }
      };
    }

    return { items: [], paginate: { current_page: 1, total_page: 1, total_items: 0, items_per_page: 10 } };
  } catch (error) {
    console.error('Error fetching movies by category:', error);
    return { items: [], paginate: { current_page: 1, total_page: 1, total_items: 0, items_per_page: 10 } };
  }
};

// Get movies by genre
export const getMoviesByGenre = async (genreSlug: string, page: number = 1): Promise<PaginatedResponse<Movie>> => {
  try {
    const mappedSlug = GENRE_MAPPINGS[genreSlug as keyof typeof GENRE_MAPPINGS] || genreSlug;
    const endpoint = API_ENDPOINTS.MOVIES.BY_GENRE(mappedSlug);
    
    const response = await apiClient.get<ApiResponse<Movie[]>>(
      endpoint,
      { params: { page } }
    );

    if (response.status === 'success' && response.items) {
      return {
        items: response.items.map(normalizeMovie),
        paginate: response.paginate || {
          current_page: page,
          total_page: 1,
          total_items: response.items.length,
          items_per_page: 10
        }
      };
    }

    return { items: [], paginate: { current_page: 1, total_page: 1, total_items: 0, items_per_page: 10 } };
  } catch (error) {
    // Silently fallback: some genre slugs may not exist on the upstream API
    // Avoid noisy console errors in production
    if (process.env.NODE_ENV === 'development') {
      console.warn('Genre fetch failed, using fallback:', genreSlug);
    }
    return { items: [], paginate: { current_page: 1, total_page: 1, total_items: 0, items_per_page: 10 } };
  }
};

// Get movies by country
export const getMoviesByCountry = async (countrySlug: string, page: number = 1): Promise<PaginatedResponse<Movie>> => {
  try {
    const mappedSlug = COUNTRY_MAPPINGS[countrySlug as keyof typeof COUNTRY_MAPPINGS] || countrySlug;
    
    const response = await apiClient.get<ApiResponse<Movie[]>>(
      API_ENDPOINTS.MOVIES.BY_COUNTRY(mappedSlug),
      { params: { page } }
    );

    if (response.status === 'success' && response.items) {
      return {
        items: response.items.map(normalizeMovie),
        paginate: response.paginate || {
          current_page: page,
          total_page: 1,
          total_items: response.items.length,
          items_per_page: 10
        }
      };
    }

    return { items: [], paginate: { current_page: 1, total_page: 1, total_items: 0, items_per_page: 10 } };
  } catch (error) {
    console.error('Error fetching movies by country:', error);
    return { items: [], paginate: { current_page: 1, total_page: 1, total_items: 0, items_per_page: 10 } };
  }
};

// Get movies by year
export const getMoviesByYear = async (year: string, page: number = 1): Promise<PaginatedResponse<Movie>> => {
  try {
    const response = await apiClient.get<ApiResponse<Movie[]>>(
      API_ENDPOINTS.MOVIES.BY_YEAR(year),
      { params: { page } }
    );

    if (response.status === 'success' && response.items) {
      return {
        items: response.items.map(normalizeMovie),
        paginate: response.paginate || {
          current_page: page,
          total_page: 1,
          total_items: response.items.length,
          items_per_page: 10
        }
      };
    }

    return { items: [], paginate: { current_page: 1, total_page: 1, total_items: 0, items_per_page: 10 } };
  } catch (error) {
    console.error('Error fetching movies by year:', error);
    return { items: [], paginate: { current_page: 1, total_page: 1, total_items: 0, items_per_page: 10 } };
  }
};

// Get movie detail
export const getMovieDetail = async (slug: string): Promise<Movie | null> => {
  try {
    const response = await apiClient.get<MovieDetailResponse>(
      API_ENDPOINTS.MOVIES.DETAIL(slug)
    );

    if (response.status === 'success' && response.movie) {
      return normalizeMovie(response.movie);
    }

    return null;
  } catch (error) {
    console.error('Error fetching movie detail:', error);
    return null;
  }
};

// Search movies
export const searchMovies = async (params: SearchParams): Promise<PaginatedResponse<Movie>> => {
  try {
    const response = await apiClient.get<ApiResponse<Movie[]>>(
      API_ENDPOINTS.MOVIES.SEARCH,
      { params: params as unknown as Record<string, string | number | boolean> }
    );

    if (response.status === 'success' && response.items) {
      return {
        items: response.items.map(normalizeMovie),
        paginate: response.paginate || {
          current_page: params.page || 1,
          total_page: 1,
          total_items: response.items.length,
          items_per_page: 10
        }
      };
    }

    return { items: [], paginate: { current_page: 1, total_page: 1, total_items: 0, items_per_page: 10 } };
  } catch (error) {
    console.error('Error searching movies:', error);
    return { items: [], paginate: { current_page: 1, total_page: 1, total_items: 0, items_per_page: 10 } };
  }
};

// Get featured movies (using new updates as featured)
export const getFeaturedMovies = async (): Promise<Movie[]> => {
  try {
    const response = await getNewUpdateMovies(1);
    return response.items.slice(0, 4);
  } catch (error) {
    console.error('Error fetching featured movies:', error);
    return [];
  }
};

// Get top rated movies (using new updates sorted by popularity)
export const getTopRatedMovies = async (): Promise<Movie[]> => {
  try {
    const response = await getNewUpdateMovies(1);
    return response.items.slice(0, 12);
  } catch (error) {
    console.error('Error fetching top rated movies:', error);
    return [];
  }
};

// Get movies by category with multiple pages
export const getMoviesByCategoryMultiplePages = async (category: string, totalMovies: number = 20): Promise<Movie[]> => {
  try {
    const moviesPerPage = 10;
    const pagesToFetch = Math.ceil(totalMovies / moviesPerPage);
    const allMovies: Movie[] = [];

    for (let page = 1; page <= pagesToFetch; page++) {
      const response = await getMoviesByCategory(category, page);
      if (response.items && response.items.length > 0) {
        allMovies.push(...response.items);
      }
      
      // If we have enough movies, break
      if (allMovies.length >= totalMovies) {
        break;
      }
    }

    return allMovies.slice(0, totalMovies);
  } catch (error) {
    console.error('Error fetching multiple pages:', error);
    return [];
  }
};