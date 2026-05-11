import React, { useEffect, useMemo, useState } from "react";
import { Loader2, RefreshCw } from "lucide-react";
import Modal from "./Modal";
import type { OperatingHourRow } from "./types";
import { supabase } from "../../services/supabase/client";

const DAYS: { key: string; label: string }[] = [
  { key: "monday", label: "Monday" },
  { key: "tuesday", label: "Tuesday" },
  { key: "wednesday", label: "Wednesday" },
  { key: "thursday", label: "Thursday" },
  { key: "friday", label: "Friday" },
  { key: "saturday", label: "Saturday" },
  { key: "sunday", label: "Sunday" },
];

function defaultRows(profileId: string): OperatingHourRow[] {
  return DAYS.map((d) => ({
    profile_id: profileId,
    day: d.key,
    open_time: "09:00",
    close_time: "18:00",
    is_closed: false,
  }));
}

export default function HoursModal({
  open,
  onClose,
  profileId,
  onToast,
}: {
  open: boolean;
  onClose: () => void;
  profileId: string;
  onToast: (t: { type: "success" | "error"; message: string }) => void;
}) {
  const [rows, setRows] = useState<OperatingHourRow[]>(() => defaultRows(profileId));
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const byDay = useMemo(() => {
    const map = new Map<string, OperatingHourRow>();
    for (const r of rows) map.set(r.day, r);
    return map;
  }, [rows]);

  const hydrateWithDefaults = (data: any[] | null) => {
    const existing = new Map<string, OperatingHourRow>();
    for (const r of data ?? []) {
      existing.set(r.day, {
        id: r.id,
        profile_id: r.profile_id,
        day: r.day,
        open_time: r.open_time,
        close_time: r.close_time,
        is_closed: !!r.is_closed,
      });
    }
    const merged = DAYS.map((d) => existing.get(d.key) ?? defaultRows(profileId).find((x) => x.day === d.key)!);
    setRows(merged);
  };

  const fetchHours = async () => {
    setError(null);
    setLoading(true);
    try {
      const { data, error: supaError } = await supabase
        .from("operating_hours")
        .select("*")
        .eq("profile_id", profileId);
      if (supaError) throw supaError;
      if (!data || data.length === 0) {
        // Seed defaults (upsert)
        const seed = defaultRows(profileId);
        const { error: seedErr } = await supabase
          .from("operating_hours")
          .upsert(seed, { onConflict: "profile_id,day" });
        if (seedErr) throw seedErr;
        hydrateWithDefaults(seed as any[]);
      } else {
        hydrateWithDefaults(data);
      }
    } catch (e: any) {
      const msg = e?.message ?? "Failed to load operating hours.";
      setError(msg);
      onToast({ type: "error", message: msg });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!open) return;
    fetchHours();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, profileId]);

  const updateRow = (day: string, patch: Partial<OperatingHourRow>) => {
    setRows((prev) => prev.map((r) => (r.day === day ? { ...r, ...patch } : r)));
  };

  const save = async () => {
    setSaving(true);
    setError(null);
    try {
      const payload = rows.map((r) => ({
        profile_id: profileId,
        day: r.day,
        open_time: r.is_closed ? null : r.open_time,
        close_time: r.is_closed ? null : r.close_time,
        is_closed: !!r.is_closed,
      }));

      const { error: supaError } = await supabase
        .from("operating_hours")
        .upsert(payload, { onConflict: "profile_id,day" });

      if (supaError) throw supaError;

      onToast({ type: "success", message: "Operating hours saved." });
      onClose();
    } catch (e: any) {
      const msg = e?.message ?? "Failed to save operating hours.";
      setError(msg);
      onToast({ type: "error", message: msg });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      title="Operating Hours"
      open={open}
      onClose={onClose}
      footer={
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={fetchHours}
            disabled={loading || saving}
            className="rounded-2xl px-4 py-3 font-bold text-slate-600 hover:bg-slate-50 transition disabled:opacity-60 flex items-center gap-2"
          >
            <RefreshCw size={18} />
            Refresh
          </button>
          <div className="flex gap-3">
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
              disabled={saving || loading}
              className="rounded-2xl bg-blue-600 px-6 py-3 font-bold text-white hover:bg-blue-700 transition disabled:opacity-60 flex items-center gap-2"
            >
              {saving ? <Loader2 className="animate-spin" size={18} /> : null}
              Save
            </button>
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        {error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
            {error}
          </div>
        ) : null}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-10 text-slate-400">
            <Loader2 className="animate-spin mb-2" size={26} />
            <p className="text-sm font-semibold">Loading operating hours...</p>
          </div>
        ) : (
          <div className="space-y-3">
            {DAYS.map((d) => {
              const r = byDay.get(d.key) ?? defaultRows(profileId).find((x) => x.day === d.key)!;
              return (
                <div
                  key={d.key}
                  className="grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-3 rounded-2xl border border-slate-200 p-4"
                >
                  <div className="flex items-center justify-between sm:justify-start sm:gap-3">
                    <p className="font-bold text-slate-900">{d.label}</p>
                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-600 sm:hidden">
                      <input
                        type="checkbox"
                        checked={r.is_closed}
                        onChange={(e) =>
                          updateRow(d.key, {
                            is_closed: e.target.checked,
                            open_time: e.target.checked ? null : r.open_time ?? "09:00",
                            close_time: e.target.checked ? null : r.close_time ?? "18:00",
                          })
                        }
                      />
                      Closed
                    </label>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-[auto_auto_auto_auto] gap-3 items-center">
                    <label className="hidden sm:flex items-center gap-2 text-sm font-semibold text-slate-600">
                      <input
                        type="checkbox"
                        checked={r.is_closed}
                        onChange={(e) =>
                          updateRow(d.key, {
                            is_closed: e.target.checked,
                            open_time: e.target.checked ? null : r.open_time ?? "09:00",
                            close_time: e.target.checked ? null : r.close_time ?? "18:00",
                          })
                        }
                      />
                      Closed
                    </label>

                    <div className={`flex items-center gap-2 ${r.is_closed ? "opacity-60" : ""}`}>
                      <span className="text-xs font-bold text-slate-500 w-10">Open</span>
                      <input
                        type="time"
                        disabled={r.is_closed}
                        value={r.open_time ?? ""}
                        onChange={(e) => updateRow(d.key, { open_time: e.target.value })}
                        className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-600 transition"
                      />
                    </div>
                    <div className={`flex items-center gap-2 ${r.is_closed ? "opacity-60" : ""}`}>
                      <span className="text-xs font-bold text-slate-500 w-10">Close</span>
                      <input
                        type="time"
                        disabled={r.is_closed}
                        value={r.close_time ?? ""}
                        onChange={(e) => updateRow(d.key, { close_time: e.target.value })}
                        className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-600 transition"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Modal>
  );
}

