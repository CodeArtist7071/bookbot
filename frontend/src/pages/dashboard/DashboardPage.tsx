import { ActivityIcon, Calendar, CheckCircle, MessageCircle, PlusCircle, QrCode, Star, StarsIcon, X, Loader2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../../services/supabase/database';
import { useAuth } from '../../app/providers/AuthProvider';

export default function BusinessDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState([
    { title: "Total Bookings", value: "0", icon: <Calendar size={20} />, color: "text-green-600", subtitle: "Lifetime bookings" },
    { title: "Pending", value: "0", icon: <ActivityIcon size={20} />, color: "text-yellow-500", subtitle: "Require attention" },
    { title: "Avg Rating", value: "0", icon: <Star size={20} />, color: "text-blue-600", subtitle: "Customer satisfaction" },
  ]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      if (!user) return;
      try {
        setLoading(true);
        // Get Business ID (In this simple schema, we might need to find it first or use metadata)
        // For now, let's assume we can fetch by user id or just all for this demo
        const businessId = user.id; // Placeholder: Real logic would find the business associated with this user

        const [bookingStats, avgRating, recentBookings] = await Promise.all([
          db.bookings.getStats(businessId),
          db.reviews.getAverageRating(businessId),
          db.bookings.getAll(businessId)
        ]);

        setStats([
          { title: "Total Bookings", value: bookingStats.total.toString(), icon: <Calendar size={20} />, color: "text-green-600", subtitle: "Lifetime bookings" },
          { title: "Pending", value: bookingStats.pending.toString(), icon: <ActivityIcon size={20} />, color: "text-yellow-500", subtitle: "Require attention" },
          { title: "Avg Rating", value: avgRating.toString(), icon: <Star size={20} />, color: "text-blue-600", subtitle: "Customer satisfaction" },
        ]);

        // Transform bookings into activity items
        const transformedActivities = (recentBookings || []).slice(0, 5).map(b => ({
          title: `Booking ${b.status.charAt(0).toUpperCase() + b.status.slice(1)}`,
          time: new Date(b.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          description: `${b.customer_name} booked ${b.services?.name || 'a service'} for ${new Date(b.booking_date).toLocaleDateString()}`,
          icon: b.status === 'confirmed' ? <CheckCircle size={20} /> : b.status === 'pending' ? <ActivityIcon size={20} /> : <X size={20} />,
          bg: b.status === 'confirmed' ? "bg-green-100" : b.status === 'pending' ? "bg-yellow-100" : "bg-red-100",
          text: b.status === 'confirmed' ? "text-green-700" : b.status === 'pending' ? "text-yellow-700" : "text-red-700",
        }));

        setActivities(transformedActivities);
      } catch (error) {
        console.error("Dashboard fetch error:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, [user]);

  const businessName = user?.user_metadata?.business_name || "Urban Styles Salon";

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <section>
        <h1 className="text-3xl font-extrabold mb-1">
          Hello, {businessName}
        </h1>

        <p className="text-gray-500">
          Here's what's happening today, {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}.
        </p>
      </section>

      {/* Stats */}
      <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm"
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-gray-500">
                {stat.title}
              </p>

              <span className={stat.color}>
                {stat.icon}
              </span>
            </div>

            <h3 className="text-4xl font-black mb-2">
              {loading ? "..." : stat.value}
            </h3>

            <p className={`text-sm ${stat.color}`}>
              {stat.subtitle}
            </p>
          </div>
        ))}
      </section>

      {/* Quick Actions */}
      <section>
        <h3 className="text-xl font-bold mb-4">
          Quick Actions
        </h3>

        <div className="grid grid-cols-2 gap-4">
          <Link to="/dashboard/qr-code" className="bg-blue-600 text-white rounded-2xl p-6 flex flex-col items-center justify-center gap-3 shadow-lg hover:scale-105 transition">
            <QrCode size={32} />
            <span className="font-semibold text-lg">
              View QR Code
            </span>
          </Link>

          <Link to="/dashboard/bookings" className="bg-blue-50 border border-blue-200 text-blue-700 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 hover:scale-105 transition">
            <PlusCircle size={32}/>
            <span className="font-semibold text-lg">
              New Booking
            </span>
          </Link>
        </div>
      </section>

      {/* Recent Activity */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold">
            Recent Activity
          </h3>

          <Link to="/dashboard/bookings" className="text-blue-600 font-semibold hover:underline">
            View All
          </Link>
        </div>

        <div className="space-y-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-10 text-slate-400">
              <Loader2 className="animate-spin mb-2" size={24} />
              <p className="text-sm">Updating activity feed...</p>
            </div>
          ) : activities.length === 0 ? (
            <div className="bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-8 text-center text-slate-500">
              <p>No recent activity. New bookings will appear here.</p>
            </div>
          ) : (
            activities.map((activity, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-2xl p-4 flex gap-4 shadow-sm"
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${activity.bg} ${activity.text}`}
                >
                  {activity.icon}
                </div>

                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-semibold">
                      {activity.title}
                    </h4>

                    <span className="text-xs text-gray-400">
                      {activity.time}
                    </span>
                  </div>

                  <p className="text-sm text-gray-500 leading-relaxed">
                    {activity.description}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Promo Card */}
      <section className="relative overflow-hidden bg-blue-600 text-white rounded-3xl p-6 shadow-xl">
        <div className="relative z-10">
          <h3 className="text-2xl font-bold mb-2">
            Automate your reminders
          </h3>

          <p className="text-blue-100 mb-5 leading-relaxed">
            Reduce no-shows by 40% with automated WhatsApp
            reminders.
          </p>

          <button className="bg-white text-blue-600 px-5 py-2 rounded-xl font-semibold hover:bg-blue-50 transition">
            Explore Feature
          </button>
        </div>

        <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-blue-400/20 blur-3xl"></div>
      </section>
    </div>
  );
}

