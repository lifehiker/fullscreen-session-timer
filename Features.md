# Features — Fullscreen Session Timer

Last updated: 2026-05-05

---

## Timer Modes

### Countdown Timer
- **Description:** Single countdown from a user-defined duration. Displays remaining time fullscreen. Ideal for simple timed sessions.
- **Status:** Completed
- **Implementation notes:** Managed via Zustand timer store. Tick uses `setInterval` with drift correction to stay accurate over long sessions.
- **Date added:** 2026-05-05

### Segments Timer (Named Agenda Blocks)
- **Description:** A sequence of named time blocks (e.g., "Introduction", "Q&A"). Each segment has its own duration and label. Timer advances automatically through segments.
- **Status:** Completed
- **Implementation notes:** Segments stored in Zustand store. Drag-and-drop reordering via dnd-kit. Audio cue fires at each segment boundary.
- **Date added:** 2026-05-05

### Intervals Timer (Work/Rest Cycles)
- **Description:** Structured interval training with configurable work duration, rest duration, number of rounds, optional warmup, and optional cooldown periods.
- **Status:** Completed
- **Implementation notes:** Interval builder UI collects work/rest/rounds/warmup/cooldown settings. Generates segment sequence internally. Rendered through the same Zustand-backed timer engine.
- **Date added:** 2026-05-05

---

## Timer Engine

### Drift-Resistant Tick
- **Description:** Keeps timer accurate over long sessions by correcting for JavaScript `setInterval` drift.
- **Status:** Completed
- **Implementation notes:** Each tick compares wall-clock elapsed time against expected elapsed time and adjusts. Prevents accumulated lag over multi-hour sessions.
- **Date added:** 2026-05-05

### Zustand Timer Store
- **Description:** Centralized state management for all timer state (mode, running/paused, current segment, elapsed time, settings).
- **Status:** Completed
- **Implementation notes:** Single Zustand store. Avoids prop drilling across the fullscreen timer UI.
- **Date added:** 2026-05-05

---

## Fullscreen & Display

### Fullscreen API Integration
- **Description:** Launches the timer into true browser fullscreen for distraction-free presentation or focus sessions.
- **Status:** Completed
- **Implementation notes:** Uses the browser Fullscreen API. Fullscreen state is reflected in the UI (enter/exit controls).
- **Date added:** 2026-05-05

### Screen Wake Lock API
- **Description:** Prevents the screen from sleeping while a session is running, ensuring the timer stays visible during presentations or classes.
- **Status:** Completed
- **Implementation notes:** Wake Lock acquired on session start, released on pause/stop or page unload. Graceful fallback if API is unavailable.
- **Date added:** 2026-05-05

### Responsive Layout
- **Description:** UI adapts cleanly to projectors, tablets, and desktops. Large readable timer display at all viewport sizes.
- **Status:** Completed
- **Implementation notes:** Tailwind CSS responsive classes. Tested across common projector and tablet resolutions.
- **Date added:** 2026-05-05

---

## Themes

### 5 Color Themes
- **Description:** Users can choose from Default, Dark, High Contrast, Ocean, and Forest themes to match their environment or preference.
- **Status:** Completed
- **Implementation notes:** Theme applied as a class on the root element. Stored in user preference (localStorage or user profile). shadcn/ui tokens customized per theme.
- **Date added:** 2026-05-05

---

## Audio

### Web Audio API Sound Cues
- **Description:** Plays distinct audio cues at segment end and session complete, alerting the presenter without requiring external sound files.
- **Status:** Completed
- **Implementation notes:** Uses Web Audio API to synthesize tones at runtime. No audio file dependencies. Respects browser autoplay policies (triggered by user interaction flow).
- **Date added:** 2026-05-05

---

## Session Management

### Local Draft Persistence
- **Description:** Automatically saves the current in-progress session configuration as a draft to localStorage so work is not lost on page refresh.
- **Status:** Completed
- **Implementation notes:** One anonymous draft slot. Loaded on app init if present. Overwritten on each change.
- **Date added:** 2026-05-05

### Local Session Library (Up to 3 Sessions)
- **Description:** Users can save up to 3 named sessions locally without an account. Saved sessions can be loaded, edited, and re-run.
- **Status:** Completed
- **Implementation notes:** Stored in localStorage as JSON. Limit enforced at save time with user feedback when limit is reached.
- **Date added:** 2026-05-05

### Session Presets
- **Description:** Built-in ready-to-use session templates: Workshop, Presentation, Classroom, Intervals, and Countdown. Lets users get started immediately.
- **Status:** Completed
- **Implementation notes:** Presets are static configurations loaded into the timer store when selected. Can be customized before running.
- **Date added:** 2026-05-05

---

## Segment Editing

### Drag-and-Drop Segment Reordering
- **Description:** Segments in the agenda builder can be reordered by dragging. Provides intuitive rearrangement of session blocks.
- **Status:** Completed
- **Implementation notes:** Implemented with dnd-kit. Drag handles visible on each segment row.
- **Date added:** 2026-05-05

### Interval Builder UI
- **Description:** Dedicated UI for configuring interval sessions: set work duration, rest duration, number of rounds, warmup, and cooldown in one place.
- **Status:** Completed
- **Implementation notes:** Builds a segment list from the configured parameters. Previews the generated interval sequence before starting.
- **Date added:** 2026-05-05

---

## Authentication & Users

### User Registration
- **Description:** New users can create an account with email and password. Enables cloud-saved sessions and Pro plan access.
- **Status:** Completed
- **Implementation notes:** Password hashed with bcryptjs before storage. Prisma 6 + SQLite backend.
- **Date added:** 2026-05-05

### User Authentication (NextAuth v5 Credentials)
- **Description:** Secure login with email and password via NextAuth v5 Credentials provider.
- **Status:** Completed
- **Implementation notes:** NextAuth v5 session management. JWT-based sessions. Auth state surfaced in Navbar.
- **Date added:** 2026-05-05

### Session-Aware Navbar
- **Description:** Navbar reflects current auth state — shows login/register links when logged out, account/logout when logged in.
- **Status:** Completed
- **Implementation notes:** Uses NextAuth `useSession` / server session to render correct nav state without flicker.
- **Date added:** 2026-05-05

---

## Subscription & Monetization

### Pro Plan Subscription Model (Stripe-Ready)
- **Description:** Subscription tier gating for Pro features. Infrastructure in place; Stripe integration is configured and ready for activation.
- **Status:** Completed
- **Implementation notes:** User model includes subscription status fields. Pricing page at `/pricing`. Stripe webhook handling scaffolded.
- **Date added:** 2026-05-05

### Pricing Page
- **Description:** Dedicated `/pricing` page describing Free vs. Pro plan tiers and features. Entry point for conversion.
- **Status:** Completed
- **Implementation notes:** Static page with plan comparison table. CTA links to registration or Stripe checkout.
- **Date added:** 2026-05-05

---

## SEO & Landing Pages

### /presentation-timer Landing Page
- **Description:** SEO-optimized landing page targeting users searching for a presentation timer. Explains use case and drives conversion.
- **Status:** Completed
- **Implementation notes:** Next.js page with metadata/title/description tuned for "presentation timer" search intent.
- **Date added:** 2026-05-05

### /classroom-timer Landing Page
- **Description:** SEO-optimized landing page targeting teachers and educators searching for a classroom timer.
- **Status:** Completed
- **Implementation notes:** Next.js page with metadata tuned for "classroom timer" search intent.
- **Date added:** 2026-05-05

### /interval-timer Landing Page
- **Description:** SEO-optimized landing page targeting users searching for an interval timer (fitness, pomodoro, etc.).
- **Status:** Completed
- **Implementation notes:** Next.js page with metadata tuned for "interval timer" search intent.
- **Date added:** 2026-05-05

---

## UI & Components

### shadcn/ui Component Library
- **Description:** Consistent, accessible UI components throughout the app using shadcn/ui.
- **Status:** Completed
- **Implementation notes:** Components installed into the project (not a runtime dependency). Customized per theme via CSS variables.
- **Date added:** 2026-05-05

---

## Infrastructure & Deployment

### Docker Deployment
- **Description:** App ships as a Docker container for easy self-hosting and deployment to services like Coolify.
- **Status:** Completed
- **Implementation notes:** `HOSTNAME=0.0.0.0` set for container networking. Next.js `output: 'standalone'` for minimal image size. Dockerfile included in repo.
- **Date added:** 2026-05-05

### Prisma 6 + SQLite Database
- **Description:** Lightweight SQLite database via Prisma 6 ORM. Stores users, sessions, and subscription data. No external database required.
- **Status:** Completed
- **Implementation notes:** Prisma schema with User and subscription models. Migrations committed to repo. SQLite file persisted via Docker volume in production.
- **Date added:** 2026-05-05
