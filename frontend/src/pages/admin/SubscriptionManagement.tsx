import React from "react";

const SubscriptionManagement = () => {
  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col bg-[#f8f9fc] overflow-x-hidden font-body-md">

      {/* Header */}
      <div className="flex items-center bg-[#f8f9fc] p-4 pb-2 justify-between border-b border-[#e7ebf3]">
        <div className="flex items-center justify-center w-12 h-12">
          <span className="material-symbols-outlined">list</span>
        </div>

        <h2 className="text-[#0e121b] text-lg font-bold flex-1">
          Subscription Management
        </h2>

        <div className="flex w-12 justify-end">
          <button>
            <span className="material-symbols-outlined">church</span>
          </button>
        </div>
      </div>

      {/* Metrics */}
      <div className="flex flex-wrap gap-4 p-4">
        {[
          {
            title: "Active Subscriptions",
            value: "1,284",
            sub: "+5.2%",
            color: "text-green-600",
            icon: "trending_up",
          },
          {
            title: "Pending Payments",
            value: "42",
            sub: "Requires Action",
            color: "text-red-500",
            icon: "warning",
          },
          {
            title: "Churn Rate",
            value: "1.8%",
            sub: "-0.4% from last month",
            color: "text-gray-500",
            icon: "",
          },
        ].map((item, i) => (
          <div
            key={i}
            className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-lg p-6 border bg-white shadow-sm"
          >
            <p className="text-sm text-[#4d6599]">{item.title}</p>
            <p className="text-2xl font-bold">{item.value}</p>

            <div className="flex items-center gap-1">
              {item.icon && (
                <span className={`material-symbols-outlined ${item.color}`}>
                  {item.icon}
                </span>
              )}
              <p className={`text-sm font-medium ${item.color}`}>
                {item.sub}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Revenue Chart */}
      <div className="px-4 py-2">
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <h3 className="font-medium">Revenue Trends</h3>
          <p className="text-3xl font-bold">$45,200</p>

          <div className="flex gap-2 text-sm text-gray-500">
            <span>Last 30 days</span>
            <span className="text-green-600">+12.5%</span>
          </div>

          <svg
            viewBox="-3 0 478 150"
            className="w-full mt-4"
            fill="none"
          >
            <path
              d="M0 109C18.1538 109 18.1538 21 36.3077 21C54.4615 21 54.4615 41 72.6154 41C90.7692 41 90.7692 93 108.923 93C127.077 93 127.077 33 145.231 33C163.385 33 163.385 101 181.538 101C199.692 101 199.692 61 217.846 61C236 61 236 45 254.154 45C272.308 45 272.308 121 290.462 121C308.615 121 308.615 149 326.769 149C344.923 149 344.923 1 363.077 1C381.231 1 381.231 81 399.385 81C417.538 81 417.538 129 435.692 129C453.846 129 453.846 25 472 25V149H0V109Z"
              fill="#dbe1ff"
              stroke="#004ac6"
              strokeWidth="3"
            />
          </svg>
        </div>
      </div>

      {/* Subscription Tiers */}
      <div className="px-4 py-6">
        <h2 className="text-xl font-bold mb-4">Subscription Tiers</h2>

        <div className="grid md:grid-cols-3 gap-4">

          {/* Free */}
          <div className="bg-white p-6 border rounded-xl">
            <h3 className="font-bold">Free</h3>
            <p className="text-sm text-gray-500">Basic plan</p>
            <p className="text-3xl font-bold mt-2">$0/mo</p>
          </div>

          {/* Pro */}
          <div className="bg-white p-6 border-2 border-blue-600 rounded-xl relative">
            <span className="absolute top-0 right-0 bg-blue-600 text-white text-xs px-2 py-1">
              Popular
            </span>
            <h3 className="font-bold">Pro</h3>
            <p className="text-sm text-gray-500">Growth plan</p>
            <p className="text-3xl font-bold mt-2">$49/mo</p>
          </div>

          {/* Enterprise */}
          <div className="bg-white p-6 border rounded-xl">
            <h3 className="font-bold">Enterprise</h3>
            <p className="text-sm text-gray-500">Advanced plan</p>
            <p className="text-3xl font-bold mt-2">$199/mo</p>
          </div>

        </div>
      </div>

      {/* Bottom Nav */}
      <div className="fixed bottom-0 w-full border-t bg-[#f8f9fc] flex justify-around py-2">
        {["Overview", "Billing", "Users", "Settings"].map((item, i) => (
          <div key={i} className="text-center text-sm text-gray-600">
            {item}
          </div>
        ))}
      </div>

    </div>
  );
};

export default SubscriptionManagement;