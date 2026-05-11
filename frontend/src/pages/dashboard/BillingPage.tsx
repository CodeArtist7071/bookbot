import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { PLACEHOLDER_BILLING_CARD } from "../../constants/images";

const invoices = [
  {
    id: "INV-9402",
    date: "Sep 24, 2024",
    amount: "$19.99",
    status: "Paid",
  },
  {
    id: "INV-8831",
    date: "Aug 24, 2024",
    amount: "$19.99",
    status: "Paid",
  },
  {
    id: "INV-8210",
    date: "Jul 24, 2024",
    amount: "$19.99",
    status: "Paid",
  },
];

const BillingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f8f9fc] text-[#0e121b]">
      {/* Header */}
      <header className="flex items-center justify-between p-4 pb-2">
        <button
          aria-label="Go back"
          onClick={() => navigate(-1)}
          className="flex h-12 w-12 items-center justify-center rounded-full hover:bg-gray-100 transition"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>

        <h1 className="flex-1 text-lg font-bold tracking-tight">
          Billing
        </h1>
      </header>

      {/* Plan Card */}
      <section className="p-4">
        <div className="overflow-hidden rounded-xl bg-white shadow-sm border border-slate-200">
          <img
            src={PLACEHOLDER_BILLING_CARD}
            alt="Plan banner"
            className="aspect-video w-full object-cover"
            loading="lazy"
          />

          <div className="p-4">
            <h2 className="text-lg font-bold">Pro Plan</h2>

            <div className="mt-2 flex flex-col gap-1 text-sm text-slate-500">
              <p>Renews on Oct 24, 2024</p>
              <p>$19.99 per month</p>
            </div>
          </div>
        </div>
      </section>

      {/* Upgrade */}
      <section className="px-4 pb-4">
        <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-700 px-6 py-3 font-semibold text-white shadow-lg transition active:scale-[0.98]">
          <span className="material-symbols-outlined">upgrade</span>
          Upgrade Plan
        </button>
      </section>

      {/* Payment Method */}
      <section className="border-t border-slate-200 px-4 pt-6">
        <h3 className="pb-4 text-lg font-bold">Payment Method</h3>

        <div className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm border border-slate-200">
          <div className="flex items-center gap-4">
            <div
              className="h-6 w-10 bg-contain bg-center bg-no-repeat"
              style={{
                backgroundImage:
                  'url("https://lh3.googleusercontent.com/aida-public/AB6AXuC54i6nNMaLvWPP6pmJKWo_1UuO0fav_x6J1qyOrXewrhINd7hBue9oKBQ_zsPnbN4TQZLnfpNEkWCpLnVxgUbR1v0qcWcU8wVVB8D7Fj1DJF0U5OeAV9Dw2LJoLmvwlYiXNcBtFGi4peQZ5x38b4vPfOAtFsuPei3q_mPo3S6Mqpbn1xaorhZZZdbdnNMgR40cH6Vy78vN8F5ot1aOIE0RyTn5mzgJ0HArbAhV61rWZZeLjsnOC7p37n9PoAl8CD_7Qj7fus6q8Vg")',
              }}
            />
            <div>
              <p className="font-medium">Visa ending in 4242</p>
              <p className="text-sm text-slate-500">Expires 12/26</p>
            </div>
          </div>

          <button className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium hover:bg-slate-200">
            Edit
          </button>
        </div>
      </section>

      {/* Invoices */}
      <section className="px-4 pt-6 pb-8">
        <h3 className="pb-4 text-lg font-bold">Recent Invoices</h3>

        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          {invoices.map((invoice, index) => (
            <div
              key={invoice.id}
              className={`flex items-center justify-between px-4 py-4 hover:bg-slate-50 transition ${
                index !== invoices.length - 1
                  ? "border-b border-slate-200"
                  : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                  <span className="material-symbols-outlined">
                    description
                  </span>
                </div>

                <div className="flex flex-col">
                  <span className="text-sm font-semibold">
                    Invoice #{invoice.id}
                  </span>
                  <span className="text-xs text-slate-500">
                    {invoice.date}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex flex-col items-end">
                  <span className="text-sm font-bold">
                    {invoice.amount}
                  </span>

                  <span className="rounded bg-green-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-green-700">
                    {invoice.status}
                  </span>
                </div>

                <button className="text-slate-400 hover:text-blue-700">
                  <span className="material-symbols-outlined">
                    download
                  </span>
                </button>
              </div>
            </div>
          ))}
        </div>

        <button className="mt-4 w-full rounded-lg border border-blue-200 bg-blue-50 py-2 text-sm font-semibold text-blue-700">
          View All History
        </button>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-slate-100 p-6">
        <div className="flex flex-col items-center gap-3">
          <p className="text-center text-sm text-slate-500">
            Need help with your subscription?
          </p>

          <div className="flex items-center gap-4 text-sm">
            <Link to="/dashboard/settings" className="flex items-center gap-1 font-medium text-blue-700">
              <span className="material-symbols-outlined text-[18px]">
                help_outline
              </span>
              Contact Support
            </Link>

            <span className="text-slate-300">|</span>

            <Link to="/dashboard/settings" className="flex items-center gap-1 font-medium text-blue-700">
              <span className="material-symbols-outlined text-[18px]">
                receipt_long
              </span>
              Billing Policy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default BillingPage;