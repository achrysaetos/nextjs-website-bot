import { useRef, useState, useEffect, useMemo } from 'react';
import Button from '@/components/ui/Button/Button';

interface LayoutProps {
  children?: React.ReactNode;
}

export default function ChatLayout({ children }: LayoutProps) {

  return (
    <div className="mx-auto h-screen flex items-center justify-start flex-col space-y-4">
      <div className="container">
        <main className="flex w-full flex-1 flex-col overflow-hidden">
          <h1 className="text-2xl font-bold leading-[1.1] tracking-tighter text-center">
            Chatterup Support
          </h1>

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
