# API Routes

The backend is built with Node.js and Express, serving as the bridge between the WhatsApp Cloud API, Supabase, and the React Frontend.

## 1. WhatsApp Webhook
- `POST /webhook`: Handles incoming messages from the WhatsApp Cloud API.
- `GET /webhook`: Verification endpoint for setting up the Meta Webhook.

## 2. Business & Onboarding (Protected)
- `POST /api/business/register`: Initial onboarding to create business profile.
- `GET /api/business/profile`: Fetch business settings, including QR code links.
- `PUT /api/business/profile`: Update business info and branding.
- `GET /api/business/stats`: Summary data (revenue, bookings count, ratings) for dashboard.

## 3. Service Management (Protected)
- `GET /api/services`: List all services for the business.
- `POST /api/services`: Add a new service (name, price, duration).
- `PUT /api/services/:id`: Update existing service.
- `DELETE /api/services/:id`: Remove a service.
- `GET /api/business/availability`: Fetch/Update working hours and holidays.

## 4. Appointments
- `GET /api/appointments`: Fetch all bookings with filters (date range, status).
- `POST /api/appointments/manual`: Create a booking from the dashboard.
- `PATCH /api/appointments/:id/status`: Update status (Confirmed, Completed, Cancelled).

## 5. Customer Directory
- `GET /api/customers`: List all unique customers and their history.
- `GET /api/customers/:id`: Detailed view of a specific customer's bookings and feedback.

## 6. Reviews
- `GET /api/reviews`: Fetch all customer feedback.
- `POST /api/reviews/request`: Trigger a manual review request via WhatsApp.

## 7. Payments & Subscriptions
- `POST /api/payments/create-order`: Initiate Razorpay subscription/payment.
- `POST /api/payments/webhook`: Handle Razorpay payment confirmation events.
- `GET /api/payments/billing-info`: Fetch current subscription status and invoices.
