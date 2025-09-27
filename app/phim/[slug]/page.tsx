'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import EpisodeList from '../../../components/EpisodeList';
import MovieGrid from '../../../components/MovieGrid';
import { getMovieDetail, getNewUpdateMovies } from '../../../lib/movieApi';
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

  useEffect(() => {
    const loadMovieData = async () => {
      setLoading(true);
      
      try {
        // Get movie detail
        const movieData = await getMovieDetail(slug);
        
        if (movieData) {
          setMovie(movieData);
          
          // Extract episodes from movie data
          if (movieData.episodes && Array.isArray(movieData.episodes)) {
            setServers(movieData.episodes);
            
            // Get all episodes from first server
            const firstServer = movieData.episodes[0];
            if (firstServer && firstServer.items) {
              setEpisodes(firstServer.items);
            }
          }
        }
        
        // Get related movies
        const relatedResponse = await getNewUpdateMovies(1);
        setRelatedMovies(relatedResponse.items.slice(0, 12));
        
      } catch (error) {
        console.error('Error loading movie data:', error);
      } finally {
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
          <div className="animate-pulse">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
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
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Không tìm thấy phim</h1>
          <p className="text-gray-400 mb-6">Phim bạn tìm kiếm không tồn tại hoặc đã bị xóa</p>
          <Link href="/" className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-3 rounded-lg transition-colors">
            Về trang chủ
          </Link>
        </div>
      </div>
    );
  }

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
          <span className="text-white truncate">{movie.name}</span>
        </nav>

        {/* Movie Info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Poster */}
          <div className="lg:col-span-1">
            <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-slate-800">
              {(() => {
                const src = movie.thumb_url || movie.thumbUrl || movie.poster_url || movie.posterUrl || '';
                return src ? (
                  <Image
                    src={src}
                    alt={movie.name}
                    fill
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-slate-500">No image</div>
                );
              })()}
              <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded font-semibold">
                {movie.quality}
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="lg:col-span-2">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              {movie.name}
            </h1>
            <h2 className="text-xl text-gray-400 mb-4">
              {movie.original_name || movie.originalName}
            </h2>

            {/* Watch Button */}
            <div className="flex flex-wrap gap-4 mb-6">
              <Link
                href={`/xem/${movie.slug}/${getFirstEpisodeSlug()}`}
                className="bg-cyan-500 hover:bg-cyan-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"/>
                </svg>
                <span>Xem phim</span>
              </Link>
              
              <button className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span>Yêu thích</span>
              </button>
            </div>

            {/* Movie Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-slate-800 p-4 rounded-lg text-center">
                <div className="text-cyan-400 text-2xl font-bold">{movie.year || (movie.created ? new Date(movie.created).getFullYear() : '')}</div>
                <div className="text-gray-400 text-sm">Năm</div>
              </div>
              <div className="bg-slate-800 p-4 rounded-lg text-center">
                <div className="text-cyan-400 text-2xl font-bold">{movie.total_episodes || movie.totalEpisodes}</div>
                <div className="text-gray-400 text-sm">Tập</div>
              </div>
              <div className="bg-slate-800 p-4 rounded-lg text-center">
                <div className="text-cyan-400 text-2xl font-bold">{movie.view ? (movie.view > 1000 ? `${(movie.view / 1000).toFixed(1)}K` : movie.view) : 'N/A'}</div>
                <div className="text-gray-400 text-sm">Lượt xem</div>
              </div>
              <div className="bg-slate-800 p-4 rounded-lg text-center">
                <div className="text-cyan-400 text-2xl font-bold">{movie.quality}</div>
                <div className="text-gray-400 text-sm">Chất lượng</div>
              </div>
            </div>

            {/* Movie Info Table */}
            <div className="bg-slate-800 rounded-lg p-6 space-y-3">
              <div className="grid grid-cols-3 gap-4">
                <span className="text-gray-400">Thời lượng:</span>
                <span className="col-span-2 text-white">{movie.time}</span>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <span className="text-gray-400">Ngôn ngữ:</span>
                <span className="col-span-2 text-white">{movie.language}</span>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <span className="text-gray-400">Đạo diễn:</span>
                <span className="col-span-2 text-white">{movie.director || 'Đang cập nhật'}</span>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <span className="text-gray-400">Diễn viên:</span>
                <span className="col-span-2 text-white">{movie.casts || 'Đang cập nhật'}</span>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <span className="text-gray-400">Trạng thái:</span>
                <span className="col-span-2 text-white">{movie.current_episode || movie.currentEpisode}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-slate-800 rounded-lg p-6 mb-8">
          <h3 className="text-xl font-semibold text-white mb-4">Nội dung phim</h3>
          <div className="text-gray-300 leading-relaxed">
            <div 
              className={showFullDescription ? '' : 'line-clamp-3'}
              dangerouslySetInnerHTML={{ __html: movie.description }}
            />
            {movie.description.length > 200 && (
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
        {episodes.length > 0 && (
          <div className="bg-slate-800 rounded-lg p-6 mb-8">
            <EpisodeList 
              episodes={episodes} 
              servers={servers}
              movieSlug={movie.slug} 
            />
          </div>
        )}

        {/* Related Movies */}
        {relatedMovies.length > 0 && (
          <div>
            <h3 className="text-2xl font-semibold text-white mb-6">Phim liên quan</h3>
            <MovieGrid movies={relatedMovies} />
          </div>
        )}
      </div>
    </div>
  );
}
