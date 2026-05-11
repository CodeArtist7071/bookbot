import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Calendar,
  BarChart3,
  MessageSquare,
  Bell,
  Settings,
} from 'lucide-react';

const menuItems = [
  { name: 'Overview', icon: LayoutDashboard, path: '/dashboard' },
  { name: 'Bookings', icon: Calendar, path: '/dashboard/bookings' },
  { name: 'Analytics', icon: BarChart3, path: '/dashboard/analytics' },
  { name: 'WhatsApp', icon: MessageSquare, path: '/dashboard/whatsapp-flow' },
//   { name: 'Notifications', icon: Bell, path: '/dashboard/notifications' },
//   { name: 'Settings', icon: Settings, path: '/dashboard/settings' },
];

const MobileLayout: React.FC = () => {
  const location = useLocation();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/95 backdrop-blur-xl shadow-[0_-1px_24px_rgba(15,23,42,0.06)] md:hidden">
      <div className="mx-auto flex max-w-screen-lg items-center justify-between gap-1 overflow-x-auto px-2 py-2 pb-[calc(env(safe-area-inset-bottom)+0.75rem)]">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex min-w-[4.5rem] flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2 text-xs transition ${
                isActive
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Icon size={20} />
              <span className="whitespace-nowrap">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileLayout;
