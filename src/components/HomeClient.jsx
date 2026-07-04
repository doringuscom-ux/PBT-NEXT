"use client";
import React from 'react';
import MainLayout from '@/layouts/MainLayout';
import WeatherWidget from '@/components/WeatherWidget';
import MarketWidget from '@/components/MarketWidget';
import Hero from '@/components/Hero';
import HomeVideoMarquee from '@/components/HomeVideoMarquee';
import MovieSlider from '@/components/MovieSlider';
import MovieCalendar from '@/components/MovieCalendar';
import NewsGrid from '@/components/NewsGrid';
import CelebGrid from '@/components/CelebGrid';

export default function HomeClient() {
  return (
    <MainLayout>
      <main className="page-container py-2 lg:py-4">
        <h1 className="sr-only">Pbtadka - Latest News, Movies, & Celebrity Updates</h1>

        <div className="space-y-8 lg:space-y-12">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            {/* Mobile Widgets - Shown only on small screens at the top */}
            <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-3">
              <WeatherWidget />
              <MarketWidget />
            </div>

            <div className="flex-1 lg:w-[68%] xl:w-[70%] min-w-0">
              <Hero />
            </div>

            <aside className="hidden lg:flex lg:w-[32%] xl:w-[30%] flex-col gap-8">
              <div className="flex flex-col gap-4">
                <WeatherWidget />
                <MarketWidget />
              </div>
            </aside>
          </div>

          {/* Full Width Sections Below Hero/Widgets Row */}
          <div className="space-y-12">
            <HomeVideoMarquee />
            <MovieSlider />
            <MovieCalendar />
            <NewsGrid />
            <CelebGrid industry="Bollywood" />
            <CelebGrid industry="Hollywood" />
            <CelebGrid />
          </div>
        </div>
      </main>
    </MainLayout>
  );
}
