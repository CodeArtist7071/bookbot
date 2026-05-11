import React from "react";
import Modal from "./Modal";

export default function LegalModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <Modal
      title="Legal & About"
      open={open}
      onClose={onClose}
      footer={
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl bg-slate-900 px-6 py-3 font-bold text-white hover:bg-slate-800 transition"
          >
            Close
          </button>
        </div>
      }
    >
      <div className="space-y-5">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm font-bold text-slate-900">BookBot for Business</p>
          <p className="text-sm text-slate-600">v2.4.0</p>
        </div>

        <div className="rounded-2xl border border-slate-200 p-4">
          <p className="text-sm font-bold text-slate-900 mb-2">Links</p>
          <div className="flex flex-col gap-2 text-sm">
            <a
              href="https://example.com/terms"
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-blue-700 hover:underline"
            >
              Terms of Service
            </a>
            <a
              href="https://example.com/privacy"
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-blue-700 hover:underline"
            >
              Privacy Policy
            </a>
          </div>
        </div>

        <p className="text-xs text-slate-500">
          Replace the placeholder links with your real legal URLs when available.
        </p>
      </div>
    </Modal>
  );
}

