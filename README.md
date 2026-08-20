# Punjabi Tadka (PBT) - Frontend

This is the frontend application for an entertainment and media portal built using **Next.js**. It features sections for movies, celebrities, news, viral videos, and box office updates, along with a complete admin dashboard.

## Features

- **Next.js App Router:** Uses the modern Next.js 16 app directory structure.
- **Entertainment Categories:** 
  - Latest Movies & Box Office
  - Celebrities & Actors Directory
  - Latest News
  - Viral Videos
- **Admin Dashboard:** A built-in management interface (`/admin`) to handle content (movies, videos, news, celebs).
- **SEO Optimized:** Dynamic sitemap generation and SEO management.
- **Styling:** Fully responsive design built with Tailwind CSS.

## Tech Stack

- **Framework:** Next.js 16 (React 19)
- **Styling:** Tailwind CSS 4
- **API Client:** Axios
- **Rich Text / Images:** React Quill, React Image Crop

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run the development server:**
   ```bash
   npm run dev
   ```

3. **Open the app:**
   Visit [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

- `src/app/` - Main pages (Movies, Celebrities, News, etc.)
- `src/app/admin/` - Admin panel routes
- `src/components/` - Reusable UI components
- `src/api.js` - Backend API integration logic
