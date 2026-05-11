import React from "react";
import Avatar from "../../components/common/Avatar";
import { PLACEHOLDER_AVATAR } from "../../constants/images";

const stats = [
  {
    title: "Total Bookings",
    value: "2,840",
    change: "+12.5%",
    subtitle: "vs last week",
    icon: "calendar_today",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    title: "Retention Rate",
    value: "78.4%",
    change: "+2.3%",
    subtitle: "vs last month",
    icon: "cached",
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
  },
];

const growthData = [
  { day: "Mon", height: "40%" },
  { day: "Tue", height: "65%" },
  { day: "Wed", height: "55%" },
  { day: "Thu", height: "90%", active: true },
  { day: "Fri", height: "75%" },
  { day: "Sat", height: "45%" },
  { day: "Sun", height: "30%" },
];

const bookingHours = [
  { time: "10:00 AM", value: 85 },
  { time: "02:00 PM", value: 60 },
  { time: "06:00 PM", value: 45 },
  { time: "08:00 PM", value: 92 },
];

const customers = [
  {
    name: "Alex Rivera",
    bookings: "12 bookings this month",
    tag: "VIP",
    image: PLACEHOLDER_AVATAR,
  },
  {
    name: "Sarah Jenkins",
    bookings: "8 bookings this month",
    tag: "Gold",
    image: PLACEHOLDER_AVATAR,
  },
];

export default function AnalyticsDashboard() {
  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white px-4 py-3 shadow-sm rounded-xl border border-gray-200">
        <div className="flex rounded-xl bg-slate-100 p-1">
          {["Today", "7 Days", "Monthly"].map((item, index) => (
            <button
              key={item}
              className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition ${
                index === 1
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-slate-500"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="rounded-2xl border bg-white p-6 shadow-sm"
          >
            <div className="mb-4 flex items-start justify-between">
              <p className="text-sm text-slate-500">{stat.title}</p>

              <div
                className={`rounded-lg p-2 ${stat.iconBg} ${stat.iconColor}`}
              >
                <span className="material-symbols-outlined text-lg">
                  {stat.icon}
                </span>
              </div>
            </div>

            <h2 className="text-3xl font-bold">{stat.value}</h2>

            <div className="mt-2 flex items-center gap-1">
              <span className="material-symbols-outlined text-sm text-green-600">
                trending_up
              </span>

              <span className="text-sm font-semibold text-green-600">
                {stat.change}
              </span>

              <span className="text-xs text-slate-400">
                {stat.subtitle}
              </span>
            </div>
          </div>
        ))}
      </section>

      {/* Growth Chart */}
      <section className="rounded-2xl border bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Growth Trends</h3>

          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-blue-600" />
            <span className="text-sm text-slate-500">Bookings</span>
          </div>
        </div>

        <div className="flex h-52 items-end justify-between gap-2">
          {growthData.map((item) => (
            <div
              key={item.day}
              className="flex flex-1 flex-col items-center gap-2"
            >
              <div
                style={{ height: item.height }}
                className={`w-full rounded-t-lg transition-all duration-300 ${
                  item.active ? "bg-blue-600" : "bg-blue-200"
                }`}
              />

              <span className="text-xs text-slate-500">{item.day}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Peak Booking Hours */}
      <section className="rounded-2xl border bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Peak Booking Hours</h3>

          <span className="material-symbols-outlined text-slate-400">
            info
          </span>
        </div>

        <div className="space-y-5">
          {bookingHours.map((hour) => (
            <div key={hour.time} className="flex items-center gap-3">
              <div className="w-20 text-sm text-slate-500">
                {hour.time}
              </div>

              <div className="h-3 flex-1 overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full rounded-full bg-green-600"
                  style={{ width: `${hour.value}%` }}
                />
              </div>

              <div className="w-10 text-right text-sm font-semibold">
                {hour.value}%
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex items-start gap-3 rounded-xl bg-slate-50 p-4">
          <span className="material-symbols-outlined text-green-600">
            tips_and_updates
          </span>

          <p className="text-sm text-slate-600">
            <span className="font-semibold">Insight:</span> Most WhatsApp
            bookings happen between 7 PM and 9 PM. Running evening promotions
            could improve conversions.
          </p>
        </div>
      </section>

      {/* Mini Cards */}
      <section className="grid grid-cols-2 gap-4">
        <div className="rounded-2xl border bg-white p-4 shadow-sm">
          <p className="text-sm text-slate-500">Average Response</p>

          <h3 className="mt-1 text-2xl font-bold">4.2 min</h3>

          <p className="mt-1 text-xs font-semibold text-green-600">
            -0.8m faster
          </p>
        </div>

        <div className="rounded-2xl border bg-white p-4 shadow-sm">
          <p className="text-sm text-slate-500">Customer Rating</p>

          <div className="mt-1 flex items-center gap-1">
            <h3 className="text-2xl font-bold">4.9</h3>

            <span className="material-symbols-outlined text-yellow-500">
              star
            </span>
          </div>

          <p className="mt-1 text-xs text-slate-500">
            From 420 reviews
          </p>
        </div>
      </section>

      {/* Customers */}
      <section>
        <h3 className="mb-3 px-1 text-lg font-semibold">
          Top Recurring Customers
        </h3>

        <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
          {customers.map((customer, index) => (
            <div
              key={customer.name}
              className={`flex items-center justify-between p-4 ${
                index !== customers.length - 1
                  ? "border-b border-slate-200"
                  : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <img
                  src={customer.image}
                  alt=""
                  className="hidden"
                />
                <Avatar
                  src={customer.image}
                  alt={`${customer.name} avatar`}
                  name={customer.name}
                  className="h-10 w-10 rounded-full object-cover"
                  fallbackClassName="h-10 w-10 rounded-full flex items-center justify-center text-xs font-bold text-slate-700"
                />

                <div>
                  <p className="font-medium">{customer.name}</p>

                  <p className="text-xs text-slate-500">
                    {customer.bookings}
                  </p>
                </div>
              </div>

              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-blue-600">
                {customer.tag}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
