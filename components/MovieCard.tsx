'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { MovieCardProps } from '../types';

const MovieCard = ({ movie, showEpisode = true }: MovieCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  // Use poster_url for hover, thumb_url for normal display
  const thumbUrl = movie.thumb_url || movie.thumbUrl || '';
  const posterUrl = movie.poster_url || movie.posterUrl || movie.thumb_url || movie.thumbUrl || '';
  const originalName = movie.original_name || movie.originalName;
  const totalEpisodes = movie.total_episodes || movie.totalEpisodes || 1;
  const currentEpisode = movie.current_episode || movie.currentEpisode || '1';
  const year = movie.year || (movie.created ? new Date(movie.created).getFullYear() : new Date().getFullYear());

  return (
    <div className="movie-card bg-slate-800/80 backdrop-blur-sm overflow-hidden group relative shadow-lg hover:shadow-xl hover:shadow-cyan-500/10 transition-all duration-300 h-full w-full" suppressHydrationWarning>
      <Link href={`/phim/${movie.slug}`} className="flex flex-col h-full" suppressHydrationWarning>
        <div className="relative aspect-[2/3] overflow-hidden bg-slate-700 rounded-lg">
          {!imageLoaded && (
            <div className="absolute inset-0 bg-slate-700 animate-pulse flex items-center justify-center">
              <svg className="w-8 h-8 text-slate-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18 3v2h-2V3H8v2H6V3H4v18h2v-2h2v2h8v-2h2v2h2V3h-2zM8 17H6v-2h2v2zm0-4H6v-2h2v2zm0-4H6V7h2v2zm10 8h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V7h2v2z"/>
              </svg>
            </div>
          )}
          {thumbUrl ? (
            <Image
              src={thumbUrl}
              alt={movie.name}
              fill
              className={`transition-all duration-500 group-hover:scale-110 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setImageLoaded(true)}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
            />
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

        {/* Card info - Simple state */}
        <div className="bg-black p-4 flex flex-col justify-center items-start min-h-[60px] group-hover:opacity-0 transition-opacity duration-300">
          {/* Movie title only - left aligned and medium weight */}
          <h3 className="text-white font-medium text-lg text-left line-clamp-2 leading-tight">
            {movie.name}
          </h3>
        </div>

        {/* Hover overlay - Detailed info like in image */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col">
          {/* Image section with overlay - Full poster image */}
          <div className="relative aspect-[2/3] overflow-hidden bg-slate-700 rounded-lg">
            {posterUrl && (
              <Image
                src={posterUrl}
                alt={movie.name}
                fill
                className="transition-all duration-500 group-hover:scale-110"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
              />
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

          {/* Detailed info section - Slide up from bottom */}
          <div className="bg-black/95 backdrop-blur-sm p-4 flex flex-col grow transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            {/* Movie title */}
            <h3 className="text-white font-semibold text-lg mb-2 line-clamp-2">
              {movie.name}
            </h3>
            
            {/* Metadata row */}
            <div className="flex items-center gap-2 mb-2 text-xs">
              <span className="text-yellow-400 font-medium">TMDB {(movie as any).rating || 'N/A'}</span>
              <span className="text-white">|</span>
              {movie.quality && <span className="text-white">{movie.quality}</span>}
              <span className="text-white">|</span>
              <span className="text-white">{year}</span>
            </div>
            
            {/* Genre tags */}
            <div className="flex flex-wrap gap-1.5 mb-2">
              {(movie as any).genres && (movie as any).genres.slice(0, 2).map((genre: any, index: number) => (
                <span key={index} className="bg-gray-700 text-white px-2 py-0.5 rounded text-xs">
                  {typeof genre === 'string' ? genre : genre.name}
                </span>
              ))}
            </div>
            
            {/* Description */}
            {(movie as any)?.description && (
              <p className="text-gray-300 text-xs line-clamp-3 mb-3 leading-relaxed">
                {(movie as any).description}
              </p>
            )}
            
            {/* Action buttons - Smaller icons */}
            <div className="flex gap-2 mt-auto">
              <button className="bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded-full text-xs font-medium transition-colors duration-200 flex items-center gap-1 flex-1 justify-center">
                <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
                Xem phim
              </button>
              <button className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1.5 rounded-full text-xs font-medium transition-colors duration-200">
                <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default MovieCard;
