// API Base URL
export const API_BASE_URL = 'https://phim.nguonc.com/api';

// API Endpoints
export const API_ENDPOINTS = {
  // Movie endpoints
  MOVIES: {
    LIST: '/films',
    NEW_UPDATES: '/films/phim-moi-cap-nhat',
    BY_CATEGORY: (categorySlug: string) => `/films/danh-sach/${categorySlug}`,
    BY_GENRE: (genreSlug: string) => `/films/the-loai/${genreSlug}`,
    BY_COUNTRY: (countrySlug: string) => `/films/quoc-gia/${countrySlug}`,
    BY_YEAR: (year: string) => `/films/nam-phat-hanh/${year}`,
    DETAIL: (slug: string) => `/film/${slug}`,
    SEARCH: '/films/search',
  },
} as const;

// Default pagination
export const DEFAULT_PAGINATION = {
  page: 1,
  limit: 24,
} as const;

// Category mappings
export const CATEGORY_MAPPINGS = {
  'phim-moi': 'phim-moi-cap-nhat',
  'phim-hay': 'phim-dang-chieu',
  'phim-le': 'phim-le',
  'phim-bo': 'phim-bo',
  'phim-dang-chieu': 'phim-dang-chieu',
  'tinh-co-trang': 'tinh-co-trang',
  'hoat-hinh': 'hoat-hinh',
} as const;

// Genre mappings 
export const GENRE_MAPPINGS = {
  'hanh-dong': 'hanh-dong',
  'hai': 'hai',
  'chinh-kich': 'chinh-kich',
  'lich-su': 'lich-su',
  'bi-an': 'bi-an',
  'gay-can': 'gay-can',
  'tinh-cam': 'tinh-cam',
  'phim-18': 'phim-18',
  'phieu-luu': 'phieu-luu',
  'hinh-su': 'hinh-su',
  'gia-dinh': 'gia-dinh',
  'kinh-di': 'kinh-di',
  'lang-man': 'lang-man',
  'chien-tranh': 'chien-tranh',
  'co-trang': 'co-trang',
  'hoat-hinh': 'hoat-hinh',
  'tai-lieu': 'tai-lieu',
  'gia-tuong': 'gia-tuong',
  'nhac': 'nhac',
  'khoa-hoc-vien-tuong': 'khoa-hoc-vien-tuong',
  'tam-ly': 'tam-ly',
  'mien-tay': 'mien-tay',
} as const;

// Country mappings
export const COUNTRY_MAPPINGS = {
  'au-my': 'au-my',
  'indonesia': 'indonesia',
  'hong-kong': 'hong-kong',
  'thai-lan': 'thai-lan',
  'ha-lan': 'ha-lan',
  'quoc-gia-khac': 'quoc-gia-khac',
  'anh': 'anh',
  'viet-nam': 'viet-nam',
  'han-quoc': 'han-quoc',
  'dai-loan': 'dai-loan',
  'philippines': 'philippines',
  'trung-quoc': 'trung-quoc',
  'phap': 'phap',
  'nhat-ban': 'nhat-ban',
  'nga': 'nga',
  'an-do': 'an-do',
} as const;