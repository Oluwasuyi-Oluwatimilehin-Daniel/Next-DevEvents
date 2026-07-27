# 🚀 DevEvents - Project Vision & Feature Roadmap

## 📌 Project Overview
**DevEvents** is a modern, high-performance web platform designed specifically for the developer community to discover, publish, and register for tech events (hackathons, conferences, meetups, and workshops).

---

## ✅ Completed Features (Phase 1)
- [x] **Live Event Database**: Powered by MongoDB for persistent storage.
- [x] **Media CDN Integration**: Image uploads powered by Cloudinary with secure URLs.
- [x] **Real-time Event Creation**: Instant publishing via `CreateEventForm` with client-side validation and automatic Next.js cache revalidation (`revalidatePath('/')`).
- [x] **Newest-First Display**: Automatic timestamp sorting (`createdAt: -1`) ensuring newly created events immediately land at the top of the homepage grid.
- [x] **Event Detail Pages (`/events/[slug]`)**: Dynamic slug routing with overview, date, time, location, event mode badges, agenda timeline, organizer profile, tags, and similar events recommendations.
- [x] **Spot Registration**: Duplicate booking prevention by email and instant database record creation.
- [x] **Email Notifications**: Formatted HTML confirmation emails sent via Nodemailer to attendees upon booking a spot.
- [x] **Product Analytics**: Integrated PostHog tracking for event views, card clicks, navigation, and booking conversions.
- [x] **Dark Glassmorphism Design System**: Tailored dark theme with emerald gradients, subtle ambient glows, responsive mobile menus, and smooth micro-animations.

---

## 🗺️ Upcoming Feature Roadmap (Phase 2 & Phase 3)

### 1. 🔍 Search, Category & Tag Filtering
- **Search Bar**: Real-time client-side search across event titles, organizers, and descriptions.
- **Category Filter Tabs**: Quick filter by event mode (`All`, `Virtual`, `In Person`, `Hybrid`).
- **Tag Filtering**: Clickable tags (`#react`, `#ai`, `#web3`) to isolate related events.

### 2. 📅 Calendar Integration ("Add to Calendar")
- One-click buttons on event pages to add events directly to:
  - Google Calendar
  - Apple Calendar / Outlook (`.ics` file export)

### 3. 🎟️ Digital Ticket & QR Code Generation
- Unique Ticket ID generated per booking.
- Embed a scannable **QR Code** directly on screen and inside the booking confirmation email.

### 4. ⚙️ Organizer Event Management (Edit & Delete)
- **Delete Event**: `DELETE` API endpoint and button with confirmation modal to remove canceled events.
- **Edit Event**: Edit existing event details (date, venue, agenda) with auto cache updates.

### 5. 📱 Social Share Buttons
- One-click share buttons on event pages for:
  - Twitter / X
  - LinkedIn
  - WhatsApp
  - Copy Direct Link with toast notification

### 6. 🔥 Live Badges & Urgency Indicators
- Dynamic card badges based on live booking counts:
  - `🔥 Trending`
  - `⚡ 5 Spots Left`
  * `🆕 Just Added`

### 7. 🔔 Automated 24-Hour Event Reminders
- Scheduled background worker / cron to send automated email reminders to registered attendees 24 hours prior to event start.

---

## 🛠️ Environment Configuration Guide

### SMTP Configuration for Live Emails (`.env.local`)
```env
# Database & CDN
MONGODB_URI=your_mongodb_connection_string
CLOUDINARY_URL=cloudinary://your_api_key:your_api_secret@your_cloud_name
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Analytics
NEXT_PUBLIC_POSTHOG_KEY=your_posthog_key
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com

# SMTP Live Email Delivery
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EMAIL_FROM="DevEvents" <your-email@gmail.com>
```
