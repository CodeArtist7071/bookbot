import React, { useEffect } from "react";
import { CheckCircle2, AlertCircle, X } from "lucide-react";

export type ToastState =
  | { type: "success" | "error"; message: string }
  | null;

export default function Toast({
  toast,
  onClear,
  durationMs = 3500,
}: {
  toast: ToastState;
  onClear: () => void;
  durationMs?: number;
}) {
  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => onClear(), durationMs);
    return () => window.clearTimeout(t);
  }, [toast, onClear, durationMs]);

  if (!toast) return null;

  const isSuccess = toast.type === "success";

  return (
    <div className="fixed bottom-6 left-1/2 z-[90] w-[calc(100%-32px)] max-w-md -translate-x-1/2">
      <div
        className={`flex items-start gap-3 rounded-2xl border px-4 py-3 shadow-xl backdrop-blur ${
          isSuccess
            ? "border-green-200 bg-green-50 text-green-800"
            : "border-red-200 bg-red-50 text-red-800"
        }`}
        role="status"
        aria-live="polite"
      >
        <div className="mt-0.5">
          {isSuccess ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
        </div>
        <div className="flex-1 text-sm font-semibold leading-relaxed">{toast.message}</div>
        <button
          type="button"
          aria-label="Dismiss"
          onClick={onClear}
          className="rounded-lg p-1 opacity-70 hover:opacity-100 hover:bg-white/40 transition"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}

