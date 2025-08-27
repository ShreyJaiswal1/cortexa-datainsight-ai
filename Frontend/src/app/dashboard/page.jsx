import Header from '@/components/header';
import { ChatInterface } from '@/components/chat-interface';

export default function DashboardPage() {
  return (
    <div className='flex min-h-screen flex-col bg-background text-foreground'>
      <Header />
      {/* pad the content*/}
      <main className='flex-1 pt-[calc(theme(spacing.14)+env(safe-area-inset-top))] overflow-hidden'>
        <ChatInterface />
      </main>
    </div>
  );
}
