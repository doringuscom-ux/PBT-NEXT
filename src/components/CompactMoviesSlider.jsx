"use client";
import Link from 'next/link';
import { useRef } from 'react';
import { useData } from '../context/DataContext';

export default function CompactMoviesSlider() {
  const { movies } = useData();

  if (!movies || movies.length === 0) return null;

  // Filter for movies that are already released (past confirmed dates or explicit released status)
  const releasedMovies = movies.filter(m => {
    const today = new Date();
    const isConfirmedPast = m.isReleaseDateConfirmed && m.releaseDate && new Date(m.releaseDate) <= today;
    const isExplicitlyReleased = m.performance?.status === 'Released' || m.performance?.status === 'Blockbuster' || m.performance?.status === 'Hit';
    return isConfirmedPast || isExplicitlyReleased;
  });

  if (releasedMovies.length === 0) return null;

  // Take 12 items so we have enough to scroll through
  const displayMovies = releasedMovies.slice(0, 12); 

  const scrollRef = useRef(null);
  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth * 0.8;
      scrollRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="my-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-2">
        <div className="flex items-center gap-2">
            <h3 className="font-black text-slate-900 tracking-tight text-xl md:text-2xl lg:text-3xl uppercase">Latest Movies</h3>
        </div>
        <Link href="/latest-movies" className="text-[10px] md:text-xs font-bold text-red-600 hover:text-red-700 uppercase tracking-wider flex items-center gap-1">
            VIEW ALL <i className="fas fa-chevron-right text-[8px]"></i>
        </Link>
      </div>

      {/* Slider Container */}
      <div className="relative group/slider">
        {/* Left Button */}
        <button 
          onClick={(e) => { e.preventDefault(); scroll('left'); }}
          className="absolute left-0 top-[40%] -translate-y-1/2 -ml-3 lg:-ml-4 z-10 w-8 h-8 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center text-gray-600 hover:text-red-600 opacity-0 group-hover/slider:opacity-100 transition-opacity"
        >
          <i className="fas fa-chevron-left text-xs"></i>
        </button>

        {/* Scroll Area */}
        <div 
          ref={scrollRef}
          className="flex overflow-x-auto gap-4 lg:gap-6 snap-x snap-mandatory hide-scrollbar"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <style>{`
            div::-webkit-scrollbar { display: none; }
          `}</style>
          
          {displayMovies.map((movie) => {
            const isReleased = movie.releaseDate && new Date(movie.releaseDate) <= new Date();
            return (
              <Link 
                key={movie._id} 
                href={`${isReleased ? '/latest-movies' : '/latest-movies/upcoming'}/${movie.slug || movie._id}`} 
                className="group no-underline flex flex-col snap-start shrink-0 w-[calc(50%-8px)] sm:w-[calc(33.333%-11px)] md:w-[calc(25%-12px)] lg:w-[calc(20%-19px)]"
              >
                <div className="w-full aspect-[4/5] sm:aspect-[3/4] rounded-md overflow-hidden bg-slate-100 relative mb-3 shadow-sm border border-gray-100">
                    <img 
                        src={movie.image} 
                        alt={movie.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                </div>
                
                <h4 className="font-bold text-slate-900 text-[11px] md:text-[13px] leading-snug line-clamp-2 group-hover:text-red-600 transition-colors">
                    {movie.title}
                </h4>
              </Link>
            );
          })}
        </div>

        {/* Right Button */}
        <button 
          onClick={(e) => { e.preventDefault(); scroll('right'); }}
          className="absolute right-0 top-[40%] -translate-y-1/2 -mr-3 lg:-mr-4 z-10 w-8 h-8 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center text-gray-600 hover:text-red-600 opacity-0 group-hover/slider:opacity-100 transition-opacity"
        >
          <i className="fas fa-chevron-right text-xs"></i>
        </button>
      </div>
    </div>
  );
}
