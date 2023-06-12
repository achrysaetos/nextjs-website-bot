interface LayoutProps {
  children?: React.ReactNode;
}

export default function ChatLayout({ children }: LayoutProps) {
  return (
    <div className="mx-auto h-screen flex items-center justify-center flex-col space-y-4">
      <div className="container">
        <main className="flex w-full flex-1 flex-col overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
