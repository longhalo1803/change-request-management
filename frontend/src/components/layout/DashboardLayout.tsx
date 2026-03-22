import React from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { Outlet } from 'react-router-dom';

interface LayoutProps {
  children?: React.ReactNode;
}

export const DashboardLayout = ({ children }: LayoutProps) => {
  return (
    <div className="flex h-screen bg-[#131417] text-gray-200 overflow-hidden font-sans antialiased">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto px-10 py-10 pb-20 scrollbar-hide">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
};
