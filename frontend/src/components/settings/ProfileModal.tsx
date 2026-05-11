import React, { useMemo, useState } from "react";
import { Loader2 } from "lucide-react";
import Modal from "./Modal";
import type { BusinessProfile } from "./types";
import { supabase } from "../../services/supabase/client";

export default function ProfileModal({
  open,
  onClose,
  profile,
  onSaved,
  onToast,
}: {
  open: boolean;
  onClose: () => void;
  profile: BusinessProfile;
  onSaved: (next: BusinessProfile) => void;
  onToast: (t: { type: "success" | "error"; message: string }) => void;
}) {
  const initial = useMemo(
    () => ({
      business_name: profile.business_name ?? "",
      description: profile.description ?? "",
      logo_url: profile.logo_url ?? "",
      phone: profile.phone ?? "",
      email: profile.email ?? "",
      website: profile.website ?? "",
      address: profile.address ?? "",
    }),
    [profile]
  );

  const [form, setForm] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Keep form in sync when re-opening with updated profile.
  React.useEffect(() => {
    if (!open) return;
    setForm(initial);
    setError(null);
  }, [open, initial]);

  const save = async () => {
    setError(null);
    if (!form.business_name.trim()) {
      setError("Business name is required.");
      return;
    }

    setSaving(true);
    try {
      const updates = {
        business_name: form.business_name.trim(),
        description: form.description.trim() || null,
        logo_url: form.logo_url.trim() || null,
        phone: form.phone.trim() || null,
        email: form.email.trim() || null,
        website: form.website.trim() || null,
        address: form.address.trim() || null,
        updated_at: new Date().toISOString(),
      };

      // Update business_profiles table
      const { data, error: supaError } = await supabase
        .from("business_profiles")
        .update(updates)
        .eq("id", profile.id)
        .select("*")
        .single();

      if (supaError) throw supaError;

      // Also update user metadata to keep in sync with signup data
      const { error: metadataError } = await supabase.auth.updateUser({
        data: {
          phone: form.phone.trim() || null,
          business_name: form.business_name.trim(),
          email: form.email.trim() || null,
        }
      });

      if (metadataError) {
        console.warn("Failed to update user metadata:", metadataError);
        // Don't fail the whole operation if metadata update fails
      }

      onSaved(data as BusinessProfile);
      onToast({ type: "success", message: "Business profile updated." });
      onClose();
    } catch (e: any) {
      const msg = e?.message ?? "Failed to save profile.";
      setError(msg);
      onToast({ type: "error", message: msg });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      title="Business Profile"
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

        <Field
          label="Business name"
          value={form.business_name}
          onChange={(v) => setForm((f) => ({ ...f, business_name: v }))}
          required
        />
        <Field
          label="Description"
          value={form.description}
          onChange={(v) => setForm((f) => ({ ...f, description: v }))}
          textarea
        />

        <Field
          label="Logo URL"
          value={form.logo_url}
          onChange={(v) => setForm((f) => ({ ...f, logo_url: v }))}
          placeholder="https://..."
        />
        {form.logo_url.trim() ? (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">Preview</p>
            <img
              src={form.logo_url.trim()}
              alt="Logo preview"
              className="h-16 w-16 rounded-2xl object-cover border border-slate-200 bg-white"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = "none";
              }}
            />
          </div>
        ) : null}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field
            label="Phone"
            value={form.phone}
            onChange={(v) => setForm((f) => ({ ...f, phone: v }))}
          />
          <Field
            label="Email"
            value={form.email}
            onChange={(v) => setForm((f) => ({ ...f, email: v }))}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field
            label="Website"
            value={form.website}
            onChange={(v) => setForm((f) => ({ ...f, website: v }))}
          />
          <Field
            label="Address"
            value={form.address}
            onChange={(v) => setForm((f) => ({ ...f, address: v }))}
          />
        </div>
      </div>
    </Modal>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  textarea = false,
  required = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  textarea?: boolean;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-slate-800">
        {label} {required ? <span className="text-red-500">*</span> : null}
      </label>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full min-h-[96px] resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-600 transition"
        />
      ) : (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-600 transition"
        />
      )}
    </div>
  );
}

