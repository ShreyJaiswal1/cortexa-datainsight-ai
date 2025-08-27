'use client';

import { AnalysisCard } from '@/components/analysis-card';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import ChartAnalysis from './chart-analysis';
export function Message({ msg }) {
  const isUser = msg.type === 'user';
  const isImage = msg.contentType === 'file' && msg.fileType === 'image';
  const isAnalysis = msg.contentType === 'analysis';
  const isChart = msg.contentType === 'chart';

  const bubbleBase =
    'rounded-2xl px-4 py-3 shadow-sm ring-1 ring-black/5 dark:ring-white/5';
  const bubbleTone = isUser
    ? 'bg-primary/15 text-foreground'
    : 'bg-muted text-foreground';

  const content = (() => {
    if (isAnalysis) {
      return (
        <div className='w-full'>
          <AnalysisCard analysisData={msg.content} />
        </div>
      );
    }
    if (isChart) {
      return (
        <ChartAnalysis data={msg.content} columns={msg.content.columns || []} />
      );
    }
    if (isImage) {
      return (
        <div className='flex flex-col items-center'>
          <img
            src={msg.fileUrl}
            alt='Uploaded image'
            className='max-h-[360px] w-full max-w-sm rounded-xl object-contain'
          />
          <p className='mt-2 text-xs text-muted-foreground text-center break-words'>
            {msg.content}
          </p>
        </div>
      );
    }

    return (
      <div className="prose prose-sm dark:prose-invert max-w-none prose-pre:whitespace-pre-wrap prose-pre:break-words prose-code:before:content-[''] prose-code:after:content-['']">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            a: (props) => (
              <a
                {...props}
                className='underline decoration-primary/60 hover:decoration-primary'
                target='_blank'
                rel='noreferrer'
              />
            ),
            pre: (props) => (
              <pre
                {...props}
                className='rounded-lg bg-background/60 p-3 border border-border overflow-x-auto'
              />
            ),
            code: (props) => (
              <code
                {...props}
                className='rounded bg-background/60 px-1 py-0.5'
              />
            ),
            ul: (props) => <ul {...props} className='list-disc pl-5' />,
            ol: (props) => <ol {...props} className='list-decimal pl-5' />,
          }}
        >
          {String(msg.content ?? '')}
        </ReactMarkdown>
      </div>
    );
  })();

  return (
    <div className='w-full px-4 sm:px-6'>
      <div className='mx-auto w-full max-w-3xl'>
        <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
          <div
            className={[
              bubbleBase,
              bubbleTone,
              isAnalysis
                ? 'max-w-full w-full p-0 ring-0 shadow-none dark:bg-neutral-950/20'
                : 'max-w-[min(85ch,100%)]',
            ].join(' ')}
          >
            {content}
          </div>
        </div>
      </div>
    </div>
  );
}
