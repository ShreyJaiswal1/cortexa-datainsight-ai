'use client';
import { Loader2 } from 'lucide-react';
import { Message } from './message';

export function MessageList({ messages, isLoading }) {
  return (
    <div className='flex-1 overflow-y-auto px-6 py-6 space-y-4'>
      {/* Empty state */}
      {messages.length === 0 && !isLoading && (
        <div className='flex h-full items-center justify-center'>
          <p className='text-muted-foreground text-center'>
            Start a conversation or upload a file...
          </p>
        </div>
      )}

      {/* Messages */}
      {messages.map((msg, index) => (
        <Message key={index} msg={msg} />
      ))}

      {/* Loading spinner */}
      {isLoading && (
        <div className='flex justify-center py-6'>
          <Loader2 className='h-6 w-6 animate-spin text-primary' />
        </div>
      )}
    </div>
  );
}
