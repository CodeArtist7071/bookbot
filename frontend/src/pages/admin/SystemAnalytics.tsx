import React from "react";

const SystemAnalytics = () => {
  return (
    <div className="relative flex min-h-screen w-full flex-col bg-[#f8f9fc] overflow-x-hidden font-sans">
      
      {/* Header */}
      <div className="flex items-center p-4 pb-2 justify-between bg-[#f8f9fc]">
        <div className="w-12 h-12 flex items-center justify-center">
          <span className="material-symbols-outlined text-[#0e121b]">
            menu
          </span>
        </div>

        <h2 className="flex-1 text-lg font-bold text-[#0e121b]">
          System Analytics
        </h2>

        <div className="w-12 flex justify-end">
          <span className="material-symbols-outlined text-[#0e121b]">
            notifications
          </span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="border-b border-[#d0d7e7] flex gap-8 px-4">
        <Tab label="Last 7 Days" active />
        <Tab label="30 Days" />
        <Tab label="90 Days" />
      </div>

      {/* Metrics */}
      <div className="flex flex-wrap gap-4 p-4">
        <Card title="New Signups WoW" value="1,248" change="+12.5%" positive />
        <Card title="Churn Rate" value="2.14%" change="-0.8%" />
        <Card title="ARPU" value="$42.80" change="+4.2%" positive />
      </div>

      {/* Business Breakdown */}
      <div className="p-4">
        <h3 className="text-lg font-bold mb-4">
          Business Type Breakdown
        </h3>

        <div className="grid md:grid-cols-3 gap-4">
          <BusinessCard icon="content_cut" label="Salons" value="452" percent="36%" />
          <BusinessCard icon="medical_services" label="Clinics" value="312" percent="25%" />
          <BusinessCard icon="spa" label="Spas" value="288" percent="23%" />
        </div>
      </div>

      {/* WhatsApp Monitor */}
      <div className="p-4">
        <div className="bg-white border rounded-xl shadow-sm">
          
          <div className="p-5 border-b flex justify-between items-center bg-gray-50">
            <h3 className="font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-green-500">
                chat_bubble
              </span>
              WhatsApp API Usage Monitor
            </h3>

            <span className="text-xs text-green-600 font-bold flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              LIVE STATUS: OPTIMAL
            </span>
          </div>

          <div className="p-5 grid lg:grid-cols-2 gap-8">
            
            {/* Stats */}
            <div>
              <div className="mb-4">
                <div className="flex justify-between text-sm">
                  <span>Monthly Message Quota</span>
                  <span>842,000 / 1,000,000</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full mt-2">
                  <div className="h-2 bg-green-500 rounded-full w-[84%]"></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <SmallBox title="Avg Response Time" value="1.2s" />
                <SmallBox title="Delivery Rate" value="99.8%" />
              </div>
            </div>

            {/* Chart */}
            <div className="h-48 bg-gray-50 rounded-xl flex items-end gap-2 p-4">
              {[40, 60, 55, 80, 70, 90, 95].map((h, i) => (
                <div
                  key={i}
                  className="w-full bg-green-500 rounded-t-md"
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>

          </div>
        </div>
      </div>

      {/* Bottom Nav */}
      <div className="fixed bottom-0 w-full flex justify-between border-t bg-white p-3">
        <NavItem icon="dashboard" label="Dashboard" active />
        <NavItem icon="bar_chart" label="Analytics" />
        <NavItem icon="group" label="Users" />
        <NavItem icon="settings" label="Settings" />
      </div>

      <div className="h-20"></div>
    </div>
  );
};

export default SystemAnalytics;

/* ---------------- COMPONENTS ---------------- */

const Tab = ({ label, active = false }: { label: string; active?: boolean }) => (
  <div
    className={`pb-3 pt-4 border-b-4 text-sm font-bold ${
      active ? "border-blue-600 text-black" : "border-transparent text-gray-500"
    }`}
  >
    {label}
  </div>
);

const Card = ({
  title,
  value,
  change,
  positive = false,
}: {
  title: string;
  value: string;
  change: string;
  positive?: boolean;
}) => (
  <div className="flex-1 min-w-[150px] p-5 bg-white border rounded-lg shadow-sm">
    <p className="text-sm text-gray-500">{title}</p>
    <p className="text-2xl font-bold">{value}</p>
    <p className={positive ? "text-green-600" : "text-red-500"}>
      {change}
    </p>
  </div>
);

const BusinessCard = ({ icon, label, value, percent }) => (
  <div className="flex items-center gap-4 p-4 border rounded-xl bg-white">
    <span className="material-symbols-outlined">{icon}</span>
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-bold">
        {value} <span className="text-sm text-gray-400">({percent})</span>
      </p>
    </div>
  </div>
);

const SmallBox = ({ title, value }) => (
  <div className="p-3 border rounded bg-gray-50">
    <p className="text-xs text-gray-500">{title}</p>
    <p className="font-bold text-lg">{value}</p>
  </div>
);

const NavItem = ({
  icon,
  label,
  active = false,
}: {
  icon: string;
  label: string;
  active?: boolean;
}) => (
  <div className={`flex flex-col items-center text-xs ${active ? "text-black" : "text-gray-500"}`}>
    <span className="material-symbols-outlined">{icon}</span>
    {label}
  </div>
);