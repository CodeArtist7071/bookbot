import React from 'react';
import { Outlet, Link } from 'react-router-dom';

const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-2 lg:px-2">
      {/* <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link to="/" className="flex justify-center items-center gap-3 mb-6">
          <span className="text-4xl">🤖</span>
          <h2 className="text-3xl font-extrabold text-gray-900">BookBot</h2>
        </Link>
      </div> */}

      <div className="mt-8 mx-auto w-full md:w-2xl">
        <div className="py-8 px-2 sm:px-10">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
