import { Poppins } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import ClerkAppearance from '@/components/clerk-appearance';
import Script from 'next/script';
import './globals.css';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-poppins',
});

const SITE_URL = 'https://cortexa.lazyshrey.xyz';

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: 'Cortexa', template: '%s | Cortexa' },
  description: 'Smart AI-powered data analysis tool.',
  keywords: ['Cortexa', 'AI', 'data analysis', 'analytics', 'chat'],
  applicationName: 'Cortexa',
  category: 'technology',
  alternates: { canonical: '/' },
  icons: {
    icon: [{ url: '/logo.png', type: 'image/png' }],
    apple: [{ url: '/logo.png', sizes: '180x180' }],
  },
  openGraph: {
    type: 'website',
    url: SITE_URL + '/',
    title: 'Cortexa — AI-powered data analysis',
    description: 'Ask questions, analyze data, and act—fast.',
    siteName: 'Cortexa',
    locale: 'en_US',
    images: [{ url: '/logo.png', width: 1200, height: 630, alt: 'Cortexa' }],
  },
  robots: {
    index: true,
    follow: true,
    'max-image-preview': 'large',
    'max-snippet': -1,
    'max-video-preview': -1,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  verification: {
    google: 'u34mtd5063aDvCNTOBnt1pyh4E4SLu_WGF_wnPS9jro',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang='en' className={poppins.variable} suppressHydrationWarning>
      <body className='min-h-screen antialiased'>
        {/* a11y: skip to content */}
        <a
          href='#content'
          className='sr-only focus:not-sr-only focus:absolute focus:p-2'
        >
          Skip to content
        </a>

        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange
        >
          <ClerkAppearance
            publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
          >
            <main id='content'>{children}</main>
          </ClerkAppearance>
        </ThemeProvider>

        {/* JSON-LD: WebSite + Organization (tweak name/links as needed) */}
        <Script
          id='ld-website'
          type='application/ld+json'
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'Cortexa',
              url: SITE_URL + '/',
              inLanguage: 'en',
            }),
          }}
        />
      </body>
    </html>
  );
}
