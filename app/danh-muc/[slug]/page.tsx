'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import MovieGrid from '../../../components/MovieGrid';
import Pagination from '../../../components/Pagination';
import { 
  getMoviesByCategory, 
  getMoviesByGenre, 
  getMoviesByCountry, 
  getMoviesByYear,
  getMoviesByCategoryMultiplePages
} from '../../../lib/movieApi';
import type { Movie, Pagination as PaginationType } from '../../../types';

export default function CategoryPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const slug = params?.slug as string;
  const currentPage = parseInt(searchParams?.get('page') || '1');
  const initialSort = (searchParams?.get('sort') || 'newest') as 'newest' | 'oldest' | 'most-viewed' | 'rating';
  const initialYear = searchParams?.get('year') || '';
  const initialQuality = searchParams?.get('quality') || '';
  
  const [movies, setMovies] = useState<Movie[]>([]);
  const [topMovies, setTopMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<PaginationType>({
    current_page: 1,
    total_page: 1,
    total_items: 0,
    items_per_page: 7
  });
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'most-viewed' | 'rating'>(initialSort);
  const [yearFilter, setYearFilter] = useState<string>(initialYear);
  const [qualityFilter, setQualityFilter] = useState<string>(initialQuality);
  const [categoryInfo, setCategoryInfo] = useState<{ name: string; type: 'category' | 'country' | 'year' | 'genre' }>({ 
    name: '', 
    type: 'category' 
  });

  useEffect(() => {
    const loadMovies = async () => {
      setLoading(true);
      
      try {
        let response;
        let pageInfo: { name: string; type: 'category' | 'country' | 'year' | 'genre' } = { name: '', type: 'category' };
        
        // Check if it's a year
        const year = parseInt(slug);
        if (!isNaN(year)) {
          response = await getMoviesByYear(slug, currentPage);
          pageInfo = { name: `Năm ${year}`, type: 'year' };
        } else {
          // Try different API endpoints based on slug patterns
          const genreSlugs = [
            'hanh-dong', 'hai', 'chinh-kich', 'lich-su', 'bi-an', 'gay-can', 'tinh-cam', 'phim-18',
            'phieu-luu', 'hinh-su', 'gia-dinh', 'kinh-di', 'lang-man', 'chien-tranh', 'co-trang',
            'hoat-hinh', 'tai-lieu', 'gia-tuong', 'nhac', 'khoa-hoc-vien-tuong', 'tam-ly', 'mien-tay'
          ];
          const countrySlugs = [
            'au-my', 'indonesia', 'hong-kong', 'thai-lan', 'ha-lan', 'quoc-gia-khac',
            'anh', 'viet-nam', 'han-quoc', 'dai-loan', 'philippines', 'trung-quoc',
            'phap', 'nhat-ban', 'nga', 'an-do'
          ];
          
          if (genreSlugs.includes(slug)) {
            response = await getMoviesByGenre(slug, currentPage);
            pageInfo = { name: getGenreName(slug), type: 'genre' };
          } else if (countrySlugs.includes(slug)) {
            response = await getMoviesByCountry(slug, currentPage);
            pageInfo = { name: getCountryName(slug), type: 'country' };
          } else {
            // Default to category
            response = await getMoviesByCategory(slug, currentPage);
            pageInfo = { name: getCategoryName(slug), type: 'category' };
          }
        }

        setCategoryInfo(pageInfo);
        setMovies(response.items);
        setPagination(response.paginate);
        
        // Load top movies
        try {
          const topMoviesData = await getMoviesByCategoryMultiplePages('phim-hay', 10);
          setTopMovies(topMoviesData);
        } catch (error) {
          console.warn('Failed to load top movies:', error);
          setTopMovies([]);
        }
        
      } catch (error) {
        console.error('Error loading movies:', error);
        setMovies([]);
        setPagination({
          current_page: 1,
          total_page: 1,
          total_items: 0,
          items_per_page: 7
        });
      } finally {
        setLoading(false);
      }
    };

    loadMovies();
  }, [slug, currentPage]);

  // Derived filtered + sorted movies
  const displayedMovies = useMemo(() => {
    let list = [...movies];
    if (qualityFilter) {
      list = list.filter((m) => (m.quality || '').toLowerCase() === qualityFilter.toLowerCase());
    }
    if (yearFilter) {
      list = list.filter((m) => String(m.year || (m.created ? new Date(m.created).getFullYear() : '')) === yearFilter);
    }
    switch (sortBy) {
      case 'newest':
        list.sort((a, b) => (b.year || 0) - (a.year || 0));
        break;
      case 'oldest':
        list.sort((a, b) => (a.year || 0) - (b.year || 0));
        break;
      case 'most-viewed':
        list.sort((a, b) => (b.view || 0) - (a.view || 0));
        break;
      default:
        break;
    }
    return list;
  }, [movies, sortBy, yearFilter, qualityFilter]);

  const updateQueryParam = (key: string, value: string) => {
    const url = new URL(window.location.href);
    if (value) url.searchParams.set(key, value); else url.searchParams.delete(key);
    url.searchParams.set('page', String(currentPage));
    window.history.replaceState(null, '', url.toString());
  };

  // Helper functions to get display names
  const getCategoryName = (slug: string): string => {
    const categoryNames: { [key: string]: string } = {
      'phim-moi': 'Phim mới cập nhật',
      'phim-hay': 'Phim hay nhất',
      'phim-le': 'Phim lẻ',
      'phim-bo': 'Phim bộ',
      'phim-dang-chieu': 'Phim đang chiếu'
    };
    return categoryNames[slug] || 'Danh mục phim';
  };

  const getGenreName = (slug: string): string => {
    const genreNames: { [key: string]: string } = {
      'hanh-dong': 'Hành Động',
      'hai': 'Hài',
      'chinh-kich': 'Chính Kịch',
      'lich-su': 'Lịch Sử',
      'bi-an': 'Bí Ẩn',
      'gay-can': 'Gây Cấn',
      'tinh-cam': 'Tình Cảm',
      'phim-18': 'Phim 18+',
      'phieu-luu': 'Phiêu Lưu',
      'hinh-su': 'Hình Sự',
      'gia-dinh': 'Gia Đình',
      'kinh-di': 'Kinh Dị',
      'lang-man': 'Lãng Mạn',
      'chien-tranh': 'Chiến Tranh',
      'co-trang': 'Cổ Trang',
      'hoat-hinh': 'Hoạt Hình',
      'tai-lieu': 'Tài Liệu',
      'gia-tuong': 'Giả Tưởng',
      'nhac': 'Nhạc',
      'khoa-hoc-vien-tuong': 'Khoa Học Viễn Tưởng',
      'tam-ly': 'Tâm Lý',
      'mien-tay': 'Miền Tây'
    };
    return genreNames[slug] || 'Thể loại';
  };

  const getCountryName = (slug: string): string => {
    const countryNames: { [key: string]: string } = {
      'au-my': 'Âu Mỹ',
      'indonesia': 'Indonesia',
      'hong-kong': 'Hồng Kông',
      'thai-lan': 'Thái Lan',
      'ha-lan': 'Hà Lan',
      'quoc-gia-khac': 'Quốc gia khác',
      'anh': 'Anh',
      'viet-nam': 'Việt Nam',
      'han-quoc': 'Hàn Quốc',
      'dai-loan': 'Đài Loan',
      'philippines': 'Philippines',
      'trung-quoc': 'Trung Quốc',
      'phap': 'Pháp',
      'nhat-ban': 'Nhật Bản',
      'nga': 'Nga',
      'an-do': 'Ấn Độ'
    };
    return countryNames[slug] || 'Quốc gia';
  };

  const handlePageChange = (page: number) => {
    window.history.pushState(null, '', `?page=${page}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getBreadcrumbText = () => {
    switch (categoryInfo.type) {
      case 'genre':
        return `Thể loại: ${categoryInfo.name}`;
      case 'country':
        return `Quốc gia: ${categoryInfo.name}`;
      case 'year':
        return `${categoryInfo.name}`;
      default:
        return categoryInfo.name;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-400 mb-6">
          <Link href="/" className="hover:text-cyan-400 transition-colors">
            Trang chủ
          </Link>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-white">{getBreadcrumbText()}</span>
        </nav>

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {categoryInfo.name}
          </h1>
          {!loading && (
            <p className="text-gray-400">
              Tìm thấy {pagination.total_items} phim • Trang {pagination.current_page} / {pagination.total_page}
            </p>
          )}
        </div>

        {/* Filter Bar */}
        <div className="bg-slate-800 rounded-lg p-4 mb-8">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2">
              <span className="text-gray-400 text-sm">Sắp xếp:</span>
              <select
                value={sortBy}
                onChange={(e) => { setSortBy(e.target.value as any); updateQueryParam('sort', e.target.value); }}
                className="bg-slate-700 text-white text-sm px-3 py-2 rounded border border-slate-600 focus:outline-none focus:border-cyan-400"
              >
                <option value="newest">Mới nhất</option>
                <option value="oldest">Cũ nhất</option>
                <option value="most-viewed">Xem nhiều nhất</option>
                <option value="rating">Đánh giá cao</option>
              </select>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-gray-400 text-sm">Năm:</span>
              <select
                value={yearFilter}
                onChange={(e) => { setYearFilter(e.target.value); updateQueryParam('year', e.target.value); }}
                className="bg-slate-700 text-white text-sm px-3 py-2 rounded border border-slate-600 focus:outline-none focus:border-cyan-400"
              >
                <option value="">Tất cả</option>
                {Array.from({ length: 22 }, (_, i) => 2025 - i).map(year => (
                  <option key={year} value={year.toString()}>{year}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-gray-400 text-sm">Chất lượng:</span>
              <select
                value={qualityFilter}
                onChange={(e) => { setQualityFilter(e.target.value); updateQueryParam('quality', e.target.value); }}
                className="bg-slate-700 text-white text-sm px-3 py-2 rounded border border-slate-600 focus:outline-none focus:border-cyan-400"
              >
                <option value="">Tất cả</option>
                <option value="FHD">FHD</option>
                <option value="HD">HD</option>
                <option value="CAM">CAM</option>
              </select>
            </div>
          </div>
        </div>

        {/* Main Content with Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left side - Movies Grid */}
          <div className="lg:col-span-3">
            <MovieGrid movies={displayedMovies} loading={loading} />

            {/* Pagination */}
            {!loading && pagination.total_page > 1 && (
              <Pagination
                currentPage={pagination.current_page}
                totalPages={pagination.total_page}
                onPageChange={handlePageChange}
              />
            )}
          </div>

          {/* Right side - Top phim */}
          <div className="lg:col-span-1">
            <div className="bg-slate-800 rounded-lg border border-slate-700 p-6 sticky top-24">
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                🏆 Top phim
              </h3>
              <div className="space-y-3">
                {topMovies.slice(0, 10).map((movie: any, idx: number) => (
                  <div key={movie.id || movie.slug || `top-${idx}`} className="group">
                    <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-700/50 transition-colors">
                      <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black text-xs font-bold rounded-full flex items-center justify-center">
                        {idx + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-white text-sm font-medium truncate group-hover:text-cyan-400 transition-colors">
                          {movie.name}
                        </h4>
                      </div>
                      <div className="flex-shrink-0">
                        <div className="w-20 h-12 bg-slate-700 rounded overflow-hidden">
                          {(movie.poster_url || movie.posterUrl) && (
                            <img 
                              src={movie.poster_url || movie.posterUrl} 
                              alt={movie.name}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                      </div>
                    </div>
                    {/* Divider line between items */}
                    {idx < topMovies.length - 1 && (
                      <div className="border-t border-slate-600/50 mx-2"></div>
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-6">
                <Link
                  href="/danh-muc/phim-hay"
                  className="w-full bg-cyan-600 hover:bg-cyan-700 text-white text-center py-2 px-4 rounded-lg text-sm font-medium transition-colors block"
                  suppressHydrationWarning
                >
                  Xem tất cả
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
