import React, { useEffect, useMemo, useState } from "react";
import { Loader2 } from "lucide-react";
import Modal from "./Modal";
import { supabase } from "../../services/supabase/client";

type NotificationsValue = {
  whatsappEnabled: boolean;
  emailEnabled: boolean;
  reminderTiming: string;
};

const TIMINGS = [
  { value: "30m", label: "30 minutes" },
  { value: "1h", label: "1 hour" },
  { value: "2h", label: "2 hours" },
  { value: "3h", label: "3 hours" },
  { value: "6h", label: "6 hours" },
  { value: "12h", label: "12 hours" },
  { value: "24h", label: "24 hours" },
];

export default function NotificationsModal({
  open,
  onClose,
  profileId,
  initialValue,
  onSaved,
  onToast,
}: {
  open: boolean;
  onClose: () => void;
  profileId: string;
  initialValue: any;
  onSaved: (value: NotificationsValue) => void;
  onToast: (t: { type: "success" | "error"; message: string }) => void;
}) {
  const initial = useMemo<NotificationsValue>(() => {
    const v = initialValue ?? {};
    return {
      whatsappEnabled: !!v.whatsappEnabled,
      emailEnabled: !!v.emailEnabled,
      reminderTiming: typeof v.reminderTiming === "string" ? v.reminderTiming : "24h",
    };
  }, [initialValue]);

  const [form, setForm] = useState<NotificationsValue>(initial);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setForm(initial);
    setError(null);
  }, [open, initial]);

  const save = async () => {
    setSaving(true);
    setError(null);
    try {
      const payload = {
        profile_id: profileId,
        key: "notifications",
        value: form,
      };

      const { error: supaError } = await supabase
        .from("business_settings")
        .upsert(payload, { onConflict: "profile_id,key" });

      if (supaError) throw supaError;
      onSaved(form);
      onToast({ type: "success", message: "Notification preferences saved." });
      onClose();
    } catch (e: any) {
      const msg = e?.message ?? "Failed to save notification preferences.";
      setError(msg);
      onToast({ type: "error", message: msg });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      title="Notification Preferences"
      open={open}
      onClose={onClose}
      footer={
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl px-5 py-3 font-bold text-slate-600 hover:bg-slate-50 transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={save}
            disabled={saving}
            className="rounded-2xl bg-blue-600 px-6 py-3 font-bold text-white hover:bg-blue-700 transition disabled:opacity-60 flex items-center gap-2"
          >
            {saving ? <Loader2 className="animate-spin" size={18} /> : null}
            Save
          </button>
        </div>
      }
    >
      <div className="space-y-5">
        {error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
            {error}
          </div>
        ) : null}

        <ToggleRow
          label="Enable WhatsApp alerts"
          description="Send booking updates and reminders on WhatsApp."
          value={form.whatsappEnabled}
          onChange={(v) => setForm((f) => ({ ...f, whatsappEnabled: v }))}
        />
        <ToggleRow
          label="Enable email reports"
          description="Receive daily/weekly summaries via email."
          value={form.emailEnabled}
          onChange={(v) => setForm((f) => ({ ...f, emailEnabled: v }))}
        />

        <div className="rounded-2xl border border-slate-200 p-4">
          <p className="text-sm font-bold text-slate-900 mb-1">Reminder before appointment</p>
          <p className="text-xs text-slate-500 mb-3">Choose when customers should be reminded.</p>
          <select
            value={form.reminderTiming}
            onChange={(e) => setForm((f) => ({ ...f, reminderTiming: e.target.value }))}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-600 transition"
          >
            {TIMINGS.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </Modal>
  );
}

function ToggleRow({
  label,
  description,
  value,
  onChange,
}: {
  label: string;
  description: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 p-4 flex items-start justify-between gap-4">
      <div className="min-w-0">
        <p className="text-sm font-bold text-slate-900">{label}</p>
        <p className="text-xs text-slate-500 mt-1">{description}</p>
      </div>
      <button
        type="button"
        aria-label={label}
        onClick={() => onChange(!value)}
        className={`h-7 w-12 rounded-full transition relative shrink-0 ${
          value ? "bg-blue-600" : "bg-slate-200"
        }`}
      >
        <span
          className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition ${
            value ? "left-6" : "left-0.5"
          }`}
        />
      </button>
    </div>
  );
}

