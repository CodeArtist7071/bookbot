import React, { useEffect, useMemo, useState } from "react";
import { Loader2 } from "lucide-react";
import Modal from "./Modal";
import { supabase } from "../../services/supabase/client";

export default function SecurityModal({
  open,
  onClose,
  onToast,
}: {
  open: boolean;
  onClose: () => void;
  onToast: (t: { type: "success" | "error"; message: string }) => void;
}) {
  const [email, setEmail] = useState<string>("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setError(null);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    (async () => {
      const { data } = await supabase.auth.getUser();
      setEmail(data?.user?.email ?? "");
    })();
  }, [open]);

  const save = async () => {
    setError(null);
    if (!email) {
      setError("Unable to read your account email.");
      return;
    }
    if (!currentPassword) {
      setError("Current password is required.");
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      setError("New password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("New password and confirmation do not match.");
      return;
    }

    setSaving(true);
    try {
      // Re-authenticate (helps catch wrong current password and meets the UX expectation).
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password: currentPassword,
      });
      if (signInError) throw signInError;

      const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });
      if (updateError) throw updateError;

      onToast({ type: "success", message: "Password updated successfully." });
      onClose();
    } catch (e: any) {
      const msg = e?.message ?? "Failed to update password.";
      setError(msg);
      onToast({ type: "error", message: msg });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      title="Account Security"
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
            Update Password
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

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Signed in as</p>
          <p className="text-sm font-semibold text-slate-900">{email || "—"}</p>
        </div>

        <Field
          label="Current password"
          value={currentPassword}
          onChange={setCurrentPassword}
          type="password"
        />
        <Field label="New password" value={newPassword} onChange={setNewPassword} type="password" />
        <Field
          label="Confirm new password"
          value={confirmPassword}
          onChange={setConfirmPassword}
          type="password"
        />
      </div>
    </Modal>
  );
}

function Field({
  label,
  value,
  onChange,
  type,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type: "text" | "password";
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-slate-800">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-600 transition"
      />
    </div>
  );
}

