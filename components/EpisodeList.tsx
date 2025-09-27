'use client';

import Link from 'next/link';
import type { EpisodeListProps } from '@/types';

const EpisodeList = ({ episodes, currentEpisode, movieSlug }: EpisodeListProps) => {
  if (!episodes || episodes.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400">Chưa có tập phim nào</p>
      </div>
    );
  }

  // Group episodes by chunks of 50 for better display
  const episodeChunks = [];
  const chunkSize = 50;
  for (let i = 0; i < episodes.length; i += chunkSize) {
    episodeChunks.push(episodes.slice(i, i + chunkSize));
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-white mb-4">
        Danh sách tập ({episodes.length} tập)
      </h3>
      
      {episodeChunks.map((chunk, chunkIndex) => (
        <div key={`chunk-${chunkIndex}-${chunk[0]?.name}-${chunk[chunk.length - 1]?.name}`} className="space-y-3">
          {episodeChunks.length > 1 && (
            <h4 className="text-lg font-medium text-gray-300">
              Tập {chunk[0].name} - {chunk[chunk.length - 1].name}
            </h4>
          )}
          
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 gap-2">
            {chunk.map((episode, epIndex) => {
              const isActive = currentEpisode === episode.slug;
              const displayLabel = episode.name || episode.slug || `Tập ${epIndex + 1}`;
              
              return (
                <Link
                  key={episode.slug || `ep-${chunkIndex}-${epIndex}`}
                  href={`/xem/${movieSlug}/${episode.slug}`}
                  className={`
                    px-3 py-2 text-sm font-medium rounded-lg text-center transition-all duration-200
                    ${isActive 
                      ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/25' 
                      : 'bg-slate-700 text-gray-300 hover:bg-slate-600 hover:text-white'
                    }
                  `}
                >
                  {displayLabel}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
      
      {episodes.length > 50 && (
        <div className="text-center pt-4">
          <p className="text-sm text-gray-400">
            Hiển thị tất cả {episodes.length} tập
          </p>
        </div>
      )}
    </div>
  );
};

export default EpisodeList;
