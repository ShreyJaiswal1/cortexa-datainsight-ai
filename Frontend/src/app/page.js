'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export default function HomePage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Ensure theme loads after hydration
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
function handleClick() {
  window.location.href = '/dashboard';
}
  return (
    <main className='min-h-screen bg-gray-50 dark:bg-gray-900'>
      {/* Header */}
      <header className='w-full border-b border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-900/70 backdrop-blur sticky top-0 z-50'>
        <div className='max-w-6xl mx-auto px-6 py-4 flex justify-between items-center'>
          {/* Logo */}
          <h1 className='text-xl font-bold text-gray-900 dark:text-gray-100'>
            Cortexa
          </h1>

          {/* Navigation + Theme toggle */}
          <div className='flex items-center gap-6'>
            <nav className='hidden md:flex gap-6 text-gray-700 dark:text-gray-300'>
              <a
                href='#'
                className='hover:text-blue-600 dark:hover:text-blue-400'
              >
                Home
              </a>
              <a
                href='#'
                className='hover:text-blue-600 dark:hover:text-blue-400'
              >
                Features
              </a>
              <a
                href='#'
                className='hover:text-blue-600 dark:hover:text-blue-400'
              >
                About
              </a>
            </nav>

            {/* Theme Toggle Button */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className='p-2 rounded-xl bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition'
            >
              {theme === 'dark' ? (
                <Sun className='h-5 w-5 text-yellow-400' />
              ) : (
                <Moon className='h-5 w-5 text-gray-800' />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className='max-w-5xl mx-auto px-6 py-20 text-center'>
        <h2 className='text-4xl md:text-6xl font-extrabold text-gray-900 dark:text-gray-100 mb-6'>
          Welcome to{' '}
          <span className='text-blue-600 dark:text-blue-400'>Cortexa</span>
        </h2>
        <p className='text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto mb-8'>
          A modern platform built with Next.js, Clerk, and Tailwind CSS.
          Seamlessly switch between light and dark themes.
        </p>
        <div className='flex justify-center gap-4'>
          <button className='px-6 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition' onClick={handleClick}>
            Get Started
          </button>
          <button className='px-6 py-3 rounded-xl bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-700 transition'>
            Learn More
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className='max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-3 gap-8'>
        <div className='p-6 rounded-2xl shadow-md bg-white dark:bg-gray-800'>
          <h3 className='text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2'>
            🚀 Fast
          </h3>
          <p className='text-gray-600 dark:text-gray-400'>
            Optimized with Next.js for blazing fast performance.
          </p>
        </div>
        <div className='p-6 rounded-2xl shadow-md bg-white dark:bg-gray-800'>
          <h3 className='text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2'>
            🔒 Secure
          </h3>
          <p className='text-gray-600 dark:text-gray-400'>
            Clerk authentication keeps your users safe and signed in.
          </p>
        </div>
        <div className='p-6 rounded-2xl shadow-md bg-white dark:bg-gray-800'>
          <h3 className='text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2'>
            🎨 Themed
          </h3>
          <p className='text-gray-600 dark:text-gray-400'>
            Beautiful light & dark mode with Tailwind’s theme support.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className='py-8 text-center text-gray-600 dark:text-gray-400'>
        © {new Date().getFullYear()} Cortexa. All rights reserved.
      </footer>
    </main>
  );
}
