# BookBot - Complete WhatsApp Booking Flow Implementation

## Instructions for AI Agent

---

## Overview

You are working on **BookBot**, a SaaS platform that enables businesses to manage bookings through WhatsApp. Currently, the project has two main sections:

1. **Super Admin Panel** - Manages all businesses on the platform
2. **Business Dashboard** - Individual business management interface

The **critical flaw** is that the core functionality — the WhatsApp booking flow for customers — is completely missing. Customers scanning a QR code have no booking experience.

---

## Your Task

Implement the complete WhatsApp booking flow from QR scan to booking confirmation. This involves fixing existing frontend issues, building backend webhook handlers, creating a conversation state machine, and integrating with the WhatsApp Cloud API.

---

## Phase 1: Fix Existing Frontend Issues

### 1.1 Fix QR Code Generation

**File:** `QRCodePage.tsx`

**Problem:** Contains a placeholder div with text "QR Code Placeholder" instead of generating an actual QR code.

**What to do:**
- Install the `qrcode.react` package and its TypeScript types
- Replace the placeholder div with a functional QR code generator component
- The QR code should encode a WhatsApp deep link in the format: `https://wa.me/{businessPhone}?text={encodedMessage}`
- Add a download button that captures the QR code canvas and triggers a PNG download
- Add a copy link button that copies the WhatsApp URL to clipboard
- The component should accept `businessPhone`, `businessName`, and optional `welcomeMessage` as props
- Handle empty states when business phone is not yet configured
- Add proper TypeScript types for all props

---

### 1.2 Fix Navigation Issues

**Problem:** All back buttons, action buttons, and footer links are non-functional across ALL pages. They lack `onClick` handlers or proper routing.

**Files affected:**
- `WhatsAppSetupPage.tsx`
- `BookingDetailsPage.tsx`
- `BillingPage.tsx`
- `NotificationsPage.tsx`
- `ReviewsPage.tsx`
- `ServicesPage.tsx`
- `StaffPage.tsx`
- `DashboardPage.tsx`
- `AnalyticsPage.tsx`

**What to do:**
- Import and use `useNavigate` from react-router-dom in each component
- Add `onClick={() => navigate(-1)}` to all back arrow buttons
- Replace all `<a href="#">` with proper `<Link to="/route">` components
- Ensure the "View All" links in DashboardPage navigate to their respective pages
- Fix bottom navigation bars to highlight active page and navigate correctly
- Add `aria-label` attributes to icon-only buttons for accessibility

---

### 1.3 Fix Form Handlers

**File:** `WhatsAppSetupPage.tsx`

**Problem:** The form has state variables (`appId`, `businessId`) but the "Save and Continue" and "Skip for now" buttons have no functionality.

**What to do:**
- Add form validation to check that both fields are filled
- Create an `onClick` handler for "Save and Continue" that validates and submits the data
- Add a loading state that disables the button and shows a spinner during submission
- Add error handling that displays validation errors inline
- Make the "Skip for now" button navigate to the dashboard
- Make the progress indicator dynamic — update the step counter and progress bar when form is submitted
- Add keyboard support — allow Enter key to submit the form

---

### 1.4 Add Loading, Error, and Empty States

**Problem:** All list-based components display static hardcoded data with no loading, error, or empty states.

**Files affected:**
- `BookingsPage.tsx`
- `ServicesPage.tsx`
- `StaffPage.tsx`
- `ReviewsPage.tsx`
- `NotificationsPage.tsx`
- `AnalyticsPage.tsx`
- `BillingPage.tsx`

**What to do for each:**
- Add a `useState` for `loading` (boolean), `error` (string | null), and `data` (array)
- Add a `useEffect` that simulates or performs data fetching
- Show a skeleton loader or spinner when `loading` is true
- Show an error message with a retry button when `error` is set
- Show an empty state message with illustration when `data` array is empty
- Replace hardcoded data with state-driven rendering
- Add pull-to-refresh or a refresh button capability

---

### 1.5 Fix Temporary Image URLs

**Problem:** Multiple components use long Google CDN URLs that will expire, breaking all images.

**Files affected:**
- `BookingDetailsPage.tsx` - Customer avatar
- `StaffPage.tsx` - Staff member photos
- `BillingPage.tsx` - Credit card icon
- `WhatsAppSetupPage.tsx` - Tutorial thumbnail
- `AdminDashboard.tsx` - Admin avatar

**What to do:**
- Create a constants file at `src/constants/images.ts` with named exports for all placeholder images
- Store actual placeholder images in the `public/images/` directory
- Replace all hardcoded Google URLs with the constants
- Add fallback logic: if image fails to load, show initials in a colored circle
- Ensure all `<img>` tags have proper `alt` text

---

## Phase 2: Build Backend Infrastructure

### 2.1 Create Database Migration

**What to do:**
- Create a migration file `001_create_conversations.sql` in `database/migrations/`
- Create a `conversations` table with the following schema:
  - `id` (UUID, primary key)
  - `business_id` (UUID, foreign key to businesses)
  - `customer_phone` (VARCHAR, not null)
  - `customer_name` (VARCHAR, nullable)
  - `state` (VARCHAR, default 'greeting') — tracks which step of booking flow
  - `selected_service_id` (UUID, nullable)
  - `selected_staff_id` (UUID, nullable)
  - `selected_date` (DATE, nullable)
  - `selected_time` (TIME, nullable)
  - `metadata` (JSONB, nullable)
  - `created_at` and `updated_at` (TIMESTAMP)
- Add unique constraint on (`business_id`, `customer_phone`)
- Create indexes on `state` and `business_id` columns
- Extend the existing `bookings` table to add:
  - `conversation_id` (UUID, referencing conversations)
  - `reminder_sent` (BOOLEAN, default false)

---

### 2.2 Build Webhook Controller

**File:** Create `src/controllers/webhook.controller.ts`

**What to do:**
- Create a `verifyWebhook` method for GET requests that:
  - Checks `hub.mode` equals "subscribe"
  - Validates `hub.verify_token` against `WHATSAPP_VERIFY_TOKEN` environment variable
  - Returns `hub.challenge` on success, 403 on failure
  
- Create a `handleMessage` method for POST requests that:
  - Extracts the message object from `req.body.entry[0].changes[0].value.messages[0]`
  - Extracts `businessPhone` from the metadata
  - Extracts `customerPhone` from `message.from`
  - Looks up the business by phone number in the database
  - Routes to `handleTextMessage` or `handleInteractiveMessage` based on `message.type`
  - Always returns 200 quickly (WhatsApp requires this)
  - Catches and logs all errors without crashing

- Create `handleTextMessage` function that:
  - Finds or creates a conversation for this customer+business combination
  - Detects booking intent by checking for keywords: "book", "appointment", "hi", "hello", "hey"
  - Updates conversation state to "service_selection" when intent detected
  - Triggers sending the service selection list

- Create `handleInteractiveMessage` function that:
  - Looks up the current conversation
  - Uses a switch statement on `conversation.state` to handle each step:
    - `service_selection` → parse `list_reply.id`, update state to `staff_selection`
    - `staff_selection` → parse `list_reply.id`, update state to `date_selection`
    - `date_selection` → parse `button_reply.id`, update state to `time_selection`
    - `time_selection` → parse `list_reply.id`, update state to `confirmation`
    - `confirmation` → if button "confirm", create booking and set state to "completed"; if "cancel", set state to "cancelled"
  - After each state change, trigger the next message to the customer

---

### 2.3 Build WhatsApp Service

**File:** Create `src/services/whatsapp.service.ts`

**What to do:**
- Create a class `WhatsAppService` that encapsulates all WhatsApp Cloud API calls
- Store API credentials from environment variables
- Implement these methods:

  **`sendServiceList(customerPhone, businessId)`**
  - Fetch services from database for this business
  - Format as WhatsApp interactive list message
  - Each row shows: service name, duration, price

  **`sendStaffList(customerPhone, businessId)`**
  - Fetch staff members from database for this business
  - Format as WhatsApp interactive list message
  - Each row shows: staff name, role, rating

  **`sendDateOptions(customerPhone)`**
  - Generate next 7 days
  - Format as WhatsApp interactive button message
  - Each button shows: "Mon, Oct 24", "Tue, Oct 25", etc.

  **`sendTimeSlots(customerPhone, availableSlots)`**
  - Accept array of available time strings
  - Format as WhatsApp interactive list message
  - Only show slots that are actually available

  **`sendConfirmation(customerPhone, conversation)`**
  - Build booking summary text with all selected details
  - Format as WhatsApp interactive button message
  - Buttons: "✅ Confirm" and "❌ Cancel"

  **`sendSuccessMessage(customerPhone, booking)`**
  - Send confirmation with booking ID
  - Include instructions for rescheduling or cancelling

  **`sendText(customerPhone, text)`**
  - Simple text message sender
  - Used for final confirmations and error messages

- All methods should call a private `sendMessage` method that makes the actual API call to `https://graph.facebook.com/{version}/{phone_id}/messages`

---

### 2.4 Build Conversation Service

**File:** Create `src/services/conversation.service.ts`

**What to do:**
- Implement `findOrCreate({ businessId, customerPhone })` — returns existing or creates new conversation
- Implement `findByPhone(customerPhone, businessId)` — finds active conversation
- Implement `updateState(conversationId, newState)` — changes the booking flow state
- Implement `update(conversationId, data)` — partial update for selected service/staff/date/time
- Store conversation state transitions in metadata for debugging

---

### 2.5 Build Booking Service with Slot Calculator

**File:** Create `src/services/booking.service.ts`

**What to do:**
- Implement `create(bookingData)` — inserts new booking into database
- Implement `getAvailableSlots(businessId, staffId, date, serviceDuration)` that:
  - Gets business operating hours (e.g., 9 AM - 6 PM)
  - Gets staff working hours for that day
  - Gets all existing bookings for that staff on that date
  - Generates all possible time slots based on service duration
  - Removes slots that overlap with existing bookings
  - Returns array of available time strings in 12-hour format
  - Handles edge cases: start of day, end of day, back-to-back bookings

---

## Phase 3: Create Routes and Configuration

### 3.1 Create Webhook Routes

**File:** Create `src/routes/webhook.routes.ts`

- Register GET `/api/webhook/whatsapp` for webhook verification
- Register POST `/api/webhook/whatsapp` for incoming messages
- Add raw body parser middleware (WhatsApp sends signed payloads)
- Add request logging for debugging

### 3.2 Environment Configuration

Create a `.env.example` file with these variables (use placeholder values):
- `WHATSAPP_PHONE_NUMBER_ID` — From Meta Developer Dashboard
- `WHATSAPP_ACCESS_TOKEN` — From Meta Developer Dashboard
- `WHATSAPP_VERIFY_TOKEN` — Custom string you create
- `WHATSAPP_API_VERSION` — e.g., "v18.0"
- `DATABASE_URL` — PostgreSQL connection string
- `APP_URL` — Your deployed application URL

---

## Phase 4: Build Frontend Flow Configuration Page

### 4.1 Create WhatsAppFlowConfig.tsx

**File:** Create `src/pages/WhatsAppFlowConfig.tsx`

**What to do:**
- Create a settings page where businesses can customize their WhatsApp bot
- Add editable fields for:
  - Welcome greeting message (with `{{business_name}}` variable support)
  - Service selection prompt text
  - Staff selection prompt text
  - Confirmation message template
- Add toggles for:
  - Enable/disable staff selection step
  - Send appointment reminders (with timing dropdown)
  - Request review after service
- Add a preview panel that shows how messages will look in WhatsApp
- Add a "Save Configuration" button that persists to database

---

## Phase 5: Complete Flow Integration Checklist

Verify the complete flow works end-to-end:

1. **Business Setup Flow:**
   - [ ] Business owner logs into dashboard
   - [ ] Configures services in ServicesPage
   - [ ] Adds staff in StaffPage
   - [ ] Sets operating hours in SettingsPage
   - [ ] Connects WhatsApp in WhatsAppSetupPage
   - [ ] Downloads QR code from QRCodePage
   - [ ] Customizes bot messages in WhatsAppFlowConfig

2. **Customer Booking Flow:**
   - [ ] Customer scans QR code with phone camera
   - [ ] WhatsApp opens with deep link
   - [ ] Customer sends the pre-filled message
   - [ ] Bot responds with service list within 2 seconds
   - [ ] Customer taps a service
   - [ ] Bot shows staff selection
   - [ ] Customer taps a provider
   - [ ] Bot shows available dates
   - [ ] Customer taps a date
   - [ ] Bot shows available time slots (no double bookings)
   - [ ] Customer taps a time
   - [ ] Bot shows booking summary with Confirm/Cancel
   - [ ] Customer taps Confirm
   - [ ] Bot sends success message with booking ID
   - [ ] Booking appears in business dashboard immediately

3. **Error Handling:**
   - [ ] Invalid QR code shows helpful error
   - [ ] Expired conversation gracefully times out
   - [ ] No available slots shows alternative message
   - [ ] Double booking attempt is prevented server-side
   - [ ] WhatsApp API failures have retry logic

---

## Key Principles to Follow

1. **Always return 200 quickly** from webhook — WhatsApp times out after 20 seconds
2. **Use idempotency keys** for database writes to prevent duplicate bookings
3. **Log everything** — webhook payloads, state transitions, and API calls
4. **Handle concurrency** — two customers booking the same slot simultaneously
5. **Validate all inputs** — never trust WhatsApp payloads directly
6. **Keep UI responsive** — all backend calls should show loading states
7. **Test with real WhatsApp numbers** — the sandbox behaves differently

---

## Deliverables

When complete, the following should be functional:

1. ✅ QR code generates correctly and opens WhatsApp
2. ✅ All navigation works across all pages
3. ✅ Forms submit and validate properly
4. ✅ Loading, error, and empty states exist on all list views
5. ✅ Images load correctly with fallback handling
6. ✅ Webhook receives and processes WhatsApp messages
7. ✅ Conversation state machine guides customers through booking
8. ✅ Services, staff, and time slots display from database
9. ✅ Bookings are created and appear in business dashboard
10. ✅ Slot calculator prevents double bookings

---

## Notes

- The business dashboard pages (BookingsPage, StaffPage, ServicesPage, etc.) currently have hardcoded data. Wire them to real API endpoints as part of this work.
- The super admin dashboard (AdminDashboard, UsersManagement, etc.) can remain with mock data for now — focus on the business-to-customer flow first.
- Test the complete flow manually before considering it done.