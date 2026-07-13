"use client";
import Link from 'next/link';


import { useRef, useEffect } from 'react';
;
import { useData } from '../context/DataContext';

const CelebGrid = ({ industry, excludeTrending = false }) => {
  const { celebs, news } = useData();
  
  // Calculate trending score based on recent articles linked
  const trendingScores = {};
  if (news && news.length > 0) {
    news.forEach(article => {
      if (article.relatedCelebrities && Array.isArray(article.relatedCelebrities)) {
        article.relatedCelebrities.forEach(celebRef => {
          const celebId = typeof celebRef === 'object' ? celebRef._id : celebRef;
          if (celebId) {
            trendingScores[celebId] = (trendingScores[celebId] || 0) + 1;
          }
        });
      }
    });
  }

  // Find top 10 trending to exclude them if needed
  let excludeIds = [];
  if (excludeTrending) {
    const allSortedForTrending = [...celebs].sort((a, b) => {
      const aScore = trendingScores[a._id] || 0;
      const bScore = trendingScores[b._id] || 0;
      if (bScore !== aScore) return bScore - aScore;
      const aFollowers = (a.followers?.length || 0) + (a.bonusFollowers || 0);
      const bFollowers = (b.followers?.length || 0) + (b.bonusFollowers || 0);
      return bFollowers - aFollowers;
    });
    excludeIds = allSortedForTrending.slice(0, 10).map(c => c._id);
  }

  // Filter by industry if provided and exclude trending if required
  const baseCelebs = celebs.filter(c => {
    if (industry && c.industry !== industry) return false;
    if (excludeTrending && excludeIds.includes(c._id)) return false;
    return true;
  });

  // Sort by articles linked descending, then by followers
  const sortedCelebs = [...baseCelebs].sort((a, b) => {
    const aScore = trendingScores[a._id] || 0;
    const bScore = trendingScores[b._id] || 0;
    
    if (bScore !== aScore) {
      return bScore - aScore;
    }

    const aFollowers = (a.followers?.length || 0) + (a.bonusFollowers || 0);
    const bFollowers = (b.followers?.length || 0) + (b.bonusFollowers || 0);
    return bFollowers - aFollowers;
  });

  const displayedCelebs = sortedCelebs.slice(0, 10);

  const sliderRef = useRef(null);

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider || displayedCelebs.length === 0) return;

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
  }, [displayedCelebs]);

  return (
    <div className="mb-12 overflow-hidden relative px-4 lg:px-20 xl:px-32 2xl:px-48">

      <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-2">
        <div className="flex items-center gap-2">
            <h3 className="font-black text-slate-900 tracking-tight text-xl md:text-2xl lg:text-3xl uppercase">
              {industry ? `${industry} Celebrities` : 'Trending Celebrities'}
            </h3>
        </div>
        <Link 
          href={industry ? `/celebrities/${industry.toLowerCase().trim().replace(/\s+/g, '-')}` : "/celebrities"} 
          className="text-[10px] md:text-xs font-bold text-red-600 hover:text-red-700 uppercase tracking-wider flex items-center gap-1"
        >
            VIEW ALL <i className="fas fa-chevron-right text-[8px]"></i>
        </Link>
      </div>
      
      <div className="celeb-marquee-container relative w-full overflow-hidden py-2">
        {/* Gradient Masks for smooth fading edges */}
        <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[#f8f9fa] to-transparent z-10 pointer-events-none hidden lg:block"></div>
        <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#f8f9fa] to-transparent z-10 pointer-events-none hidden lg:block"></div>
        
        <div 
          ref={sliderRef}
          className="flex overflow-x-auto gap-4 px-2 no-scrollbar"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <style>{`.no-scrollbar::-webkit-scrollbar { display: none; }`}</style>
          {[...displayedCelebs, ...displayedCelebs].map((celeb, idx) => {
            // Default (Bollywood) styling
            let cardStyle = "w-[200px] shrink-0 bg-white rounded-xl shadow-md text-center hover:-translate-y-1.5 hover:shadow-xl transition-all duration-300 group no-underline text-inherit block overflow-hidden";
            let imgContainerStyle = "relative w-full pt-[125%] overflow-hidden bg-slate-100";
            let infoStyle = "p-3 border-t-2 border-transparent group-hover:border-primary-red transition-colors";
            let badgeStyle = "bg-primary-red text-white text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-wider inline-block shadow-sm border border-white/10";
            let nameStyle = "font-black text-[13px] mb-1 group-hover:text-primary-red transition-colors line-clamp-1 italic tracking-tight";

            if (!industry) {
              // Trending Celebrities - Premium Story Ring Avatar
              cardStyle = "w-[110px] md:w-[130px] shrink-0 text-center group no-underline text-inherit block flex flex-col items-center";
              imgContainerStyle = "relative w-full pt-[100%] rounded-full mb-3 bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 shadow-sm transition-all duration-300 group-hover:shadow-[0_10px_20px_rgba(236,72,153,0.3)] group-hover:-translate-y-1.5";
              infoStyle = "px-1 w-full";
              badgeStyle = "hidden"; // Hide badge for a cleaner look
              nameStyle = "font-black text-[12px] md:text-[14px] text-slate-800 mb-0 group-hover:text-pink-600 transition-colors line-clamp-1 tracking-tight";
            } else if (industry === 'Hollywood') {
              // Hollywood - Premium Square Style with Blue Accents
              cardStyle = "w-[220px] shrink-0 bg-slate-50 border border-slate-200 rounded-2xl shadow-sm text-center hover:-translate-y-1.5 hover:shadow-lg transition-all duration-300 group no-underline text-inherit block overflow-hidden";
              imgContainerStyle = "relative w-full pt-[100%] overflow-hidden bg-slate-200";
              infoStyle = "p-4 border-b-[3px] border-transparent group-hover:border-blue-600 transition-colors bg-white";
              badgeStyle = "bg-blue-600 text-white text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-wider inline-block shadow-sm";
              nameStyle = "font-black text-[14px] mb-1 group-hover:text-blue-600 transition-colors line-clamp-1 tracking-tight";
            }

            return (
              <Link href={`/celebrities/${celeb.slug || celeb._id}`} key={`${celeb._id}-${idx}`} className={cardStyle}>
                <div className={imgContainerStyle}>
                  <img 
                    src={celeb.image} 
                    alt={celeb.name} 
                    loading="lazy"
                    className={!industry 
                      ? "absolute top-[3px] left-[3px] w-[calc(100%-6px)] h-[calc(100%-6px)] rounded-full object-cover object-[center_top] border-[3px] border-white bg-white transition-transform duration-700 group-hover:scale-[1.02]"
                      : "absolute top-0 left-0 w-full h-full object-cover object-[center_top] transition-transform duration-700 group-hover:scale-110"}
                  />
                </div>
                <div className={infoStyle}>
                  <div className={nameStyle}>{celeb.name}</div>
                  <div className="flex justify-center">
                      <span className={badgeStyle}>
                          {celeb.category || celeb.role}
                      </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CelebGrid;
