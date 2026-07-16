"use client";
import React from 'react';
import MainLayout from '@/layouts/MainLayout';

import Hero from '@/components/Hero';
import PromotionCarousel from '@/components/PromotionCarousel';
import dynamic from 'next/dynamic';

const MovieSlider = dynamic(() => import('@/components/MovieSlider'));
const MovieCalendar = dynamic(() => import('@/components/MovieCalendar'));
const NewsGrid = dynamic(() => import('@/components/NewsGrid'));
const CelebGrid = dynamic(() => import('@/components/CelebGrid'));
const SidebarVideos = dynamic(() => import('@/components/SidebarVideos'));
const CompactNewsSlider = dynamic(() => import('@/components/CompactNewsSlider'));
const CompactMoviesSlider = dynamic(() => import('@/components/CompactMoviesSlider'));
const CompactTrailersSlider = dynamic(() => import('@/components/CompactTrailersSlider'));
const CompactCelebSlider = dynamic(() => import('@/components/CompactCelebSlider'));
const CompactSongsSlider = dynamic(() => import('@/components/CompactSongsSlider'));

export default function HomeClient() {
  return (
    <MainLayout>
      <PromotionCarousel />


      <main className="page-container pb-2 lg:pb-4 pt-0">
        <h1 className="sr-only">Pbtadka - Latest News, Movies, & Celebrity Updates</h1>

        <div className="space-y-8 lg:space-y-12">




          {/* Hero and Sidebar Row (Moved below Celebrities) */}
          <div className="flex flex-col lg:flex-row lg:justify-between gap-6 lg:gap-10 xl:gap-12 items-stretch px-4 lg:px-20 xl:px-32 2xl:px-48">
            {/* Left Column (Hero) */}
            <div className="flex-1 min-w-0 flex flex-col">
              <Hero />
            </div>

            {/* Right Column (Sidebar) */}
            <aside className="hidden lg:block lg:w-[350px] xl:w-[400px] 2xl:w-[450px] shrink-0 relative">
              <div className="absolute inset-0">
                <SidebarVideos />
              </div>
            </aside>
          </div>



          {/* Compact Sliders Row */}
          <div className="flex flex-col gap-8 lg:gap-[30px]">
            <MovieCalendar />
            <CompactTrailersSlider />
            <CompactMoviesSlider />
            <CompactNewsSlider />
            <CompactCelebSlider />
            <NewsGrid />
            <CompactSongsSlider />
            <CelebGrid />
          </div>




          {/* Full Width Sections Below Hero/Widgets Row */}
        </div>
      </main>
    </MainLayout>
  );
}
