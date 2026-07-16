import "./globals.css";
import Providers from "../components/Providers";
import Script from "next/script";
import { Montserrat, Open_Sans, Roboto } from 'next/font/google';

const montserrat = Montserrat({ subsets: ['latin'], weight: ['400', '700', '900'], variable: '--font-headline', display: 'swap' });
const openSans = Open_Sans({ subsets: ['latin'], weight: ['400', '600', '700'], variable: '--font-sans', display: 'swap' });
const roboto = Roboto({ subsets: ['latin'], weight: ['400', '700', '900'], variable: '--font-menu', display: 'swap' });

export const metadata = {
  title: "PB TADKA - Film News",
  description: "Latest film news, movie reviews, celebrity updates, and more at Pbtadka.",
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: "pZU5V9lFho27fnQXxHchm3MdmtIiSr3BOdGU8s13r4U",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${montserrat.variable} ${openSans.variable} ${roboto.variable}`}>
      <head>
        <link rel="icon" type="image/png" href="/favicon.png" />
        <link rel="preconnect" href="https://cdnjs.cloudflare.com" crossOrigin="anonymous" />
        <link 
            rel="stylesheet" 
            href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" 
            media="print" 
            onLoad="this.media='all'" 
        />
        <noscript>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
        </noscript>
        
        {/* Google Adsense */}
        <meta name="google-adsense-account" content="ca-pub-6214614018313479" />
        
        {/* Auto-Reload on Chunk Error */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.addEventListener('error', function(e) {
                var isChunkLoadError = e.message && (e.message.includes('ChunkLoadError') || e.message.includes('Failed to fetch'));
                var isScriptError = e.target && e.target.tagName === 'SCRIPT' && e.target.src && e.target.src.includes('/_next/static/chunks/');
                
                if (isChunkLoadError || isScriptError) {
                  if (!sessionStorage.getItem('chunk_reloaded')) {
                    sessionStorage.setItem('chunk_reloaded', 'true');
                    window.location.reload(true);
                  }
                }
              }, true);

              window.addEventListener('unhandledrejection', function(e) {
                if (e.reason && e.reason.message && (e.reason.message.includes('ChunkLoadError') || e.reason.message.includes('Failed to fetch'))) {
                  if (!sessionStorage.getItem('chunk_reloaded')) {
                    sessionStorage.setItem('chunk_reloaded', 'true');
                    window.location.reload(true);
                  }
                }
              });

              // Clear the reload flag after a successful load
              setTimeout(function() {
                sessionStorage.removeItem('chunk_reloaded');
              }, 5000);
            `,
          }}
        />
      </head>
      <body suppressHydrationWarning>
        <Providers>
          {children}
        </Providers>

        <Script 
            id="adsense"
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6214614018313479" 
            strategy="lazyOnload"
            crossOrigin="anonymous" 
        />

        <Script 
            id="ga-script"
            src="https://www.googletagmanager.com/gtag/js?id=G-QVGGSCFLGE" 
            strategy="lazyOnload" 
        />
        <Script id="ga-config" strategy="lazyOnload">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-QVGGSCFLGE');
            `}
        </Script>
      </body>
    </html>
  );
}
