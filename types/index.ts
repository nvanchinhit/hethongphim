// Movie related types - updated for phimapi.com structure
export interface Movie {
  _id: string;
  name: string;
  slug: string;
  origin_name: string;
  thumb_url: string;
  poster_url: string;
  content?: string;
  type: 'single' | 'series' | 'hoathinh';
  status?: 'completed' | 'ongoing';
  time: string;
  episode_current: string;
  episode_total?: string;
  quality: string;
  lang: string;
  year: number;
  view?: number;
  actor?: string[];
  director?: string[];
  category: Category[];
  country: Country[];
  sub_docquyen?: boolean;
  chieurap?: boolean;
  trailer_url?: string;
  notify?: string;
  showtimes?: string;
  is_copyright?: boolean;
  created?: {
    time: string;
  };
  modified?: {
    time: string;
  };
  tmdb?: {
    type: string | null;
    id: string | null;
    season: number | null;
    vote_average: number;
    vote_count: number;
  };
  imdb?: {
    id: string | null;
  };
  // Episodes for detail pages
  episodes?: EpisodeServer[];
  // For compatibility with existing code
  id?: string;
  originalName?: string;
  thumbUrl?: string;
  posterUrl?: string;
  totalEpisodes?: number;
  currentEpisode?: string;
  episodeTime?: string;
  cast?: string[];
  description?: string;
  total_episodes?: number;
  current_episode?: string;
  language?: string;
  casts?: string | string[];
  isCopyright?: boolean;
  isNewUpdate?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CategoryGroup {
  [key: string]: {
    group: {
      id: string;
      name: string;
    };
    list: Category[];
  };
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface Country {
  id: string;
  name: string;
  slug: string;
}

export interface Episode {
  name: string;
  slug: string;
  filename: string;
  link_embed: string;
  link_m3u8: string;
}

export interface EpisodeServer {
  server_name: string;
  server_data: Episode[];
}

// API Response types - updated for phimapi.com structure
export interface ApiResponse<T> {
  status: boolean | string;
  msg?: string;
  data?: T;
  movie?: T;
  items?: T;
  pagination?: Pagination;
  seoOnPage?: {
    og_type?: string;
    titleHead?: string;
    descriptionHead?: string;
    og_image?: string[];
    og_url?: string;
  };
  breadCrumb?: Array<{
    name: string;
    slug?: string;
    isCurrent: boolean;
    position: number;
  }>;
  titlePage?: string;
  params?: {
    type_slug?: string;
    filterCategory?: string[];
    filterCountry?: string[];
    filterYear?: string | string[];
    filterType?: string;
    sortField?: string;
    sortType?: string;
    pagination?: Pagination;
  };
  type_list?: string;
  APP_DOMAIN_FRONTEND?: string;
  APP_DOMAIN_CDN_IMAGE?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: Pagination;
}

export interface Pagination {
  totalItems: number;
  totalItemsPerPage: number;
  currentPage: number;
  totalPages: number;
  updateToday?: number;
  // For compatibility
  current_page?: number;
  total_page?: number;
  total_items?: number;
  items_per_page?: number;
}

// Search types - updated for phimapi.com
export interface SearchParams {
  keyword?: string;
  category?: string;
  country?: string;
  year?: number;
  page?: number;
  limit?: number;
  sort_field?: 'modified.time' | '_id' | 'year';
  sort_type?: 'desc' | 'asc';
  sort_lang?: 'vietsub' | 'thuyet-minh' | 'long-tieng';
}

// Component props types
export interface MovieCardProps {
  movie: Movie;
  showEpisode?: boolean;
}

export interface MovieGridProps {
  movies: Movie[];
  loading?: boolean;
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export interface HeroCarouselProps {
  movies: Movie[];
}

export interface EpisodeListProps {
  episodes: Episode[];
  servers?: EpisodeServer[];
  currentEpisode?: string;
  movieSlug: string;
}

export interface VideoPlayerProps {
  src: string;
  poster?: string;
  title?: string;
}

// Movie detail response - updated for phimapi.com
export interface MovieDetailResponse {
  status: boolean;
  msg: string;
  movie: Movie;
  episodes: EpisodeServer[];
}