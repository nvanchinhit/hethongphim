// Movie related types
export interface Movie {
  id?: string;
  name: string;
  slug: string;
  original_name: string;
  thumb_url: string;
  poster_url: string;
  description: string;
  total_episodes: number;
  current_episode: string;
  time: string;
  quality: string;
  language: string;
  director?: string | string[];
  casts?: string | string[];
  created?: string;
  modified?: string;
  category?: CategoryGroup;
  // Episodes for detail pages
  episodes?: EpisodeServer[];
  // For compatibility with existing code
  originalName?: string;
  thumbUrl?: string;
  posterUrl?: string;
  totalEpisodes?: number;
  currentEpisode?: string;
  episodeTime?: string;
  cast?: string[];
  country?: Country[];
  year?: number;
  view?: number;
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
  slug?: string;
  title?: string;
}

export interface Country {
  id: string;
  name: string;
  slug: string;
}

export interface Episode {
  name: string;
  slug: string;
  embed: string;
  m3u8: string;
}

export interface EpisodeServer {
  server_name: string;
  items: Episode[];
}

// API Response types
export interface ApiResponse<T> {
  status: string;
  message?: string;
  data?: T;
  movie?: T;
  items?: T;
  cat?: Category;
  paginate?: Pagination;
}

export interface PaginatedResponse<T> {
  items: T[];
  paginate: Pagination;
}

export interface Pagination {
  current_page: number;
  total_page: number;
  total_items: number;
  items_per_page: number;
  // For compatibility
  totalItems?: number;
  totalItemsPerPage?: number;
  currentPage?: number;
  totalPages?: number;
}

// Search types
export interface SearchParams {
  keyword?: string;
  category?: string;
  country?: string;
  year?: number;
  page?: number;
  limit?: number;
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

// Movie detail response
export interface MovieDetailResponse {
  status: string;
  movie: {
    id: string;
    name: string;
    slug: string;
    original_name: string;
    thumb_url: string;
    poster_url: string;
    created: string;
    modified: string;
    description: string;
    total_episodes: number;
    current_episode: string;
    time: string;
    quality: string;
    language: string;
    director: string;
    casts: string;
    category: CategoryGroup;
    episodes: EpisodeServer[];
  };
}