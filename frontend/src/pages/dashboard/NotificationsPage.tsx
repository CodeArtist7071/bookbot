// src/pages/NotificationsPage.tsx

import React from "react";
import {
  Bell,
  Calendar,
  CheckCircle,
  Home,
  Info,
  Megaphone,
  Star,
  User,
  XCircle,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

const notifications = [
  {
    title: "New booking: Ocean View Suite",
    subtitle: "10m ago • Sarah Miller for 3 nights",
    type: "booking",
    unread: true,
    action: "View Details",
  },
  {
    title: "Booking Cancelled",
    subtitle: "1h ago • Deluxe Studio by John Doe",
    type: "cancelled",
    unread: true,
  },
  {
    title: "New 5-star Review",
    subtitle: 'Yesterday, 4:30 PM • "Amazing service!"',
    type: "review",
  },
  {
    title: "System Maintenance",
    subtitle: "Yesterday, 11:00 AM • Completed successfully",
    type: "system",
  },
  {
    title: "New Feature: Auto-Reply",
    subtitle: "Oct 24 • Automate your WhatsApp responses",
    type: "promo",
  },
];

const getIcon = (type: string) => {
  switch (type) {
    case "booking":
      return (
        <div className="bg-blue-100 text-blue-600 p-3 rounded-xl">
          <Calendar size={22} />
        </div>
      );

    case "cancelled":
      return (
        <div className="bg-red-100 text-red-500 p-3 rounded-xl">
          <XCircle size={22} />
        </div>
      );

    case "review":
      return (
        <div className="bg-yellow-100 text-yellow-500 p-3 rounded-xl">
          <Star size={22} />
        </div>
      );

    case "system":
      return (
        <div className="bg-slate-200 text-slate-600 p-3 rounded-xl">
          <Info size={22} />
        </div>
      );

    default:
      return (
        <div className="bg-green-100 text-green-600 p-3 rounded-xl">
          <Megaphone size={22} />
        </div>
      );
  }
};

export default function NotificationsPage() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[#f8f9fc] flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-[#f8f9fc] border-b border-slate-200 px-4 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-900">
          Notifications
        </h1>

        <button aria-label="Mark all read" className="hover:bg-slate-100 p-2 rounded-lg transition">
          <CheckCircle className="text-slate-700" size={24} />
        </button>
      </div>

      {/* Tabs */}
      <div className="sticky top-[73px] z-10 bg-[#f8f9fc] border-b border-slate-200 overflow-x-auto">
        <div className="flex gap-8 px-4">
          {["All", "Bookings", "Reviews", "System"].map(
            (tab, index) => (
              <button
                key={tab}
                className={`py-4 text-sm font-semibold whitespace-nowrap border-b-2 ${
                  index === 0
                    ? "border-blue-600 text-slate-900"
                    : "border-transparent text-slate-500"
                }`}
              >
                {tab}
              </button>
            )
          )}
        </div>
      </div>

      {/* Notifications */}
      <div className="flex-1">
        <div className="px-4 pt-6 pb-2">
          <h2 className="text-sm font-bold text-slate-900">
            Today
          </h2>
        </div>

        {notifications.slice(0, 2).map((item) => (
          <div
            key={item.title}
            className="bg-white border-b border-slate-100 px-4 py-4 flex justify-between gap-4"
          >
            <div className="flex gap-4 flex-1">
              {getIcon(item.type)}

              <div className="flex-1">
                <h3 className="font-semibold text-slate-900">
                  {item.title}
                </h3>

                <p className="text-sm text-slate-500 mt-1">
                  {item.subtitle}
                </p>

                {item.action && (
                  <button className="mt-3 px-3 py-1.5 bg-blue-600 text-white text-xs rounded-lg font-semibold">
                    {item.action}
                  </button>
                )}
              </div>
            </div>

            {item.unread && (
              <div className="w-2.5 h-2.5 rounded-full bg-blue-600 mt-2" />
            )}
          </div>
        ))}

        <div className="px-4 pt-6 pb-2">
          <h2 className="text-sm font-bold text-slate-900">
            Yesterday
          </h2>
        </div>

        {notifications.slice(2).map((item) => (
          <div
            key={item.title}
            className="bg-white border-b border-slate-100 px-4 py-4 flex gap-4 opacity-80"
          >
            {getIcon(item.type)}

            <div>
              <h3 className="font-medium text-slate-900">
                {item.title}
              </h3>

              <p className="text-sm text-slate-500 mt-1">
                {item.subtitle}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Navigation */}
      <div className="sticky bottom-0 bg-white border-t border-slate-200">
        <div className="grid grid-cols-4 py-2">
          <NavItem
            active={location.pathname === "/dashboard"}
            onClick={() => navigate("/dashboard")}
            icon={<Home size={22} />}
            label="Home"
          />
          <NavItem
            active={location.pathname.startsWith("/dashboard/bookings")}
            onClick={() => navigate("/dashboard/bookings")}
            icon={<Calendar size={22} />}
            label="Bookings"
          />

          <NavItem
            active={location.pathname === "/dashboard/notifications"}
            onClick={() => navigate("/dashboard/notifications")}
            icon={<Bell size={22} />}
            label="Inbox"
          />

          <NavItem
            active={location.pathname === "/dashboard/settings"}
            onClick={() => navigate("/dashboard/settings")}
            icon={<User size={22} />}
            label="Profile"
          />
        </div>
      </div>
    </div>
  );
}

type NavItemProps = {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
};

function NavItem({
  icon,
  label,
  active = false,
  onClick,
}: NavItemProps) {
  return (
    <button
      aria-label={label}
      onClick={onClick}
      className={`flex flex-col items-center justify-center gap-1 py-2 ${
        active ? "text-slate-900" : "text-slate-500"
      }`}
    >
      {icon}

      <span className="text-xs font-medium">
        {label}
      </span>
    </button>
  );
}