export const CTASection = () => {
  return (
    <section className="py-24">
      <div className="max-w-6xl mx-auto px-6">
        <div className="bg-gray-100 rounded-3xl p-14 text-center">
          <h2 className="text-5xl font-black mb-6">
            Ready to reclaim your time?
          </h2>

          <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto">
            Join 5,000+ business owners using BookBot to automate operations.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="bg-blue-600 text-white px-10 py-5 rounded-xl font-bold hover:scale-105 transition">
              Get Started for Free
            </button>

            <button className="border-2 border-blue-600 text-blue-600 px-10 py-5 rounded-xl font-bold">
              Book a Strategy Call
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}