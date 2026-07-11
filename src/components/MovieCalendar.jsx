"use client";
import Link from 'next/link';


import React, { useRef } from 'react';
;
import { useData } from '../context/DataContext';

const MovieCalendar = () => {
  const { movies } = useData();
  const scrollRef = useRef(null);

  // Filter for movies with a release date in the future
  const upcomingMovies = movies
    .filter(movie => movie.releaseDate && new Date(movie.releaseDate) > new Date())
    .sort((a, b) => new Date(a.releaseDate) - new Date(b.releaseDate));

  if (upcomingMovies.length === 0) return null;

  const scroll = (direction) => {
    const { current } = scrollRef;
    if (current) {
      const scrollAmount = 300;
      current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  React.useEffect(() => {
    const slider = scrollRef.current;
    if (!slider || upcomingMovies.length === 0) return;

    let intervalId = null;
    const scrollStep = 1;
    const scrollSpeed = 30;

    const startScrolling = () => {
      if (intervalId) clearInterval(intervalId);
      intervalId = setInterval(() => {
        if (!slider) return;
        slider.scrollLeft += scrollStep;
        
        if (slider.scrollLeft >= slider.scrollWidth - slider.clientWidth - 1) {
          slider.scrollLeft = 0;
        }
      }, scrollSpeed);
    };

    startScrolling();

    const handleMouseEnter = () => {
        if (intervalId) clearInterval(intervalId);
    };
    const handleMouseLeave = () => startScrolling();

    slider.addEventListener('mouseenter', handleMouseEnter);
    slider.addEventListener('mouseleave', handleMouseLeave);
    slider.addEventListener('touchstart', handleMouseEnter, { passive: true });
    slider.addEventListener('touchend', handleMouseLeave, { passive: true });

    return () => {
      if (intervalId) clearInterval(intervalId);
      slider.removeEventListener('mouseenter', handleMouseEnter);
      slider.removeEventListener('mouseleave', handleMouseLeave);
      slider.removeEventListener('touchstart', handleMouseEnter);
      slider.removeEventListener('touchend', handleMouseLeave);
    };
  }, [upcomingMovies]);

  return (
    <div className="my-6">
      <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-2">
        <div className="flex items-center gap-2">
            <h3 className="font-black text-slate-900 tracking-tight text-xl md:text-2xl lg:text-3xl uppercase">Movie Calendar</h3>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/latest-movies" className="text-[10px] md:text-xs font-bold text-red-600 hover:text-red-700 uppercase tracking-wider flex items-center gap-1">
              VIEW SCHEDULE <i className="fas fa-chevron-right text-[8px]"></i>
          </Link>
        </div>
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

        <div 
          ref={scrollRef}
          className="flex overflow-x-auto gap-4 lg:gap-6 snap-x snap-mandatory hide-scrollbar"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
        {upcomingMovies.map((movie, index) => {
          const isReleased = movie.releaseDate && new Date(movie.releaseDate) <= new Date();
          return (
            <Link 
              key={movie._id} 
              href={`${isReleased ? '/latest-movies' : '/latest-movies/upcoming'}/${movie.slug || movie._id}`}
            className="group no-underline flex flex-col snap-start shrink-0 w-[calc(80%-16px)] sm:w-[calc(33.333%-11px)] md:w-[calc(25%-12px)] lg:w-[calc(16.666%-20px)] bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100 hover:-translate-y-1 transition-transform animate-slide-up"
            style={{ animationDelay: `${index * 150}ms` }}
          >
            <div className="relative aspect-[3/4] overflow-hidden">
                <img 
                src={movie.image} 
                alt={movie.title} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                
                {/* Date Badge */}
                <div className="absolute top-3 left-3 bg-yellow-400 text-[#0f172a] px-2 py-1 rounded-md flex flex-col items-center justify-center min-w-[35px] shadow-lg backdrop-blur-sm scale-90 font-black">
                    { (movie.isReleaseDateConfirmed && movie.releaseDate) ? (
                        <>
                            <span className="text-[8px] font-black uppercase tracking-tighter opacity-90 leading-none mb-0.5">
                                {new Date(movie.releaseDate).toLocaleDateString('en-US', { month: 'short' })}
                            </span>
                            <span className="text-sm font-black leading-none uppercase">
                                {new Date(movie.releaseDate).getDate()}
                            </span>
                        </>
                    ) : (
                        <span className="text-[10px] font-black uppercase tracking-tighter px-1">TBA</span>
                    )}
                </div>
            </div>

            <div className="p-4 bg-white">
              <h3 className="font-bold mb-1.5 text-lg truncate group-hover:text-[#0f172a] transition-colors">
                {movie.title}
              </h3>
              <div className="text-slate-400 text-xs flex justify-between items-center font-bold uppercase tracking-tighter">
                <span>{movie.genre}</span>
                <span className="text-yellow-500 italic">COMING SOON</span>
              </div>
            </div>
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

      <style dangerouslySetInnerHTML={{ __html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}} />
    </div>
  );
};

export default MovieCalendar;
