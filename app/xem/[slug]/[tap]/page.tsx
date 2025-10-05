'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import VideoPlayer from '@/components/VideoPlayer';
import EpisodeList from '@/components/EpisodeList';
import MovieGrid from '@/components/MovieGrid';
import { getMovieDetail, getNewUpdateMovies, getOptimizedImageUrl } from '@/lib/movieApi';
import type { Movie, Episode, EpisodeServer } from '@/types';

export default function WatchPage() {
  const params = useParams();
  const movieSlug = params?.slug as string;
  const episodeSlug = params?.tap as string;
  
  const [movie, setMovie] = useState<Movie | null>(null);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [servers, setServers] = useState<EpisodeServer[]>([]);
  const [currentEpisode, setCurrentEpisode] = useState<Episode | null>(null);
  const [currentServer, setCurrentServer] = useState(0);
  const [relatedMovies, setRelatedMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadWatchData = async () => {
      setLoading(true);
      
      try {
        // Get movie detail with episodes
        const movieData = await getMovieDetail(movieSlug);
        
        if (movieData) {
          setMovie(movieData);
          
          // Extract episodes from movie data
          if (movieData.episodes && Array.isArray(movieData.episodes)) {
            setServers(movieData.episodes);
            
            // Get all episodes from first server
            const firstServer = movieData.episodes[0];
            if (firstServer && firstServer.server_data) {
              setEpisodes(firstServer.server_data);
              
              // Find current episode
              const episode = firstServer.server_data.find((ep: any) => ep.slug === episodeSlug) || firstServer.server_data[0];
              setCurrentEpisode(episode);
            }
          }
        }
        
        // Get related movies
        const relatedResponse = await getNewUpdateMovies(1);
        setRelatedMovies(relatedResponse.items.slice(0, 12));
        
      } catch (error) {
        console.error('Error loading watch data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (movieSlug && episodeSlug) {
      loadWatchData();
    }
  }, [movieSlug, episodeSlug]);

  const handleServerChange = (serverIndex: number) => {
    setCurrentServer(serverIndex);
    if (servers[serverIndex] && servers[serverIndex].server_data) {
      const newEpisodes = servers[serverIndex].server_data;
      setEpisodes(newEpisodes);
      
      // Find current episode in new server
      const episode = newEpisodes.find((ep: any) => ep.slug === episodeSlug) || newEpisodes[0];
      setCurrentEpisode(episode);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="bg-slate-700 aspect-video rounded-lg mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                <div className="h-6 bg-slate-700 rounded w-3/4"></div>
                <div className="h-4 bg-slate-700 rounded w-1/2"></div>
              </div>
              <div className="space-y-2">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div key={i} className="h-10 bg-slate-700 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!movie || !currentEpisode) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Không tìm thấy tập phim</h1>
          <p className="text-gray-400 mb-6">Tập phim bạn tìm kiếm không tồn tại hoặc đã bị xóa</p>
          <Link href="/" className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-3 rounded-lg transition-colors" suppressHydrationWarning>
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
          <Link href="/" className="hover:text-cyan-400 transition-colors" suppressHydrationWarning>
            Trang chủ
          </Link>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <Link href={`/phim/${movie.slug}`} className="hover:text-cyan-400 transition-colors truncate" suppressHydrationWarning>
            {movie.name}
          </Link>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-white truncate">{currentEpisode.name}</span>
        </nav>

        {/* Video Player */}
        <div className="mb-8">
          <VideoPlayer
            src={currentEpisode.link_embed || ''}
            poster={movie.thumb_url || movie.thumbUrl || ''}
            title={`${movie.name} - ${currentEpisode.name}`}
          />
        </div>

        {/* Movie Info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
              {movie.name}
            </h1>
            <h2 className="text-lg text-gray-400 mb-4">
              {movie.origin_name || movie.originalName} - {currentEpisode.name}
            </h2>
            
            <div className="flex flex-wrap gap-4 mb-6">
              <span className="bg-red-600 text-white px-3 py-1 rounded text-sm font-semibold">
                {movie.quality}
              </span>
              <span className="bg-blue-600 text-white px-3 py-1 rounded text-sm">
                {movie.language}
              </span>
              <span className="bg-green-600 text-white px-3 py-1 rounded text-sm">
                {movie.year || (movie.created?.time ? new Date(movie.created.time).getFullYear() : '')}
              </span>
              <span className="bg-purple-600 text-white px-3 py-1 rounded text-sm">
                {movie.time}
              </span>
            </div>

            {/* Server Selection */}
            {servers.length > 1 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-3">Chọn server:</h3>
                <div className="flex flex-wrap gap-2">
                  {servers.map((server, index) => (
                    <button
                      key={index}
                      onClick={() => handleServerChange(index)}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        currentServer === index
                          ? 'bg-cyan-500 text-white'
                          : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                      }`}
                    >
                      {server.server_name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-slate-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Nội dung phim</h3>
              <div className="text-gray-300 leading-relaxed" dangerouslySetInnerHTML={{ __html: movie.description || movie.content || '' }} />
            </div>
          </div>

          <div>
            <div className="bg-slate-800 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Thông tin phim</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-gray-400">Đạo diễn:</span>
                  <span className="text-white ml-2">{movie.director || 'Đang cập nhật'}</span>
                </div>
                <div>
                  <span className="text-gray-400">Diễn viên:</span>
                  <span className="text-white ml-2">{movie.casts || 'Đang cập nhật'}</span>
                </div>
                <div>
                  <span className="text-gray-400">Tổng số tập:</span>
                  <span className="text-white ml-2">{movie.total_episodes || movie.totalEpisodes}</span>
                </div>
                <div>
                  <span className="text-gray-400">Trạng thái:</span>
                  <span className="text-white ml-2">{movie.current_episode || movie.currentEpisode}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Episodes */}
        {episodes.length > 0 && (
          <div className="bg-slate-800 rounded-lg p-6 mb-8">
            <EpisodeList 
              episodes={episodes} 
              currentEpisode={episodeSlug}
              movieSlug={movieSlug}
            />
          </div>
        )}

        {/* Related Movies */}
        {relatedMovies.length > 0 && (
          <div>
            <h3 className="text-2xl font-semibold text-white mb-6">Phim đề xuất</h3>
            <MovieGrid movies={relatedMovies} />
          </div>
        )}
      </div>
    </div>
  );
}
