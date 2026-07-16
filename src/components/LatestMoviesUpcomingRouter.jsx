"use client";
import React, { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import MovieDetail from '@/old_pages/MovieDetail';
import UpcomingList from '@/old_pages/UpcomingList';
import { useData } from '@/context/DataContext';

export default function LatestMoviesUpcomingRouter() {
    const params = useParams();
    const router = useRouter();
    const rawId = params?.id || params?.param || params?.['*']; 
    const id = Array.isArray(rawId) ? rawId.join('/') : rawId;
    const { movies } = useData();

    // Find the actual movie object
    const movie = movies.find(item => item._id === id || item.slug === id);
    const isMovie = !!movie;

    // Check if it's released
    const isReleased = movie && movie.releaseDate && new Date(movie.releaseDate) <= new Date();

    useEffect(() => {
        if (isMovie && isReleased) {
            // It's a released movie, but we're on the upcoming route. Redirect.
            router.replace(`/latest-movies/${id}`);
        }
    }, [isMovie, isReleased, id, router]);

    // If it's a known movie that is released, render null while redirecting.
    // If it's a known movie that is NOT released, render the detail page.
    // Otherwise, assume it's a category (like south-indian, bollywood) and render the list.
    if (isMovie) {
        return isReleased ? null : <MovieDetail />;
    } else {
        return <UpcomingList />;
    }
}
