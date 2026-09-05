# Portfolio Public Data Hydration, Local Caching & Request Management Plan

## 1. Overview

The portfolio will use a public-data-first client architecture designed to make the website feel instant while keeping the backend as the source of truth.

The system will:

- Store safe, public portfolio data locally in the visitor's browser.
- Render locally available data immediately.
- Silently validate and synchronize local data with the backend.
- Proactively preload public data for pages the visitor has not opened yet.
- Render pages progressively instead of blocking the entire page until everything loads.
- Use skeleton loading for individual sections that are not ready.
- Treat large/heavy assets differently from small structured data.
- Route API requests through a frontend Request Manager.
- Use request deduplication so identical simultaneous requests produce only one network request.
- Queue and prioritize requests to prevent excessive client-side traffic.
- Keep backend rate limiting and protection as the actual security boundary.

The goal is perceived instant loading, not simply reducing the number of backend requests.

---

## 2. Core Architecture

```text
                    ┌──────────────────────────┐
                    │       React Portfolio    │
                    │                          │
                    │  Pages / Components      │
                    └────────────┬─────────────┘
                                 │
                                 ▼
                    ┌──────────────────────────┐
                    │     Memory Cache         │
                    │  Current-session data    │
                    └────────────┬─────────────┘
                                 │
                                 ▼
                    ┌──────────────────────────┐
                    │   IndexedDB / Local DB   │
                    │  Public data only        │
                    └────────────┬─────────────┘
                                 │
                         cache miss / sync
                                 │
                                 ▼
                    ┌──────────────────────────┐
                    │    Request Manager       │
                    │                          │
                    │ • Queue                  │
                    │ • Priority               │
                    │ • Deduplication          │
                    │ • Concurrency limit      │
                    │ • Retry / backoff        │
                    │ • Cancellation           │
                    └────────────┬─────────────┘
                                 │
                                 ▼
                    ┌──────────────────────────┐
                    │       Backend API        │
                    │                          │
                    │ • Public API             │
                    │ • Rate limiting          │
                    │ • Validation             │
                    └────────────┬─────────────┘
                                 │
                                 ▼
                    ┌──────────────────────────┐
                    │      Backend Database    │
                    │    Source of Truth       │
                    └──────────────────────────┘
3. Source of Truth

The backend database remains the authoritative source.

The browser's local database is only a cache/replica of public-safe data.

Backend

Responsible for:

Authoritative portfolio content.
Public API responses.
Admin/private data.
Analytics processing.
Data validation.
Rate limiting.
Security.
Browser Local Database

Responsible for:

Public portfolio content.
Cached public configuration.
Cached public analytics summaries.
Public metadata.
Other data that is safe for visitors to persist locally.

The local database must never become the authoritative database.

4. Local Storage Strategy

The preferred architecture is:

Backend
   ↓
IndexedDB
   ↓
Memory Cache
   ↓
React UI
IndexedDB

Use IndexedDB as the primary persistent browser store because the portfolio may contain structured datasets that are larger and more complex than ideal for localStorage.

Potential stores can include:

publicData
metadata
syncState

The exact schema will be decided during implementation.

Memory Cache

The memory cache exists above IndexedDB for data that is already being used during the current session.

This avoids repeatedly reading IndexedDB for the same data.

5. Initial Application Startup

The portfolio should not wait for every public dataset before rendering.

Startup flow:

Visitor opens portfolio
        ↓
Render application shell immediately
        ↓
Read available local public data
        ↓
Render locally available sections
        ↓
Start background synchronization
        ↓
Start background hydration of other public pages
        ↓
Update individual sections as data arrives

The visitor should never experience:

Loading everything...
        ↓
Blank page
        ↓
Everything appears at once

Instead:

App shell
   ↓
Cached content appears
   ↓
Current page completes
   ↓
Other public data hydrates in background
   ↓
Sections update incrementally
6. Application-Wide Background Hydration

After the application starts, the system should proactively load public data for the portfolio even if the visitor has not opened those pages.

Example:

Visitor opens Home

Priority 1:
    Home data
    Navigation
    Critical UI configuration

Priority 2:
    Projects
    About
    Experience
    Public analytics

Priority 3:
    Other page data
    Secondary content
    Public metadata

Priority 4:
    Heavy assets
    Large images
    Videos
    Other expensive resources

This allows a visitor who navigates from Home → Projects to potentially find Projects already available locally.

However, background hydration must still pass through the Request Manager.

7. Progressive Section Loading

Loading state should belong to individual sections rather than the entire page.

Example:

Home
├── Hero          → Ready
├── About         → Ready
├── Projects      → Ready
├── Analytics     → Skeleton
└── Other Content → Loading

When Analytics finishes:

Home
├── Hero          → Ready
├── About         → Ready
├── Projects      → Ready
├── Analytics     → Ready
└── Other Content → Loading

The rest of the page must remain usable.

Loading UI Rule

Do not use a generic spinner as the primary loading experience.

Use skeletons that represent the actual shape of the content being loaded.

8. Local-First Data Behavior
Case A — Local data exists
Read local data
      ↓
Render immediately
      ↓
Background backend validation
      ↓
Backend unchanged?
      ↓
Keep current data
Case B — Local data exists but backend changed
Read local data
      ↓
Render immediately
      ↓
Backend validation
      ↓
Data changed
      ↓
Update IndexedDB
      ↓
Update memory cache
      ↓
Update React UI
Case C — No local data exists
No local data
      ↓
Request Manager
      ↓
Backend request
      ↓
Skeleton for affected section
      ↓
Response received
      ↓
Save locally
      ↓
Render section
Case D — Backend temporarily unavailable but local data exists

Keep displaying the local data.

Do not replace usable cached content with an empty state simply because a background request failed.

The system can retry later.

9. Synchronization Strategy

The browser needs a reliable way to determine whether its local data is current.

Potential mechanisms:

Dataset version.
Global public-data version.
updatedAt.
Content hash.
HTTP ETag.
Last-Modified.
Conditional requests such as If-None-Match.

A preferred future optimization is a lightweight public manifest:

GET /api/public/manifest

Example conceptual response:

{
  "version": "2026-09-02-001",
  "datasets": {
    "projects": "v12",
    "about": "v4",
    "experience": "v7",
    "analytics": "v19"
  }
}

The client can compare local versions and only download datasets that actually changed.

This can reduce unnecessary payloads while preserving aggressive background synchronization.

The exact synchronization protocol will be finalized during implementation.

10. Request Manager

All public API requests should be routed through a centralized Request Manager instead of allowing every component to independently call fetch().

Responsibilities:

Queue

Requests that cannot run immediately wait in a controlled queue.

Priority

Requests receive priorities based on importance.

Example:

CURRENT_PAGE       → Highest
IMPORTANT_DATA     → High
BACKGROUND_DATA    → Normal
HEAVY/PREFETCH     → Low
Concurrency Limit

The manager limits how many requests can be active simultaneously.

The exact number should be configurable and tested rather than hard-coded prematurely.

For example:

Maximum active requests: 4

Request 1 → running
Request 2 → running
Request 3 → running
Request 4 → running

Request 5 → queued
Request 6 → queued
Request 7 → queued

When one finishes, the next appropriate request begins.

11. Request Deduplication

Request deduplication is a required feature.

If several components request the same resource at approximately the same time:

Component A ─┐
Component B ─┼──→ Request Manager ──→ ONE API request
Component C ─┘

All consumers receive the same result.

Example:

GET /api/public/projects

If five components request it while the first request is still running, the manager must not create five network requests.

Instead:

First request
     ↓
In-flight request registry
     ↓
A ─┐
B ─┼─→ Shared result
C ─┤
D ─┤
E ─┘

This prevents duplicate traffic and unnecessary backend work.

12. Request Cancellation

Low-priority requests should be cancellable when appropriate.

Example:

Visitor starts background loading
        ↓
Visitor changes context / leaves page
        ↓
No longer-needed low-priority request
        ↓
Cancel if safe

Cancellation should not interrupt requests that are already needed by other consumers.

This works together with request deduplication and shared in-flight requests.

13. Retry and Backoff

Temporary failures should not immediately produce repeated requests.

The Request Manager should support:

Limited retries.
Exponential backoff.
Jitter.
Retry only when appropriate.
Avoid retrying permanent errors unnecessarily.

Example:

Request fails
   ↓
Wait
   ↓
Retry
   ↓
Fails again
   ↓
Longer wait
   ↓
Retry

This prevents a temporary outage from turning into a request storm.

14. Large Data and Heavy Assets

Not all public data should be aggressively persisted or downloaded at startup.

Small / structured data

Suitable for local caching:

Text.
Project metadata.
Experience information.
About content.
Public analytics summaries.
Configuration.
Small JSON datasets.
Large data

Should generally use controlled loading:

Large images.
Videos.
Large files.
Heavy visual assets.
Other expensive media.

These can use:

Lazy loading.
Prefetching.
Browser caching.
Dynamic imports.
Asset-level caching.
Priority-based loading.

The goal is to preload useful data, not blindly download every byte of the portfolio.

15. Public Analytics

Public analytics must use a public-safe representation.

The browser should receive aggregated information rather than raw analytics events.

Never place the following in the public local database:

Raw visitor events.
IP addresses.
Individual visitor identities.
Private sessions.
Admin analytics.
Authentication information.
Sensitive operational data.

Public analytics should be small, aggregated, and safe to expose.

16. Backend Protection

Frontend protection is not a security boundary.

A visitor can bypass React and directly call the API.

Therefore the backend must still implement:

Rate limiting.
Request validation.
Authentication for private endpoints.
Authorization.
Payload limits.
Appropriate caching.
Database protection.
Monitoring.

Architecture:

Client Request Manager
        ↓
Backend Rate Limiting
        ↓
Public API
        ↓
Database

The frontend Request Manager exists primarily to control client behavior and improve performance.

17. Failure Behavior

The system should favor graceful degradation.

Cached data + failed backend
Keep cached data
     +
Retry in background
No cached data + failed backend
Show section skeleton
        ↓
Retry according to policy
        ↓
If retries exhausted
        ↓
Show a useful section-level error/fallback

The entire portfolio should not fail because one dataset is unavailable.

18. Performance Philosophy

The system is optimized around perceived performance.

The objective is:

Make the visitor feel like the portfolio was already loaded.

This is achieved by:

Local-first rendering.
Memory caching.
Persistent public caching.
Background synchronization.
Application-wide preloading.
Progressive hydration.
Request deduplication.
Controlled concurrency.
Prioritized requests.
Skeleton-based section loading.
Lazy loading of heavy assets.

The system does not need to eliminate every backend request.

It needs to ensure that requests are controlled, useful, deduplicated, and mostly invisible to the visitor.

19. Example Full Flow
Visitor opens portfolio
        ↓
React app shell renders
        ↓
Memory cache checked
        ↓
IndexedDB checked
        ↓
Cached public data rendered immediately
        ↓
Request Manager starts
        ↓
Public manifest/version checked
        ↓
Changed datasets identified
        ↓
Requests placed into priority queue
        ↓
Current page requests run first
        ↓
Background page data follows
        ↓
Heavy assets remain lower priority
        ↓
Duplicate requests are merged
        ↓
Concurrency limit prevents request flooding
        ↓
Responses update:
    ├── Memory Cache
    ├── IndexedDB
    └── React UI
        ↓
Visitor navigates to another page
        ↓
Its data may already be available
        ↓
If not, only that section/page loads
20. Implementation Components

The eventual implementation should be separated into clear responsibilities.

Potential modules:

src/
├── data/
│   ├── publicData/
│   ├── cache/
│   ├── sync/
│   └── requestManager/
│
├── services/
│   └── publicApi/
│
├── hooks/
│   └── publicData/
│
└── components/
    └── loading/

Potential logical components:

RequestManager
MemoryCache
PublicDatabase
PublicDataHydrator
SyncManager
PublicApi
Section-level loading states
Public-data hooks

These names are conceptual and may change during implementation.

21. Important Rules
Backend remains the source of truth.
Browser storage contains public-safe data only.
Local data should render before waiting for backend validation.
Backend synchronization happens in the background whenever possible.
The application should proactively hydrate public data.
Current-page data gets higher priority than background data.
Heavy assets should not block the application.
No generic full-page spinner.
Use section-level skeletons.
Identical in-flight requests must be deduplicated.
Requests must pass through a controlled queue.
Concurrency must be limited.
Failed requests should use controlled retry/backoff.
Backend rate limiting remains mandatory.
Local cache failure must never compromise the backend source of truth.
Private/admin data must never enter the public cache.
The system should degrade gracefully when the backend is temporarily unavailable.
22. End Goal

The finished architecture should make the portfolio behave approximately like this:

FIRST VISIT
────────────────────────────────────────

Open site
   ↓
Shell appears immediately
   ↓
Cached data (if any) appears
   ↓
Current content loads progressively
   ↓
Other public data silently preloads
   ↓
Local database becomes hydrated


RETURN VISIT
────────────────────────────────────────

Open site
   ↓
Local public data appears immediately
   ↓
Page feels already loaded
   ↓
Backend quietly checks for changes
   ↓
Changed data updates in background


NAVIGATION
────────────────────────────────────────

Open Projects
   ↓
Projects data may already exist locally
   ↓
Render immediately

If not:
   ↓
Only Projects waits
   ↓
Projects skeleton appears
   ↓
Data arrives
   ↓
Projects section renders


UNDER HEAVY REQUEST ACTIVITY
────────────────────────────────────────

Many requests
   ↓
Request Manager
   ↓
Deduplicate identical requests
   ↓
Prioritize important requests
   ↓
Queue excess requests
   ↓
Limit concurrency
   ↓
Retry failures carefully
   ↓
Backend rate limiting provides final protection

This architecture is intended to be the foundation for the portfolio's public data delivery, caching, synchronization, preloading, and request-control layer.