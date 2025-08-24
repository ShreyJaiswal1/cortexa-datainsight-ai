import { Poppins } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs';
import { ThemeProvider } from '@/components/theme-provider'; // Import ThemeProvider
import './globals.css';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-poppins',
});
// src/app/layout.js
export const metadata = {
  title: {
    default: 'Cortexa',
    template: '%s | Cortexa',
  },
  description: 'Smart AI powered data analysis tool',
  icons: {
    icon: [
      // 16x16 / 32x32
      { url: '../../public/logo.png', type: 'image/png' }, // 32x32 or 64x64
    ],
  },
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider
      appearance={{
        theme: 'simple',
      }}
    >
      <html lang='en' className={poppins.variable} suppressHydrationWarning>
        <body>
          <ThemeProvider
            attribute='class'
            defaultTheme='system'
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
