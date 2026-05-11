// BookingDetailsPage.tsx

import React from "react";
import { useNavigate } from "react-router-dom";
import Avatar from "../../components/common/Avatar";
import { PLACEHOLDER_AVATAR } from "../../constants/images";

const history = [
  {
    title: "Booking Confirmed",
    date: "Oct 20, 2023 • 02:45 PM",
    description: "Provider assigned and customer notified.",
    active: true,
    icon: "check",
  },
  {
    title: "Appointment Created",
    date: "Oct 20, 2023 • 02:30 PM",
    description: "Request received via WhatsApp.",
    active: false,
    icon: "schedule",
  },
];

export default function BookingDetailsPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-20 flex items-center justify-between border-b bg-slate-50 px-4 py-4">
        <button
          aria-label="Go back"
          onClick={() => navigate(-1)}
          className="flex h-11 w-11 items-center justify-center rounded-full transition hover:bg-slate-200"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>

        <h1 className="ml-2 flex-1 text-lg font-bold">
          Booking Details
        </h1>

        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
          Confirmed
        </span>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-6">
        {/* Customer Card */}
        <section className="mb-6 rounded-2xl border bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <div className="relative">
              <Avatar
                src={PLACEHOLDER_AVATAR}
                alt="Customer avatar"
                name="Alex Johnson"
                className="h-24 w-24 rounded-full border-2 border-blue-200 object-cover"
                fallbackClassName="h-24 w-24 rounded-full border-2 border-blue-200 flex items-center justify-center font-bold text-slate-700"
              />
            </div>

            <div className="flex-1">
              <h2 className="text-3xl font-bold">Alex Johnson</h2>

              <p className="mt-1 text-slate-500">
                Customer since October 2023
              </p>

              <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <div className="flex items-center gap-2 font-medium text-blue-600">
                  <span className="material-symbols-outlined">
                    call
                  </span>

                  <span>+1 (555) 012-3456</span>
                </div>

                <div className="flex items-center gap-2 text-slate-500">
                  <span className="material-symbols-outlined">
                    mail
                  </span>

                  <span>alex.j@example.com</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Info Grid */}
        <section className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Service Details */}
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-2">
              <span className="material-symbols-outlined text-blue-600">
                cleaning_services
              </span>

              <h3 className="text-xl font-bold">
                Service Details
              </h3>
            </div>

            <div className="space-y-4">
              {[
                ["Service", "Full House Cleaning"],
                ["Duration", "3 Hours"],
                ["Provider", "Maria Rodriguez"],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex justify-between border-b border-slate-200 pb-2"
                >
                  <p className="text-sm text-slate-500">{label}</p>

                  <p className="text-sm font-semibold">{value}</p>
                </div>
              ))}

              <div className="flex justify-between">
                <p className="text-sm text-slate-500">Total Price</p>

                <p className="text-xl font-bold text-blue-600">
                  $145.00
                </p>
              </div>
            </div>
          </div>

          {/* Schedule */}
          <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-2">
              <span className="material-symbols-outlined text-blue-600">
                calendar_today
              </span>

              <h3 className="text-xl font-bold">Schedule</h3>
            </div>

            <div className="space-y-4">
              {[
                ["Date", "October 24, 2023"],
                ["Start Time", "10:00 AM"],
                ["End Time", "1:00 PM"],
                ["Location", "123 Pine St, Apt 4B"],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex justify-between border-b border-slate-200 pb-2 last:border-none"
                >
                  <p className="text-sm text-slate-500">{label}</p>

                  <p className="text-right text-sm font-semibold">
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Notes */}
        <section className="mb-6 rounded-2xl border bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-2">
            <span className="material-symbols-outlined text-blue-600">
              notes
            </span>

            <h3 className="text-xl font-bold">Booking Notes</h3>
          </div>

          <div className="rounded-xl bg-slate-100 p-4">
            <p className="italic leading-relaxed text-slate-700">
              "Please pay special attention to the master bedroom
              windows. Also, the customer mentioned they have a small
              cat, so please be mindful when opening the front door.
              Key is in the lockbox (code: 4920)."
            </p>
          </div>
        </section>

        {/* Timeline */}
        <section className="mb-6 rounded-2xl border bg-white p-6 shadow-sm">
          <div className="mb-8 flex items-center gap-2">
            <span className="material-symbols-outlined text-blue-600">
              history
            </span>

            <h3 className="text-xl font-bold">
              Booking History
            </h3>
          </div>

          <div className="relative space-y-8 before:absolute before:left-[11px] before:top-2 before:h-[calc(100%-16px)] before:w-0.5 before:bg-slate-200">
            {history.map((item) => (
              <div key={item.title} className="relative pl-10">
                <div
                  className={`absolute left-0 top-1 flex h-6 w-6 items-center justify-center rounded-full ring-4 ring-white ${
                    item.active
                      ? "bg-blue-600 text-white"
                      : "bg-slate-200 text-slate-500"
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">
                    {item.icon}
                  </span>
                </div>

                <div>
                  <p className="font-semibold">{item.title}</p>

                  <p className="text-xs text-slate-500">
                    {item.date}
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Actions */}
        <section className="mb-10 flex flex-col gap-4 sm:flex-row">
          <button className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-green-500 px-6 py-4 font-bold text-white shadow-lg transition hover:brightness-95">
            <span className="material-symbols-outlined">chat</span>

            Contact via WhatsApp
          </button>

          <button className="flex flex-1 items-center justify-center gap-2 rounded-2xl border bg-white px-6 py-4 font-bold text-slate-800 transition hover:bg-slate-100">
            <span className="material-symbols-outlined">
              event_repeat
            </span>

            Reschedule
          </button>

          <button className="flex flex-1 items-center justify-center gap-2 rounded-2xl border border-red-500 bg-white px-6 py-4 font-bold text-red-500 transition hover:bg-red-50">
            <span className="material-symbols-outlined">
              cancel
            </span>

            Cancel Booking
          </button>
        </section>
      </main>
    </div>
  );
}