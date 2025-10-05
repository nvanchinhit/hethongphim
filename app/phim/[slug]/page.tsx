'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import EpisodeList from '../../../components/EpisodeList';
import MovieGrid from '../../../components/MovieGrid';
import { getMovieDetail, getNewUpdateMovies, getOptimizedImageUrl } from '../../../lib/movieApi';
import type { Movie, Episode, EpisodeServer } from '../../../types';

export default function MovieDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  
  const [movie, setMovie] = useState<Movie | null>(null);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [servers, setServers] = useState<EpisodeServer[]>([]);
  const [relatedMovies, setRelatedMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [loadingRelated, setLoadingRelated] = useState(false);

  useEffect(() => {
    const loadMovieData = async () => {
      setLoading(true);
      
      try {
        console.log('Loading movie detail for slug:', slug);
        
        // Load movie detail first (priority)
        const movieData = await getMovieDetail(slug);
        
        // Handle movie data
        if (movieData) {
          console.log('Movie data received:', movieData);
          setMovie(movieData);
          
          // Extract episodes from movie data
          if (movieData.episodes && Array.isArray(movieData.episodes)) {
            console.log('Setting servers:', movieData.episodes);
            setServers(movieData.episodes);
            
            // Get all episodes from first server
            const firstServer = movieData.episodes[0];
            if (firstServer && firstServer.server_data) {
              console.log('Setting episodes:', firstServer.server_data);
              setEpisodes(firstServer.server_data);
            }
          } else {
            console.log('No episodes found in movie data');
          }
          
          // Set loading to false after main content is loaded
          setLoading(false);
        } else {
          console.warn('No movie data found for slug:', slug);
          setLoading(false);
        }
        
        // Load related movies in background
        setLoadingRelated(true);
        try {
          const relatedResponse = await getNewUpdateMovies(1);
          setRelatedMovies(relatedResponse.items.slice(0, 12));
        } catch (error) {
          console.warn('Failed to load related movies:', error);
        } finally {
          setLoadingRelated(false);
        }
        
      } catch (error) {
        console.error('Error loading movie data:', error);
        setLoading(false);
      }
    };

    if (slug) {
      loadMovieData();
    }
  }, [slug]);

  const getFirstEpisodeSlug = () => {
    if (episodes.length > 0) {
      return episodes[0].slug;
    }
    return 'full';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <div className="lg:col-span-1">
              <div className="bg-slate-700 aspect-[2/3] rounded-lg"></div>
            </div>
            <div className="lg:col-span-2 space-y-4">
              <div className="h-8 bg-slate-700 rounded w-3/4"></div>
              <div className="h-6 bg-slate-700 rounded w-1/2"></div>
              <div className="space-y-2">
                <div className="h-4 bg-slate-700 rounded"></div>
                <div className="h-4 bg-slate-700 rounded"></div>
                <div className="h-4 bg-slate-700 rounded w-2/3"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="mb-6">
            <svg className="w-24 h-24 mx-auto text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">Không tìm thấy phim</h1>
          <p className="text-gray-400 mb-6 leading-relaxed">
            Phim bạn tìm kiếm không tồn tại hoặc đã bị xóa. Vui lòng kiểm tra lại tên phim hoặc thử tìm kiếm phim khác.
          </p>
          <div className="space-y-4">
            <Link 
              href="/" 
              className="inline-block bg-cyan-500 hover:bg-cyan-600 text-white px-8 py-3 rounded-lg transition-colors font-semibold" 
              suppressHydrationWarning
            >
              Về trang chủ
            </Link>
            <div className="text-sm text-gray-500">
              <p>Slug: <code className="bg-slate-800 px-2 py-1 rounded text-xs">{slug}</code></p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Hero cover */}
      <div
        className="relative h-[420px] md:h-[520px] w-full bg-center bg-cover"
        style={{ backgroundImage: `url(${movie.thumb_url || movie.thumbUrl || movie.poster_url || ''})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-slate-900"></div>
        <div className="container mx-auto px-4 h-full flex items-center pb-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end w-full">
            {/* Poster card */}
            <div className="md:col-span-1">
              <div className="relative aspect-[2/3] w-56 md:w-64 rounded-lg overflow-hidden ring-2 ring-white/10 shadow-2xl">
                <img
                  src={movie.poster_url || movie.thumb_url || ''}
                  alt={movie.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 bg-red-600 text-white px-2.5 py-1 rounded text-xs font-semibold">
                  {movie.quality || 'HD'}
                </div>
              </div>
            </div>
            {/* Title + CTA */}
            <div className="md:col-span-2">
              <h1 className="text-5xl md:text-7xl font-extrabold tracking-normal leading-tight text-white drop-shadow-2xl font-sans">
                {movie.name}
              </h1>
              {/* Meta and buttons removed for cleaner banner */}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Movie Info Table */}
        <div className="bg-slate-800 rounded-lg p-6 space-y-3">
              <div className="grid grid-cols-3 gap-4">
                <span className="text-gray-400">Thời lượng:</span>
                <span className="col-span-2 text-white">{movie.time || 'Đang cập nhật'}</span>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <span className="text-gray-400">Ngôn ngữ:</span>
                <span className="col-span-2 text-white">{movie.language || 'Đang cập nhật'}</span>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <span className="text-gray-400">Đạo diễn:</span>
                <span className="col-span-2 text-white">
                  {Array.isArray(movie.director) ? movie.director.join(', ') : movie.director || 'Đang cập nhật'}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <span className="text-gray-400">Diễn viên:</span>
                <span className="col-span-2 text-white">
                  {Array.isArray(movie.casts) ? movie.casts.join(', ') : movie.casts || 'Đang cập nhật'}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <span className="text-gray-400">Trạng thái:</span>
                <span className="col-span-2 text-white">
                  {movie.current_episode || movie.currentEpisode || 'Đang cập nhật'}
                </span>
              </div>
              {movie.category && movie.category.length > 0 && (
                <div className="grid grid-cols-3 gap-4">
                  <span className="text-gray-400">Thể loại:</span>
                  <span className="col-span-2 text-white">
                    {movie.category.map((cat: any) => typeof cat === 'string' ? cat : cat.name).join(', ')}
                  </span>
                </div>
              )}
              {movie.country && movie.country.length > 0 && (
                <div className="grid grid-cols-3 gap-4">
                  <span className="text-gray-400">Quốc gia:</span>
                  <span className="col-span-2 text-white">
                    {movie.country.map((country: any) => typeof country === 'string' ? country : country.name).join(', ')}
                  </span>
                </div>
              )}
            </div>
        {/* Description */}
        <div className="bg-slate-800 rounded-lg p-6 mb-8">
          <h3 className="text-xl font-semibold text-white mb-4">Nội dung phim</h3>
          <div className="text-gray-300 leading-relaxed">
            <div 
              className={showFullDescription ? '' : 'line-clamp-3'}
              dangerouslySetInnerHTML={{ __html: movie.description || movie.content || '' }}
            />
            {(movie.description || movie.content || '').length > 200 && (
              <button
                onClick={() => setShowFullDescription(!showFullDescription)}
                className="text-cyan-400 hover:text-cyan-300 transition-colors mt-2 text-sm"
              >
                {showFullDescription ? 'Thu gọn' : 'Xem thêm'}
              </button>
            )}
          </div>
        </div>

        {/* Episodes */}
        {episodes.length > 0 ? (
          <div className="bg-slate-800 rounded-lg p-6 mb-8">
            <EpisodeList 
              episodes={episodes} 
              servers={servers}
              movieSlug={movie.slug} 
            />
          </div>
        ) : (
          <div className="bg-slate-800 rounded-lg p-6 mb-8">
            <h3 className="text-xl font-semibold text-white mb-4">Danh sách tập</h3>
            <div className="text-center py-8">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-gray-400 mb-4">Chưa có thông tin tập phim</p>
              <p className="text-sm text-gray-500">Phim này có thể là phim lẻ hoặc thông tin tập chưa được cập nhật</p>
            </div>
          </div>
        )}

        {/* Related Movies */}
        <div>
          <h3 className="text-2xl font-semibold text-white mb-6">Phim liên quan</h3>
          {loadingRelated ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-slate-700 aspect-[2/3] rounded-lg mb-2"></div>
                  <div className="h-4 bg-slate-700 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          ) : relatedMovies.length > 0 ? (
            <MovieGrid movies={relatedMovies} />
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-400">Không có phim liên quan</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
