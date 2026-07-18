"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import * as api from '../api';
import Loading from '../components/Loading';

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider = ({ children }) => {
  const [movies, setMovies] = useState([]);
  const [news, setNews] = useState([]);
  const [todayNews, setTodayNews] = useState([]);
  const [celebs, setCelebs] = useState([]);
  const [videos, setVideos] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [user, setUser] = useState(null); // New user state for session
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);

  const fetchData = async () => {
    
    // 1. FAST BOOT: Check local cache first to instantly show the website
    let hasCache = false;
    try {
      const cachedData = localStorage.getItem('pbt_cached_data');
      if (cachedData) {
        const parsedCache = JSON.parse(cachedData);
        if (parsedCache.movies) setMovies(parsedCache.movies);
        if (parsedCache.news) setNews(parsedCache.news);
        if (parsedCache.todayNews) setTodayNews(parsedCache.todayNews);
        if (parsedCache.celebs) setCelebs(parsedCache.celebs);
        if (parsedCache.videos) setVideos(parsedCache.videos);
        if (parsedCache.announcements) setAnnouncements(parsedCache.announcements);
        setIsLoading(false); // Instantly hide loading screen!
        hasCache = true;
      }
    } catch (e) {}

    if (!hasCache) {
      setIsLoading(true);
    }
    
    setLoadingProgress(0);
    const totalRequests = 7;
    let completed = 0;

    // Smooth fake progress that moves while waiting for the network
    const fakeProgressInterval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev < 85) return prev + 1;
        return prev;
      });
    }, 150);

    const increment = (step) => {
      completed++;
      const actualP = Math.round((completed / totalRequests) * 100);
      setLoadingProgress(prev => Math.max(prev, actualP));
    };

    const withTimeout = (promise, ms, name) => {
      let timer;
      const timeoutPromise = new Promise((_, reject) => {
        timer = setTimeout(() => reject(new Error(`Timeout: ${name}`)), ms);
      });
      return Promise.race([promise, timeoutPromise]).finally(() => clearTimeout(timer));
    };

    try {
      // 1. Auth
      withTimeout(api.getMe(), 10000, 'auth/me')
        .then(r => { if (r?.data?.success) setUser(r.data.user); })
        .catch(e => { setUser(null); })
        .finally(() => increment('auth/me'));

      // 2. Movies
      withTimeout(api.getMovies(), 15000, 'movies')
        .then(res => {
          const newMovies = ((res && res.data) ? (Array.isArray(res.data) ? res.data : res.data.data || []) : []).sort((a, b) => new Date(b.createdAt || b.year) - new Date(a.createdAt || a.year));
          setMovies(newMovies);
        })
        .catch(e => console.error("Movies failed", e))
        .finally(() => increment('movies'));

      // 3. News
      withTimeout(api.getNews(), 15000, 'news')
        .then(res => {
          const newNews = ((res && res.data) ? (Array.isArray(res.data) ? res.data : res.data.data || []) : []).sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date));
          setNews(newNews);
        })
        .catch(e => console.error("News failed", e))
        .finally(() => increment('news'));

      // 4. Today News
      withTimeout(api.getTodayNews(), 15000, 'todayNews')
        .then(res => {
          const newTodayNews = ((res && res.data) ? (Array.isArray(res.data) ? res.data : res.data.data || []) : []).sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date));
          setTodayNews(newTodayNews);
        })
        .catch(e => console.error("TodayNews failed", e))
        .finally(() => increment('todayNews'));

      // 5. Celebs
      withTimeout(api.getCelebrities(), 15000, 'celebs')
        .then(res => {
          const newCelebs = (res && res.data) ? (Array.isArray(res.data) ? res.data : res.data.data || []) : []; 
          setCelebs(newCelebs);
        })
        .catch(e => console.error("Celebs failed", e))
        .finally(() => increment('celebs'));

      // 6. Videos
      withTimeout(api.getVideos(), 15000, 'videos')
        .then(res => {
          const newVideos = (res && res.data) ? (Array.isArray(res.data) ? res.data : res.data.data || []) : [];
          setVideos(newVideos);
        })
        .catch(e => console.error("Videos failed", e))
        .finally(() => increment('videos'));

      // 7. Announcements
      withTimeout(api.getAnnouncements(), 15000, 'announcements')
        .then(res => {
          const newAnnouncements = (res && res.data) ? (Array.isArray(res.data) ? res.data : res.data.data || []) : [];
          setAnnouncements(newAnnouncements);
        })
        .catch(e => console.error("Announcements failed", e))
        .finally(() => increment('announcements'));

      // Setup completion checker
      const checkCompletion = setInterval(() => {
        if (completed >= totalRequests) {
          clearInterval(fakeProgressInterval);
          clearInterval(checkCompletion);
          setLoadingProgress(100);
          setTimeout(() => setIsLoading(false), 300);
        }
      }, 500);

    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  const logout = async () => {
    try {
      await api.logout();
      setUser(null);
      // Clear legacy localStorage hints
      localStorage.removeItem('pbt_user_authenticated');
      localStorage.removeItem('pbt_is_authenticated');
      localStorage.removeItem('pbt_token');
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    fetchData();

    // Prevent backend from going to sleep while the tab is open (Ping every 5 mins)
    const keepAliveInterval = setInterval(() => {
      api.getMe().catch(() => {});
    }, 5 * 60 * 1000);

    // Cross-tab synchronization: if another tab updates the cache, sync this tab instantly
    const handleStorage = (e) => {
      if (e.key === 'pbt_cached_data' && e.newValue) {
        try {
          const parsedCache = JSON.parse(e.newValue);
          if (parsedCache.movies) setMovies(parsedCache.movies);
          if (parsedCache.news) setNews(parsedCache.news);
          if (parsedCache.todayNews) setTodayNews(parsedCache.todayNews);
          if (parsedCache.celebs) setCelebs(parsedCache.celebs);
          if (parsedCache.videos) setVideos(parsedCache.videos);
          if (parsedCache.announcements) setAnnouncements(parsedCache.announcements);
        } catch (err) {}
      }
    };
    
    window.addEventListener('storage', handleStorage);
    return () => {
      window.removeEventListener('storage', handleStorage);
      clearInterval(keepAliveInterval);
    };
  }, []);

  // Auto-save cache when data changes so other tabs can sync
  useEffect(() => {
    if (!isLoading && movies.length > 0) {
      try {
        localStorage.setItem('pbt_cached_data', JSON.stringify({
          movies, news, todayNews, celebs, videos, announcements
        }));
      } catch (e) {}
    }
  }, [movies, news, todayNews, celebs, videos, announcements, isLoading]);

  const addMovie = async (movie) => {
    try {
      const res = await api.addMovie(movie);
      setMovies([res.data, ...movies].sort((a, b) => new Date(b.createdAt || b.year) - new Date(a.createdAt || a.year)));
      return { success: true };
    } catch (err) { 
        console.error(err); 
        alert("Movie Upload Failed: " + (err.response?.data?.message || err.message));
        return { success: false };
    }
  };

  const updateMovie = async (id, updatedMovie) => {
    try {
      const res = await api.updateMovie(id, updatedMovie);
      setMovies(movies.map(m => m._id === id ? res.data : m));
      return { success: true };
    } catch (err) { 
        console.error(err); 
        alert("Movie Update Failed: " + (err.response?.data?.message || err.message));
        return { success: false };
    }
  };

  const deleteMovie = async (id) => {
    try {
      await api.deleteMovie(id);
      setMovies(movies.filter(m => m._id !== id));
    } catch (err) { console.error(err); }
  };

  const addMovieComment = async (id, commentData) => {
    try {
      const res = await api.addMovieComment(id, commentData);
      setMovies(movies.map(m => m._id === id ? res.data : m));
      return { success: true };
    } catch (err) { return { success: false, error: err.message }; }
  };

  const deleteMovieComment = async (id, commentId) => {
    try {
      if (!id || !commentId) throw new Error("Missing id or commentId");
      const res = await api.deleteMovieComment(id, commentId);
      setMovies(movies.map(m => m._id === id ? res.data : m));
    } catch (err) { 
        console.error("Delete Movie Comment Error:", err.response?.data || err.message);
        console.log("Details:", { id, commentId });
    }
  };


  const likeMovieComment = async (id, commentId) => {
    try {
      const res = await api.likeMovieComment(id, commentId);
      setMovies(movies.map(m => m._id === id ? res.data : m));
    } catch (err) { console.error(err); }
  };

  const rateMovie = async (id, rating, review) => {
    try {
      const res = await api.rateMovie(id, rating, review);
      setMovies(movies.map(m => m._id === id ? res.data : m));
      return { success: true };
    } catch (err) { 
      console.error(err); 
      return { success: false, error: err.response?.data?.message || err.message };
    }
  };

  const deleteMovieRating = async (id) => {
    try {
      const res = await api.deleteMovieRating(id);
      setMovies(movies.map(m => m._id === id ? res.data : m));
      return { success: true };
    } catch (err) {
      console.error(err);
      return { success: false, error: err.response?.data?.message || err.message };
    }
  };

  const updateMovieComment = async (id, commentId, data) => {
    try {
      if (!id || !commentId) throw new Error("Missing id or commentId");
      const res = await api.updateMovieComment(id, commentId, data);
      setMovies(movies.map(m => m._id === id ? res.data : m));
    } catch (err) { 
      console.error("Update Movie Comment Error:", err.response?.data || err.message); 
      console.log("Details:", { id, commentId });
    }
  };


  // Video Management
  const addVideo = async (videoFormData) => {
    try {
      const res = await api.addVideo(videoFormData);
      setVideos([res.data, ...videos]);
      return { success: true };
    } catch (err) { 
      console.error(err); 
      return { success: false, error: err.message };
    }
  };

  const updateVideo = async (id, updatedVideo) => {
    try {
      const res = await api.updateVideo(id, updatedVideo);
      setVideos(videos.map(v => v._id === id ? res.data : v));
      return { success: true };
    } catch (err) { 
        console.error(err); 
        alert("Video Update Failed: " + (err.response?.data?.message || err.message));
        return { success: false };
    }
  };

  const deleteVideo = async (id) => {
    try {
      await api.deleteVideo(id);
      setVideos(videos.filter(v => v._id !== id));
    } catch (err) { console.error(err); }
  };

  const addVideoComment = async (id, commentData) => {
    try {
      const res = await api.addVideoComment(id, commentData);
      setVideos(videos.map(v => v._id === id ? res.data : v));
      return { success: true };
    } catch (err) { return { success: false, error: err.message }; }
  };

  const deleteVideoComment = async (id, commentId) => {
    try {
      if (!id || !commentId) throw new Error("Missing id or commentId");
      const res = await api.deleteVideoComment(id, commentId);
      setVideos(videos.map(v => v._id === id ? res.data : v));
    } catch (err) { 
        console.error("Delete Video Comment Error:", err.response?.data || err.message);
        console.log("Details:", { id, commentId });
    }
  };


  const likeVideoComment = async (id, commentId) => {
    try {
      const res = await api.likeVideoComment(id, commentId);
      setVideos(videos.map(v => v._id === id ? res.data : v));
    } catch (err) { console.error(err); }
  };

  const updateVideoComment = async (id, commentId, data) => {
    try {
      if (!id || !commentId) throw new Error("Missing id or commentId");
      const res = await api.updateVideoComment(id, commentId, data);
      setVideos(videos.map(v => v._id === id ? res.data : v));
    } catch (err) { 
      console.error("Update Video Comment Error:", err.response?.data || err.message);
      console.log("Details:", { id, commentId });
    }
  };


  // News Management
  const addNews = async (article) => {
    try {
      const res = await api.addNews(article);
      setNews([res.data, ...news].sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date)));
      return { success: true };
    } catch (err) { 
        console.error(err); 
        alert("News Upload Failed: " + (err.response?.data?.message || err.message));
        return { success: false };
    }
  };

  const updateNews = async (id, updatedArticle) => {
    try {
      const res = await api.updateNews(id, updatedArticle);
      setNews(news.map(n => n._id === id ? res.data : n));
      return { success: true };
    } catch (err) { 
        console.error(err); 
        alert("News Update Failed: " + (err.response?.data?.message || err.message));
        return { success: false };
    }
  };

  const deleteNews = async (id) => {
    try {
      await api.deleteNews(id);
      setNews(news.filter(n => n._id !== id));
    } catch (err) { console.error(err); }
  };

  const addComment = async (newsId, commentData) => {
    console.log("Adding Comment:", { newsId, commentData });
    try {
      const res = await api.addComment(newsId, commentData);
      setNews(news.map(n => n._id === newsId ? res.data : n));
      return { success: true };
    } catch (err) { 
      console.error("Add Comment Error:", err.response?.data || err.message); 
      return { success: false, error: err.response?.data?.message || err.message };
    }
  };


  const deleteComment = async (newsId, commentId) => {
    try {
      if (!newsId || !commentId) throw new Error("Missing newsId or commentId");
      const res = await api.deleteComment(newsId, commentId);
      setNews(news.map(n => n._id === newsId ? res.data : n));
      return { success: true };
    } catch (err) { 
      console.error("Delete Comment Error:", err.response?.data || err.message); 
      console.log("Details:", { newsId, commentId });
      return { success: false, error: err.message };
    }
  };


  const likeComment = async (newsId, commentId) => {
    console.log(`Liking comment ${commentId} on article ${newsId}`);
    try {
      const res = await api.likeComment(newsId, commentId);
      console.log('Like result:', res.data);
      setNews(news.map(n => n._id === newsId ? res.data : n));
    } catch (err) { 
      console.error('Like error:', err.response?.data || err.message); 
      alert('Error: ' + (err.response?.data?.message || 'Could not like comment'));
    }
  };

  const reportComment = async (newsId, commentId) => {
    try {
      const res = await api.reportComment(newsId, commentId);
      setNews(news.map(n => n._id === newsId ? res.data : n));
    } catch (err) { console.error(err); }
  };

  const updateComment = async (newsId, commentId, commentData) => {
    try {
      if (!newsId || !commentId) throw new Error("Missing newsId or commentId");
      const res = await api.updateComment(newsId, commentId, commentData);
      setNews(news.map(n => n._id === newsId ? res.data : n));
    } catch (err) { 
      console.error("Update Comment Error:", err.response?.data || err.message); 
      console.log("Details:", { newsId, commentId });
    }
  };


  // Celeb Management
  const addCeleb = async (celeb) => {
    try {
      const res = await api.addCelebrity(celeb);
      setCelebs([...celebs, res.data]);
      return { success: true };
    } catch (err) { 
        console.error(err); 
        alert("Celebrity Upload Failed: " + (err.response?.data?.message || err.message));
        return { success: false };
    }
  };

  const updateCeleb = async (id, updatedCeleb) => {
    try {
      const res = await api.updateCelebrity(id, updatedCeleb);
      setCelebs(celebs.map(c => c._id === id ? res.data : c));
      return { success: true };
    } catch (err) { 
        console.error(err); 
        alert("Celebrity Update Failed: " + (err.response?.data?.message || err.message));
        return { success: false };
    }
  };

  const deleteCeleb = async (id) => {
    try {
      await api.deleteCelebrity(id);
      setCelebs(celebs.filter(c => c._id !== id));
    } catch (err) { console.error(err); }
  };

  const addCelebComment = async (id, commentData) => {
    try {
      const res = await api.addCelebComment(id, commentData);
      setCelebs(celebs.map(c => c._id === id ? res.data : c));
      return { success: true };
    } catch (err) { return { success: false, error: err.message }; }
  };

  const deleteCelebComment = async (id, commentId) => {
    try {
      if (!id || !commentId) throw new Error("Missing id or commentId");
      const res = await api.deleteCelebComment(id, commentId);
      setCelebs(celebs.map(c => c._id === id ? res.data : c));
    } catch (err) { 
        console.error("Delete Celeb Comment Error:", err.response?.data || err.message);
        console.log("Details:", { id, commentId });
    }
  };


  const likeCelebComment = async (id, commentId) => {
    try {
      const res = await api.likeCelebComment(id, commentId);
      setCelebs(celebs.map(c => c._id === id ? res.data : c));
    } catch (err) { console.error(err); }
  };

  const updateCelebComment = async (id, commentId, data) => {
    try {
      if (!id || !commentId) throw new Error("Missing id or commentId");
      const res = await api.updateCelebComment(id, commentId, data);
      setCelebs(celebs.map(c => c._id === id ? res.data : c));
    } catch (err) { 
      console.error("Update Celeb Comment Error:", err.response?.data || err.message);
      console.log("Details:", { id, commentId });
    }
  };

  const followCeleb = async (id) => {
    try {
      const res = await api.followCelebrity(id);
      setCelebs(celebs.map(c => c._id === id ? res.data : c));
      return { success: true };
    } catch (err) { 
      console.error(err); 
      return { success: false, error: err.response?.data?.message || err.message };
    }
  };

  const autoGenerateCelebSEO = async () => {
    try {
      const res = await api.autoGenerateCelebSEO();
      return { success: true, message: res.data.message };
    } catch (err) {
      console.error(err);
      return { success: false, error: err.response?.data?.message || err.message };
    }
  };


  const addAnnouncement = async (text) => {
    try {
      const res = await api.addAnnouncement({ text });
      setAnnouncements([res.data, ...announcements]);
      return { success: true };
    } catch (err) { 
      console.error(err); 
      return { success: false, error: err.message };
    }
  };

  const deleteAnnouncement = async (id) => {
    try {
      await api.deleteAnnouncement(id);
      setAnnouncements(announcements.filter(a => a._id !== id));
      return { success: true };
    } catch (err) { 
      console.error(err); 
      return { success: false, error: err.message };
    }
  };

  const combinedAnnouncements = announcements.map(ann => ({ 
    text: ann.text, 
    link: ann.link || null 
  }));

    // if (combinedAnnouncements.length === 0) {
    //   combinedAnnouncements.push({ text: "Stay tuned for the latest film updates!", link: null });
    // }

    // Removed blocking loading screen to improve FCP & LCP!
    // if (isLoading) return <Loading progress={loadingProgress} />;

    return (
      <DataContext.Provider value={{
        movies, addMovie, updateMovie, deleteMovie,
        news, todayNews, addNews, updateNews, deleteNews,
        celebs, addCeleb, updateCeleb, deleteCeleb,
        videos, addVideo, updateVideo, deleteVideo,
        addComment, deleteComment, likeComment, reportComment, updateComment,
        announcements: combinedAnnouncements,
        manualAnnouncements: announcements,
        addAnnouncement, deleteAnnouncement,
        user, setUser, logout,
        refreshData: fetchData,
        addMovieComment, deleteMovieComment, likeMovieComment, updateMovieComment, rateMovie, deleteMovieRating,
        addVideoComment, deleteVideoComment, likeVideoComment, updateVideoComment,
        addCelebComment, deleteCelebComment, likeCelebComment, updateCelebComment, followCeleb, autoGenerateCelebSEO,
        isLoading, loadingProgress
      }}>
      {isLoading && (
        <div 
          className="fixed top-0 left-0 h-[3px] bg-[#e31e24] z-[9999] transition-all duration-300 ease-out" 
          style={{ width: `${loadingProgress}%`, opacity: loadingProgress === 100 ? 0 : 1 }} 
        />
      )}
      {children}
    </DataContext.Provider>
  );
};
