import React, { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';

// Header/Footer will be moved here from LandingPage later
const LandingLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        <Outlet />
      </main>
    </div>
  );
};

export default LandingLayout;
