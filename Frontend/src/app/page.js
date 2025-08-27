'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export default function HomePage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  function handleGetStarted() {
    window.location.href = '/sign-in';
  }

  function scrollToId(id) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <main className='relative min-h-screen overflow-hidden'>
      {/* Gradient Mesh Background */}
      <div className='absolute inset-0 -z-10 bg-gradient-to-b from-blue-50 via-white to-purple-50 dark:from-gray-950 dark:via-gray-900 dark:to-black'>
        <div className='absolute w-[40rem] h-[40rem] top-[-10rem] left-[-10rem] rounded-full bg-gradient-to-r from-blue-400/30 to-purple-400/30 blur-3xl animate-blob'></div>
        <div className='absolute w-[35rem] h-[35rem] bottom-[-8rem] right-[-8rem] rounded-full bg-gradient-to-r from-pink-400/30 to-yellow-300/30 blur-3xl animate-blob animation-delay-2000'></div>
        <div className='absolute w-[30rem] h-[30rem] top-[30%] left-[60%] rounded-full bg-gradient-to-r from-green-400/20 to-indigo-300/20 blur-3xl animate-blob animation-delay-4000'></div>
      </div>

      {/* Header */}
      <header className='sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-900/70 backdrop-blur'>
        <div className='max-w-6xl mx-auto px-6 py-4 flex justify-between items-center'>
          <h1 className='text-xl font-extrabold text-gray-900 dark:text-gray-100'>
            <span className='bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400'>
              Cortexa
            </span>
          </h1>

          <div className='flex items-center gap-6'>
            <nav className='hidden md:flex gap-6 text-gray-700 dark:text-gray-300'>
              <button
                onClick={() => scrollToId('features')}
                className='hover:text-blue-600 dark:hover:text-blue-400'
              >
                Features
              </button>
              <button
                onClick={() => scrollToId('how')}
                className='hover:text-blue-600 dark:hover:text-blue-400'
              >
                How it works
              </button>
              <button
                onClick={() => scrollToId('security')}
                className='hover:text-blue-600 dark:hover:text-blue-400'
              >
                Security
              </button>
              <button
                onClick={() => scrollToId('faq')}
                className='hover:text-blue-600 dark:hover:text-blue-400'
              >
                FAQ
              </button>
            </nav>

            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className='p-2 rounded-xl bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition'
              aria-label='Toggle theme'
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

      {/* Hero */}
      <section className='max-w-6xl mx-auto px-6 py-20 text-center relative z-10'>
        <h2 className='text-4xl md:text-6xl font-extrabold text-gray-900 dark:text-gray-100 mb-6'>
          Welcome to{' '}
          <span className='text-blue-600 dark:text-blue-400'>Cortexa</span>
        </h2>
        <p className='text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto mb-8'>
          Upload your dataset and chat with it. Get instant summaries, insights,
          and clear answers — all grounded in your own data.
        </p>
        <div className='flex justify-center gap-4'>
          <button
            className='px-6 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition'
            onClick={handleGetStarted}
          >
            Get Started
          </button>
          <button
            className='px-6 py-3 rounded-xl bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-700 transition'
            onClick={() => scrollToId('features')}
          >
            Learn More
          </button>
        </div>
      </section>

      {/* Features */}
      <section
        id='features'
        className='max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10'
      >
        <FeatureCard
          title='🚀 Fast answers'
          body='Summaries, describe stats, and quick insights in seconds — no notebooks required.'
        />
        <FeatureCard
          title='🔌 Bring your data'
          body='CSV, Excel, JSON, Parquet — just drop a file and chat with it.'
        />
        <FeatureCard
          title='🧠 Smart reasoning'
          body='Backed by Groq-hosted LLMs and pandas for grounded, data-aware responses.'
        />
      </section>

      {/* How it works */}
      <section id='how' className='max-w-6xl mx-auto px-6 py-16 relative z-10'>
        <h3 className='text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6'>
          How it works
        </h3>
        <ol className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          <Step
            num='1'
            title='Upload'
            body='Drop a CSV/XLSX/JSON/Parquet file. We load it into memory for fast analysis.'
          />
          <Step
            num='2'
            title='Analyze'
            body='We compute describe() stats, shape, and missingness right away.'
          />
          <Step
            num='3'
            title='Chat'
            body='Ask questions in plain English — get answers backed by your data.'
          />
        </ol>

        <div className='mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm'>
          <PillList
            title='Supported formats'
            items={['CSV', 'Excel', 'JSON', 'Parquet']}
          />
          <PillList
            title='Built with'
            items={[
              'Next.js',
              'Tailwind',
              'Clerk',
              'FastAPI',
              'Pandas',
              'Groq',
            ]}
          />
          <PillList
            title='Questions you can ask'
            items={[
              'Summarize columns',
              'Find missing values',
              'Show distributions',
              'Compare groups',
            ]}
          />
        </div>
      </section>

      {/* Security */}
      <section
        id='security'
        className='max-w-6xl mx-auto px-6 py-16 relative z-10'
      >
        <h3 className='text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4'>
          Security & Privacy
        </h3>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div className='p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'>
            <h4 className='font-semibold mb-2'>🔒 Authentication</h4>
            <p className='text-gray-600 dark:text-gray-400'>
              Clerk handles sign-in and protects user sessions securely.
            </p>
          </div>
          <div className='p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'>
            <h4 className='font-semibold mb-2'>🗄️ Data stays in memory</h4>
            <p className='text-gray-600 dark:text-gray-400'>
              Your file is never stored permanently — only held temporarily in
              memory for analysis.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id='faq' className='max-w-6xl mx-auto px-6 py-16 relative z-10'>
        <h3 className='text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6'>
          Frequently Asked Questions
        </h3>
        <ul className='space-y-4 text-gray-700 dark:text-gray-300'>
          <li>
            <strong>What file formats can I upload?</strong> — CSV, Excel
            (xls/xlsx), JSON, and Parquet.
          </li>
          <li>
            <strong>Is my data secure?</strong> — Yes. Files are processed in
            memory only and discarded after use.
          </li>
          <li>
            <strong>What powers the analysis?</strong> — We use pandas for stats
            and Groq-hosted LLMs for natural language answers.
          </li>
          <li>
            <strong>Do I need coding skills?</strong> — No, just upload your
            file and start asking questions.
          </li>
        </ul>
      </section>

      {/* Footer */}
      <footer className='py-8 text-center text-gray-600 dark:text-gray-400 relative z-10'>
        © {new Date().getFullYear()} Cortexa. All rights reserved.
      </footer>

      {/* Background animations */}
      <style jsx>{`
        .animate-blob {
          animation: blob 20s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes blob {
          0%,
          100% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
      `}</style>
    </main>
  );
}

/* --- helper components --- */
function FeatureCard({ title, body }) {
  return (
    <div className='p-6 rounded-2xl shadow-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'>
      <h3 className='text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2'>
        {title}
      </h3>
      <p className='text-gray-600 dark:text-gray-400'>{body}</p>
    </div>
  );
}

function Step({ num, title, body }) {
  return (
    <li className='p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'>
      <div className='text-blue-600 dark:text-blue-400 font-bold mb-2'>
        {num}
      </div>
      <h4 className='font-semibold text-gray-900 dark:text-gray-100 mb-1'>
        {title}
      </h4>
      <p className='text-gray-600 dark:text-gray-400'>{body}</p>
    </li>
  );
}

function PillList({ title, items }) {
  return (
    <div>
      <h5 className='font-semibold text-gray-800 dark:text-gray-200 mb-2'>
        {title}
      </h5>
      <div className='flex flex-wrap gap-2'>
        {items.map((i) => (
          <span
            key={i}
            className='px-3 py-1 rounded-full bg-gray-200 dark:bg-gray-700 text-sm text-gray-800 dark:text-gray-200'
          >
            {i}
          </span>
        ))}
      </div>
    </div>
  );
}
