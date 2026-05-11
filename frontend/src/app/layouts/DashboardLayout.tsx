import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../../components/navigation/Sidebar';
import Topbar from '../../components/navigation/Topbar';
import MobileLayout from './MobileLayout';

const DashboardLayout: React.FC = () => {
  useEffect(() => {
    const setAppHeight = () => {
      document.documentElement.style.setProperty('--app-height', `${window.innerHeight}px`);
    };

    setAppHeight();
    window.addEventListener('resize', setAppHeight);

    return () => window.removeEventListener('resize', setAppHeight);
  }, []);

  return (
    <div className="flex bg-gray-50" style={{ minHeight: 'var(--app-height)' }}>
      <Sidebar />

      <div className="flex-grow flex flex-col" style={{ minHeight: 'var(--app-height)' }}>
        <Topbar />

        <main className="pt-20 p-8 pb-28 md:pb-8 flex-grow">
          <Outlet />
        </main>
      </div>

      <MobileLayout />
    </div>
  );
};

export default DashboardLayout;
