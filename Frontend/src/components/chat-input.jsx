'use client';
import { Paperclip, Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import TextareaAutosize from 'react-textarea-autosize';

export function ChatInput({
  input,
  setInput,
  handleSendMessage,
  handleFileUpload,
  isLoading,
  fileInputRef,
}) {
  const handleUploadButtonClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className='w-full flex justify-center p-4'>
      <form
        onSubmit={handleSendMessage}
        className='w-full max-w-2xl flex items-end rounded-2xl border bg-background px-3 py-2 shadow-sm focus-within:ring-2 focus-within:ring-ring dark:bg-cyan-200/10'
      >
        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type='file'
          onChange={handleFileUpload}
          className='hidden'
        />

        {/* Textarea */}
        <TextareaAutosize
          minRows={1}
          maxRows={6}
          placeholder='Send a message...'
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isLoading}
          className='w-full resize-none bg-transparent px-2 py-1 text-sm focus:outline-none'
        />

        {/* Action Buttons */}
        <div className='flex items-center gap-1 pb-1'>
          <Button
            variant='ghost'
            size='icon'
            type='button'
            onClick={handleUploadButtonClick}
            className='h-8 w-8'
          >
            <Paperclip className='h-4 w-4' />
          </Button>

          <Button
            type='submit'
            size='icon'
            disabled={isLoading || !input.trim()}
            className='h-8 w-8'
          >
            {isLoading ? (
              <Loader2 className='h-4 w-4 animate-spin' />
            ) : (
              <Send className='h-4 w-4' />
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
