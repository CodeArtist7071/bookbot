// ReviewManagement.jsx

import React from "react";
import {
  ArrowLeft,
  Settings,
  Star,
  StarHalf,
  MessageCircle,
  Reply,
  Home,
  BarChart3,
  User,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

const reviews = [
  {
    initials: "SJ",
    name: "Sarah Jenkins",
    time: "2 hours ago via WhatsApp",
    rating: 5,
    review:
      "Absolutely loved the service! The team was very responsive on WhatsApp and guided me through the whole process. Highly recommended for any local business!",
    action: "Share to Google",
    color: "bg-slate-200",
  },
  {
    initials: "MR",
    name: "Marcus Rivera",
    time: "Yesterday via WhatsApp",
    rating: 4,
    review:
      "The booking experience was seamless. It's so much easier to just text a business than having to call or fill out long forms on a website.",
    action: "Share to Google",
    color: "bg-green-100",
  },
  {
    initials: "AW",
    name: "Alice Wong",
    time: "3 days ago via WhatsApp",
    rating: 3,
    review:
      "Good service overall. Had a slight delay in the response time but the actual appointment was great.",
    action: "Internal Follow-up",
    color: "bg-orange-100",
  },
];

const ratingStats = [
  { star: 5, value: 80 },
  { star: 4, value: 12 },
  { star: 3, value: 5 },
  { star: 2, value: 1 },
  { star: 1, value: 2 },
];

function RatingStars({ rating }) {
  return (
    <div className="flex gap-0.5 text-yellow-500">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={18}
          className={star <= rating ? "fill-yellow-500" : ""}
        />
      ))}
    </div>
  );
}

function ReviewCard({ review }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div className="p-4 flex flex-col gap-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-slate-700 ${review.color}`}
            >
              {review.initials}
            </div>

            <div>
              <h3 className="font-bold text-slate-900">{review.name}</h3>
              <p className="text-xs text-slate-500">{review.time}</p>
            </div>
          </div>

          <RatingStars rating={review.rating} />
        </div>

        <p className="text-sm text-slate-700 italic leading-relaxed">
          "{review.review}"
        </p>

        <div className="flex gap-2 pt-2">
          <button
            className={`flex-1 h-10 rounded-lg text-sm font-semibold transition ${
              review.action === "Share to Google"
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "border border-blue-600 text-blue-600 hover:bg-blue-50"
            }`}
          >
            {review.action}
          </button>

          <button className="w-10 h-10 border border-slate-200 rounded-lg flex items-center justify-center hover:bg-slate-50">
            <Reply size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ReviewManagement() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-slate-200">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            aria-label="Go back"
            onClick={() => navigate(-1)}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100"
          >
            <ArrowLeft size={22} />
          </button>

          <h1 className="text-lg font-bold text-slate-900">
            Review Management
          </h1>

          <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100">
            <Settings size={22} />
          </button>
        </div>
      </header>

      {/* Rating Summary */}
      <section className="m-4 rounded-2xl bg-white border border-slate-200 shadow-sm p-6">
        <div className="flex flex-wrap gap-8">
          <div>
            <h2 className="text-5xl font-black text-slate-900">4.8</h2>

            <div className="flex mt-2 text-yellow-500">
              <Star className="fill-yellow-500" size={18} />
              <Star className="fill-yellow-500" size={18} />
              <Star className="fill-yellow-500" size={18} />
              <Star className="fill-yellow-500" size={18} />
              <StarHalf size={18} />
            </div>

            <p className="mt-2 text-sm text-slate-500">
              Based on 124 reviews
            </p>
          </div>

          <div className="flex-1 min-w-[220px] space-y-3">
            {ratingStats.map((item) => (
              <div
                key={item.star}
                className="grid grid-cols-[20px_1fr_40px] items-center gap-3"
              >
                <span className="text-sm font-medium">{item.star}</span>

                <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full"
                    style={{ width: `${item.value}%` }}
                  />
                </div>

                <span className="text-xs text-right text-slate-500">
                  {item.value}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WhatsApp Feedback */}
      <section className="px-4 pb-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-900">
            WhatsApp Feedback
          </h2>

          <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold">
            <MessageCircle size={14} />
            LIVE
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {reviews.map((review, index) => (
            <ReviewCard key={index} review={review} />
          ))}
        </div>
      </section>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-4 py-2 flex justify-around">
        <button
          aria-label="Go to dashboard"
          onClick={() => navigate("/dashboard")}
          className="flex flex-col items-center text-slate-500"
        >
          <Home size={22} />
          <span className="text-xs mt-1">Home</span>
        </button>

        <button
          aria-label="Go to reviews"
          onClick={() => navigate("/dashboard/reviews")}
          className={`flex flex-col items-center font-semibold ${
            location.pathname === "/dashboard/reviews" ? "text-black" : "text-slate-500"
          }`}
        >
          <Star className="fill-black" size={22} />
          <span className="text-xs mt-1">Reviews</span>
        </button>

        <button
          aria-label="Go to analytics"
          onClick={() => navigate("/dashboard/analytics")}
          className="flex flex-col items-center text-slate-500"
        >
          <BarChart3 size={22} />
          <span className="text-xs mt-1">Analytics</span>
        </button>

        <button
          aria-label="Go to settings"
          onClick={() => navigate("/dashboard/settings")}
          className="flex flex-col items-center text-slate-500"
        >
          <User size={22} />
          <span className="text-xs mt-1">Profile</span>
        </button>
      </nav>
    </div>
  );
}