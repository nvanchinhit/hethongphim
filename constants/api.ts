// API Base URL - Use direct phimapi.com endpoints
export const API_BASE_URL = 'https://phimapi.com';

// API Endpoints
export const API_ENDPOINTS = {
  // Movie endpoints - Updated to use correct phimapi.com endpoints
  MOVIES: {
    NEW_UPDATES: '/danh-sach/phim-moi-cap-nhat',
    DETAIL: (slug: string) => `/phim/${slug}`,
    SEARCH: '/v1/api/tim-kiem',
    BY_TYPE: (typeList: string) => `/v1/api/danh-sach/${typeList}`,
    BY_GENRE: (genreSlug: string) => `/v1/api/the-loai/${genreSlug}`,
    BY_COUNTRY: (countrySlug: string) => `/v1/api/quoc-gia/${countrySlug}`,
    BY_YEAR: (year: string) => `/v1/api/nam/${year}`,
  },
  // Category and country lists
  CATEGORIES: '/the-loai',
  COUNTRIES: '/quoc-gia',
  // Image optimization
  IMAGE_OPTIMIZE: (imageUrl: string) => `/image.php?url=${encodeURIComponent(imageUrl)}`,
} as const;

// Default pagination
export const DEFAULT_PAGINATION = {
  page: 1,
  limit: 24,
} as const;

// Category mappings for type_list parameter
export const CATEGORY_MAPPINGS = {
  'phim-moi': 'phim-moi-cap-nhat',
  'phim-hay': 'phim-dang-chieu',
  'phim-le': 'phim-le',
  'phim-bo': 'phim-bo',
  'phim-dang-chieu': 'phim-dang-chieu',
  'tinh-co-trang': 'tinh-co-trang',
  'hoat-hinh': 'hoat-hinh',
  'tv-shows': 'tv-shows',
  'phim-vietsub': 'phim-vietsub',
  'phim-thuyet-minh': 'phim-thuyet-minh',
  'phim-long-tieng': 'phim-long-tieng',
} as const;

// Genre mappings - updated to match phimapi.com categories
export const GENRE_MAPPINGS = {
  'hanh-dong': 'hanh-dong',
  'hai-huoc': 'hai-huoc',
  'chinh-kich': 'chinh-kich',
  'lich-su': 'lich-su',
  'bi-an': 'bi-an',
  'tinh-cam': 'tinh-cam',
  'phim-18': 'phim-18',
  'phieu-luu': 'phieu-luu',
  'hinh-su': 'hinh-su',
  'gia-dinh': 'gia-dinh',
  'kinh-di': 'kinh-di',
  'chien-tranh': 'chien-tranh',
  'co-trang': 'co-trang',
  'hoat-hinh': 'hoat-hinh',
  'tai-lieu': 'tai-lieu',
  'am-nhac': 'am-nhac',
  'khoa-hoc': 'khoa-hoc',
  'vien-tuong': 'vien-tuong',
  'tam-ly': 'tam-ly',
  'mien-tay': 'mien-tay',
  'tre-em': 'tre-em',
  'the-thao': 'the-thao',
  'vo-thuat': 'vo-thuat',
  'than-thoai': 'than-thoai',
  'kinh-dien': 'kinh-dien',
  'hoc-duong': 'hoc-duong',
} as const;

// Country mappings - updated to match phimapi.com countries
export const COUNTRY_MAPPINGS = {
  'viet-nam': 'viet-nam',
  'trung-quoc': 'trung-quoc',
  'thai-lan': 'thai-lan',
  'hong-kong': 'hong-kong',
  'phap': 'phap',
  'duc': 'duc',
  'ha-lan': 'ha-lan',
  'mexico': 'mexico',
  'thuy-dien': 'thuy-dien',
  'philippines': 'philippines',
  'dan-mach': 'dan-mach',
  'thuy-si': 'thuy-si',
  'ukraina': 'ukraina',
  'han-quoc': 'han-quoc',
  'au-my': 'au-my',
  'an-do': 'an-do',
  'canada': 'canada',
  'tay-ban-nha': 'tay-ban-nha',
  'indonesia': 'indonesia',
  'ba-lan': 'ba-lan',
  'malaysia': 'malaysia',
  'bo-dao-nha': 'bo-dao-nha',
  'uae': 'uae',
  'chau-phi': 'chau-phi',
  'a-rap-xe-ut': 'a-rap-xe-ut',
  'nhat-ban': 'nhat-ban',
  'dai-loan': 'dai-loan',
  'anh': 'anh',
  'quoc-gia-khac': 'quoc-gia-khac',
  'tho-nhi-ky': 'tho-nhi-ky',
  'nga': 'nga',
  'uc': 'uc',
  'brazil': 'brazil',
  'y': 'y',
  'na-uy': 'na-uy',
  'nam-phi': 'nam-phi',
} as const;

// Sort field options
export const SORT_FIELDS = {
  MODIFIED_TIME: 'modified.time',
  ID: '_id',
  YEAR: 'year',
} as const;

// Sort type options
export const SORT_TYPES = {
  DESC: 'desc',
  ASC: 'asc',
} as const;

// Language options
export const LANGUAGE_OPTIONS = {
  VIETSUB: 'vietsub',
  THUYET_MINH: 'thuyet-minh',
  LONG_TIENG: 'long-tieng',
} as const;