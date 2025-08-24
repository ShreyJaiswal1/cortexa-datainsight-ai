'use client';
import { AnalysisCard } from '@/components/analysis-card';
import ReactMarkdown from 'react-markdown';

export function Message({ msg }) {
  const renderContent = () => {
    if (msg.contentType === 'analysis') {
      return <AnalysisCard analysisData={msg.content} />;
    } else if (msg.contentType === 'file' && msg.fileType === 'image') {
      return (
        <div className='flex flex-col items-center'>
          <img
            src={msg.fileUrl}
            alt='Uploaded image'
            className='rounded-xl w-full max-w-xs object-contain'
          />
          <p className='mt-2 text-xs text-center break-words'>{msg.content}</p>
        </div>
      );
    } else {
      return (
        <div className='prose prose-sm dark:prose-invert max-w-none'>
          <ReactMarkdown>{String(msg.content)}</ReactMarkdown>
        </div>
      );
    }
  };

  return (
    <div className='w-full flex justify-center'>
      {/* Centered container for all messages */}
      <div
        className={`flex ${
          msg.type === 'user' ? 'justify-end' : 'justify-start'
        } w-full max-w-6xl mx-auto`}
      >
        <div
          className={`p-3 rounded-xl max-w-lg ${
            msg.type === 'user'
              ? 'bg-blue-400/40 text-black dark:bg-cyan-200/10 dark:text-white'
              : 'bg-muted text-foreground'
          }`}
        >
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
