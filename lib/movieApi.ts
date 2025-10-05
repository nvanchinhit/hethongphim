import { apiClient } from './api';
import { 
  API_BASE_URL, 
  API_ENDPOINTS, 
  CATEGORY_MAPPINGS, 
  GENRE_MAPPINGS, 
  COUNTRY_MAPPINGS,
  SORT_FIELDS,
  SORT_TYPES,
  LANGUAGE_OPTIONS
} from '../constants/api';
import type { Movie, ApiResponse, PaginatedResponse, MovieDetailResponse, SearchParams, Category, Country } from '../types';

// Helper function to normalize movie data for phimapi.com
const normalizeMovie = (movie: any): Movie => {
  // Helper function to fix image URLs
  const fixImageUrl = (url: string): string => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    if (url.startsWith('/upload/')) {
      return `https://phimimg.com${url}`;
    }
    return `https://phimimg.com/${url}`;
  };

  // Helper function to parse episode total
  const parseEpisodeTotal = (episodeTotal: string | number): number => {
    if (typeof episodeTotal === 'number') return episodeTotal;
    if (typeof episodeTotal === 'string') {
      // Handle formats like "36", "36/36", "Hoàn Tất (36/36)"
      const match = episodeTotal.match(/(\d+)/);
      return match ? parseInt(match[1]) : 0;
    }
    return 0;
  };

  // console.log('Normalizing movie data:', movie);

  return {
    ...movie,
    // Add compatibility properties
    id: movie._id,
    originalName: movie.origin_name,
    thumbUrl: fixImageUrl(movie.thumb_url),
    posterUrl: fixImageUrl(movie.poster_url),
    thumb_url: fixImageUrl(movie.thumb_url),
    poster_url: fixImageUrl(movie.poster_url),
    totalEpisodes: parseEpisodeTotal(movie.episode_total),
    currentEpisode: movie.episode_current,
    episodeTime: movie.time,
    cast: movie.actor || [],
    director: movie.director || [],
    year: movie.year || 2024,
    view: movie.view || 0,
    isCopyright: movie.is_copyright || false,
    isNewUpdate: movie.modified && new Date(movie.modified.time) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    createdAt: movie.created?.time,
    updatedAt: movie.modified?.time,
    description: movie.content,
    total_episodes: parseEpisodeTotal(movie.episode_total),
    current_episode: movie.episode_current,
    language: movie.lang,
    casts: movie.actor || [],
    // Ensure category and country are arrays
    category: Array.isArray(movie.category) ? movie.category : [],
    country: Array.isArray(movie.country) ? movie.country : [],
    // Ensure episodes are properly handled
    episodes: movie.episodes || [],
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
    const response = await apiClient.get<ApiResponse<any>>(
      API_ENDPOINTS.MOVIES.NEW_UPDATES,
      { params: { page } }
    );

    if (response.status === true && response.items) {
      return {
        items: response.items.map(normalizeMovie),
        pagination: response.pagination || {
          currentPage: page,
          totalPages: 1,
          totalItems: response.items.length,
          totalItemsPerPage: 24
        }
      };
    }

    return { 
      items: [], 
      pagination: { 
        currentPage: 1, 
        totalPages: 1, 
        totalItems: 0, 
        totalItemsPerPage: 24 
      } 
    };
  } catch (error) {
    console.error('Error fetching new update movies:', error);
    return { 
      items: [], 
      pagination: { 
        currentPage: 1, 
        totalPages: 1, 
        totalItems: 0, 
        totalItemsPerPage: 24 
      } 
    };
  }
};

// Get movies by category (type_list)
export const getMoviesByCategory = async (categorySlug: string, page: number = 1): Promise<PaginatedResponse<Movie>> => {
  try {
    // Map category slug to API category
    const mappedSlug = CATEGORY_MAPPINGS[categorySlug as keyof typeof CATEGORY_MAPPINGS] || categorySlug;

    // Special case: "Top phim" (phim-hay) → dùng danh sách phim mới cập nhật làm Top
    if (categorySlug === 'phim-hay') {
      const res = await getNewUpdateMovies(page);
      return res;
    }
    
    const response = await apiClient.get<ApiResponse<any>>(
      API_ENDPOINTS.MOVIES.BY_TYPE(mappedSlug),
      { 
        params: { 
          page,
          sort_field: SORT_FIELDS.MODIFIED_TIME,
          sort_type: SORT_TYPES.DESC,
          limit: 24
        } 
      }
    );

    if (response.status === true && response.data) {
      const items = Array.isArray(response.data) ? response.data : response.data.items || [];
      return {
        items: items.map(normalizeMovie),
        pagination: response.data.pagination || response.pagination || {
          currentPage: page,
          totalPages: 1,
          totalItems: items.length,
          totalItemsPerPage: 24
        }
      };
    }

    return { 
      items: [], 
      pagination: { 
        currentPage: 1, 
        totalPages: 1, 
        totalItems: 0, 
        totalItemsPerPage: 24 
      } 
    };
  } catch (error: any) {
    // Fallback: nếu endpoint danh sách trả 404, thử endpoint thể loại
    try {
      const fallback = await apiClient.get<ApiResponse<any>>(
        API_ENDPOINTS.MOVIES.BY_GENRE(categorySlug),
        { 
          params: { 
            page,
            sort_field: SORT_FIELDS.MODIFIED_TIME,
            sort_type: SORT_TYPES.DESC,
            limit: 24
          } 
        }
      );
      if (fallback.status === true && fallback.data) {
        const items = Array.isArray(fallback.data) ? fallback.data : fallback.data.items || [];
        return {
          items: items.map(normalizeMovie),
          pagination: fallback.data.pagination || fallback.pagination || {
            currentPage: page,
            totalPages: 1,
            totalItems: items.length,
            totalItemsPerPage: 24
          }
        };
      }
    } catch {}

    console.error('Error fetching movies by category:', error);
    return { 
      items: [], 
      pagination: { 
        currentPage: 1, 
        totalPages: 1, 
        totalItems: 0, 
        totalItemsPerPage: 24 
      } 
    };
  }
};

// Get movies by genre
export const getMoviesByGenre = async (genreSlug: string, page: number = 1): Promise<PaginatedResponse<Movie>> => {
  try {
    const mappedSlug = GENRE_MAPPINGS[genreSlug as keyof typeof GENRE_MAPPINGS] || genreSlug;
    
    const response = await apiClient.get<ApiResponse<any>>(
      API_ENDPOINTS.MOVIES.BY_GENRE(mappedSlug),
      { 
        params: { 
          page,
          sort_field: SORT_FIELDS.MODIFIED_TIME,
          sort_type: SORT_TYPES.DESC,
          limit: 24
        } 
      }
    );

    if (response.status === true && response.data) {
      const items = Array.isArray(response.data) ? response.data : response.data.items || [];
      return {
        items: items.map(normalizeMovie),
        pagination: response.data.pagination || response.pagination || {
          currentPage: page,
          totalPages: 1,
          totalItems: items.length,
          totalItemsPerPage: 24
        }
      };
    }

    return { 
      items: [], 
      pagination: { 
        currentPage: 1, 
        totalPages: 1, 
        totalItems: 0, 
        totalItemsPerPage: 24 
      } 
    };
  } catch (error) {
    // Silently fallback: some genre slugs may not exist on the upstream API
    // Avoid noisy console errors in production
    if (process.env.NODE_ENV === 'development') {
      console.warn('Genre fetch failed, using fallback:', genreSlug);
    }
    return { 
      items: [], 
      pagination: { 
        currentPage: 1, 
        totalPages: 1, 
        totalItems: 0, 
        totalItemsPerPage: 24 
      } 
    };
  }
};

// Get movies by country
export const getMoviesByCountry = async (countrySlug: string, page: number = 1): Promise<PaginatedResponse<Movie>> => {
  try {
    const mappedSlug = COUNTRY_MAPPINGS[countrySlug as keyof typeof COUNTRY_MAPPINGS] || countrySlug;
    
    const response = await apiClient.get<ApiResponse<any>>(
      API_ENDPOINTS.MOVIES.BY_COUNTRY(mappedSlug),
      { 
        params: { 
          page,
          sort_field: SORT_FIELDS.MODIFIED_TIME,
          sort_type: SORT_TYPES.DESC,
          limit: 24
        } 
      }
    );

    if (response.status === true && response.data) {
      const items = Array.isArray(response.data) ? response.data : response.data.items || [];
      return {
        items: items.map(normalizeMovie),
        pagination: response.data.pagination || response.pagination || {
          currentPage: page,
          totalPages: 1,
          totalItems: items.length,
          totalItemsPerPage: 24
        }
      };
    }

    return { 
      items: [], 
      pagination: { 
        currentPage: 1, 
        totalPages: 1, 
        totalItems: 0, 
        totalItemsPerPage: 24 
      } 
    };
  } catch (error) {
    console.error('Error fetching movies by country:', error);
    return { 
      items: [], 
      pagination: { 
        currentPage: 1, 
        totalPages: 1, 
        totalItems: 0, 
        totalItemsPerPage: 24 
      } 
    };
  }
};

// Get movies by year
export const getMoviesByYear = async (year: string, page: number = 1): Promise<PaginatedResponse<Movie>> => {
  try {
    const response = await apiClient.get<ApiResponse<any>>(
      API_ENDPOINTS.MOVIES.BY_YEAR(year),
      { 
        params: { 
          page,
          sort_field: SORT_FIELDS.MODIFIED_TIME,
          sort_type: SORT_TYPES.DESC,
          limit: 24
        } 
      }
    );

    if (response.status === true && response.data) {
      const items = Array.isArray(response.data) ? response.data : response.data.items || [];
      return {
        items: items.map(normalizeMovie),
        pagination: response.data.pagination || response.pagination || {
          currentPage: page,
          totalPages: 1,
          totalItems: items.length,
          totalItemsPerPage: 24
        }
      };
    }

    return { 
      items: [], 
      pagination: { 
        currentPage: 1, 
        totalPages: 1, 
        totalItems: 0, 
        totalItemsPerPage: 24 
      } 
    };
  } catch (error) {
    console.error('Error fetching movies by year:', error);
    return { 
      items: [], 
      pagination: { 
        currentPage: 1, 
        totalPages: 1, 
        totalItems: 0, 
        totalItemsPerPage: 24 
      } 
    };
  }
};

// Get movie detail
export const getMovieDetail = async (slug: string): Promise<Movie | null> => {
  try {
    console.log('Fetching movie detail for slug:', slug);
    const response = await apiClient.get<any>(
      API_ENDPOINTS.MOVIES.DETAIL(slug)
    );

    console.log('API Response:', response);

    if (response.status === true && response.movie) {
      const normalizedMovie = normalizeMovie(response.movie);
      // Add episodes to the movie object
      if (response.episodes) {
        normalizedMovie.episodes = response.episodes;
      }
      console.log('Normalized movie:', normalizedMovie);
      return normalizedMovie;
    }

    console.warn('No movie data found in response');
    return null;
  } catch (error) {
    console.error('Error fetching movie detail:', error);
    return null;
  }
};

// Search movies
export const searchMovies = async (params: SearchParams): Promise<PaginatedResponse<Movie>> => {
  try {
    const searchParams = {
      keyword: params.keyword || '',
      page: params.page || 1,
      sort_field: params.sort_field || SORT_FIELDS.MODIFIED_TIME,
      sort_type: params.sort_type || SORT_TYPES.DESC,
      sort_lang: params.sort_lang || LANGUAGE_OPTIONS.VIETSUB,
      category: params.category || '',
      country: params.country || '',
      year: params.year || '',
      limit: params.limit || 24
    };

    const response = await apiClient.get<ApiResponse<any>>(
      API_ENDPOINTS.MOVIES.SEARCH,
      { params: searchParams }
    );

    if (response.status === true && response.data?.items) {
      return {
        items: response.data.items.map(normalizeMovie),
        pagination: response.data.pagination || {
          currentPage: params.page || 1,
          totalPages: 1,
          totalItems: response.data.items.length,
          totalItemsPerPage: 24
        }
      };
    }

    return { 
      items: [], 
      pagination: { 
        currentPage: 1, 
        totalPages: 1, 
        totalItems: 0, 
        totalItemsPerPage: 24 
      } 
    };
  } catch (error) {
    console.error('Error searching movies:', error);
    return { 
      items: [], 
      pagination: { 
        currentPage: 1, 
        totalPages: 1, 
        totalItems: 0, 
        totalItemsPerPage: 24 
      } 
    };
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
    const moviesPerPage = 24;
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

// Get categories list
export const getCategories = async (): Promise<Category[]> => {
  try {
    const response = await apiClient.get<Category[]>(API_ENDPOINTS.CATEGORIES);
    return response || [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};

// Get countries list
export const getCountries = async (): Promise<Country[]> => {
  try {
    const response = await apiClient.get<Country[]>(API_ENDPOINTS.COUNTRIES);
    return response || [];
  } catch (error) {
    console.error('Error fetching countries:', error);
    return [];
  }
};

// Optimize image URL
export const getOptimizedImageUrl = (imageUrl: string): string => {
  if (!imageUrl) return '';
  
  // If it's already a full URL, use it as is
  if (imageUrl.startsWith('http')) {
    return imageUrl;
  }
  
  // If it's a relative path, prepend the CDN domain
  const cdnUrl = `https://phimimg.com${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
  return cdnUrl;
};