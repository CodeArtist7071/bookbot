# Database Schema (Supabase)

The database uses PostgreSQL with Supabase for Row Level Security (RLS) to ensure data isolation between different businesses.

## Tables

### 1. `businesses`
- `id`: UUID (Primary Key)
- `name`: Text
- `owner_id`: UUID (FK to auth.users)
- `phone_number`: Text (WhatsApp Number)
- `subscription_status`: Text (Active, Trialing, Expired)

### 2. `services`
- `id`: UUID (PK)
- `business_id`: UUID (FK to businesses)
- `name`: Text
- `price`: Numeric
- `duration_minutes`: Integer

### 3. `appointments`
- `id`: UUID (PK)
- `business_id`: UUID (FK to businesses)
- `customer_name`: Text
- `customer_phone`: Text
- `service_id`: UUID (FK to services)
- `appointment_date`: Date
- `time_slot`: Time
- `status`: Enum (Pending, Confirmed, Completed, Cancelled)

### 4. `reviews`
- `id`: UUID (PK)
- `appointment_id`: UUID (FK to appointments)
- `rating`: Integer (1-5)
- `comment`: Text
- `is_public`: Boolean (If posted to Google via flow)
