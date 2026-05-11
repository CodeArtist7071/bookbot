import React from "react";
import { Link } from "react-router-dom";
import { Bell, Settings, User } from "lucide-react";

const Topbar: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b px-6 flex items-center justify-between z-50">
      <h2 className="text-xl font-semibold text-gray-800">Dashboard</h2>

      <div className="flex items-center gap-4">
        {/* <Link 
          to="/dashboard/settings" 
          className="p-2 text-gray-500 hover:bg-gray-100 rounded-full hover:text-gray-700 transition-colors"
          title="Settings"
        >
          <Settings size={20} />
        </Link> */}

        <div className="flex items-center gap-2 border-l pl-4 ml-2">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
            JD
          </div>
          <span className="hidden md:block text-sm font-medium text-gray-700">
            John Doe
          </span>
          <button
            className="absolute p-2 right-0 top-0 text-gray-500 hover:bg-gray-100 rounded-full hover:text-gray-700 transition-colors md:hidden"
            title="Notifications"
          >
            <Bell size={15} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
