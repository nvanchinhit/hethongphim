import React from 'react';
import type { Movie } from '../types';
import HomeHero from '../components/HomeHero';
import MovieCard from '../components/MovieCard';
import Link from 'next/link';
import { 
  getNewUpdateMovies,
  getMoviesByGenre,
  getOptimizedImageUrl
} from '../lib/movieApi';
// Removed Google Fonts to avoid network errors; rely on system fonts

export default async function HomePage() {
  let newUpdateResponse: any;
  let featuredMovies: Movie[] = [];
  let topRatedMovies: Movie[] = [];
  let actionMovies: Movie[] = [];
  let romanceMovies: Movie[] = [];
  let comedyMovies: Movie[] = [];
  let tinhCoTrangMovies: Movie[] = [];
  let thanThoaiMovies: Movie[] = [];
  let phimLeMovies: Movie[] = [];
  let phimBoMovies: Movie[] = [];
  let hoatHinhMovies: Movie[] = [];

  try {
    // Lấy phim mới cập nhật cho featured và top rated
    newUpdateResponse = await getNewUpdateMovies(1);
    const allMovies = newUpdateResponse.items || [];
    
    // Lấy featured movies (4 phim đầu tiên)
    featuredMovies = allMovies.slice(0, 4);
    
    // Lấy 7 phim mới nhất làm Top
    topRatedMovies = allMovies.slice(0, 7);
    if (!topRatedMovies || topRatedMovies.length === 0) {
      try {
        const topFallback = await getNewUpdateMovies(1);
        topRatedMovies = (topFallback.items || []).slice(0, 7);
      } catch {}
    }
    
    // Gọi API riêng cho Phim hành động và Phim tình cảm
    try {
      const actionResponse = await getMoviesByGenre('hanh-dong', 1);
      actionMovies = actionResponse.items.slice(0, 7);
      // console.log('Action movies loaded:', actionMovies.length);
    } catch (error) {
      console.warn('Failed to load action movies:', error);
      // Fallback: lọc từ allMovies
      actionMovies = allMovies.filter((movie: any) => 
        movie.category?.some((cat: any) => 
          cat.slug === 'hanh-dong' || cat.name?.toLowerCase().includes('hành động')
        )
      ).slice(0, 7);
    }
    
    try {
      const romanceResponse = await getMoviesByGenre('tinh-cam', 1);
      romanceMovies = romanceResponse.items.slice(0, 7);
      // console.log('Romance movies loaded:', romanceMovies.length);
    } catch (error) {
      console.warn('Failed to load romance movies:', error);
      // Fallback: lọc từ allMovies
      romanceMovies = allMovies.filter((movie: any) => 
        movie.category?.some((cat: any) => 
          cat.slug === 'tinh-cam' || cat.name?.toLowerCase().includes('tình cảm')
        )
      ).slice(0, 7);
    }
    
    // Lọc phim khác từ dữ liệu đã có
    comedyMovies = allMovies.filter((movie: any) => 
      movie.category?.some((cat: any) => 
        cat.slug === 'hai-huoc' || cat.name?.toLowerCase().includes('hài hước')
      )
    ).slice(0, 7);
    
    // Cổ trang: ưu tiên API; fallback lọc
    try {
      const coTrangRes = await getMoviesByGenre('co-trang', 1);
      tinhCoTrangMovies = coTrangRes.items.slice(0, 7);
    } catch {
      tinhCoTrangMovies = allMovies.filter((movie: any) => 
        movie.category?.some((cat: any) => 
          cat.slug === 'co-trang' || cat.name?.toLowerCase().includes('cổ trang')
        )
      ).slice(0, 7);
    }

    // Thần thoại: ưu tiên API; fallback lọc
    try {
      const thanThoaiRes = await getMoviesByGenre('than-thoai', 1);
      thanThoaiMovies = thanThoaiRes.items.slice(0, 7);
    } catch {
      thanThoaiMovies = allMovies.filter((movie: any) => 
        movie.category?.some((cat: any) => 
          cat.slug === 'than-thoai' || cat.name?.toLowerCase().includes('thần thoại')
        )
      ).slice(0, 7);
    }

    // Thần thoại
    thanThoaiMovies = allMovies.filter((movie: any) => 
      movie.category?.some((cat: any) => 
        cat.slug === 'than-thoai' || cat.name?.toLowerCase().includes('thần thoại')
      )
    ).slice(0, 7);
    
    // Bỏ phim hoạt hình
    hoatHinhMovies = [];
    
    // Lọc phim theo loại từ danh sách chung
    phimLeMovies = allMovies.filter((movie: any) => 
      movie.type === 'single' || movie.total_episodes === 1
    ).slice(0, 7);
    
    phimBoMovies = allMovies.filter((movie: any) => 
      movie.type === 'series' || (movie.total_episodes && movie.total_episodes > 1)
    ).slice(0, 7);
    
    console.log('Final results:', {
      action: actionMovies.length,
      romance: romanceMovies.length,
      comedy: comedyMovies.length,
      tinhCoTrang: tinhCoTrangMovies.length,
      phimLe: phimLeMovies.length,
      phimBo: phimBoMovies.length
    });
    
    // Fallback: nếu không đủ phim theo thể loại, lấy từ danh sách chung
    if (actionMovies.length < 7) {
      const additionalMovies = allMovies.filter((movie: any) => 
        !actionMovies.some(existing => existing.id === movie.id) &&
        (movie.category?.some((cat: any) => 
          cat.slug === 'phieu-luu' || cat.name?.toLowerCase().includes('phiêu lưu') ||
          cat.slug === 'chien-tranh' || cat.name?.toLowerCase().includes('chiến tranh') ||
          cat.slug === 'vo-thuat' || cat.name?.toLowerCase().includes('võ thuật')
        ))
      ).slice(0, 7 - actionMovies.length);
      actionMovies = [...actionMovies, ...additionalMovies];
    }
    
    if (romanceMovies.length < 7) {
      const additionalMovies = allMovies.filter((movie: any) => 
        !romanceMovies.some(existing => existing.id === movie.id) &&
        (movie.category?.some((cat: any) => 
          cat.slug === 'lang-man' || cat.name?.toLowerCase().includes('lãng mạn') ||
          cat.slug === 'tam-ly' || cat.name?.toLowerCase().includes('tâm lý')
        ))
      ).slice(0, 7 - romanceMovies.length);
      romanceMovies = [...romanceMovies, ...additionalMovies];
    }
    
    if (comedyMovies.length < 7) {
      const additionalMovies = allMovies.filter((movie: any) => 
        !comedyMovies.some(existing => existing.id === movie.id) &&
        (movie.category?.some((cat: any) => 
          cat.slug === 'gia-dinh' || cat.name?.toLowerCase().includes('gia đình') ||
          cat.slug === 'hoc-duong' || cat.name?.toLowerCase().includes('học đường')
        ))
      ).slice(0, 7 - comedyMovies.length);
      comedyMovies = [...comedyMovies, ...additionalMovies];
    }
    
    if (tinhCoTrangMovies.length < 7) {
      const additionalMovies = allMovies.filter((movie: any) => 
        !tinhCoTrangMovies.some(existing => existing.id === movie.id) &&
        (movie.category?.some((cat: any) => 
          cat.slug === 'lich-su' || cat.name?.toLowerCase().includes('lịch sử') ||
          cat.slug === 'than-thoai' || cat.name?.toLowerCase().includes('thần thoại')
        ))
      ).slice(0, 7 - tinhCoTrangMovies.length);
      tinhCoTrangMovies = [...tinhCoTrangMovies, ...additionalMovies];
    }

    if (thanThoaiMovies.length < 7) {
      const additionalMovies = allMovies.filter((movie: any) => 
        !thanThoaiMovies.some(existing => existing.id === movie.id) &&
        (movie.category?.some((cat: any) => 
          cat.slug === 'gia-tuong' || cat.name?.toLowerCase().includes('giả tưởng') ||
          cat.slug === 'co-trang' || cat.name?.toLowerCase().includes('cổ trang')
        ))
      ).slice(0, 7 - thanThoaiMovies.length);
      thanThoaiMovies = [...thanThoaiMovies, ...additionalMovies];
    }

    if (thanThoaiMovies.length < 7) {
      const additionalMovies = allMovies.filter((movie: any) => 
        !thanThoaiMovies.some(existing => existing.id === movie.id) &&
        (movie.category?.some((cat: any) => 
          cat.slug === 'gia-tuong' || cat.name?.toLowerCase().includes('giả tưởng') ||
          cat.slug === 'co-trang' || cat.name?.toLowerCase().includes('cổ trang')
        ))
      ).slice(0, 7 - thanThoaiMovies.length);
      thanThoaiMovies = [...thanThoaiMovies, ...additionalMovies];
    }
    
    if (phimLeMovies.length < 7) {
      const additionalMovies = allMovies.filter((movie: any) => 
        !phimLeMovies.some(existing => existing.id === movie.id) &&
        (movie.type === 'single' || movie.total_episodes === 1)
      ).slice(0, 7 - phimLeMovies.length);
      phimLeMovies = [...phimLeMovies, ...additionalMovies];
    }
    
    if (phimBoMovies.length < 7) {
      const additionalMovies = allMovies.filter((movie: any) => 
        !phimBoMovies.some(existing => existing.id === movie.id) &&
        (movie.type === 'series' || (movie.total_episodes && movie.total_episodes > 1))
      ).slice(0, 7 - phimBoMovies.length);
      phimBoMovies = [...phimBoMovies, ...additionalMovies];
    }

  } catch (error) {
    console.error('Error loading homepage data:', error);
    newUpdateResponse = { items: [], pagination: { currentPage: 1, totalPages: 1, totalItems: 0, totalItemsPerPage: 24 } };
    
    // Fallback data để đảm bảo trang chủ luôn có nội dung
    if (featuredMovies.length === 0) {
      featuredMovies = [
        {
          id: 'fallback-1',
          name: 'Phim mẫu 1',
          slug: 'phim-mau-1',
          thumb_url: 'https://via.placeholder.com/300x450/1e293b/ffffff?text=Phim+Mẫu+1',
          year: 2024,
          quality: 'HD',
          total_episodes: 1,
          current_episode: 'Trọn bộ',
          description: 'Đây là phim mẫu để hiển thị khi không có dữ liệu thực.',
          category: [{ name: 'Hành động', slug: 'hanh-dong' }],
          country: [{ name: 'Việt Nam', slug: 'viet-nam' }]
        } as any
      ];
    }
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
                      className="w-full text-8xl md:text-[10rem] leading-none text-center select-none text-transparent bg-clip-text bg-gradient-to-b from-white via-white/80 to-white/20 font-extrabold tracking-tight drop-shadow-[0_3px_8px_rgba(0,0,0,0.6)]"
                      style={{ WebkitTextStroke: '2.5px rgba(255,255,255,0.28)', textShadow: '0 2px 6px rgba(0,0,0,0.65)' }}
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
                    suppressHydrationWarning
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
                      suppressHydrationWarning
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
            { name: 'Hành Động', slug: 'hanh-dong' },
            { name: 'Hài', slug: 'hai-huoc' },
            { name: 'Chính Kịch', slug: 'chinh-kich' },
            { name: 'Tình Cảm', slug: 'tinh-cam' },
            { name: 'Cổ Trang', slug: 'co-trang' },
            { name: 'Thần Thoại', slug: 'than-thoai' },
          ].map((tag) => (
            <Link
              key={tag.slug}
              href={`/danh-muc/${tag.slug}`}
              className="px-3 py-1 text-sm rounded-md bg-slate-800 text-gray-300 border border-slate-700 hover:border-cyan-500/50 hover:text-white transition-colors"
              suppressHydrationWarning
            >
              {tag.name}
            </Link>
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
            suppressHydrationWarning
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
            suppressHydrationWarning
          >
            <span>Xem thêm</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
        <div className="relative">
          {topRatedMovies && topRatedMovies.length > 0 ? (
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
          ) : (
            <div className="text-gray-400 text-sm py-8">Chưa có dữ liệu top phim.</div>
          )}
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
                suppressHydrationWarning
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
                suppressHydrationWarning
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
                  suppressHydrationWarning
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
                  suppressHydrationWarning
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

          {/* Thần Thoại Movies - chỉ hiển thị nếu có phim */}
          {thanThoaiMovies.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-white">Phim thần thoại</h3>
                <Link
                  href="/danh-muc/than-thoai"
                  className="text-cyan-400 hover:text-cyan-300 font-medium flex items-center space-x-1 transition-colors"
                  suppressHydrationWarning
                >
                  <span>Xem thêm</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
              <div className="relative">
                <div className="flex space-x-4 overflow-x-auto scrollbar-hide pb-4">
                  {thanThoaiMovies.slice(0, 7).map((movie: any, idx: number) => (
                    <div key={movie.id || movie.slug || `than-thoai-${idx}`} className="flex-shrink-0 w-48 h-full">
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
                  suppressHydrationWarning
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
                  suppressHydrationWarning
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

          {/* Thần Thoại Movies - chỉ hiển thị nếu có phim */}
          {thanThoaiMovies.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-white">Phim thần thoại</h3>
                <Link
                  href="/danh-muc/than-thoai"
                  className="text-cyan-400 hover:text-cyan-300 font-medium flex items-center space-x-1 transition-colors"
                  suppressHydrationWarning
                >
                  <span>Xem thêm</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
              <div className="relative">
                <div className="flex space-x-4 overflow-x-auto scrollbar-hide pb-4">
                  {thanThoaiMovies.slice(0, 7).map((movie: any, idx: number) => (
                    <div key={movie.id || movie.slug || `than-thoai-${idx}`} className="flex-shrink-0 w-48 h-full">
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
