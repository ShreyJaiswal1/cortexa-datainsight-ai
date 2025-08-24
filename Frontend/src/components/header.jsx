'use client';

import { UserButton } from '@clerk/nextjs';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useTheme } from 'next-themes';
import { Menu } from 'lucide-react';
import { Sun, Moon } from 'lucide-react';

export default function Header() {
  const { theme, setTheme } = useTheme();
  return (
    <header className='fixed top-0 left-0 right-0 z-50 border-b border-border bg-gradient-to-r from-background/80 via-background/60 to-background/80 backdrop-blur-lg dark:bg-gray-900/70'>
      <div className='max-w-6xl mx-auto px-6 py-4 flex justify-between items-center'>
        {/* Logo */}
        <h1 className='text-2xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent cursor-pointer hover:scale-105 transition-transform'>
          Cortexa
        </h1>

        {/* Desktop Navigation */}
        <div className='hidden sm:flex items-center gap-6'>
          <nav className='flex items-center gap-6 text-sm font-medium'>
            <a href='#features' className='relative group transition-colors'>
              <span className='hover:text-primary'>Features</span>
              <span className='absolute left-0 -bottom-1 h-[2px] w-0 bg-primary transition-all group-hover:w-full'></span>
            </a>
            <a href='#pricing' className='relative group transition-colors'>
              <span className='hover:text-primary'>Pricing</span>
              <span className='absolute left-0 -bottom-1 h-[2px] w-0 bg-primary transition-all group-hover:w-full'></span>
            </a>
            <a href='#about' className='relative group transition-colors'>
              <span className='hover:text-primary'>About</span>
              <span className='absolute left-0 -bottom-1 h-[2px] w-0 bg-primary transition-all group-hover:w-full'></span>
            </a>
          </nav>
          <div className='flex items-center gap-4'>
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
            <UserButton afterSignOutRedirectUrl='/' />
          </div>
        </div>

        {/* Mobile Menu */}
        <div className='sm:hidden flex items-center gap-3'>
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
          <Sheet>
            <SheetTrigger asChild>
              <button className='p-2 rounded-md hover:bg-muted/70 transition'>
                <Menu className='w-6 h-6' />
              </button>
            </SheetTrigger>
            <SheetContent side='right' className='flex flex-col gap-6 p-6'>
              <nav className='flex flex-col gap-4 text-lg font-medium'>
                <a
                  href='#features'
                  className='hover:text-primary transition-colors'
                >
                  Features
                </a>
                <a
                  href='#pricing'
                  className='hover:text-primary transition-colors'
                >
                  Pricing
                </a>
                <a
                  href='#about'
                  className='hover:text-primary transition-colors'
                >
                  About
                </a>
              </nav>
              <div className='mt-auto'>
                <UserButton afterSignOutRedirectUrl='/' />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
