"use client";
import React from 'react';
import MainLayout from '@/layouts/MainLayout';

import Hero from '@/components/Hero';
import PromotionCarousel from '@/components/PromotionCarousel';
import MovieSlider from '@/components/MovieSlider';
import MovieCalendar from '@/components/MovieCalendar';
import NewsGrid from '@/components/NewsGrid';
import CelebGrid from '@/components/CelebGrid';
import SidebarVideos from '@/components/SidebarVideos';
import CompactNewsSlider from '@/components/CompactNewsSlider';
import CompactMoviesSlider from '@/components/CompactMoviesSlider';
import CompactTrailersSlider from '@/components/CompactTrailersSlider';
import CompactCelebSlider from '@/components/CompactCelebSlider';

export default function HomeClient() {
  return (
    <MainLayout>
      <main className="page-container py-2 lg:py-4">
        <h1 className="sr-only">Pbtadka - Latest News, Movies, & Celebrity Updates</h1>

        <div className="space-y-8 lg:space-y-12">
          
          <PromotionCarousel />

          {/* Top Row: Hero and Sidebar ONLY */}
          <div className="flex flex-col lg:flex-row lg:justify-between gap-6 lg:gap-10 xl:gap-12 items-stretch">
            {/* Left Column (Hero) */}
            <div className="flex-1 lg:w-[65%] xl:w-[68%] min-w-0 flex flex-col">
              <Hero />
            </div>

            {/* Right Column (Sidebar) */}
            <aside className="hidden lg:block lg:w-[35%] xl:w-[32%] relative">
              <div className="absolute inset-0">
                <SidebarVideos />
              </div>
            </aside>
          </div>

          {/* Compact Sliders Row */}
          <div className="flex flex-col">
            <CompactNewsSlider />
            <CompactMoviesSlider />
            <CompactTrailersSlider />
            <CompactCelebSlider />
            <MovieCalendar />
          </div>

          {/* Full Width Sections Below Hero/Widgets Row */}
          <div className="space-y-12">
            <NewsGrid />
            <CelebGrid />
          </div>
        </div>
      </main>
    </MainLayout>
  );
}
