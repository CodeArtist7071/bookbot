# Deployment Guide

BookBot uses a distributed hosting strategy for maximum scalability and low maintenance.

## 1. Frontend (Vercel)
- **Framework**: React / Vite.
- **Auto-deploy**: Pushing to the `main` branch triggers a Vercel build.
- **Environment Variables**:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
  - `VITE_BACKEND_URL`

## 2. Backend (Railway)
- **Framework**: Node.js / Express.
- **Deployment**: Connect GitHub repo to Railway for automatic CI/CD.
- **Environment Variables**:
  - `PORT`
  - `WHATSAPP_TOKEN`
  - `WHATSAPP_PHONE_ID`
  - `WEBHOOK_VERIFY_TOKEN`
  - `RAZORPAY_KEY_ID`
  - `RAZORPAY_KEY_SECRET`

## 3. Database & Auth (Supabase)
- **Database**: Managed PostgreSQL.
- **Auth**: Use Supabase Auth for dashboard logins.
- **RLS**: Ensure Row Level Security is enabled for all tables.

## 4. WhatsApp Cloud API (Meta Developers)
- **Setup**: Create a Meta App and add the WhatsApp product.
- **Webhook**: Set the Railway backend URL as the Webhook destination.
- **Verification**: Use the `WEBHOOK_VERIFY_TOKEN` defined in Railway.
