'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import type { Movie } from '../types';

interface HomeHeroProps {
  movies: Movie[];
  children?: React.ReactNode;
}

const HomeHero: React.FC<HomeHeroProps> = ({ movies, children }) => {
  const [current, setCurrent] = useState(0);
  const currentMovie = movies[current];

  const bgImage = useMemo(() => {
    if (!currentMovie) return '';
    return (
      currentMovie.poster_url ||
      currentMovie.poster_url ||
      currentMovie.posterUrl ||
      ''
    );
  }, [currentMovie]);

  if (!currentMovie) return null;

  return (
 <div
   className="relative h-[80vh] w-full bg-center bg-cover bg-no-repeat -mt-16 md:-mt-16"
  style={{ backgroundImage: bgImage ? `url(${bgImage})` : undefined }}
>
  {/* Gradient góc dưới */}
  <div className="absolute inset-0 pointer-events-none">
    <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
    <div className="absolute bottom-0 left-0 w-1/2 h-40 bg-gradient-to-tr from-black/40 to-transparent"></div>
    <div className="absolute bottom-0 right-0 w-1/2 h-40 bg-gradient-to-tl from-black/40 to-transparent"></div>
  </div>

  {/* Content */}
  <div className="relative z-10 h-full flex items-center">
    <div className="px-5 md:px-12 w-full text-white">
      <h1 className="text-5xl font-bold mb-3 drop-shadow-md">{currentMovie.name}</h1>
      <p className="text-gray-200 italic mb-5 text-lg">{currentMovie.original_name}</p>

      {/* Badge */}
      <div className="flex flex-wrap gap-2 mb-5 text-sm">
        <span className="bg-green-600 px-3 py-1 rounded">Trọn bộ</span>
        {currentMovie.year && (
          <span className="bg-white/10 px-3 py-1 rounded">{currentMovie.year}</span>
        )}
        {(currentMovie.total_episodes || currentMovie.totalEpisodes) && (
          <span className="bg-white/10 px-3 py-1 rounded">
            {currentMovie.total_episodes || currentMovie.totalEpisodes} tập
          </span>
        )}
      </div>

      {/* Mô tả */}
      <p className="text-gray-200 leading-relaxed mb-6 max-w-2xl line-clamp-3">
        {currentMovie.description}
      </p>

      {/* Nút + Thumbnail */}
      <div className="flex justify-between items-center gap-6">
        <div className="flex items-center gap-4">
          <Link
            href={`/phim/${currentMovie.slug}`}
            suppressHydrationWarning
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded font-semibold inline-flex items-center gap-2 shadow transition hover:scale-105"
          >
            ▶ Play
          </Link>
          <Link
            href={`/phim/${currentMovie.slug}`}
            suppressHydrationWarning
            className="border border-white/80 text-white px-5 py-3 rounded inline-flex items-center gap-2 transition hover:bg-white/10"
          >
            + Xem sau
          </Link>
        </div>

        {/* Thumbnail mini */}
        <div className="flex gap-3 overflow-x-auto no-scrollbar">
          {movies.slice(0, 7).map((m, i) => (
            <button
              key={m.slug + i}
              onClick={() => setCurrent(i)}
              className={`rounded-md overflow-hidden shadow flex-shrink-0 transition hover:scale-105 ${
                i === current ? 'ring-2 ring-green-400' : ''
              }`}
            >
              <img
                src={m.poster_url || m.posterUrl || ''}
                alt={m.name}
                className="h-16 w-28 object-cover"
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  </div>
</div>

  );
};

export default HomeHero;
