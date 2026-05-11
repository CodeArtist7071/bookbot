import React, { useEffect } from "react";
import { X } from "lucide-react";

type ModalProps = {
  title: string;
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
};

export default function Modal({ title, open, onClose, children, footer }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close modal"
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-2xl overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-2xl">
        <div className="flex items-center justify-between gap-4 border-b border-slate-100 bg-slate-50/70 px-6 py-5">
          <div className="min-w-0">
            <h2 className="truncate text-lg font-black text-slate-900">{title}</h2>
          </div>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="rounded-xl p-2 text-slate-500 hover:bg-white hover:text-slate-900 transition"
          >
            <X size={20} />
          </button>
        </div>

        <div className="px-6 py-6">{children}</div>

        {footer ? <div className="border-t border-slate-100 bg-white px-6 py-5">{footer}</div> : null}
      </div>
    </div>
  );
}

