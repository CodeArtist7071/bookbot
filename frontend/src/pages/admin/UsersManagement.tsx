import React from "react";

const UserManagement = () => {
  return (
    <div className="min-h-screen flex flex-col font-['Inter'] bg-[#faf8ff] text-[#191b23]">
      {/* Top Navigation Bar */}
      <header className="flex items-center bg-surface-container-lowest border-b border-border-light p-4 justify-between sticky top-0 z-50">
        <div className="flex items-center">
          <span className="material-symbols-outlined text-on-surface">
            list
          </span>
        </div>

        <h2 className="text-lg font-bold flex-1 ml-2 font-['Manrope']">
          User Management
        </h2>

        <button className="h-12 w-12 flex items-center justify-center">
          <span className="material-symbols-outlined">doorbell</span>
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-[1280px] mx-auto w-full px-4 py-6 flex flex-col gap-6">
        {/* Search */}
        <div>
          <div className="flex items-center border border-border-light rounded-xl bg-white h-12 px-4">
            <span className="material-symbols-outlined text-gray-500">
              search
            </span>
            <input
              className="w-full bg-transparent outline-none px-4"
              placeholder="Search business accounts by name or email"
            />
          </div>
        </div>

        {/* Filter Chips */}
        <div className="flex gap-3 overflow-x-auto">
          <button className="h-10 px-5 rounded-full bg-blue-600 text-white">
            All Accounts
          </button>
          <button className="h-10 px-5 rounded-full border">
            Active
          </button>
          <button className="h-10 px-5 rounded-full border">
            Trial
          </button>
          <button className="h-10 px-5 rounded-full border">
            Suspended
          </button>
        </div>

        {/* Section Header */}
        <div className="flex justify-between items-end">
          <div>
            <h3 className="text-xl font-bold">Business Accounts</h3>
            <p className="text-gray-500 text-sm">
              Showing 128 registered businesses
            </p>
          </div>

          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">add</span>
            New Account
          </button>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card Example */}
          <div className="bg-white border rounded-xl p-5 flex flex-col gap-4 shadow-sm">
            <div className="flex justify-between items-start">
              <div className="w-12 h-12 rounded-lg bg-blue-100" />
              <span className="text-xs px-3 py-1 rounded-full bg-green-100 text-green-700">
                Active
              </span>
            </div>

            <div>
              <h4 className="font-bold text-lg">Lumina Day Spa</h4>
              <p className="text-sm text-gray-500">contact@lumina-spa.com</p>
            </div>

            <div className="border-t pt-4 text-sm flex flex-col gap-2">
              <div className="flex justify-between">
                <span className="text-gray-500">Plan</span>
                <span className="font-semibold">Premium</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Users</span>
                <span className="font-semibold">12 Staff</span>
              </div>
            </div>

            <button className="border border-blue-600 text-blue-600 py-2 rounded-lg">
              Manage Account
            </button>
          </div>

          {/* You can duplicate cards here for remaining users */}
        </div>

        {/* Pagination */}
        <div className="flex justify-center gap-2 py-6">
          <button className="border px-3 py-1 rounded">Prev</button>
          <button className="bg-blue-600 text-white px-3 py-1 rounded">
            1
          </button>
          <button className="border px-3 py-1 rounded">2</button>
          <button className="border px-3 py-1 rounded">Next</button>
        </div>
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around py-2">
        <div className="text-center">
          <span className="material-symbols-outlined">group</span>
          <p className="text-xs">Users</p>
        </div>
        <div className="text-center">
          <span className="material-symbols-outlined">bar_chart</span>
          <p className="text-xs">Analytics</p>
        </div>
        <div className="text-center">
          <span className="material-symbols-outlined">credit_card</span>
          <p className="text-xs">Plans</p>
        </div>
        <div className="text-center">
          <span className="material-symbols-outlined">settings</span>
          <p className="text-xs">Settings</p>
        </div>
      </nav>

      <div className="h-16" />
    </div>
  );
};

export default UserManagement;