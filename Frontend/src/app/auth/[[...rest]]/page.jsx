'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { Sun, Moon, Home } from 'lucide-react';
import { SignIn, SignUp } from '@clerk/nextjs';

export default function AuthPage() {
  const { theme, setTheme } = useTheme();
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [mode, setMode] = useState('signin');

  useEffect(() => setMounted(true), []);

  // Redirect if already signed in
  useEffect(() => {
    if (isLoaded && isSignedIn) router.replace('/dashboard');
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded || isSignedIn) return null;

  return (
    <main className='relative min-h-screen flex flex-col overflow-hidden'>
      {/* Aurora Background */}
      <div className='absolute inset-0 -z-10'>
        <div className='aurora absolute inset-0' />
      </div>

      <header className='w-full border-b border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-900/70 backdrop-blur relative z-10'>
        <div className='max-w-6xl mx-auto px-6 py-4 flex justify-between items-center'>
          <h1 className='text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400'>
            Cortexa
          </h1>

          <div className='flex items-center gap-3'>
            {/* Home Button - transparent */}
            <button
              onClick={() => router.push('/')}
              className='flex items-center gap-1 px-3 py-1.5 rounded-xl border border-blue-600 text-blue-600 hover:bg-blue-600/10 transition'
            >
              <Home className='h-4 w-4' />
              Home
            </button>

            {/* Theme Toggle */}
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
        </div>
      </header>

      <div className='flex-grow flex items-center justify-center px-4 relative z-10'>
        <div className='w-full max-w-md bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-md p-6'>
          {/* Tabs with sliding indicator */}
          <div className='mb-4'>
            <div className='relative grid grid-cols-2 p-1 rounded-xl bg-gray-100 dark:bg-gray-700'>
              {/* Sliding pill */}
              <span
                className={`absolute inset-y-1 left-1 w-[calc(50%-0.25rem)] rounded-lg bg-white dark:bg-gray-800 shadow transition-transform duration-300 ease-out ${
                  mode === 'signin' ? 'translate-x-0' : 'translate-x-full'
                }`}
              />
              <button
                onClick={() => setMode('signin')}
                className={`relative z-10 py-2 text-center font-medium transition-colors ${
                  mode === 'signin'
                    ? 'text-gray-900 dark:text-white'
                    : 'text-gray-600 dark:text-gray-300'
                }`}
                aria-selected={mode === 'signin'}
                role='tab'
              >
                Sign in
              </button>
              <button
                onClick={() => setMode('signup')}
                className={`relative z-10 py-2 text-center font-medium transition-colors ${
                  mode === 'signup'
                    ? 'text-gray-900 dark:text-white'
                    : 'text-gray-600 dark:text-gray-300'
                }`}
                aria-selected={mode === 'signup'}
                role='tab'
              >
                Sign up
              </button>
            </div>
          </div>

          {/* Animated content swap */}
          <div key={mode} className='animate-[fadeIn_.2s_ease]'>
            {mode === 'signin' ? (
              <SignIn
                path='/auth'
                routing='path'
                signUpUrl='/auth'
                fallbackRedirectUrl='/dashboard'
                appearance={{
                  elements: {
                    footer: 'hidden',
                    footerAction: 'hidden',
                    footerActionText: 'hidden',
                    footerActionLink: 'hidden',
                    cardFooter: 'hidden',
                  },
                }}
              />
            ) : (
              <SignUp
                path='/auth'
                routing='path'
                signInUrl='/auth'
                fallbackRedirectUrl='/dashboard'
                appearance={{
                  elements: {
                    footer: 'hidden',
                    footerAction: 'hidden',
                    footerActionText: 'hidden',
                    footerActionLink: 'hidden',
                    cardFooter: 'hidden',
                  },
                }}
              />
            )}
          </div>
        </div>
      </div>

      {/* Aurora + fade keyframes */}
      <style jsx>{`
        .aurora {
          background: radial-gradient(
              ellipse at top left,
              #4f46e5,
              transparent 60%
            ),
            radial-gradient(ellipse at bottom right, #06b6d4, transparent 60%),
            radial-gradient(ellipse at top right, #ec4899, transparent 60%),
            radial-gradient(ellipse at bottom left, #22c55e, transparent 60%);
          background-blend-mode: screen;
          filter: blur(100px);
          animation: aurora-move 20s ease-in-out infinite alternate;
        }
        @keyframes aurora-move {
          0% {
            transform: translate(-10%, -10%) scale(1);
          }
          50% {
            transform: translate(10%, 10%) scale(1.2);
          }
          100% {
            transform: translate(-10%, -5%) scale(1);
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </main>
  );
}
