import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Calendar,
  BarChart3,
  Users,
  Settings,
  QrCode,
  MessageSquare,
  Bell,
  CreditCard,
  Star,
  LogOut
} from 'lucide-react';
import { useAuth } from '../../app/providers/AuthProvider';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { signOut } = useAuth();

  const menuItems = [
    { name: 'Overview', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'Bookings', icon: Calendar, path: '/dashboard/bookings' },
    { name: 'Analytics', icon: BarChart3, path: '/dashboard/analytics' },
    { name: 'Staff', icon: Users, path: '/dashboard/staff' },
    { name: 'Services', icon: MessageSquare, path: '/dashboard/services' },
    { name: 'WhatsApp Setup', icon: MessageSquare, path: '/dashboard/whatsapp-setup' },
    { name: "WhatsApp Flow", icon: MessageSquare, path: "/dashboard/whatsapp-flow" },
    { name: 'QR Code', icon: QrCode, path: '/dashboard/qr-code' },
    { name: "Notifications", icon: Bell, path: "/dashboard/notifications" },
    { name: "Reviews", icon: Star, path: "/dashboard/reviews" },
    { name: "Billing", icon: CreditCard, path: "/dashboard/billing" },
    { name: 'Settings', icon: Settings, path: '/dashboard/settings' },
  ];


  return (
    <aside className="w-64 bg-white border-r min-h-screen flex flex-col">
      <div className="p-6 border-b">
        <Link to="/dashboard" className="flex items-center gap-3">
          <span className="text-2xl">🤖</span>
          <span className="text-xl font-bold">BookBot</span>
        </Link>
      </div>

      <nav className="flex-grow p-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition ${
                isActive
                  ? 'bg-blue-50 text-blue-600 font-medium'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <item.icon size={20} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t">
        <button
          onClick={signOut}
          className="flex items-center gap-3 px-4 py-2 w-full text-left text-red-600 hover:bg-red-50 rounded-lg transition"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
