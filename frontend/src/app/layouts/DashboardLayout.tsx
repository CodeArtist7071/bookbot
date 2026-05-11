import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../../components/navigation/Sidebar';
import Topbar from '../../components/navigation/Topbar';

const DashboardLayout: React.FC = () => {
  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />

      <div className="flex-grow flex flex-col">
        <Topbar />

        <main className="p-8 flex-grow">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
