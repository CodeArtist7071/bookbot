import React from "react";

const PlatformSettings = () => {
  return (
    <div className="min-h-screen flex flex-col font-[Inter] bg-[#f8f9fc] text-[#191b23]">
      {/* Main Content */}
      <main className="flex-1 pb-24">

        {/* Header */}
        <header className="flex items-center bg-surface-container-lowest px-4 py-4 border-b border-border-light sticky top-0 z-10">
          <button className="mr-4 p-2 rounded-full hover:bg-surface-container">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>

          <h1 className="text-xl font-semibold">Platform Settings</h1>

          <div className="ml-auto">
            <button className="bg-primary text-white px-4 py-2 rounded-lg shadow-sm hover:opacity-90">
              Save Changes
            </button>
          </div>
        </header>

        <div className="max-w-[800px] mx-auto px-4 mt-6 flex flex-col gap-8">

          {/* System Health */}
          <section>
            <h2 className="uppercase text-sm text-gray-500 mb-4">System Health</h2>

            <div className="bg-white rounded-xl border shadow-sm overflow-hidden">

              {/* Maintenance */}
              <div className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center gap-4">
                  <span className="material-symbols-outlined">settings_suggest</span>
                  <div>
                    <p className="font-semibold">Maintenance Mode</p>
                    <p className="text-sm text-gray-500">Take platform offline</p>
                  </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-300 peer-checked:bg-blue-600 rounded-full relative after:content-[''] after:absolute after:h-5 after:w-5 after:bg-white after:rounded-full after:top-[2px] after:left-[2px] peer-checked:after:translate-x-full"></div>
                </label>
              </div>

              {/* Status Page */}
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-4">
                  <span className="material-symbols-outlined">analytics</span>
                  <div>
                    <p className="font-semibold">System Status Page</p>
                    <p className="text-sm text-gray-500">Public uptime dashboard</p>
                  </div>
                </div>

                <span className="material-symbols-outlined text-gray-400">
                  open_in_new
                </span>
              </div>

            </div>
          </section>

          {/* API Integrations */}
          <section>
            <h2 className="uppercase text-sm text-gray-500 mb-4">
              Integrations & APIs
            </h2>

            <div className="bg-white rounded-xl border shadow-sm divide-y">

              {/* WhatsApp */}
              <div className="flex justify-between p-4 hover:bg-gray-50 cursor-pointer">
                <div className="flex gap-4">
                  <span className="material-symbols-outlined">key</span>
                  <div>
                    <p className="font-medium">Meta WhatsApp Cloud API</p>
                    <p className="text-sm text-gray-500">
                      Configure API keys & webhooks
                    </p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-gray-400">
                  chevron_right
                </span>
              </div>

              {/* Stripe */}
              <div className="flex justify-between p-4 hover:bg-gray-50 cursor-pointer">
                <div className="flex gap-4">
                  <span className="material-symbols-outlined">payments</span>
                  <div>
                    <p className="font-medium">Stripe Connect</p>
                    <p className="text-sm text-gray-500">
                      Manage payments & fees
                    </p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-gray-400">
                  chevron_right
                </span>
              </div>

            </div>
          </section>

          {/* Support */}
          <section>
            <h2 className="uppercase text-sm text-gray-500 mb-4">
              Support & Contact
            </h2>

            <div className="bg-white p-4 rounded-xl border shadow-sm space-y-4">

              <input
                className="w-full border p-2 rounded-lg"
                placeholder="Support Email"
                type="email"
              />

              <input
                className="w-full border p-2 rounded-lg"
                placeholder="Emergency Phone"
              />

              <input
                className="w-full border p-2 rounded-lg"
                placeholder="Help Center URL"
              />

            </div>
          </section>

          {/* Danger Zone */}
          <section>
            <div className="bg-red-50 border border-red-200 p-6 rounded-xl">
              <h3 className="text-red-600 font-bold">Danger Zone</h3>
              <p className="text-sm text-red-500 mb-4">
                These actions are irreversible
              </p>

              <div className="flex gap-4">
                <button className="border border-red-500 text-red-500 px-4 py-2 rounded-lg">
                  Purge Cache
                </button>

                <button className="bg-red-500 text-white px-4 py-2 rounded-lg">
                  Factory Reset
                </button>
              </div>
            </div>
          </section>

        </div>
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 w-full bg-white border-t flex justify-around py-2">
        <NavItem icon="dashboard" label="Dashboard" />
        <NavItem icon="people" label="Users" />
        <NavItem icon="book" label="Content" />
        <NavItem icon="settings" label="Settings" active />
      </nav>
    </div>
  );
};

const NavItem = ({
  icon,
  label,
  active = false,
}: {
  icon: string;
  label: string;
  active?: boolean;
}) => {
  return (
    <div className={`flex flex-col items-center text-xs ${active ? "text-black" : "text-gray-500"}`}>
      <span className="material-symbols-outlined">{icon}</span>
      {label}
    </div>
  );
};

export default PlatformSettings;