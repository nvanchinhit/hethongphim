import type { Movie, Category, Country, CategoryGroup } from '@/types';
import { apiClient } from './api';
import { API_ENDPOINTS, CATEGORY_MAPPINGS, GENRE_MAPPINGS, COUNTRY_MAPPINGS } from '../constants/api';

// API Response Types
interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Categories API - Static data since API doesn't provide categories
export const getCategories = async (): Promise<Category[]> => {
  return [
    { id: '1', name: 'Hành Động', slug: 'hanh-dong' },
    { id: '2', name: 'Hài', slug: 'hai' },
    { id: '3', name: 'Chính Kịch', slug: 'chinh-kich' },
    { id: '4', name: 'Lịch Sử', slug: 'lich-su' },
    { id: '5', name: 'Bí Ẩn', slug: 'bi-an' },
    { id: '6', name: 'Gây Cấn', slug: 'gay-can' },
    { id: '7', name: 'Tình Cảm', slug: 'tinh-cam' },
    { id: '8', name: 'Phim 18+', slug: 'phim-18' },
    { id: '9', name: 'Phiêu Lưu', slug: 'phieu-luu' },
    { id: '10', name: 'Hình Sự', slug: 'hinh-su' },
    { id: '11', name: 'Gia Đình', slug: 'gia-dinh' },
    { id: '12', name: 'Kinh Dị', slug: 'kinh-di' },
    { id: '13', name: 'Lãng Mạn', slug: 'lang-man' },
    { id: '14', name: 'Chiến Tranh', slug: 'chien-tranh' },
    { id: '15', name: 'Cổ Trang', slug: 'co-trang' },
    { id: '16', name: 'Hoạt Hình', slug: 'hoat-hinh' },
    { id: '17', name: 'Tài Liệu', slug: 'tai-lieu' },
    { id: '18', name: 'Giả Tưởng', slug: 'gia-tuong' },
    { id: '19', name: 'Nhạc', slug: 'nhac' },
    { id: '20', name: 'Khoa Học Viễn Tưởng', slug: 'khoa-hoc-vien-tuong' },
    { id: '21', name: 'Tâm Lý', slug: 'tam-ly' },
    { id: '22', name: 'Miền Tây', slug: 'mien-tay' },
  ];
};

// Countries API - Static data since API doesn't provide countries
export const getCountries = async (): Promise<Country[]> => {
  return [
    { id: '1', name: 'Âu Mỹ', slug: 'au-my' },
    { id: '2', name: 'Indonesia', slug: 'indonesia' },
    { id: '3', name: 'Hồng Kông', slug: 'hong-kong' },
    { id: '4', name: 'Thái Lan', slug: 'thai-lan' },
    { id: '5', name: 'Hà Lan', slug: 'ha-lan' },
    { id: '6', name: 'Quốc gia khác', slug: 'quoc-gia-khac' },
    { id: '7', name: 'Anh', slug: 'anh' },
    { id: '8', name: 'Việt Nam', slug: 'viet-nam' },
    { id: '9', name: 'Hàn Quốc', slug: 'han-quoc' },
    { id: '10', name: 'Đài Loan', slug: 'dai-loan' },
    { id: '11', name: 'Philippines', slug: 'philippines' },
    { id: '12', name: 'Trung Quốc', slug: 'trung-quoc' },
    { id: '13', name: 'Pháp', slug: 'phap' },
    { id: '14', name: 'Nhật Bản', slug: 'nhat-ban' },
    { id: '15', name: 'Nga', slug: 'nga' },
    { id: '16', name: 'Ấn Độ', slug: 'an-do' },
  ];
};

// Helper function to create CategoryGroup
const createCategoryGroup = (categories: Category[]): CategoryGroup => {
  return {
    '1': {
      group: { id: '1', name: 'Thể loại' },
      list: categories
    }
  };
};

// Movies API
export const getMovies = async (params?: {
  page?: number;
  limit?: number;
  category?: string;
  country?: string;
  year?: number;
  isNewUpdate?: boolean;
  search?: string;
}): Promise<PaginatedResponse<Movie>> => {
  try {
    const queryParams: Record<string, string | number | boolean> = {};
    
    if (params?.page) queryParams.page = params.page;
    if (params?.limit) queryParams.limit = params.limit;
    if (params?.search) queryParams.q = params.search;

    // Map category to API endpoint
    let endpoint: string = API_ENDPOINTS.MOVIES.NEW_UPDATES;
    if (params?.category) {
      const mappedCategory = CATEGORY_MAPPINGS[params.category as keyof typeof CATEGORY_MAPPINGS];
      if (mappedCategory) {
        endpoint = API_ENDPOINTS.MOVIES.BY_GENRE(mappedCategory);
      }
    }

    const response = await apiClient.get<PaginatedResponse<Movie>>(endpoint, { params: queryParams });
    return response;
  } catch (error) {
    console.error('Error fetching movies:', error);
    // Return empty result on error
    return {
      data: [],
      total: 0,
      page: 1,
      limit: 12,
      totalPages: 0
    };
  }
};

// New function to fetch 2 pages (20 movies)
export const getMoviesByCategoryMultiplePages = async (category: string, totalMovies: number = 20): Promise<Movie[]> => {
  try {
    const moviesPerPage = 10;
    const pagesToFetch = Math.ceil(totalMovies / moviesPerPage);
    const allMovies: Movie[] = [];

    for (let page = 1; page <= pagesToFetch; page++) {
      const response = await getMovies({ category, page, limit: moviesPerPage });
      if (response.data && response.data.length > 0) {
        allMovies.push(...response.data);
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

export const getMovieById = async (slug: string): Promise<Movie | null> => {
  try {
    const response = await apiClient.get<Movie>(API_ENDPOINTS.MOVIES.DETAIL(slug));
    return response;
  } catch (error) {
    console.error('Error fetching movie:', error);
    return null;
  }
};

export const getFeaturedMovies = async (): Promise<Movie[]> => {
  try {
    const response = await getMovies({ limit: 4, page: 1 });
    return response.data;
  } catch (error) {
    console.error('Error fetching featured movies:', error);
    return [];
  }
};

export const getNewUpdateMovies = async (limit = 24): Promise<Movie[]> => {
  try {
    const response = await apiClient.get<PaginatedResponse<Movie>>(API_ENDPOINTS.MOVIES.NEW_UPDATES, {
      params: { limit, page: 1 }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching new update movies:', error);
    return [];
  }
};

export const getTopRatedMovies = async (limit = 12): Promise<Movie[]> => {
  try {
    const response = await getMovies({ limit, page: 1 });
    return response.data;
  } catch (error) {
    console.error('Error fetching top rated movies:', error);
    return [];
  }
};

export const getMoviesByCategory = async (categorySlug: string, limit = 12): Promise<Movie[]> => {
  try {
    const response = await getMovies({ 
      category: categorySlug, 
      limit,
      page: 1 
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching movies by category:', error);
    return [];
  }
};

export const getNewMoviesByType = async (
  type: 'phim-le' | 'phim-bo' | 'tinh-co-trang' | 'hoat-hinh', 
  limit = 12
): Promise<Movie[]> => {
  try {
    const response = await getMovies({ 
      category: type, 
      limit,
      page: 1 
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching movies by type:', error);
    return [];
  }
};

export const searchMovies = async (query: string, limit = 12): Promise<Movie[]> => {
  try {
    const response = await apiClient.get<PaginatedResponse<Movie>>(API_ENDPOINTS.MOVIES.SEARCH, {
      params: { q: query, limit, page: 1 }
    });
    return response.data;
  } catch (error) {
    console.error('Error searching movies:', error);
    return [];
  }
};

// Legacy exports for backward compatibility (deprecated - use API functions instead)
export const mockMovies: Movie[] = [];

// Legacy exports for backward compatibility (deprecated - use API functions instead)
export const allMockMovies: Movie[] = [];
export const featuredMovies: Movie[] = [];
export const newUpdateMovies: Movie[] = [];
export const topRatedMovies: Movie[] = [];

// Note: All data now comes from API calls. Use the async functions above instead of these static exports.
