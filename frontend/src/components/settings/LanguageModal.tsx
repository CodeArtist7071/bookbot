import React, { useEffect, useMemo, useState } from "react";
import { Loader2 } from "lucide-react";
import Modal from "./Modal";
import { supabase } from "../../services/supabase/client";

type LanguageValue = {
  lang: string;
  region: string;
  label: string;
};

const LANGUAGES = [
  { value: "en", label: "English" },
  { value: "es", label: "Spanish" },
  { value: "fr", label: "French" },
  { value: "de", label: "German" },
  { value: "pt", label: "Portuguese" },
  { value: "hi", label: "Hindi" },
];

const REGIONS_BY_LANG: Record<string, { value: string; label: string }[]> = {
  en: [
    { value: "US", label: "United States" },
    { value: "GB", label: "United Kingdom" },
    { value: "IN", label: "India" },
    { value: "AU", label: "Australia" },
  ],
  es: [
    { value: "ES", label: "Spain" },
    { value: "MX", label: "Mexico" },
  ],
  fr: [
    { value: "FR", label: "France" },
    { value: "CA", label: "Canada" },
  ],
  de: [{ value: "DE", label: "Germany" }],
  pt: [
    { value: "BR", label: "Brazil" },
    { value: "PT", label: "Portugal" },
  ],
  hi: [{ value: "IN", label: "India" }],
};

function computeLabel(lang: string, region: string) {
  const langLabel = LANGUAGES.find((l) => l.value === lang)?.label ?? lang;
  const regionLabel =
    (REGIONS_BY_LANG[lang] ?? []).find((r) => r.value === region)?.label ?? region;
  return `${langLabel} (${regionLabel})`;
}

export default function LanguageModal({
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
  onSaved: (value: LanguageValue) => void;
  onToast: (t: { type: "success" | "error"; message: string }) => void;
}) {
  const initial = useMemo<LanguageValue>(() => {
    const v = initialValue ?? {};
    const lang = typeof v.lang === "string" ? v.lang : "en";
    const region =
      typeof v.region === "string"
        ? v.region
        : (REGIONS_BY_LANG[lang]?.[0]?.value ?? "US");
    return {
      lang,
      region,
      label: typeof v.label === "string" ? v.label : computeLabel(lang, region),
    };
  }, [initialValue]);

  const [form, setForm] = useState<LanguageValue>(initial);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setForm(initial);
    setError(null);
  }, [open, initial]);

  const regions = REGIONS_BY_LANG[form.lang] ?? REGIONS_BY_LANG.en;

  const save = async () => {
    setSaving(true);
    setError(null);
    try {
      const next: LanguageValue = {
        lang: form.lang,
        region: form.region,
        label: computeLabel(form.lang, form.region),
      };

      const payload = { profile_id: profileId, key: "language", value: next };
      const { error: supaError } = await supabase
        .from("business_settings")
        .upsert(payload, { onConflict: "profile_id,key" });
      if (supaError) throw supaError;

      onSaved(next);
      onToast({ type: "success", message: "Language & region saved." });
      onClose();
    } catch (e: any) {
      const msg = e?.message ?? "Failed to save language settings.";
      setError(msg);
      onToast({ type: "error", message: msg });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      title="Language & Region"
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

        <div className="rounded-2xl border border-slate-200 p-4">
          <label className="block text-sm font-bold text-slate-900 mb-2">Language</label>
          <select
            value={form.lang}
            onChange={(e) => {
              const nextLang = e.target.value;
              const nextRegion = (REGIONS_BY_LANG[nextLang] ?? REGIONS_BY_LANG.en)[0]?.value ?? "US";
              setForm((f) => ({
                ...f,
                lang: nextLang,
                region: nextRegion,
              }));
            }}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-600 transition"
          >
            {LANGUAGES.map((l) => (
              <option key={l.value} value={l.value}>
                {l.label}
              </option>
            ))}
          </select>
        </div>

        <div className="rounded-2xl border border-slate-200 p-4">
          <label className="block text-sm font-bold text-slate-900 mb-2">Region</label>
          <select
            value={form.region}
            onChange={(e) => setForm((f) => ({ ...f, region: e.target.value }))}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-600 transition"
          >
            {regions.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Current label</p>
          <p className="text-sm font-semibold text-slate-900">{computeLabel(form.lang, form.region)}</p>
        </div>
      </div>
    </Modal>
  );
}

