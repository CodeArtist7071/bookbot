import { Bell, CalendarHeart, Group, View } from "lucide-react";


const features = [
  {
    icon: <Bell size={24} />,
    title: "Auto-Review Requests",
    description:
      "Automatically send Google review links to happy customers 30 minutes after their appointment ends.",
  },
  {
    icon: <CalendarHeart size={24} />,
    title: "Smart Scheduling",
    description:
      "Avoid double bookings with real-time calendar sync across your entire team's Google or Outlook calendars.",
  },
  {
    icon: <Group size={24} />,
    title: "Multi-Agent Support",
    description:
      "Assign chats to different staff members. Perfect for salons, clinics, and service centers.",
  },
  {
    icon: <Bell size={24} />,
    title: "SMS & WhatsApp Alerts",
    description:
      "Reduce no-shows with automated appointment reminders and confirmations.",
  },
  {
    icon: <View size={24} />,
    title: "Customer Insights",
    description:
      "Track customer lifetime value, visit frequency, and average spend.",
  },
  {
    icon: <Bell size={24} />,
    title: "Secure Payments",
    description:
      "Collect deposits and payments directly through WhatsApp chat flow.",
  },
];

export const FeaturesSection=()=> {
  return (
    <section id="features" className="py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-16">
          <h2 className="text-4xl font-black mb-4">
            Powerful features for your business
          </h2>

          <p className="text-lg text-gray-600">
            Everything you need to automate your service business.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-8 rounded-2xl border bg-white shadow-sm hover:shadow-xl transition"
            >
              <div className="w-14 h-14 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-5">
                <span className="material-symbols-outlined">
                  {feature.icon}
                </span>
              </div>

              <h3 className="text-2xl font-bold mb-3">
                {feature.title}
              </h3>

              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
