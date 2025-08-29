'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { UserButton } from '@clerk/nextjs';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useTheme } from 'next-themes';
import { Menu, Sun, Moon } from 'lucide-react';

export default function Header() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <header className='fixed inset-x-0 top-0 z-50 border-b border-border/40 bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:bg-[#111828]'>
      <div className='mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6'>
        {/* Brand */}
        <Link href='/' className='flex items-center gap-2'>
          <span className='text-xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent'>
            Cortexa
          </span>
        </Link>

        {/* Desktop nav */}
        <div className='hidden sm:flex items-center gap-6'>
          <nav className='flex items-center gap-6 text-sm font-medium text-foreground/80'>
            <a
              href='https://github.com/ShreyJaiswal1/cortexa-datainsight-ai'
              target='_blank'
              rel='noopener noreferrer'
              className='group relative transition-colors hover:text-foreground'
            >
              GitHub
              <span className='pointer-events-none absolute left-0 -bottom-1 h-[2px] w-0 bg-primary transition-all duration-300 group-hover:w-full' />
            </a>
            <a
              href='https://discord.com/invite/BCKjPjhBrm'
              target='_blank'
              rel='noopener noreferrer'
              className='group relative transition-colors hover:text-foreground'
            >
              Discord
              <span className='pointer-events-none absolute left-0 -bottom-1 h-[2px] w-0 bg-primary transition-all duration-300 group-hover:w-full' />
            </a>
          </nav>

          <div className='ml-2 flex items-center gap-3'>
            {/* Theme toggle */}
            {mounted && (
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className='inline-grid h-9 w-9 place-items-center rounded-lg border border-transparent hover:border-border/60 hover:bg-muted/60 transition-colors'
                aria-label='Toggle theme'
              >
                {theme === 'dark' ? (
                  <Sun className='h-4 w-4' />
                ) : (
                  <Moon className='h-4 w-4' />
                )}
              </button>
            )}
            <UserButton afterSignOutRedirectUrl='/' />
          </div>
        </div>

        {/* Mobile actions */}
        <div className='sm:hidden flex items-center gap-2'>
          {mounted && (
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className='inline-grid h-9 w-9 place-items-center rounded-lg border border-transparent hover:border-border/60 hover:bg-muted/60 transition-colors'
              aria-label='Toggle theme'
            >
              {theme === 'dark' ? (
                <Sun className='h-4 w-4' />
              ) : (
                <Moon className='h-4 w-4' />
              )}
            </button>
          )}

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button
                className='inline-grid h-9 w-9 place-items-center rounded-lg hover:bg-muted/70 transition-colors'
                aria-label='Open menu'
              >
                <Menu className='h-5 w-5' />
              </button>
            </SheetTrigger>
            <SheetContent side='right' className='flex flex-col gap-6 p-6'>
              <nav className='flex flex-col gap-4 text-base font-medium'>
                <a
                  href='https://github.com/ShreyJaiswal1/cortexa-datainsight-ai'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='hover:text-primary transition-colors'
                >
                  GitHub
                </a>
                <a
                  href='https://discord.com/invite/BCKjPjhBrm'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='hover:text-primary transition-colors'
                >
                  Discord
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
