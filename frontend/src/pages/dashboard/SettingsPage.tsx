import React, { useEffect, useMemo, useState } from "react";
import {
  Store,
  Clock3,
  Bell,
  Globe,
  Shield,
  Users,
  HelpCircle,
  Info,
  ChevronRight,
  LogOut,
} from "lucide-react";
import { useAuth } from "../../app/providers/AuthProvider";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../services/supabase/client";
import Toast, { type ToastState } from "../../components/settings/Toast";
import type { BusinessProfile } from "../../components/settings/types";
import ProfileModal from "../../components/settings/ProfileModal";
import HoursModal from "../../components/settings/HoursModal";
import NotificationsModal from "../../components/settings/NotificationsModal";
import LanguageModal from "../../components/settings/LanguageModal";
import SecurityModal from "../../components/settings/SecurityModal";
import LegalModal from "../../components/settings/LegalModal";
import { Loader2, RefreshCw } from "lucide-react";

const settingsSections = [
  {
    title: "Business Management",
    items: [
      {
        key: "profile",
        icon: <Store className="w-5 h-5 text-blue-600" />,
        title: "Business Profile",
        subtitle: "Logo, description, and contact info",
        bg: "bg-blue-100",
      },
      {
        key: "hours",
        icon: <Clock3 className="w-5 h-5 text-blue-600" />,
        title: "Operating Hours",
        subtitle: "Define when you're open for business",
        bg: "bg-blue-100",
      },
    ],
  },
  {
    title: "Preferences",
    items: [
      {
        key: "notifications",
        icon: <Bell className="w-5 h-5 text-purple-600" />,
        title: "Notification Preferences",
        subtitle: "WhatsApp alerts and email reports",
        bg: "bg-purple-100",
      },
      {
        key: "language",
        icon: <Globe className="w-5 h-5 text-purple-600" />,
        title: "Language & Region",
        subtitle: "English (United States)",
        bg: "bg-purple-100",
      },
    ],
  },
  {
    title: "Security & Access",
    items: [
      {
        key: "security",
        icon: <Shield className="w-5 h-5 text-red-600" />,
        title: "Account Security",
        subtitle: "Password, 2FA, and login activity",
        bg: "bg-red-100",
      },
      {
        key: "staff",
        icon: <Users className="w-5 h-5 text-red-600" />,
        title: "Staff Access",
        subtitle: "Manage roles and permissions",
        bg: "bg-red-100",
      },
    ],
  },
  {
    title: "Support",
    items: [
      {
        key: "help",
        icon: <HelpCircle className="w-5 h-5 text-slate-600" />,
        title: "Help Center",
        subtitle: "Tutorials and documentation",
        bg: "bg-slate-100",
      },
      {
        key: "legal",
        icon: <Info className="w-5 h-5 text-slate-600" />,
        title: "Legal & About",
        subtitle: "Version 2.4.0",
        bg: "bg-slate-100",
      },
    ],
  },
];

type SettingKey =
  | "profile"
  | "hours"
  | "notifications"
  | "language"
  | "security"
  | "staff"
  | "help"
  | "legal";

const SettingItem = ({
  item,
  subtitle,
  onClick,
}: {
  item: any;
  subtitle: string;
  onClick: () => void;
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center gap-4 p-4 hover:bg-slate-50 active:bg-slate-100 transition-colors text-left"
    >
      <div
        className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${item.bg}`}
      >
        {item.icon}
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-bold text-slate-900 truncate">
          {item.title}
        </h4>

        <p className="text-xs text-slate-500 truncate">
          {subtitle}
        </p>
      </div>

      <ChevronRight className="w-5 h-5 text-slate-300 shrink-0" />
    </button>
  );
};

export default function BusinessSettings() {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState<BusinessProfile | null>(null);
  const [settings, setSettings] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeModal, setActiveModal] = useState<SettingKey | null>(null);
  const [toast, setToast] = useState<ToastState>(null);

  const fetchAll = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      const user = userData?.user;
      if (!user) {
        setError("You must be logged in to view settings.");
        return;
      }

      // 1) Fetch or create profile.
      const { data: existingProfile, error: profileError } = await supabase
        .from("business_profiles")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();
      if (profileError) throw profileError;

      let p = existingProfile as BusinessProfile | null;

      if (!p) {
        const { data: created, error: createError } = await supabase
          .from("business_profiles")
          .insert({
            user_id: user.id,
            business_name: user.user_metadata?.business_name ?? null,
            phone: user.user_metadata?.phone ?? null,
            email: user.email ?? null,
          })
          .select("*")
          .single();
        if (createError) throw createError;
        p = created as BusinessProfile;
      }
      setProfile(p);

      // 2) Fetch settings rows for this profile.
      const { data: settingsRows, error: settingsError } = await supabase
        .from("business_settings")
        .select("key,value")
        .eq("profile_id", p.id);
      if (settingsError) throw settingsError;
      const obj: Record<string, any> = {};
      for (const row of settingsRows ?? []) obj[row.key] = row.value;
      setSettings(obj);
    } catch (e: any) {
      setError(e?.message ?? "Failed to load settings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const subtitleFor = useMemo(() => {
    return (key: SettingKey) => {
      if (key === "profile") {
        const name = profile?.business_name?.trim();
        return name ? name : "Set your business name and contact info";
      }
      if (key === "hours") return "Manage opening and closing hours";
      if (key === "notifications") {
        const n = settings.notifications;
        return n?.whatsappEnabled ? "WhatsApp alerts enabled" : "Configure alerts";
      }
      if (key === "language") {
        return settings.language?.label ?? "Choose language and region";
      }
      if (key === "security") return "Password, 2FA, and login activity";
      if (key === "staff") return "Manage roles and permissions";
      if (key === "help") return "Tutorials and documentation";
      if (key === "legal") return "Version 2.4.0";
      return "";
    };
  }, [profile, settings]);

  const handleClick = (key: SettingKey) => {
    if (key === "staff") {
      navigate("/dashboard/staff");
      return;
    }
    if (key === "help") {
      window.open("https://example.com/help", "_blank", "noreferrer");
      return;
    }
    setActiveModal(key);
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 text-slate-400">
          <Loader2 className="animate-spin mb-3" size={28} />
          <p className="text-sm font-semibold">Loading settings...</p>
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
          <p className="font-bold mb-2">Couldn’t load settings</p>
          <p className="text-sm">{error}</p>
          <button
            type="button"
            onClick={fetchAll}
            className="mt-4 inline-flex items-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2 text-sm font-bold text-red-700 hover:bg-red-50 transition"
          >
            <RefreshCw size={16} />
            Retry
          </button>
        </div>
      ) : null}

      <div className="space-y-8">
        {settingsSections.map((section, index) => (
          <div key={index}>
            <h3 className="px-4 mb-2 text-xs font-bold uppercase tracking-widest text-slate-400">
              {section.title}
            </h3>

            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              {section.items.map((item, idx) => (
                <div key={idx}>
                  <SettingItem
                    item={item}
                    subtitle={subtitleFor(item.key as SettingKey)}
                    onClick={() => handleClick(item.key as SettingKey)}
                  />
                  {idx !== section.items.length - 1 && (
                    <div className="mx-4 border-t border-slate-100" />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Danger Zone */}
        <div>
          <h3 className="px-4 mb-2 text-xs font-bold uppercase tracking-widest text-red-400">
            Account Actions
          </h3>

          <div className="bg-white rounded-2xl border border-red-100 overflow-hidden shadow-sm">
            <button
              onClick={signOut}
              className="w-full flex items-center gap-4 p-4 hover:bg-red-50 active:bg-red-100 transition-colors text-left group"
            >
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-red-100 group-hover:bg-red-200 transition-colors shrink-0">
                <LogOut className="w-5 h-5 text-red-600" />
              </div>

              <div className="flex-1">
                <h4 className="text-sm font-bold text-red-600">
                  Log Out
                </h4>

                <p className="text-xs text-red-400">
                  Exit from your business account
                </p>
              </div>

              <ChevronRight className="w-5 h-5 text-red-200" />
            </button>
          </div>
        </div>
      </div>

      <div className="mt-12 text-center pb-8">
        <p className="text-xs text-slate-400 font-medium">
          BookBot for Business • v2.4.0
        </p>
      </div>

      {profile ? (
        <>
          <ProfileModal
            open={activeModal === "profile"}
            onClose={() => setActiveModal(null)}
            profile={profile}
            onSaved={(p) => setProfile(p)}
            onToast={(t) => setToast(t)}
          />
          <HoursModal
            open={activeModal === "hours"}
            onClose={() => setActiveModal(null)}
            profileId={profile.id}
            onToast={(t) => setToast(t)}
          />
          <NotificationsModal
            open={activeModal === "notifications"}
            onClose={() => setActiveModal(null)}
            profileId={profile.id}
            initialValue={settings.notifications}
            onSaved={(v) => setSettings((s) => ({ ...s, notifications: v }))}
            onToast={(t) => setToast(t)}
          />
          <LanguageModal
            open={activeModal === "language"}
            onClose={() => setActiveModal(null)}
            profileId={profile.id}
            initialValue={settings.language}
            onSaved={(v) => setSettings((s) => ({ ...s, language: v }))}
            onToast={(t) => setToast(t)}
          />
          <SecurityModal
            open={activeModal === "security"}
            onClose={() => setActiveModal(null)}
            onToast={(t) => setToast(t)}
          />
          <LegalModal open={activeModal === "legal"} onClose={() => setActiveModal(null)} />
        </>
      ) : null}

      <Toast toast={toast} onClear={() => setToast(null)} />
    </div>
  );
}
