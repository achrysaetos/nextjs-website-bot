import { useRef, useState, useEffect, useMemo } from 'react';
import Button from '@/components/ui/Button/Button';

interface LayoutProps {
  children?: React.ReactNode;
}

export default function ChatLayout({ children }: LayoutProps) {

  const [urls, setUrls] = useState<string[]>([
    'https://thomasjfrank.com/creator/the-ultimate-guide-to-website-speed/',
  ]);

  // api call to train the bot
  const trainBot = async (urls: string[]) => {
    try {
      const path = '/api/scrape-embed';
      const res: Response = await fetch(path, {
        method: 'POST',
        headers: new Headers({ 'Content-Type': 'application/json' }),
        credentials: 'same-origin',
        body: JSON.stringify(urls)
      });
      if (!res.ok) {
        console.log('Error in postData', { path, urls, res });
        throw Error(res.statusText);
      }
      return res.json();
    } catch (error) {
      return alert((error as Error)?.message);
    } finally {
      console.log('bot trained');
      // setPriceIdLoading(undefined);
    }
  };

  return (
    <div className="mx-auto h-screen flex items-center justify-center flex-col space-y-4">
      <div className="container">
        <main className="flex w-full flex-1 flex-col overflow-hidden">
          <h1 className="text-2xl font-bold leading-[1.1] tracking-tighter text-center">
            Chatterup Support
          </h1>

          <Button onClick={() => trainBot(urls)}>Train Bot</Button>

          {children}

          <footer className="m-auto">
            <a href="#">
              Powered by ChatGPT. Copyright © 2022 Chatterup.
            </a>
          </footer>
        </main>
      </div>
    </div>
  );
}
