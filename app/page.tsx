import React from 'react';
import type { Movie } from '../types';
import HomeHero from '../components/HomeHero';
import MovieCard from '../components/MovieCard';
import Link from 'next/link';
import { 
  getNewUpdateMovies, 
  getMoviesByGenre,
  getMoviesByCategory,
  getMoviesByCategoryMultiplePages
} from '../lib/movieApi';
import { Anton } from 'next/font/google';

const anton = Anton({ subsets: ['latin'], weight: '400' });

export default async function HomePage() {
  let newUpdateResponse: any;
  let featuredMovies: Movie[] = [];
  let topRatedMovies: Movie[] = [];
  let actionMovies: Movie[] = [];
  let romanceMovies: Movie[] = [];
  let comedyMovies: Movie[] = [];
  let tinhCoTrangMovies: Movie[] = [];
  let phimLeMovies: Movie[] = [];
  let phimBoMovies: Movie[] = [];
  let hoatHinhMovies: Movie[] = [];

  try {
    newUpdateResponse = await getNewUpdateMovies(1);
    featuredMovies = newUpdateResponse.items.slice(0, 4);
    
    // Get top rated movies separately
    try {
      const topRatedResponse = await getMoviesByCategoryMultiplePages('phim-hay', 10);
      topRatedMovies = topRatedResponse;
      console.log('Top rated movies:', topRatedMovies.length, topRatedMovies.map(m => m.name));
    } catch (error) {
      console.warn('Top rated API failed, using fallback:', error);
      topRatedMovies = newUpdateResponse.items.slice(0, 10);
    }
    
    // Ensure we have at least some movies for ranking
    if (topRatedMovies.length === 0) {
      topRatedMovies = newUpdateResponse.items.slice(0, 10);
      console.log('Using fallback for top rated movies:', topRatedMovies.length);
    }

    // Thử API riêng lẻ cho từng danh mục - fetch 2 trang để có 20 phim
    try {
      actionMovies = await getMoviesByCategoryMultiplePages('hanh-dong', 20);
      console.log('Action movies from API:', actionMovies.length, actionMovies.map(m => m.name));
    } catch (error) {
      console.warn('Action API failed:', error);
    }

    try {
      romanceMovies = await getMoviesByCategoryMultiplePages('tinh-cam', 20);
      console.log('Romance movies from API:', romanceMovies.length, romanceMovies.map(m => m.name));
    } catch (error) {
      console.warn('Romance API failed:', error);
    }

    try {
      const comedyRes = await getMoviesByGenre('hai-huoc', 1);
      comedyMovies = (comedyRes.items || []).slice(0, 7);
      console.log('Comedy movies from API:', comedyMovies.length, comedyMovies.map(m => m.name));
    } catch (error) {
      console.warn('Comedy API failed:', error);
    }

    try {
      const tinhCoTrangRes = await getMoviesByGenre('co-trang', 1);
      tinhCoTrangMovies = (tinhCoTrangRes.items || []).slice(0, 7);
      console.log('Tinh co trang movies from API:', tinhCoTrangMovies.length, tinhCoTrangMovies.map(m => m.name));
    } catch (error) {
      console.warn('Tinh co trang API failed:', error);
    }

    try {
      const hoatHinhRes = await getMoviesByGenre('hoat-hinh', 1);
      hoatHinhMovies = (hoatHinhRes.items || []).slice(0, 7);
      console.log('Hoat hinh movies from API:', hoatHinhMovies.length, hoatHinhMovies.map(m => m.name));
    } catch (error) {
      console.warn('Hoat hinh API failed:', error);
    }

    // Get phim le and phim bo from new updates - sử dụng cả total_episodes và totalEpisodes
    const allNewMovies = newUpdateResponse.items || [];
    
    // Debug: kiểm tra dữ liệu episodes
    console.log('Sample movies episodes:', allNewMovies.slice(0, 3).map((m: any) => ({
      name: m.name,
      total_episodes: m.total_episodes,
      totalEpisodes: m.totalEpisodes
    })));
    
    phimLeMovies = allNewMovies.filter((movie: any) => {
      const episodes = movie.total_episodes || movie.totalEpisodes || 0;
      return episodes === 1;
    }).slice(0, 7);
    phimBoMovies = allNewMovies.filter((movie: any) => {
      const episodes = movie.total_episodes || movie.totalEpisodes || 0;
      return episodes > 1;
    }).slice(0, 7);
    
    console.log('Filtered results:', {
      phimLe: phimLeMovies.length,
      phimBo: phimBoMovies.length,
      totalMovies: allNewMovies.length
    });

    // Chỉ dùng fallback khi API thật sự không có dữ liệu
    const fallback = newUpdateResponse.items || [];
    const fallbackLength = fallback.length;
    
    // Chỉ dùng fallback khi API không trả về dữ liệu (length === 0)
    if (actionMovies.length === 0) {
      actionMovies = fallback.slice(0, Math.min(20, fallbackLength));
      console.log('Using fallback for action movies');
    } else {
      console.log('Action movies from API:', actionMovies.length, 'movies');
    }
    
    if (romanceMovies.length === 0) {
      romanceMovies = fallback.slice(20, Math.min(40, fallbackLength));
      console.log('Using fallback for romance movies');
    } else {
      console.log('Romance movies from API:', romanceMovies.length, 'movies');
    }
    
    if (comedyMovies.length === 0) {
      comedyMovies = fallback.slice(14, Math.min(21, fallbackLength));
      console.log('Using fallback for comedy movies');
    } else {
      console.log('Comedy movies from API:', comedyMovies.length, 'movies');
    }
    
    if (tinhCoTrangMovies.length === 0) {
      tinhCoTrangMovies = fallback.slice(21, Math.min(28, fallbackLength));
      console.log('Using fallback for tinh co trang movies');
    } else {
      console.log('Tinh co trang movies from API:', tinhCoTrangMovies.length, 'movies');
    }
    
    if (hoatHinhMovies.length === 0) {
      hoatHinhMovies = fallback.slice(28, Math.min(35, fallbackLength));
      console.log('Using fallback for hoat hinh movies');
    } else {
      console.log('Hoat hinh movies from API:', hoatHinhMovies.length, 'movies');
    }
    
    // Đảm bảo phim lẻ và phim bộ luôn có dữ liệu - sử dụng các slice khác nhau
    if (phimLeMovies.length === 0) {
      phimLeMovies = fallback.slice(35, Math.min(42, fallbackLength));
      console.log('Using fallback for phim le:', phimLeMovies.length);
    }
    if (phimBoMovies.length === 0) {
      phimBoMovies = fallback.slice(42, Math.min(49, fallbackLength));
      console.log('Using fallback for phim bo:', phimBoMovies.length);
    }
    
    // Nếu vẫn trùng nhau, tạo dữ liệu khác biệt
    if (phimLeMovies.length > 0 && phimBoMovies.length > 0) {
      const phimLeIds = new Set(phimLeMovies.map(m => m.id || m.slug));
      const phimBoIds = new Set(phimBoMovies.map(m => m.id || m.slug));
      
      // Kiểm tra xem có trùng không
      const hasOverlap = Array.from(phimLeIds).some(id => phimBoIds.has(id));
      if (hasOverlap) {
        console.log('Detected overlap between phim le and phim bo, fixing...');
        // Sử dụng các slice khác nhau
        phimLeMovies = fallback.slice(35, Math.min(42, fallbackLength));
        phimBoMovies = fallback.slice(42, Math.min(49, fallbackLength));
      }
    }
    
    // Debug log để kiểm tra kết quả cuối cùng
    console.log('=== FINAL RESULTS ===');
    console.log('Movie counts by category:', {
      action: actionMovies.length,
      romance: romanceMovies.length,
      comedy: comedyMovies.length,
      tinhCoTrang: tinhCoTrangMovies.length,
      hoatHinh: hoatHinhMovies.length,
      phimLe: phimLeMovies.length,
      phimBo: phimBoMovies.length,
      totalFallback: fallbackLength
    });
    
    // Debug: kiểm tra tên phim trong mỗi danh mục
    console.log('Sample movies by category:');
    if (actionMovies.length > 0) console.log('Action:', actionMovies.slice(0, 2).map(m => m.name));
    if (romanceMovies.length > 0) console.log('Romance:', romanceMovies.slice(0, 2).map(m => m.name));
    if (comedyMovies.length > 0) console.log('Comedy:', comedyMovies.slice(0, 2).map(m => m.name));
    if (tinhCoTrangMovies.length > 0) console.log('Tinh co trang:', tinhCoTrangMovies.slice(0, 2).map(m => m.name));
    if (hoatHinhMovies.length > 0) console.log('Hoat hinh:', hoatHinhMovies.slice(0, 2).map(m => m.name));
    if (phimLeMovies.length > 0) console.log('Phim le:', phimLeMovies.slice(0, 2).map(m => m.name));
    if (phimBoMovies.length > 0) console.log('Phim bo:', phimBoMovies.slice(0, 2).map(m => m.name));
    
    // Debug: kiểm tra xem có phim nào trùng nhau không
    const allMovieIds = [
      ...actionMovies.map(m => m.id || m.slug),
      ...romanceMovies.map(m => m.id || m.slug),
      ...comedyMovies.map(m => m.id || m.slug),
      ...tinhCoTrangMovies.map(m => m.id || m.slug),
      ...hoatHinhMovies.map(m => m.id || m.slug),
      ...phimLeMovies.map(m => m.id || m.slug),
      ...phimBoMovies.map(m => m.id || m.slug)
    ];
    const uniqueIds = new Set(allMovieIds);
    console.log('Total movies displayed:', allMovieIds.length, 'Unique movies:', uniqueIds.size);

  } catch (error) {
    console.error('Error loading homepage data:', error);
    newUpdateResponse = { items: [], paginate: { current_page: 1, total_page: 1, total_items: 0, items_per_page: 10 } };
  }

  const newUpdateMovies = (newUpdateResponse.items as any[]).slice(0, 7);

  return (
    <div className="min-h-screen bg-black">
      {featuredMovies && featuredMovies.length > 0 && (
        <HomeHero movies={featuredMovies} />
      )}

      {/* Today Top - Xem gì hôm nay */}
      <section className="container mx-auto px-4 py-10" aria-label="Xem-Gì-Hôm-Nay-heading">
        <div className="mb-4 flex items-center justify-between">
          <h2 id="Xem-Gì-Hôm-Nay-heading" className="text-lg font-bold text-white lg:text-2xl">
            Xem Gì Hôm Nay
          </h2>
        </div>
        <div className="relative">
          <div className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pt-2">
            {(newUpdateResponse.items as any[]).slice(0, 6).map((movie: any, idx: number) => (
              <div
                key={movie.id || movie.slug || `today-${idx}`}
                className="movie-card-item w-[calc(100%/2-theme(gap.4)/2)] sm:w-[calc(100%/3-theme(gap.4)*2/3)] md:w-[calc(100%/4-theme(gap.4)*3/4)] xl:w-[calc(100%/6-theme(gap.4)*5/6)] group relative flex-shrink-0 snap-start"
              >
                <div className="flex w-full">
                  {/* Left column: TOP and rank */}
                  <div className="flex w-[28%] flex-shrink-0 flex-col justify-between items-center pr-1">
                    <div className="mt-1 flex items-center gap-1 text-[10px] tracking-widest text-white/70">
                      <svg className="w-3 h-2 opacity-60" viewBox="0 0 24 12" fill="currentColor">
                        <path d="M12 6c-4 0-7-1-12-6 4 2 8 3 12 3s8-1 12-3c-5 5-8 6-12 6z" />
                      </svg>
                      <span>TOP</span>
                      <svg
                        className="w-3 h-2 opacity-60 -scale-x-100"
                        viewBox="0 0 24 12"
                        fill="currentColor"
                      >
                        <path d="M12 6c-4 0-7-1-12-6 4 2 8 3 12 3s8-1 12-3c-5 5-8 6-12 6z" />
                      </svg>
                    </div>
                    <div
                      className={`w-full text-8xl md:text-[9.5rem] leading-none text-center select-none bg-gradient-to-b from-white/90 to-white/20 text-transparent bg-clip-text brightness-200 ${anton.className}`}
                      style={{ WebkitTextStroke: '2px rgba(255,255,255,0.25)' }}
                    >
                      {idx + 1}
                    </div>
                  </div>
                  {/* Poster */}
                  <Link
                    href={`/phim/${movie.slug}`}
                    title={movie.name}
                    className="relative block h-full w-[72%]"
                    aria-label={`Xem phim ${movie.name}`}
                  >
                    <div className="rounded-[4px] relative aspect-[2/3] w-full overflow-hidden">
                      <img
                        src={movie.thumb_url || movie.thumbUrl || movie.poster_url || movie.posterUrl}
                        alt={`Poster phim ${movie.name}`}
                        className="rounded-[4px] h-full w-full object-cover"
                        loading="lazy"
                      />
                      <div
                        className="absolute bottom-0 left-0 h-[40%] w-full rounded-b-[4px]"
                        style={{
                          background: 'linear-gradient(to top,rgba(0,0,0,0.7) 10%, transparent 100%)',
                        }}
                        aria-hidden="true"
                      ></div>
                      <div className="rounded-[4px] absolute inset-0 bg-black/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                      <div className="absolute bottom-2 left-2 z-20 flex flex-col gap-1 text-xs font-bold leading-tight lg:text-sm">
                        <span>{movie.quality || 'T.M + P.Đ'}</span>
                        <span>
                          {movie.current_episode ||
                            `Trọn Bộ (${movie.total_episodes || movie.totalEpisodes || ''})`}
                        </span>
                      </div>
                    </div>
                  </Link>
                </div>
                {/* Title below */}
                <div className="flex items-center justify-center py-2">
                  <div className="flex-[3]"></div>
                  <div className="flex-[7]">
                    <Link
                      href={`/phim/${movie.slug}`}
                      className="line-clamp-2 text-xs font-semibold text-gray-300 hover:text-cyan-400 lg:text-base"
                      title={movie.name}
                    >
                      {movie.name}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-2">
          {[
            'Hành Động',
            'Hài',
            'Chính Kịch',
            'Lịch Sử',
            'Bí Ẩn',
            'Gây Cấn',
            'Tình Cảm',
            'Phim 18+',
            'Phiêu Lưu',
            'Hình Sự',
            'Gia Đình',
            'Kinh Dị',
            'Lãng Mạn',
            'Chiến Tranh',
            'Cổ Trang',
            'Hoạt Hình',
            'Tài Liệu',
            'Giả Tưởng',
            'Nhạc',
            'Khoa Học Viễn Tưởng',
            'Tâm Lý',
            'Miền Tây',
          ].map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 text-sm rounded-md bg-slate-800 text-gray-300 border border-slate-700 hover:border-cyan-500/50 cursor-default"
            >
              {tag}
            </span>
          ))}
        </div>
      </section>

      {/* New Episodes Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-white">Phim có tập mới</h2>
          <Link
            href="/danh-muc/phim-moi"
            className="text-cyan-400 hover:text-cyan-300 font-medium flex items-center space-x-1 transition-colors"
          >
            <span>Xem thêm</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
        <div className="relative">
          <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 pr-4 snap-x snap-mandatory">
            {newUpdateMovies.map((movie: any) => (
              <div key={movie.id || movie.slug} className="flex-shrink-0 w-48 snap-start">
                <MovieCard movie={movie} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Top Movies Carousel */}
      <section className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-white">Top phim nổi bật</h2>
          <Link
            href="/danh-muc/phim-hay"
            className="text-cyan-400 hover:text-cyan-300 font-medium flex items-center space-x-1 transition-colors"
          >
            <span>Xem thêm</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
        <div className="relative">
          <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 pr-4 snap-x snap-mandatory">
            {topRatedMovies.slice(0, 7).map((movie: any, idx: number) => (
              <div
                key={(movie && (movie.id || movie.slug)) || `top-${idx}`}
                className="flex-shrink-0 w-48 snap-start h-full"
              >
                <MovieCard movie={movie} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Sections */}
      <section className="container mx-auto px-4 py-6">
        <div className="space-y-8">
          {/* Action Movies */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">Phim hành động</h3>
              <Link
                href="/danh-muc/hanh-dong"
                className="text-cyan-400 hover:text-cyan-300 font-medium flex items-center space-x-1 transition-colors"
              >
                <span>Xem thêm</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            <div className="relative">
              <div className="flex space-x-4 overflow-x-auto scrollbar-hide pb-4">
                {actionMovies.slice(0, 7).map((movie) => (
                  <div key={movie.id || movie.slug} className="flex-shrink-0 w-48">
                    <MovieCard movie={movie} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Romance Movies */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">Phim tình cảm</h3>
              <Link
                href="/danh-muc/tinh-cam"
                className="text-cyan-400 hover:text-cyan-300 font-medium flex items-center space-x-1 transition-colors"
              >
                <span>Xem thêm</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            <div className="relative">
              <div className="flex space-x-4 overflow-x-auto scrollbar-hide pb-4">
                {romanceMovies.slice(0, 7).map((movie: any, idx: number) => (
                  <div key={movie.id || movie.slug || `rom-${idx}`} className="flex-shrink-0 w-48 h-full">
                    <MovieCard movie={movie} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Comedy Movies - chỉ hiển thị nếu có phim */}
          {comedyMovies.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-white">Phim hài hước</h3>
                <Link
                  href="/danh-muc/hai-huoc"
                  className="text-cyan-400 hover:text-cyan-300 font-medium flex items-center space-x-1 transition-colors"
                >
                  <span>Xem thêm</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
              <div className="relative">
                <div className="flex space-x-4 overflow-x-auto scrollbar-hide pb-4">
                  {comedyMovies.slice(0, 7).map((movie: any, idx: number) => (
                    <div key={movie.id || movie.slug || `com-${idx}`} className="flex-shrink-0 w-48 h-full">
                      <MovieCard movie={movie} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* New Movies Sections */}
        <div className="space-y-12">
          {/* Tình Cổ Trang Movies - chỉ hiển thị nếu có phim */}
          {tinhCoTrangMovies.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-white">Phim tình cổ trang</h3>
                <Link
                  href="/danh-muc/tinh-co-trang"
                  className="text-cyan-400 hover:text-cyan-300 font-medium flex items-center space-x-1 transition-colors"
                >
                  <span>Xem thêm</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
              <div className="relative">
                <div className="flex space-x-4 overflow-x-auto scrollbar-hide pb-4">
                  {tinhCoTrangMovies.slice(0, 7).map((movie: any, idx: number) => (
                    <div key={movie.id || movie.slug || `tinh-co-trang-${idx}`} className="flex-shrink-0 w-48 h-full">
                      <MovieCard movie={movie} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Phim Lẻ Movies - chỉ hiển thị nếu có phim */}
          {phimLeMovies.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-white">Phim lẻ</h3>
                <Link
                  href="/danh-muc/phim-le"
                  className="text-cyan-400 hover:text-cyan-300 font-medium flex items-center space-x-1 transition-colors"
                >
                  <span>Xem thêm</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
              <div className="relative">
                <div className="flex space-x-4 overflow-x-auto scrollbar-hide pb-4">
                  {phimLeMovies.slice(0, 7).map((movie: any, idx: number) => (
                    <div key={movie.id || movie.slug || `phim-le-${idx}`} className="flex-shrink-0 w-48 h-full">
                      <MovieCard movie={movie} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Phim Bộ Movies - chỉ hiển thị nếu có phim */}
          {phimBoMovies.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-white">Phim bộ</h3>
                <Link
                  href="/danh-muc/phim-bo"
                  className="text-cyan-400 hover:text-cyan-300 font-medium flex items-center space-x-1 transition-colors"
                >
                  <span>Xem thêm</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
              <div className="relative">
                <div className="flex space-x-4 overflow-x-auto scrollbar-hide pb-4">
                  {phimBoMovies.slice(0, 7).map((movie: any, idx: number) => (
                    <div key={movie.id || movie.slug || `phim-bo-${idx}`} className="flex-shrink-0 w-48 h-full">
                      <MovieCard movie={movie} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Hoạt Hình Movies - chỉ hiển thị nếu có phim */}
          {hoatHinhMovies.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-white">Phim hoạt hình</h3>
                <Link
                  href="/danh-muc/hoat-hinh"
                  className="text-cyan-400 hover:text-cyan-300 font-medium flex items-center space-x-1 transition-colors"
                >
                  <span>Xem thêm</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
              <div className="relative">
                <div className="flex space-x-4 overflow-x-auto scrollbar-hide pb-4">
                  {hoatHinhMovies.slice(0, 7).map((movie: any, idx: number) => (
                    <div key={movie.id || movie.slug || `hoat-hinh-${idx}`} className="flex-shrink-0 w-48 h-full">
                      <MovieCard movie={movie} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
