"use client";
import Link from 'next/link';
import { useRef } from 'react';
import { useData } from '../context/DataContext';

export default function CompactTrailersSlider() {
  const { videos } = useData();

  if (!videos || videos.length === 0) return null;

  // Filter only strict trailers or teasers
  const trailers = videos.filter(v => {
    const title = (v.title || '').toLowerCase();

    // Reject anything that looks like a song, music video, or interview
    if (title.includes('song') || title.includes('music video') || title.includes('lyrical') || title.includes('audio') || title.includes('interview')) {
      return false;
    }

    // Must have trailer or teaser in the title to be 100% sure it's a trailer,
    // because backend category defaults to 'Trailer' causing false positives.
    return title.includes('trailer') || title.includes('teaser');
  });

  if (trailers.length === 0) return null;

  // Take 12 items so we have enough to scroll through
  const displayVideos = trailers.slice(0, 12);

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
          <h3 className="font-black text-slate-900 tracking-tight text-xl md:text-2xl lg:text-3xl uppercase">Latest Trailers</h3>
        </div>
        <Link href="/latest-viral-videos" className="text-[10px] md:text-xs font-bold text-red-600 hover:text-red-700 uppercase tracking-wider flex items-center gap-1">
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

          {displayVideos.map((video) => (
            <Link
              key={video._id}
              href={`/latest-viral-videos/${video.slug || video._id}`}
              className="group no-underline flex flex-col snap-start shrink-0 w-[calc(80%-16px)] sm:w-[calc(33.333%-11px)] md:w-[calc(25%-12px)] lg:w-[calc(20%-19px)]"
            >
              <div className="w-full aspect-video rounded-md overflow-hidden bg-slate-100 relative mb-3 shadow-sm border border-gray-100">
                <img
                  src={video.image || video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Play Button Overlay */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white pl-0.5 shadow-lg transform scale-50 group-hover:scale-100 transition-transform duration-300">
                    <i className="fas fa-play text-xs"></i>
                  </div>
                </div>
              </div>

              <h4 className="font-bold text-slate-900 text-[11px] md:text-[13px] leading-snug line-clamp-2 group-hover:text-red-600 transition-colors">
                {video.title}
              </h4>
            </Link>
          ))}
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
