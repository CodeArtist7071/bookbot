# Settings Page – Full Functionality Implementation Instructions

## Context
You are working on `SettingsPage.tsx`, a currently static UI that lists settings categories (Business Management, Preferences, Security & Access, Support). Each setting item shows an icon, title, and subtitle, but none are interactive (except Logout). Your job is to make this page fully operational by connecting it to a Supabase backend and adding editing capabilities for every relevant setting.

The following Supabase tables already exist (or you should assume they are ready):
- `business_profiles` – stores business name, description, logo, contact info (one row per authenticated user)
- `operating_hours` – per‑day opening/closing times (Mon–Sun)
- `business_settings` – flexible key‑value store for other preferences (notifications, language, etc.)

Row Level Security is enabled so that each user can only access their own data.

---

## Objectives
1. **Fetch** the current business profile and settings from Supabase when the page loads.
2. **Display dynamic subtitles** under each setting item that reflect the current stored value.
3. **Open the appropriate editing modal** when a setting item is clicked.
4. **Allow users to edit and save**:
   - Business name, description, logo URL, contact info
   - Weekly operating hours
   - Notification preferences (WhatsApp, email, reminder timing)
   - Language and region
   - Account password (via Supabase Auth)
5. **Handle navigation** for Staff Access (redirect to existing staff page) and external links for Help Center.
6. **Show a Logout button** that calls the existing `logout` function from your AuthProvider.
7. **Provide success/error feedback** after any save operation.

---

## Database Tables (Summary)
- `business_profiles` – columns: `id`, `user_id` (UUID, unique), `business_name`, `description`, `logo_url`, `phone`, `email`, `website`, `address`, `updated_at`
- `operating_hours` – columns: `id`, `profile_id` (FK to `business_profiles`), `day` (enum), `open_time`, `close_time`, `is_closed` (boolean), unique constraint on `(profile_id, day)`
- `business_settings` – columns: `id`, `profile_id` (FK), `key` (text), `value` (jsonb), unique on `(profile_id, key)`

---

## Step‑by‑Step Implementation

### 1. Update the Static Settings List
Add a unique string `key` to each setting item in the `settingsSections` array (e.g., `"profile"`, `"hours"`, `"notifications"`, `"language"`, `"security"`, `"staff"`, `"help"`, `"legal"`). This key will be used to determine which modal to open.

### 2. Import and Use Supabase Client
Ensure you have access to the Supabase client (usually imported from `@/lib/supabase` or similar). Use it for all database operations.

### 3. State Setup
In `SettingsPage`, add state variables:
- `profile` (object) – holds the current business profile row
- `settings` (object) – holds key‑value data from `business_settings` (e.g., `{ notifications: { … }, language: { … } }`)
- `loading` (boolean) – true while data is being fetched
- `error` (string or null) – for fetch errors
- `activeModal` (string or null) – tracks which modal is open (`"profile"`, `"hours"`, etc.)
- `toast` (object or string) – for showing success/error messages

### 4. Data Fetching on Page Load
When the component mounts, perform these steps:
- Get the current authenticated user via `supabase.auth.getUser()`.
- If no user, set an error and stop.
- Query `business_profiles` for a row where `user_id` matches the current user.
- If no row exists (first time), create one with default/empty values.
- Store the profile in state.
- Query `business_settings` for all rows belonging to this profile. Transform them into an object `{ [key]: value }` and store it in state.
- Set `loading` to false.

### 5. Dynamic Subtitles
Create a helper that returns a subtitle string for each setting key based on the current data:
- **Profile**: If `profile.business_name` exists, show it; otherwise “Set your business name and contact info”.
- **Hours**: Show a generic prompt like “Manage opening and closing hours”.
- **Notifications**: Indicate whether WhatsApp alerts are enabled, or show “Configure alerts”.
- **Language**: Display the current language label (e.g., “English (United States)”) from `settings.language.label`.
- **Security**: Static text like “Password, 2FA”.
- Others: leave empty or use defaults.

Pass these dynamic subtitles to each `SettingItem`.

### 6. Making Setting Items Clickable
Modify the `SettingItem` component (or its usage) to accept an `onClick` handler. When clicked, call a function that:
- For **staff**: navigate to the existing staff management page using React Router.
- For **help**: open a help URL in a new tab.
- For **legal**: open the legal modal (or just show static content).
- For all others: set `activeModal` to the corresponding key (e.g., `"profile"`, `"hours"`).

### 7. Building the Modals
Create a reusable `Modal` component (centered overlay, white card, close button). For each editable setting, create a separate component that will be rendered inside the modal.

#### 7.1 Business Profile Modal
- **Opens when**: `activeModal === "profile"`
- **Form fields**: business name, description, logo URL (text input + optional preview), phone, email, website, address.
- **Initial values**: populated from the current `profile` state.
- **On save**:
  - Validate required fields (at least business name).
  - Update the `business_profiles` row using `supabase.from('business_profiles').update({...}).eq('id', profile.id)`.
  - On success: update the local `profile` state, show a success toast, and close the modal.
  - On error: show the error message.

#### 7.2 Operating Hours Modal
- **Opens when**: `activeModal === "hours"`
- **Fetch**: when the modal opens, query `operating_hours` for all days belonging to `profile.id`. If no rows exist, create default empty entries.
- **Form**: a row for each day of the week (Monday–Sunday). Each row contains:
  - Day name (label)
  - “Closed” toggle (checkbox)
  - Open time input (time picker)
  - Close time input
- **Logic**: if “Closed” is checked, nullify the open/close times.
- **On save**:
  - Loop through each day and perform an upsert (insert or update) on `operating_hours` using `{ profile_id, day, open_time, close_time, is_closed }` with conflict on `(profile_id, day)`.
  - On success, show a toast and close the modal.

#### 7.3 Notification Preferences Modal
- **Opens when**: `activeModal === "notifications"`
- **Fields**:
  - Toggle: Enable WhatsApp alerts
  - Toggle: Enable email reports
  - Dropdown: Reminder before appointment (options: 30 minutes, 1 hour, 2 hours, 3 hours, 6 hours, 12 hours, 24 hours)
- **Initial values**: from `settings.notifications` (if any).
- **On save**:
  - Upsert into `business_settings` with `key = "notifications"` and `value` as a JSON object containing the three chosen values.
  - Update local `settings` state accordingly.
  - Show toast.

#### 7.4 Language & Region Modal
- **Opens when**: `activeModal === "language"`
- **Fields**:
  - Language dropdown (list common languages: English, Spanish, French, etc.)
  - Region dropdown (list regions relevant to the language)
- **Compute label** for display: e.g., “English (United States)”.
- **On save**:
  - Upsert into `business_settings` with `key = "language"` and `value = { lang, region, label }`.
  - Update local `settings.language` and the subtitle.
  - Show toast.

#### 7.5 Account Security Modal
- **Opens when**: `activeModal === "security"`
- **Show** the user’s email (from `supabase.auth.getUser()`).
- **Password change form**:
  - Current password
  - New password
  - Confirm new password
- **On submit**:
  - Call `supabase.auth.updateUser({ password: newPassword })`.
  - Handle errors (weak password, wrong current password, etc.).
  - On success, show a success message and close the modal.
- **No database tables** are needed for this; it’s handled by Supabase Auth.

#### 7.6 Legal Modal
- **Opens when**: `activeModal === "legal"`
- **Display static content**:
  - App version (e.g., “BookBot for Business · v2.4.0”)
  - Links to Terms of Service and Privacy Policy (use external URLs or placeholders).
- No database interaction required.

### 8. UI Feedback (Toasts)
After any successful save/update, show a temporary notification at the bottom of the screen (or use a library like Sonner if already installed). For errors, display an alert or a similar error toast. The toast should disappear automatically after a few seconds.

### 9. Logout
The existing Logout button already works. Ensure it calls the `logout` function from `AuthProvider`, which should use `supabase.auth.signOut()`.

### 10. Edge Cases
- If the user does not have a profile yet, create one automatically during the initial fetch so that all subsequent operations work.
- Handle network errors gracefully; show appropriate error messages.
- While saving, disable the submit button and show a loading spinner.
- Ensure all modals can be closed by clicking outside or pressing the escape key.

---

## Testing
Verify the following manually:
- Navigate to Settings. Initially, all subtitles show default placeholders.
- Click “Business Profile” → modal opens with empty fields (or previously saved data).
- Fill in details, save → modal closes, subtitle updates to show the business name.
- Refresh the page → data persists.
- Repeat for operating hours, notifications, language.
- Change password → logout and login with new password.
- Logout works.

---

## Deliverables
- Modified `SettingsPage.tsx` with dynamic fetching, click handlers, and subtitle logic.
- New files for each modal component inside `components/settings/` (e.g., `ProfileModal.tsx`, `HoursModal.tsx`, `NotificationModal.tsx`, etc.).
- A reusable `Modal` component.
- All interactions connected to the existing Supabase tables as described above.