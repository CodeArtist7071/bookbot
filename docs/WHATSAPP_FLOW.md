# WhatsApp Conversational Flow

The core of BookBot is the WhatsApp experience. We use interactive messages to guide users.

## 1. Booking Journey
1.  **Greeting**: Customer sends "Hi" or scans QR.
2.  **Service List**: Bot replies with a List Message showing available services.
3.  **Date Selection**: Bot provides buttons for "Today", "Tomorrow", or "Pick a Date".
4.  **Time Slots**: Based on the selected service duration and business hours, bot offers available slots.
5.  **Confirmation**: Bot summarizes the details and asks for final confirmation.
6.  **Database Sync**: Appointment is written to Supabase and dashboard is updated.

## 2. Review Journey
1.  **Trigger**: Appointment marked "Completed" in the dashboard.
2.  **Delay**: System waits a few hours (pre-configured).
3.  **Rating Request**: Bot asks "How was your experience at [Business Name]?" with buttons 1 to 5.
4.  **Logic**:
    *   **4-5 Stars**: Bot sends: "We are glad you loved it! Could you please share this on Google? [Link]"
    *   **1-3 Stars**: Bot sends: "We are sorry to hear that. Could you tell us what went wrong so we can fix it?" (Saves response privately).

## 3. Support Journey
- **Keywords**: "Reschedule", "Cancel", "Human" triggers automated support or flags the business owner in the dashboard.
