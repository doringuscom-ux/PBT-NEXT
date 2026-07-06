"use client";
import { usePathname } from 'next/navigation';


import React, { useEffect } from 'react';
;
import Header from '../components/Header';
import Footer from '../components/Footer';

import AnnouncementBar from '../components/AnnouncementBar';
import InquiryPopup from '../components/InquiryPopup';
import { useData } from '../context/DataContext';

const MainLayout = ({ children }) => {
  const pathname = usePathname();
  const isHomePage = pathname === '/';
  const { movies, news, celebs, videos } = useData();

  // Check if any data is loaded from the backend
  const hasData = (movies?.length > 0) || (news?.length > 0) || (celebs?.length > 0) || (videos?.length > 0);

  useEffect(() => {
    if (hasData) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (err) {}
    }
  }, [hasData]);

  return (
    <div className="flex flex-col min-h-screen">
      
      <div className="sticky top-0 z-[1000] flex flex-col bg-white shadow-md">
        <Header />
      </div>
      {isHomePage && <AnnouncementBar />}
      <main className="flex-1">
        {children}
      </main>
      {hasData && (
        <div className="w-full text-center my-4 overflow-hidden flex justify-center">
          <ins className="adsbygoogle w-full"
               style={{ display: 'block' }}
               data-ad-client="ca-pub-6214614018313479"
               data-ad-slot="3465212641"
               data-ad-format="auto"
               data-full-width-responsive="true"></ins>
        </div>
      )}
      <InquiryPopup />
      <Footer />
    </div>
  );
};

export default MainLayout;
