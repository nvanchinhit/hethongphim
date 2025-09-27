import type { Episode } from '@/types';

// Generate episodes for movies
export const generateEpisodesForMovie = (movieSlug: string, totalEpisodes: number): Episode[] => {
  const episodes: Episode[] = [];
  
  for (let i = 1; i <= totalEpisodes; i++) {
    episodes.push({
      name: totalEpisodes === 1 ? 'Full' : `Tập ${i}`,
      slug: totalEpisodes === 1 ? 'full' : `tap-${i}`,
      embed: `https://demo-embed.com/embed/${movieSlug}/${totalEpisodes === 1 ? 'full' : `tap-${i}`}`,
      m3u8: `https://demo-stream.com/${movieSlug}/${totalEpisodes === 1 ? 'full' : `tap-${i}`}.m3u8`,
    });
  }
  
  return episodes;
};

// Mock episodes for demo movies
export const mockEpisodes = {
  'avatar-the-way-of-water': generateEpisodesForMovie('avatar-the-way-of-water', 1),
  'squid-game': generateEpisodesForMovie('squid-game', 9),
  'stranger-things': generateEpisodesForMovie('stranger-things', 34),
  'tan-thuy-hoang': generateEpisodesForMovie('tan-thuy-hoang', 50),
};

export const getEpisodesForMovie = (movieSlug: string, totalEpisodes: number): Episode[] => {
  // Check if we have pre-defined episodes
  if (mockEpisodes[movieSlug as keyof typeof mockEpisodes]) {
    return mockEpisodes[movieSlug as keyof typeof mockEpisodes];
  }
  
  // Generate episodes for other movies
  return generateEpisodesForMovie(movieSlug, totalEpisodes);
};
