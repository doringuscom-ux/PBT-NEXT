import api from '@/api';

export default async function sitemap() {
  try {
    const res = await api.get('/seo');
    const seoEntries = res.data;

    // Filter out admin and non-existent exclusive routes
    const validEntries = seoEntries.filter(
      (entry) => {
        const url = entry.url.toLowerCase();
        const formattedUrl = url.startsWith('/') ? url : `/${url}`;
        return !formattedUrl.startsWith('/admin') && !formattedUrl.startsWith('/exclusive');
      }
    );

    return validEntries.map((entry) => {
      const formattedUrl = entry.url.startsWith('/') ? entry.url : `/${entry.url}`;
      return {
        url: `https://pbtadka.com${formattedUrl === '/' ? '' : formattedUrl}`,
        lastModified: entry.updatedAt || new Date(),
        changeFrequency: 'daily',
        priority: formattedUrl === '/' ? 1 : 0.8,
      };
    });
  } catch (error) {
    console.error('Error generating sitemap:', error);
    // Fallback sitemap if backend is unreachable
    return [
      {
        url: 'https://pbtadka.com',
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
      }
    ];
  }
}
