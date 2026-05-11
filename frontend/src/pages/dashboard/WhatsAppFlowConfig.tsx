import React, { useMemo, useState } from "react";
import { Save, ToggleLeft, ToggleRight } from "lucide-react";
import { useAuth } from "../../app/providers/AuthProvider";

type BotConfig = {
  welcomeGreeting: string;
  servicePrompt: string;
  staffPrompt: string;
  confirmationTemplate: string;
  enableStaffSelection: boolean;
  sendReminders: boolean;
  reminderTiming: "1h" | "3h" | "24h";
  requestReviewAfterService: boolean;
};

const DEFAULT_CONFIG: BotConfig = {
  welcomeGreeting: "Hi! Welcome to {{business_name}}. What would you like to book today?",
  servicePrompt: "Please choose a service from the list below.",
  staffPrompt: "Choose a preferred staff member.",
  confirmationTemplate:
    "Great! Here’s your booking summary:\nService: {{service}}\nStaff: {{staff}}\nDate: {{date}}\nTime: {{time}}\n\nConfirm to finalize.",
  enableStaffSelection: true,
  sendReminders: true,
  reminderTiming: "24h",
  requestReviewAfterService: true,
};

function storageKey(businessId: string) {
  return `bookbot:wa_flow_config:${businessId}`;
}

export default function WhatsAppFlowConfig() {
  const { user } = useAuth();
  const businessId = user?.id ?? "local";
  const businessName = (user?.user_metadata?.business_name as string | undefined) ?? "your business";

  const initial = useMemo(() => {
    try {
      const raw = localStorage.getItem(storageKey(businessId));
      return raw ? ({ ...DEFAULT_CONFIG, ...JSON.parse(raw) } as BotConfig) : DEFAULT_CONFIG;
    } catch {
      return DEFAULT_CONFIG;
    }
  }, [businessId]);

  const [config, setConfig] = useState<BotConfig>(initial);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const preview = useMemo(() => {
    const interpolate = (tpl: string) =>
      tpl
        .replace(/\{\{\s*business_name\s*\}\}/g, businessName)
        .replace(/\{\{\s*service\s*\}\}/g, "Haircut")
        .replace(/\{\{\s*staff\s*\}\}/g, config.enableStaffSelection ? "Maria" : "(auto-assigned)")
        .replace(/\{\{\s*date\s*\}\}/g, "Mon, Oct 24")
        .replace(/\{\{\s*time\s*\}\}/g, "10:00 AM");

    return [
      interpolate(config.welcomeGreeting),
      interpolate(config.servicePrompt),
      config.enableStaffSelection ? interpolate(config.staffPrompt) : null,
      interpolate(config.confirmationTemplate),
    ].filter(Boolean);
  }, [businessName, config]);

  const save = async () => {
    setSaving(true);
    setSaved(false);
    try {
      localStorage.setItem(storageKey(businessId), JSON.stringify(config));
      setSaved(true);
      window.setTimeout(() => setSaved(false), 1500);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
        <h1 className="text-2xl font-black text-slate-900 mb-2">WhatsApp Flow Configuration</h1>
        <p className="text-slate-500 mb-8">
          Customize the messages and steps customers see when they start a WhatsApp booking.
        </p>

        <div className="space-y-6">
          <Field
            label="Welcome greeting"
            value={config.welcomeGreeting}
            onChange={(v) => setConfig((c) => ({ ...c, welcomeGreeting: v }))}
            helper='Supports: {{business_name}}'
          />
          <Field
            label="Service selection prompt"
            value={config.servicePrompt}
            onChange={(v) => setConfig((c) => ({ ...c, servicePrompt: v }))}
          />
          <Field
            label="Staff selection prompt"
            value={config.staffPrompt}
            onChange={(v) => setConfig((c) => ({ ...c, staffPrompt: v }))}
            disabled={!config.enableStaffSelection}
          />
          <Field
            label="Confirmation template"
            value={config.confirmationTemplate}
            onChange={(v) => setConfig((c) => ({ ...c, confirmationTemplate: v }))}
            textarea
            helper="Supports: {{service}}, {{staff}}, {{date}}, {{time}}, {{business_name}}"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <Toggle
              label="Enable staff selection"
              value={config.enableStaffSelection}
              onChange={(v) => setConfig((c) => ({ ...c, enableStaffSelection: v }))}
            />
            <Toggle
              label="Send appointment reminders"
              value={config.sendReminders}
              onChange={(v) => setConfig((c) => ({ ...c, sendReminders: v }))}
            />
            <Toggle
              label="Request review after service"
              value={config.requestReviewAfterService}
              onChange={(v) => setConfig((c) => ({ ...c, requestReviewAfterService: v }))}
            />

            <div className={`rounded-2xl border p-4 ${config.sendReminders ? "border-slate-200" : "border-slate-100 opacity-60"}`}>
              <p className="text-sm font-bold text-slate-900 mb-2">Reminder timing</p>
              <select
                disabled={!config.sendReminders}
                value={config.reminderTiming}
                onChange={(e) => setConfig((c) => ({ ...c, reminderTiming: e.target.value as BotConfig["reminderTiming"] }))}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-600 transition"
              >
                <option value="1h">1 hour before</option>
                <option value="3h">3 hours before</option>
                <option value="24h">24 hours before</option>
              </select>
            </div>
          </div>

          <button
            onClick={save}
            disabled={saving}
            className="w-full mt-2 bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-slate-800 transition shadow-lg disabled:opacity-60 flex items-center justify-center gap-2"
          >
            <Save size={18} />
            {saving ? "Saving..." : saved ? "Saved" : "Save Configuration"}
          </button>
        </div>
      </div>

      <div className="bg-slate-900 rounded-3xl shadow-xl p-8 text-white">
        <h2 className="text-lg font-black mb-2">Preview</h2>
        <p className="text-slate-300 text-sm mb-6">A lightweight preview of how messages will look in WhatsApp.</p>

        <div className="space-y-4">
          {preview.map((msg, idx) => (
            <div key={idx} className="bg-white/10 border border-white/10 rounded-2xl p-4">
              <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg as string}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 text-xs text-slate-400">
          Saved locally for business: <span className="font-semibold text-slate-200">{businessName}</span>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  helper,
  textarea = false,
  disabled = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  helper?: string;
  textarea?: boolean;
  disabled?: boolean;
}) {
  return (
    <div className={`${disabled ? "opacity-60" : ""}`}>
      <label className="block text-sm font-bold text-slate-800 mb-2">{label}</label>
      {textarea ? (
        <textarea
          disabled={disabled}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full min-h-[120px] resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-600 transition"
        />
      ) : (
        <input
          disabled={disabled}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-600 transition"
        />
      )}
      {helper ? <p className="mt-2 text-xs text-slate-500">{helper}</p> : null}
    </div>
  );
}

function Toggle({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={() => onChange(!value)}
      className="rounded-2xl border border-slate-200 p-4 text-left hover:bg-slate-50 transition flex items-center justify-between gap-4"
    >
      <div>
        <p className="text-sm font-bold text-slate-900">{label}</p>
        <p className="text-xs text-slate-500">{value ? "Enabled" : "Disabled"}</p>
      </div>
      {value ? <ToggleRight className="text-blue-600" size={28} /> : <ToggleLeft className="text-slate-400" size={28} />}
    </button>
  );
}

