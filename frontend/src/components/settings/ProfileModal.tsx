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
    () => {
      // Parse existing phone to separate country code and national number
      const existingPhone = profile.phone ?? "";
      let countryCode = "+91";
      let nationalNumber = existingPhone;
      
      // Extract country code if present
      if (existingPhone.startsWith("+")) {
        const match = existingPhone.match(/^\+(\d{1,3})(\d+)$/);
        if (match) {
          countryCode = "+" + match[1];
          nationalNumber = match[2];
        }
      } else if (existingPhone.length > 10) {
        // Assume first 1-3 digits are country code
        countryCode = "+" + existingPhone.slice(0, existingPhone.length - 10);
        nationalNumber = existingPhone.slice(-10);
      }
      
      return {
        business_name: profile.business_name ?? "",
        description: profile.description ?? "",
        logo_url: profile.logo_url ?? "",
        phone: profile.phone ?? "",
        phoneCountryCode: countryCode,
        phoneNationalNumber: nationalNumber,
        email: profile.email ?? "",
        website: profile.website ?? "",
        address: profile.address ?? "",
      };
    },
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
      // Combine country code and national number for full phone
      const fullPhone = form.phoneCountryCode && form.phoneNationalNumber 
        ? `${form.phoneCountryCode}${form.phoneNationalNumber.replace(/\D/g, '')}`
        : form.phone?.trim() || null;

      const updates = {
        business_name: form.business_name.trim(),
        description: form.description.trim() || null,
        logo_url: form.logo_url.trim() || null,
        phone: fullPhone,
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
          phone: fullPhone,
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

        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="mb-2 block text-sm font-bold text-slate-800">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-[120px_1fr] gap-3">
              <select
                value={form.phoneCountryCode || "+91"}
                onChange={(e) => setForm((f) => ({ ...f, phoneCountryCode: e.target.value }))}
                className="w-full h-14 rounded-2xl border border-slate-200 bg-slate-50 px-4 outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-600 transition"
              >
                <option value="+1">+1 (US/CA)</option>
                <option value="+44">+44 (UK)</option>
                <option value="+49">+49 (DE)</option>
                <option value="+61">+61 (AU)</option>
                <option value="+64">+64 (NZ)</option>
                <option value="+65">+65 (SG)</option>
                <option value="+91">+91 (IN)</option>
                <option value="+92">+92 (PK)</option>
                <option value="+93">+93 (AF)</option>
                <option value="+94">+94 (LK)</option>
                <option value="+95">+95 (MM)</option>
                <option value="+971">+971 (AE)</option>
                <option value="+966">+966 (SA)</option>
              </select>
              <input
                type="tel"
                value={form.phoneNationalNumber || ""}
                onChange={(e) => setForm((f) => ({ ...f, phoneNationalNumber: e.target.value }))}
                placeholder="Phone number"
                className="w-full h-14 rounded-2xl border border-slate-200 bg-slate-50 px-4 outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-600 transition"
              />
            </div>
          </div>
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

