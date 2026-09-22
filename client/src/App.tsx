import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { MainContent } from '@/components/layout/MainContent';

export function App(): JSX.Element {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <>
      <Header onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <MainContent>
        <Outlet />
      </MainContent>
    </>
  );
}

// Made with Bob
