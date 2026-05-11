import React from "react";
import { PLACEHOLDER_ADMIN_AVATAR } from "../../constants/images";

const stats = [
  {
    title: "Total Businesses",
    value: "1,284",
    growth: "+12%",
    subtext: "vs last month",
    icon: "storefront",
    iconColor: "text-primary",
  },
  {
    title: "Monthly Revenue (MRR)",
    value: "$52,400",
    growth: "+8.5%",
    subtext: "vs last month",
    icon: "payments",
    iconColor: "text-primary",
  },
  {
    title: "Active WhatsApp",
    value: "942",
    growth: "+15%",
    subtext: "connected bots",
    icon: "chat",
    iconColor: "text-whatsapp-green",
  },
  {
    title: "System Uptime",
    value: "99.98%",
    growth: "Stable",
    subtext: "Last 30 days",
    icon: "cloud_done",
    iconColor: "text-secondary",
  },
];

const signups = [
  {
    initials: "LS",
    name: "Luxe Salon & Spa",
    plan: "Professional Plan • 2m ago",
  },
  {
    initials: "BC",
    name: "Barber Collective",
    plan: "Growth Plan • 15m ago",
  },
  {
    initials: "PF",
    name: "Prime Fitness Hub",
    plan: "Basic Plan • 1h ago",
  },
  {
    initials: "DA",
    name: "Dental Associates",
    plan: "Enterprise • 3h ago",
  },
  {
    initials: "GC",
    name: "Green Cleaners",
    plan: "Growth Plan • 5h ago",
  },
];

const nodes = [
  {
    title: "US-East (Virginia)",
    desc: "Primary Database",
    status: "Active",
    latency: "12ms",
  },
  {
    title: "EU-West (Ireland)",
    desc: "WhatsApp Relay",
    status: "Active",
    latency: "28ms",
  },
  {
    title: "AP-South (Mumbai)",
    desc: "Content Delivery",
    status: "Active",
    latency: "45ms",
  },
];

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-background text-on-background font-body-md">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-border-light bg-surface p-4">
        <div className="flex items-center gap-3">
          <img
            src={PLACEHOLDER_ADMIN_AVATAR}
            alt="Admin avatar"
            className="h-10 w-10 rounded-full border border-border-light object-cover"
            loading="lazy"
          />
          <h2 className="text-xl font-bold">BookBot Admin</h2>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex flex-col items-end">
            <span className="text-sm font-medium">System Status</span>
            <span className="flex items-center gap-1 text-xs font-bold uppercase text-secondary">
              <span className="h-2 w-2 rounded-full bg-secondary"></span>
              Operational
            </span>
          </div>

          <button className="flex h-10 w-10 items-center justify-center rounded-lg hover:bg-surface-container">
            <span className="material-symbols-outlined">search</span>
          </button>

          <button className="relative flex h-10 w-10 items-center justify-center rounded-lg hover:bg-surface-container">
            <span className="material-symbols-outlined">
              notifications
            </span>
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-error"></span>
          </button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl flex-1 p-4 md:p-8">
        {/* Stats */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((item, index) => (
            <div
              key={index}
              className="rounded-xl border border-border-light bg-surface-card p-6 shadow-sm"
            >
              <div className="mb-3 flex items-start justify-between">
                <p className="text-sm text-text-muted">{item.title}</p>

                <span
                  className={`material-symbols-outlined ${item.iconColor}`}
                >
                  {item.icon}
                </span>
              </div>

              <h3 className="text-3xl font-bold text-text-main">
                {item.value}
              </h3>

              <div className="mt-2 flex items-center gap-1">
                <span className="text-sm font-bold text-secondary">
                  {item.growth}
                </span>

                <span className="text-xs text-text-muted">
                  {item.subtext}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Middle Section */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* System Health */}
          <div className="lg:col-span-2 rounded-xl border border-border-light bg-surface-card p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold">System Health</h3>
                <p className="text-sm text-text-muted">
                  API Response Latency (Global)
                </p>
              </div>

              <div className="flex gap-2 rounded-lg border border-border-light bg-background-subtle p-1">
                <button className="rounded bg-surface-card px-3 py-1 text-sm text-primary shadow-sm">
                  1h
                </button>
                <button className="px-3 py-1 text-sm text-text-muted">
                  24h
                </button>
                <button className="px-3 py-1 text-sm text-text-muted">
                  7d
                </button>
              </div>
            </div>

            <div className="min-h-[280px]">
              <svg
                className="h-full w-full"
                fill="none"
                preserveAspectRatio="none"
                viewBox="0 0 472 150"
              >
                <path
                  d="M0 109C18.1538 109 18.1538 21 36.3077 21C54.4615 21 54.4615 41 72.6154 41C90.7692 41 90.7692 93 108.923 93C127.077 93 127.077 33 145.231 33C163.385 33 163.385 101 181.538 101C199.692 101 199.692 61 217.846 61C236 61 236 45 254.154 45C272.308 45 272.308 121 290.462 121C308.615 121 308.615 149 326.769 149C344.923 149 344.923 1 363.077 1C381.231 1 381.231 81 399.385 81C417.538 81 417.538 129 435.692 129C453.846 129 453.846 25 472 25V149H0V109Z"
                  fill="url(#gradient)"
                />

                <path
                  d="M0 109C18.1538 109 18.1538 21 36.3077 21C54.4615 21 54.4615 41 72.6154 41C90.7692 41 90.7692 93 108.923 93C127.077 93 127.077 33 145.231 33C163.385 33 163.385 101 181.538 101C199.692 101 199.692 61 217.846 61C236 61 236 45 254.154 45C272.308 45 272.308 121 290.462 121C308.615 121 308.615 149 326.769 149C344.923 149 344.923 1 363.077 1C381.231 1 381.231 81 399.385 81C417.538 81 417.538 129 435.692 129C453.846 129 453.846 25 472 25"
                  stroke="#004ac6"
                  strokeWidth="3"
                  strokeLinecap="round"
                />

                <defs>
                  <linearGradient
                    id="gradient"
                    x1="236"
                    x2="236"
                    y1="1"
                    y2="149"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#dbe1ff" stopOpacity="0.8" />
                    <stop
                      offset="1"
                      stopColor="#dbe1ff"
                      stopOpacity="0"
                    />
                  </linearGradient>
                </defs>
              </svg>

              <div className="mt-4 flex justify-between border-t border-border-light pt-4 text-xs font-bold text-text-muted">
                <span>00:00</span>
                <span>06:00</span>
                <span>12:00</span>
                <span>18:00</span>
                <span>Now</span>
              </div>
            </div>
          </div>

          {/* Signups */}
          <div className="rounded-xl border border-border-light bg-surface-card p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-bold">New Signups</h3>

              <button className="text-sm font-bold text-primary" type="button">
                View All
              </button>
            </div>

            <div className="space-y-4">
              {signups.map((user, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 rounded-lg border border-transparent p-3 transition hover:border-border-light hover:bg-background-subtle"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-container-high font-bold text-primary">
                    {user.initials}
                  </div>

                  <div className="flex-1 overflow-hidden">
                    <p className="truncate font-medium">{user.name}</p>
                    <p className="text-xs text-text-muted">{user.plan}</p>
                  </div>

                  <span className="material-symbols-outlined text-secondary">
                    verified
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Nodes */}
        <div className="mt-8 rounded-xl border border-border-light bg-surface-card p-6 shadow-sm">
          <h3 className="mb-6 text-xl font-bold">Regional Node Status</h3>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {nodes.map((node, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-lg border border-border-light bg-background-subtle p-4"
              >
                <div>
                  <h4 className="font-bold text-text-main">{node.title}</h4>
                  <p className="text-xs text-text-muted">{node.desc}</p>
                </div>

                <div className="text-right">
                  <p className="text-sm font-bold text-secondary">
                    {node.status}
                  </p>
                  <p className="text-xs text-text-muted">{node.latency}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="sticky bottom-0 flex gap-2 border-t border-border-light bg-surface px-4 pb-3 pt-2">
        {[
          { label: "Health", icon: "monitoring", active: true },
          { label: "Businesses", icon: "business" },
          { label: "Revenue", icon: "payments" },
          { label: "Settings", icon: "settings" },
        ].map((item, index) => (
          <button
            key={index}
            className={`flex flex-1 flex-col items-center gap-1 ${
              item.active ? "text-primary" : "text-text-muted"
            }`}
          >
            <span className="material-symbols-outlined">{item.icon}</span>

            <span className="text-xs font-medium">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}