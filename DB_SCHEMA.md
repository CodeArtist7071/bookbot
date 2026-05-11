# Database Schema Definition

This document outlines the table structures for the BookBot application. These definitions are based on an analysis of the dashboard views and data requirements.

## 1. Businesses (Profiles)
Stores information about the business owner/entity.
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID (PK)` | Primary Key |
| `name` | `TEXT` | Name of the business |
| `owner_name` | `TEXT` | Name of the business owner |
| `phone` | `TEXT` | Contact phone number |
| `email` | `TEXT` | Business email address |
| `logo_url` | `TEXT` | URL to business logo |
| `address` | `TEXT` | Physical address |
| `created_at` | `TIMESTAMPTZ` | Record creation time |

## 2. Staff
Profiles for employees/stylists within a business.
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID (PK)` | Primary Key |
| `business_id` | `UUID (FK)` | Reference to Businesses |
| `name` | `TEXT` | Staff member name |
| `role` | `TEXT` | Job title/role (e.g., "Senior Stylist") |
| `image_url` | `TEXT` | Profile image URL |
| `rating` | `DECIMAL(3,2)` | Average customer rating |
| `skills` | `TEXT[]` | List of skills/specializations |
| `is_active` | `BOOLEAN` | Whether the staff member is currently employed |

## 3. Services
The catalog of services offered by the business.
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID (PK)` | Primary Key |
| `business_id` | `UUID (FK)` | Reference to Businesses |
| `name` | `TEXT` | Service name (e.g., "Executive Haircut") |
| `description` | `TEXT` | Detailed description of the service |
| `price` | `DECIMAL(10,2)` | Cost of the service |
| `duration_mins` | `INTEGER` | Duration in minutes |
| `is_active` | `BOOLEAN` | Whether the service is currently offered |

## 4. Bookings
Customer appointments for services.
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID (PK)` | Primary Key |
| `business_id` | `UUID (FK)` | Reference to Businesses |
| `customer_name` | `TEXT` | Name of the customer |
| `customer_phone` | `TEXT` | Customer's WhatsApp/Phone number |
| `service_id` | `UUID (FK)` | Reference to Services |
| `staff_id` | `UUID (FK)` | Reference to Staff (Optional/Assigned) |
| `booking_date` | `TIMESTAMPTZ` | Scheduled date and time |
| `status` | `ENUM` | `pending`, `confirmed`, `cancelled`, `completed` |
| `total_price` | `DECIMAL(10,2)` | Price at time of booking |
| `created_at` | `TIMESTAMPTZ` | When the booking was made |

## 5. Reviews
Customer feedback for completed bookings.
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID (PK)` | Primary Key |
| `booking_id` | `UUID (FK)` | Reference to Bookings |
| `rating` | `INTEGER` | 1-5 star rating |
| `comment` | `TEXT` | Customer feedback text |
| `created_at` | `TIMESTAMPTZ` | Feedback submission time |

## 6. Business Hours
Operating schedule for the business.
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | `UUID (PK)` | Primary Key |
| `business_id` | `UUID (FK)` | Reference to Businesses |
| `day_of_week` | `INTEGER` | 0 (Sun) to 6 (Sat) |
| `open_time` | `TIME` | Opening time |
| `close_time` | `TIME` | Closing time |
| `is_closed` | `BOOLEAN` | Whether closed on this day |
