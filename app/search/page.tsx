'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import MovieGrid from '@/components/MovieGrid';
import Pagination from '@/components/Pagination';
import { searchMovies } from '@/lib/movieApi';
import type { Movie, Pagination as PaginationType } from '@/types';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams?.get('q') || '';
  const currentPage = parseInt(searchParams?.get('page') || '1');
  
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState<PaginationType>({
    current_page: 1,
    total_page: 1,
    total_items: 0,
    items_per_page: 10
  });

  useEffect(() => {
    const performSearch = async () => {
      if (!query.trim()) {
        setMovies([]);
        return;
      }

      setLoading(true);
      
      try {
        const response = await searchMovies({
          keyword: query,
          page: currentPage
        });

        setMovies(response.items);
        setPagination(response.paginate);
        
      } catch (error) {
        console.error('Error searching movies:', error);
        setMovies([]);
        setPagination({
          current_page: 1,
          total_page: 1,
          total_items: 0,
          items_per_page: 10
        });
      } finally {
        setLoading(false);
      }
    };

    performSearch();
  }, [query, currentPage]);

  const handlePageChange = (page: number) => {
    const url = new URL(window.location.href);
    url.searchParams.set('page', page.toString());
    window.history.pushState(null, '', url.toString());
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Kết quả tìm kiếm
          </h1>
          {query && (
            <p className="text-gray-400 mb-4">
              Tìm kiếm cho: <span className="text-cyan-400 font-semibold">&quot;{query}&quot;</span>
            </p>
          )}
          {!loading && query && (
            <p className="text-gray-400">
              Tìm thấy {pagination.total_items} kết quả • Trang {pagination.current_page} / {pagination.total_page}
            </p>
          )}
        </div>

        {/* Search Form */}
        <div className="bg-slate-800 rounded-lg p-6 mb-8">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const searchQuery = formData.get('q') as string;
              if (searchQuery.trim()) {
                const url = new URL(window.location.href);
                url.searchParams.set('q', searchQuery.trim());
                url.searchParams.delete('page');
                window.location.href = url.toString();
              }
            }}
            className="flex gap-4"
          >
            <input
              type="text"
              name="q"
              defaultValue={query}
              placeholder="Nhập tên phim bạn muốn tìm..."
              className="flex-1 px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 transition-colors"
            />
            <button
              type="submit"
              className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Tìm kiếm
            </button>
          </form>
        </div>

        {/* Results */}
        {!query.trim() ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg mb-2">Nhập từ khóa để tìm kiếm phim</div>
            <p className="text-gray-500 text-sm">Hãy nhập tên phim, đạo diễn hoặc diễn viên bạn muốn tìm</p>
          </div>
        ) : loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
            {Array.from({ length: 24 }).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-slate-700 aspect-[2/3] rounded-lg mb-3"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-slate-700 rounded w-3/4"></div>
                  <div className="h-3 bg-slate-700 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : movies.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg mb-2">Không tìm thấy kết quả nào</div>
            <p className="text-gray-500 text-sm">Hãy thử với từ khóa khác hoặc kiểm tra lại chính tả</p>
          </div>
        ) : (
          <>
            <MovieGrid movies={movies} />
            
            {/* Pagination */}
            {pagination.total_page > 1 && (
              <Pagination
                currentPage={pagination.current_page}
                totalPages={pagination.total_page}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
