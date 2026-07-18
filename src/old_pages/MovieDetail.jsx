"use client";
import { useParams } from 'next/navigation';


import React, { useEffect } from 'react';
;
import { useData } from '../context/DataContext';
import MovieDetailLayout from './MovieDetailLayout';

const MovieDetail = () => {
    const params = useParams();
    const rawId = params?.id || params?.param || params?.['*']; const id = Array.isArray(rawId) ? rawId.join('/') : rawId;
    const { movies, news, addMovieComment, likeMovieComment, updateMovieComment, deleteMovieComment, isLoading, loadingProgress } = useData();
    
    // Find movie by ID or Slug
    const movie = movies.find(item => item._id === id || item.slug === id);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

    const sidebarNews = React.useMemo(() => {
        return [...news].sort(() => 0.5 - Math.random()).slice(0, 6);
    }, [news]);

    if (isLoading) return (
        <div className="min-h-screen flex justify-center items-center bg-gray-50">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary-red"></div>
        </div>
    );

    if (!movie) return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center p-10 bg-gray-50">
            <i className="fas fa-film text-gray-200 text-6xl mb-4"></i>
            <h2 className="text-xl font-black uppercase text-slate-400">Movie not found</h2>
            <p className="text-gray-300 text-xs font-bold uppercase tracking-widest mt-2 italic">The requested content may have been moved or deleted.</p>
        </div>
    );

    return (
        <MovieDetailLayout 
            movie={movie} 
            sidebarNews={sidebarNews} 
        />
    );
};

export default MovieDetail;
