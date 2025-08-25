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
  const handleUploadButtonClick = () => fileInputRef?.current?.click();

  const onKeyDown = (e) => {
    // Enter to send, Shift+Enter for newline
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!isLoading && input.trim()) {
        // submit the parent form
        e.currentTarget.form?.dispatchEvent(
          new Event('submit', { cancelable: true, bubbles: true })
        );
      }
    }
  };

  return (
    <div className='w-full'>
      <form
        onSubmit={handleSendMessage}
        className='
          mx-auto w-full max-w-3xl
          rounded-2xl border border-border bg-background/95 backdrop-blur
          px-3 py-2 shadow-sm
          focus-within:ring-1 focus-within:ring-primary
        '
      >
        {/* hidden file input */}
        <input
          ref={fileInputRef}
          type='file'
          onChange={handleFileUpload}
          className='hidden'
          // accept common images & data types you support
          accept='.png,.jpg,.jpeg,.webp,.csv,.xlsx,.xls,.json,.parquet'
        />

        <div className='flex items-end gap-1'>
          {/* multiline textarea */}
          <TextareaAutosize
            minRows={1}
            maxRows={8}
            placeholder='Send a message…'
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            disabled={isLoading}
            className='
              grow resize-none bg-transparent
              px-2 py-2 text-sm leading-6
              placeholder:text-muted-foreground/70
              focus:outline-none
            '
          />

          {/* actions */}
          <div className='flex items-center gap-1 pb-1'>
            <Button
              variant='ghost'
              size='icon'
              type='button'
              onClick={handleUploadButtonClick}
              disabled={isLoading}
              className='h-8 w-8 rounded-xl'
              aria-label='Attach a file'
              title='Attach a file'
            >
              <Paperclip className='h-4 w-4' />
            </Button>

            <Button
              type='submit'
              size='icon'
              disabled={isLoading || !input.trim()}
              className='h-8 w-8 rounded-xl'
              aria-label='Send message'
              title='Send (Enter)'
            >
              {isLoading ? (
                <Loader2 className='h-4 w-4 animate-spin' />
              ) : (
                <Send className='h-4 w-4' />
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
