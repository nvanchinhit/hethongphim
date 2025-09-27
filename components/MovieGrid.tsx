import MovieCard from './MovieCard';
import type { MovieGridProps } from '@/types';

const MovieGrid = ({ movies, loading = false }: MovieGridProps) => {
  if (loading) {
    return (
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
    );
  }

  if (!movies || movies.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-lg mb-2">Không tìm thấy phim nào</div>
        <p className="text-gray-500 text-sm">Vui lòng thử lại với từ khóa khác</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-4">
      {movies.map((movie, index) => (
        <div key={movie.id || movie.slug || `movie-${index}`} className="h-full relative">
          <MovieCard movie={movie} />
        </div>
      ))}
    </div>
  );
};

export default MovieGrid;
