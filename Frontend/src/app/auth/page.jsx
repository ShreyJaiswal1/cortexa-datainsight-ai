// src/app/auth/page.jsx
'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { Sun, Moon } from 'lucide-react';
import { SignIn, SignUp } from '@clerk/nextjs';

export default function AuthPage() {
  const { theme, setTheme } = useTheme();
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [mode, setMode] = useState('signin');

  useEffect(() => setMounted(true), []);

  // Optional: client-side safety redirect if already signed in
  useEffect(() => {
    if (isLoaded && isSignedIn) router.replace('/dashboard');
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded || isSignedIn) return null;

  return (
    <main className='min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900'>
      <header className='w-full border-b border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-900/70 backdrop-blur'>
        <div className='max-w-6xl mx-auto px-6 py-4 flex justify-between items-center'>
          <h1 className='text-xl font-bold text-gray-900 dark:text-gray-100'>
            Cortexa
          </h1>
          <button
            onClick={() =>
              mounted && setTheme(theme === 'dark' ? 'light' : 'dark')
            }
            className='p-2 rounded-xl bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition'
            aria-label='Toggle theme'
          >
            {!mounted ? (
              <div className='h-5 w-5' />
            ) : theme === 'dark' ? (
              <Sun className='h-5 w-5 text-yellow-400' />
            ) : (
              <Moon className='h-5 w-5 text-gray-800' />
            )}
          </button>
        </div>
      </header>

      <div className='flex-grow flex items-center justify-center px-4'>
        <div className='w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6'>
          <div className='mb-4 flex rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden'>
            <button
              onClick={() => setMode('signin')}
              className={`w-1/2 py-2 text-center ${
                mode === 'signin'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
              }`}
            >
              Sign in
            </button>
            <button
              onClick={() => setMode('signup')}
              className={`w-1/2 py-2 text-center ${
                mode === 'signup'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
              }`}
            >
              Sign up
            </button>
          </div>

          {mode === 'signin' ? (
            <SignIn
              path='/auth'
              routing='path'
              signUpUrl='/auth'
              fallbackRedirectUrl='/dashboard'
            />
          ) : (
            <SignUp
              path='/auth'
              routing='path'
              signInUrl='/auth'
              fallbackRedirectUrl='/dashboard'
            />
          )}
        </div>
      </div>
    </main>
  );
}
