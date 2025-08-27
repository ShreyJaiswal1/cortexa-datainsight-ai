import { Poppins } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import ClerkAppearance from '@/components/clerk-appearance';
import './globals.css';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-poppins',
});

export const metadata = {
  title: { default: 'Cortexa', template: '%s | Cortexa' },
  description: 'Smart AI powered data analysis tool',
  icons: { icon: [{ url: '/logo.png', type: 'image/png' }] },
};

export default function RootLayout({ children }) {
  return (
    <html lang='en' className={poppins.variable} suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange
        >
          <ClerkAppearance
            publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
          >
            {children}
          </ClerkAppearance>
        </ThemeProvider>
      </body>
    </html>
  );
}
