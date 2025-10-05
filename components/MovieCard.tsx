'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getOptimizedImageUrl, getMovieDetail } from '../lib/movieApi';
import type { MovieCardProps } from '../types';

// simple in-memory cache per session
const synopsisCache = new Map<string, string>();

const MovieCard = ({ movie, showEpisode = true }: MovieCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [synopsis, setSynopsis] = useState<string>('');
  const [synopsisLoading, setSynopsisLoading] = useState<boolean>(false);

  // Sử dụng poster_url làm ảnh chính, thumb_url làm ảnh hover
  const posterUrl = movie.poster_url || movie.posterUrl || '';
  const thumbUrl = movie.thumb_url || movie.thumbUrl || '';
  const originalName = movie.origin_name || movie.originalName;
  const totalEpisodes = movie.total_episodes || movie.totalEpisodes || 1;
  const currentEpisode = movie.current_episode || movie.currentEpisode || '1';
  const year = movie.year || (movie.created?.time ? new Date(movie.created.time).getFullYear() : '2024');

  const router = useRouter();

  // Prefill synopsis if available on movie object
  useEffect(() => {
    const initial = (movie as any).description || (movie as any).content || (movie as any).notify || '';
    if (initial) {
      setSynopsis(initial);
      synopsisCache.set(movie.slug, initial);
    }
  }, [movie]);

  // Lazy fetch detail when hovering if synopsis missing
  useEffect(() => {
    if (!isHovered) return;
    if (synopsis) return;
    const cached = synopsisCache.get(movie.slug);
    if (cached !== undefined) {
      setSynopsis(cached);
      return;
    }
    let cancelled = false;
    setSynopsisLoading(true);
    getMovieDetail(movie.slug)
      .then((detail) => {
        if (cancelled) return;
        const text = (detail as any)?.description || (detail as any)?.content || (detail as any)?.notify || '';
        synopsisCache.set(movie.slug, text);
        setSynopsis(text);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setSynopsisLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [isHovered, movie.slug, synopsis]);

  return (
    <div 
      className="movie-card bg-slate-800/80 backdrop-blur-sm overflow-hidden group relative shadow-lg hover:shadow-xl hover:shadow-cyan-500/10 transition-all duration-300 h-full w-full" 
      suppressHydrationWarning
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        role="link"
        tabIndex={0}
        onClick={() => router.push(`/phim/${movie.slug}`)}
        onKeyDown={(e) => { if (e.key === 'Enter') router.push(`/phim/${movie.slug}`); }}
        className="flex flex-col h-full cursor-pointer"
        suppressHydrationWarning
      >
        <div className="relative aspect-[2/3] overflow-hidden bg-slate-700 rounded-lg">
          {!imageLoaded && (
            <div className="absolute inset-0 bg-slate-700 animate-pulse flex items-center justify-center">
              <svg className="w-8 h-8 text-slate-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18 3v2h-2V3H8v2H6V3H4v18h2v-2h2v2h8v-2h2v2h2V3h-2zM8 17H6v-2h2v2zm0-4H6v-2h2v2zm0-4H6V7h2v2zm10 8h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V7h2v2z"/>
              </svg>
            </div>
          )}
          {posterUrl ? (
            <>
              {/* Ảnh chính - poster_url */}
              <img
                src={posterUrl}
                alt={movie.name}
                className="w-full h-full object-cover transition-transform duration-300 transform group-hover:scale-105"
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageLoaded(true)}
                loading="lazy"
                decoding="async"
                style={{ objectPosition: 'center' }}
              />
              {/* Ảnh hover - thumb_url - chỉ load khi hover */}
              {isHovered && thumbUrl && (
                <img
                  src={thumbUrl}
                  alt={movie.name}
                  className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transform transition-transform duration-300 group-hover:scale-110"
                  loading="lazy"
                  style={{ objectPosition: 'center' }}
                />
              )}
            </>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-slate-500">
              <span className="text-xs">No image</span>
            </div>
          )}
          
          {/* Quality badge */}
          {movie.quality && (
            <div className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs px-2.5 py-1 rounded-full font-semibold shadow-lg">
              {movie.quality}
            </div>
          )}
          
          {/* Episode count */}
          {showEpisode && totalEpisodes > 1 && (
            <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full font-medium">
              {currentEpisode}
            </div>
          )}
        </div>

        {/* Card info - Simple state (fixed height to avoid affecting image) */}
        <div className="bg-transparent px-2 h-10 flex items-center group-hover:opacity-0 transition-opacity duration-300">
          {/* Movie title */}
          <h3 className="text-white font-medium text-sm md:text-base text-left truncate w-full">
            {movie.name}
          </h3>
        </div>

        {/* Hover overlay - Detailed info */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col bg-slate-800 rounded-lg">
          {/* Image section with thumb_url - smaller */}
          <div className="relative h-32 overflow-hidden bg-slate-700 rounded-t-lg">
            {thumbUrl && (
              <img
                src={thumbUrl}
                alt={movie.name}
                className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-110"
                loading="lazy"
                style={{ objectPosition: 'center' }}
              />
            )}
            
            {/* Quality badge */}
            {movie.quality && (
              <div className="absolute top-2 left-2 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs px-2 py-1 rounded-full font-semibold shadow-lg">
                {movie.quality}
              </div>
            )}
            
            {/* Episode count */}
            {showEpisode && totalEpisodes > 1 && (
              <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full font-medium">
                {currentEpisode}
              </div>
            )}
          </div>
          
          {/* Movie info section */}
          <div className="flex-1 p-4 text-white">
            {/* Title */}
            <h3 className="text-white font-semibold text-lg mb-2 line-clamp-2">
              {movie.name}
            </h3>
            
            {/* Metadata row */}
            <div className="flex items-center gap-2 mb-3 text-sm text-gray-300">
              {movie.tmdb?.vote_average ? (
                <>
                  <span className="text-yellow-400 font-medium">TMDB {movie.tmdb.vote_average}</span>
                  <span>•</span>
                </>
              ) : (
                <span className="text-gray-400">TMDB N/A</span>
              )}
              <span>•</span>
              <span>{movie.quality}</span>
              <span>•</span>
              <span>{year}</span>
            </div>
            
            {/* Genre tags */}
            <div className="flex flex-wrap gap-1 mb-3">
              {movie.category && movie.category.slice(0, 2).map((genre: any, index: number) => (
                <span key={index} className="bg-slate-700 text-white px-2 py-1 rounded text-xs">
                  {typeof genre === 'string' ? genre : genre.name}
                </span>
              ))}
            </div>
            
            {/* Synopsis (lazy) */}
            {synopsisLoading && (
              <div className="space-y-2 mb-4">
                <div className="h-3 bg-slate-700 rounded w-5/6 animate-pulse"></div>
                <div className="h-3 bg-slate-700 rounded w-4/6 animate-pulse"></div>
                <div className="h-3 bg-slate-700 rounded w-3/6 animate-pulse"></div>
              </div>
            )}
            {!synopsisLoading && synopsis && (
              <p className="text-gray-300 text-xs md:text-sm mb-3 line-clamp-2 leading-snug">
                {synopsis}
              </p>
            )}
            
            {/* Action buttons */}
            <div className="flex gap-2">
              <button 
                onClick={() => router.push(`/phim/${movie.slug}`)}
                className="bg-green-500 hover:bg-green-600 text-white w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-200"
                aria-label={`Xem ngay ${movie.name}`}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </button>
              <button className="bg-gray-600 hover:bg-gray-700 text-white w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-200">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default MovieCard;
