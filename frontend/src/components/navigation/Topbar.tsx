import React from 'react';
import { Bell, User } from 'lucide-react';

const Topbar: React.FC = () => {
  return (
    <header className="h-16 bg-white border-b px-6 flex items-center justify-between">
      <h2 className="text-xl font-semibold text-gray-800">Dashboard</h2>

      <div className="flex items-center gap-4">
        <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full">
          <Bell size={20} />
        </button>

        <div className="flex items-center gap-2 border-l pl-4 ml-2">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
            JD
          </div>
          <span className="text-sm font-medium text-gray-700">John Doe</span>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
