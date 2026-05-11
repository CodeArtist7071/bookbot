export const HeroSection=()=> {
  return (
    <section className="py-20 bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-14 items-center">
        <div>
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
            ⚡ AI-Powered Customer Sentiment Analysis
          </div>

          <h1 className="text-5xl lg:text-6xl font-black leading-tight text-gray-900 mb-6">
            Automate your WhatsApp bookings and Google reviews
          </h1>

          <p className="text-lg text-gray-600 leading-relaxed mb-8">
            BookBot helps you manage appointments, automate reminders,
            and grow your reputation — 24/7.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <button className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold hover:scale-105 transition">
              Start 14-Day Free Trial
            </button>

            <button className="border px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition">
              Watch Demo
            </button>
          </div>

          <div className="mt-8 flex items-center gap-4 text-sm text-gray-500">
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full bg-gray-300 border-2 border-white"></div>
              <div className="w-8 h-8 rounded-full bg-gray-400 border-2 border-white"></div>
              <div className="w-8 h-8 rounded-full bg-gray-500 border-2 border-white"></div>
            </div>

            <span>Joined by 1,200+ businesses this month</span>
          </div>
        </div>

        <div className="relative">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCgNUL2RW3AKVCPWImWkqZd9GwNav0hoCuFG5CPg7Za0kbb68oxxkDF3QcFD2l6B9UtGhfXuBEr3DaBfQfyEuQm8kqaMWzBTfO-GB1A2xkc1QrRFfoxhbcbanW6rzV7zZdK806w02-8d3m3u4riAtAEjFMyTWfSEmO8tHz0LOdeg-ANFh4XCGj7pWBIpJJIXR0rKCe2ahkSlBIdlLJPVYDqYxrH11e9CgOXFfSLYmAWeRZW2Lcby7jZQXYXCsPl2Q_Oc_dKvs6dEhM"
            alt="Dashboard"
            className="rounded-2xl shadow-2xl border"
          />

          <div className="absolute -bottom-5 -left-5 bg-white p-4 rounded-xl shadow-xl border hidden md:flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center">
              💬
            </div>

            <div>
              <p className="font-bold text-sm">New Booking!</p>
              <p className="text-xs text-gray-500">Haircut @ 2:30 PM</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}