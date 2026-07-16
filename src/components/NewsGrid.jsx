"use client";
import Link from 'next/link';
;
import { useData } from '../context/DataContext';

const NewsGrid = () => {
  const { news } = useData();
  if (news.length === 0) return (
    <div className="px-4 lg:px-20 xl:px-32 2xl:px-48">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1,2,3].map(i => (
          <div key={i} className="h-[300px] rounded-3xl skeleton opacity-20"></div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="px-4 lg:px-20 xl:px-32 2xl:px-48">
      <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-2">
        <div className="flex items-center gap-2">
            <h3 className="font-black text-slate-900 tracking-tight text-xl md:text-2xl lg:text-3xl uppercase">Latest News</h3>
        </div>
        <Link href="/latest-news" className="text-[10px] md:text-xs font-bold text-red-600 hover:text-red-700 uppercase tracking-wider flex items-center gap-1">
            VIEW ALL <i className="fas fa-chevron-right text-[8px]"></i>
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {news.slice(12, 18).map((item, index) => (
          <Link href={`/latest-news/${item.slug || item._id}`} key={item._id} className="group cursor-pointer no-underline text-inherit block">
            {/* Image Container with premium hover effect */}
            <div className="relative aspect-video rounded-3xl overflow-hidden mb-4 shadow-lg group-hover:shadow-2xl border border-slate-100/50 bg-slate-50 transition-all duration-500 group-hover:-translate-y-1">
              <img 
                src={item.image} 
                alt={item.title} 
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md text-red-600 py-1.5 px-3 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg">
                {item.category}
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
            
            {/* Content Area with premium number and typography */}
            <div className="flex items-center gap-4 md:gap-5 px-2 mt-4">
                <span className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-slate-300 to-slate-400 group-hover:from-red-500 group-hover:to-red-700 transition-all duration-500 italic leading-none shrink-0 drop-shadow-sm group-hover:scale-110 origin-left pr-3 pl-1 -ml-1 py-1">
                    {String(index + 1).padStart(2, '0')}
                </span>
                <div className="flex-1 py-2">
                    <h3 className="text-lg md:text-xl font-extrabold mb-2.5 leading-[1.3] text-slate-800 group-hover:text-red-600 transition-colors tracking-tight line-clamp-2">
                        {item.title}
                    </h3>
                    <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        <span>{item.date}</span>
                        <span className="w-1 h-1 bg-red-500/30 rounded-full"></span>
                        <span className="text-red-600 flex items-center gap-1 group-hover:underline underline-offset-4 decoration-2 decoration-red-600/30">
                          Full Story <i className="fas fa-chevron-right text-[8px]"></i>
                        </span>
                    </div>
                </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default NewsGrid;
