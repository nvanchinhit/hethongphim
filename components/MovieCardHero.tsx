'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { MovieCardProps } from '../types';

const MovieCardHero = ({ movie, showEpisode = true }: MovieCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  // Prefer thumb for grid/demo, fallback to poster
  const posterUrl = movie.thumb_url || movie.thumbUrl || movie.poster_url || movie.posterUrl || '';
  const originalName = movie.original_name || movie.originalName;
  const totalEpisodes = movie.total_episodes || movie.totalEpisodes || 1;
  const currentEpisode = movie.current_episode || movie.currentEpisode || '1';
  const year = movie.year || (movie.created ? new Date(movie.created).getFullYear() : new Date().getFullYear());

  return (
    <div className="movie-card-hero bg-slate-800/80 backdrop-blur-sm rounded-xl overflow-hidden group relative shadow-lg hover:shadow-xl hover:shadow-cyan-500/10 transition-all duration-300 border border-slate-700/50 hover:border-cyan-500/30 h-full w-full hover:scale-105 hover:z-20">
      <Link href={`/phim/${movie.slug}`} className="flex flex-col h-full" suppressHydrationWarning>
        <div className="relative aspect-[2/3] overflow-hidden bg-slate-700">
          {!imageLoaded && (
            <div className="absolute inset-0 bg-slate-700 animate-pulse flex items-center justify-center">
              <svg className="w-8 h-8 text-slate-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18 3v2h-2V3H8v2H6V3H4v18h2v-2h2v2h8v-2h2v2h2V3h-2zM8 17H6v-2h2v2zm0-4H6v-2h2v2zm0-4H6V7h2v2zm10 8h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V7h2v2z"/>
              </svg>
            </div>
          )}
          {posterUrl ? (
            <Image
              src={posterUrl}
              alt={movie.name}
              fill
              className={`object-cover transition-all duration-500 group-hover:scale-110 ${
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
          
          
          {/* Episode count */}
          {showEpisode && totalEpisodes > 1 && (
            <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full font-medium">
              {currentEpisode}
            </div>
          )}
          
          {/* Hover overlay with rectangular design - Hero version */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
            {/* Rectangular overlay - Larger for hero */}
            <div className="bg-slate-900/95 backdrop-blur-sm rounded-lg p-6 mx-4 w-full max-w-[320px] transform scale-95 group-hover:scale-100 transition-transform duration-300">
              <div className="text-center">
                {/* Movie title */}
                <h3 className="text-white font-bold text-xl mb-3 line-clamp-2">
                  {movie.name}
                </h3>
                
                {/* Original name */}
                {originalName && (
                  <p className="text-cyan-400 text-base mb-4 line-clamp-1">
                    {originalName}
                  </p>
                )}
                
                {/* Metadata tags */}
                <div className="flex flex-wrap gap-2 justify-center mb-4">
                  {movie.quality && (
                    <span className="bg-cyan-500/20 text-cyan-300 px-3 py-1.5 rounded text-sm font-medium">
                      {movie.quality}
                    </span>
                  )}
                  {year && (
                    <span className="bg-gray-600/50 text-gray-300 px-3 py-1.5 rounded text-sm">
                      {year}
                    </span>
                  )}
                  {totalEpisodes > 1 && (
                    <span className="bg-gray-600/50 text-gray-300 px-3 py-1.5 rounded text-sm">
                      {totalEpisodes} tập
                    </span>
                  )}
                </div>
                
                {/* Description */}
                {(movie as any)?.description && (
                  <p className="text-gray-300 text-sm line-clamp-3 mb-6">
                    {(movie as any).description}
                  </p>
                )}
                
                {/* Action buttons */}
                <div className="flex gap-4 justify-center">
                  <button className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-3 rounded-full text-base font-medium transition-colors duration-200 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                    Xem phim
                  </button>
                  <button className="bg-gray-600/50 hover:bg-gray-600 text-white px-6 py-3 rounded-full text-base font-medium transition-colors duration-200">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 flex flex-col grow group-hover:opacity-0 transition-opacity duration-300">
          <h3 className="text-white font-semibold text-sm mb-2 line-clamp-2 group-hover:text-cyan-400 transition-colors duration-300 leading-tight min-h-[2.5rem]">
            {movie.name}
          </h3>
          {originalName && (
            <p className="text-gray-400 text-xs mb-3 line-clamp-1 opacity-80 min-h-[1rem]">
              {originalName}
            </p>
          )}
          
          <div className="mt-auto flex items-center justify-between text-xs">
            <span className="text-gray-400 bg-slate-700/50 px-2 py-1 rounded-md">{year}</span>
            {movie.view && movie.view > 0 && (
              <span className="flex items-center space-x-1 text-gray-400">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
                </svg>
                <span>{movie.view > 1000 ? `${(movie.view / 1000).toFixed(1)}K` : movie.view}</span>
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default MovieCardHero;
