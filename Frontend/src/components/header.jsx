'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { UserButton } from '@clerk/nextjs';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useTheme } from 'next-themes';
import { Menu, Sun, Moon } from 'lucide-react';

/**
 * Cortexa Header — simple, elegant, on‑brand
 * - Keeps your existing structure: logo, 3 nav links, theme toggle, Clerk UserButton, mobile sheet
 * - Subtle glass + border, electric‑blue accents, refined spacing/hover states
 * - No extra features or new deps
 */
export default function Header() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <header className='fixed inset-x-0 top-0 z-50 border-b border-border/40 bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:bg-[111828]'>
      <div className='mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6'>
        {/* Brand */}
        <Link href='/' className='flex items-center gap-2'>
          <span className='text-xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-fuchsia-400 bg-clip-text text-transparent'>
            Cortexa
          </span>
        </Link>

        {/* Desktop nav */}
        <div className='hidden sm:flex items-center gap-6'>
          <nav className='flex items-center gap-6 text-sm font-medium text-foreground/80'>
            {[
              { href: '#features', label: 'Features' },
              { href: '#pricing', label: 'Pricing' },
              { href: '#about', label: 'About' },
            ].map((item) => (
              <a
                key={item.href}
                href={item.href}
                className='relative transition-colors hover:text-foreground'
              >
                {item.label}
                <span className='absolute left-0 -bottom-1 h-[2px] w-0 bg-primary transition-all duration-300 group-hover:w-full' />
              </a>
            ))}
          </nav>

          <div className='ml-2 flex items-center gap-3'>
            {/* Theme toggle (hydration-safe) */}
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

          <Sheet>
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
