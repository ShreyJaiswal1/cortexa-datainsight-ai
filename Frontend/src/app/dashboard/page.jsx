import Header from '@/components/header';
import { ChatInterface } from '@/components/chat-interface';

export default function DashboardPage() {
  return (
    <div className='flex flex-col min-h-screen bg-white dark:bg-cyan-200 text-gray-900 dark:text-gray-100'>
      {/* Top Navigation */}
      <Header />

      {/* Chat Section */}
      <main className='flex-1 pt-16 flex flex-col overflow-hidden'>
        <ChatInterface />
      </main>
    </div>
  );
}
