'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { HeroCarouselProps } from '../types';

const HeroCarousel = ({ movies }: HeroCarouselProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [imageLoaded, setImageLoaded] = useState<{ [key: number]: boolean }>({});

  useEffect(() => {
    if (movies.length === 0) return;
    
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % movies.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [movies.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % movies.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + movies.length) % movies.length);
  };

  if (!movies || movies.length === 0) {
    return (
      <div className="relative h-96 md:h-[500px] bg-slate-800 rounded-lg overflow-hidden animate-pulse">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-700 to-slate-600"></div>
      </div>
    );
  }

  return (
    <div className="relative z-0 h-[400px] md:h-[500px] lg:h-[600px] bg-slate-900 overflow-hidden group">
      <div className="absolute inset-0">
        {(() => {
          const src = movies[currentSlide]?.poster_url || movies[currentSlide]?.posterUrl || '';
          return src ? (
            <Image
              src={src}
              alt={movies[currentSlide]?.name || 'movie'}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="absolute inset-0 bg-slate-800" />
          );
        })()}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>
      </div>

      {/* Content overlay */}
      <div className="relative h-full container mx-auto px-4 md:px-6 lg:px-8 flex items-end pb-8 z-10">
        <div>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-3">
            {movies[currentSlide]?.name}
          </h2>
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
              🔥 Phim nổi bật
            </span>
            {movies[currentSlide]?.quality && (
              <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                {movies[currentSlide]?.quality}
              </span>
            )}
            {(movies[currentSlide]?.current_episode || movies[currentSlide]?.currentEpisode) && (
              <span className="text-gray-200 text-sm">
                Cập Nhật {movies[currentSlide]?.current_episode || movies[currentSlide]?.currentEpisode}
              </span>
            )}
          </div>
          <p className="text-gray-200/90 text-sm md:text-base max-w-2xl line-clamp-2 mb-6">
            {movies[currentSlide]?.original_name || movies[currentSlide]?.originalName}
          </p>
          <Link
            href={`/phim/${movies[currentSlide]?.slug}`}
            suppressHydrationWarning
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
            <span>Xem ngay</span>
          </Link>
        </div>
      </div>


      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-300 hover:scale-110 opacity-0 group-hover:opacity-100"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-300 hover:scale-110 opacity-0 group-hover:opacity-100"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Enhanced Dots Indicator */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3 z-10">
        {movies.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`transition-all duration-300 ${
              index === currentSlide 
                ? 'w-8 h-3 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full shadow-lg' 
                : 'w-3 h-3 bg-white/50 hover:bg-white/80 rounded-full'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
      
      {/* Quick Action Buttons */}
      <div className="absolute bottom-6 right-6 flex space-x-3 z-10">
        <Link
          href={`/phim/${movies[currentSlide]?.slug}`}
          className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center space-x-2 shadow-lg"
          suppressHydrationWarning
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z"/>
          </svg>
          <span>Xem ngay</span>
        </Link>
      </div>
    </div>
  );
};

export default HeroCarousel;
