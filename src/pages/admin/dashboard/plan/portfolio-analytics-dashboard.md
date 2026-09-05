# Portfolio Analytics Dashboard

## Overview

The currently empty admin Dashboard will become a private **Portfolio Analytics / Insights Dashboard**.

Its purpose is to measure how visitors use the portfolio, identify which pages and features are most engaging, and provide useful insights into the effectiveness of the portfolio's design and content.

---

# 1. Overall Portfolio Analytics

Track general portfolio traffic and engagement.

### Metrics

- Total visits
- Total page views
- Unique visitors
- Returning visitors
- Total sessions
- Average session duration
- Total time spent
- Bounce rate
- Engagement rate
- Most visited page
- Most interacted page

### Time periods

Analytics should be viewable by:

- Today
- Last 7 days
- Last 30 days
- Monthly
- Yearly
- Custom date range (future feature)

---

# 2. Page Analytics

Track visitor behavior for individual portfolio pages.

### Per-page metrics

- Number of views
- Unique views
- Average time spent
- Total time spent
- Entry rate
- Exit rate
- Scroll depth
- Interaction count
- Engagement score

Example:

| Page | Views | Avg. Time | Interactions |
|------|------:|----------:|-------------:|
| Home | 1,240 | 1m 42s | 3,820 |
| Projects | 830 | 3m 18s | 5,410 |
| About | 510 | 48s | 620 |
| Play | 460 | 4m 12s | 8,930 |

---

# 3. Interaction Tracking

Visitors do not need accounts.

The system should track **anonymous interaction events** rather than identifying individual people.

We don't necessarily need to know *who* interacted.

Instead, we record **what happened**.

### Possible events

- Button clicked
- Project opened
- Project image viewed
- Navbar item clicked
- External link clicked
- GitHub link clicked
- Email link clicked
- Resume downloaded
- Contact form opened
- Contact form submitted
- Copy-to-clipboard
- Scroll depth reached
- Interactive component used
- Animation interacted with
- Play preset selected
- Play preset changed

Example event:

```text
PROJECT_OPENED

Rather than:

John opened Project #1
4. Visitor Behavior

Analyze how visitors move through the portfolio.

Visitor flow

Example:

Home
  ↓
Projects
  ↓
Project #1
  ↓
Play
  ↓
Contact

The Dashboard should eventually show common navigation paths.

This can help determine:

Where visitors usually enter
Which page they visit next
Which pages lead to other pages
Where visitors commonly leave
Which pages encourage further exploration
5. Time Analysis

Track how much time visitors spend on the portfolio.

Metrics
Average session duration
Average page duration
Total session time
Total page time
Time spent per page
Most time-consuming page
Least time-consuming page

Example:

Projects
Average time: 3m 10s

About
Average time: 48s

Time alone should not determine whether a page is interesting.

It should be combined with views and interactions.

6. Engagement Analysis

A page with many views is not automatically the most interesting page.

Example:

About
1,000 views
32 seconds average
120 interactions

Projects
700 views
3m 10 seconds average
4,200 interactions

Projects receives fewer views but significantly more engagement.

Therefore, the Dashboard should eventually calculate an Engagement Score using multiple signals.

Possible signals:

Views
Time spent
Interaction count
Scroll depth
Returning visits
Feature usage

The exact formula will be designed later.

7. Device Analytics

Track general device information.

Possible categories:

Mobile
Tablet
Desktop

Additional information may include:

Browser
Operating system
Screen size

This can help determine whether the portfolio experience works well across different devices.

8. Location Analytics

If implemented, track approximate visitor location.

Possible information:

Country
Region
City (if sufficiently accurate)

This should remain privacy-conscious and should not attempt to identify individual visitors.

9. Play Feature Analytics

The /play feature allows visitors to switch between complete, pre-designed portfolio style presets.

Each preset represents a complete visual identity rather than individual settings.

Examples:

Minimal
Glass
Vaporwave
Brutalist
Neumorphism
Maximalism
Cyberpunk
Retro
Editorial
Terminal

Analytics can measure how visitors interact with these presets.

Example
Minimal
Views: 1,240
Average session: 2m 31s
Interactions: 4,820

Glass
Views: 730
Average session: 3m 12s
Interactions: 4,910

Vaporwave
Views: 540
Average session: 4m 08s
Interactions: 6,420

The Dashboard could then identify:

Vaporwave currently has the highest interaction rate.

This can demonstrate both the visual design capability of the portfolio and the ability to analyze user behavior.

10. Privacy Philosophy

Visitors should not need an account to use the portfolio.

The analytics system should focus on anonymous/aggregated behavior.

The goal is to understand:

What visitors view
What visitors interact with
How long visitors stay
Which features are useful
Which designs attract engagement
How visitors navigate the portfolio

The goal is not to identify individual visitors.

11. Proposed Dashboard Sections

The admin Dashboard can eventually contain:

Overview

High-level statistics:

Total views
Unique visitors
Sessions
Average session duration
Engagement rate
Most visited page
Most interacted page
Pages

Detailed page analytics:

Views
Average time
Total time
Scroll depth
Interactions
Engagement score
Interactions

Most-used features and actions:

Most clicked elements
Most opened projects
Most used features
Most selected Play presets
Most common interaction types
Visitor Flow

Visual representation of common visitor navigation paths.

Time Analysis

Charts showing:

Daily activity
Weekly activity
Monthly activity
Yearly activity
Devices

Breakdown of:

Mobile
Tablet
Desktop
Browser
Operating system
Locations

Approximate geographic distribution of visitors.

12. Future Analytics Ideas

Potential future additions:

Real-time active visitors
Live visitor counter
Traffic sources
Referrer tracking
Search engine traffic
UTM campaign tracking
Most popular projects
Most downloaded resources
Conversion tracking
Contact-form conversion rate
Resume download conversion rate
Project-to-contact conversion
A/B testing
Design preset comparison
Automatic insights
13. Core Principle

The analytics system should answer questions such as:

How many people visited my portfolio?

How long did they stay?

Which pages did they spend the most time on?

Which pages did they leave quickly?

Which pages received the most interactions?

Which projects are visitors most interested in?

Which features are actually being used?

Which Play preset gets the most engagement?

How do visitors navigate through my portfolio?

Is the portfolio becoming more engaging over time?

The Dashboard should turn raw visitor activity into useful insights about the portfolio's design, content, and user experience.

14. Planned Architecture

The portfolio frontend will generate anonymous analytics events.

Example:

Visitor
   ↓
React Portfolio
   ↓
Analytics Event
   ↓
Backend API
   ↓
Database
   ↓
Analytics Processing
   ↓
Admin Dashboard

Example event:

{
  "event": "PROJECT_OPENED",
  "page": "/projects",
  "target": "project-1",
  "timestamp": "2026-08-XXTXX:XX:XXZ"
}

The backend will aggregate these events into useful statistics for the admin Dashboard.

# 15. Public / Viewer Analytics

The analytics system will not be limited to the private admin Dashboard.

A simplified version of the analytics can also be exposed to portfolio visitors.

The purpose is not to give visitors access to the full analytics system, but to let them see selected, aggregated statistics about the portfolio itself.

This turns the portfolio analytics into part of the portfolio experience.

---

## 15.1 Concept

The admin Dashboard remains the primary analytics center.

However, selected statistics can be displayed publicly through:

- A dedicated Analytics / Insights page
- A section on an existing portfolio page
- A small statistics section on the Home page
- A combination of these depending on the final design

The public analytics should remain simple and visually focused.

Example:

```text
┌─────────────────────────────────────┐
│          PORTFOLIO INSIGHTS         │
│                                     │
│  12,482       8,931       4m 12s   │
│  Visitors      Views      Avg Time  │
│                                     │
│  Most Viewed                         │
│  Projects                            │
│                                     │
│  Most Interactive                    │
│  Play                                │
└─────────────────────────────────────┘
15.2 Public Statistics

Possible statistics that can be shown to visitors:

General
Total visitors
Total page views
Total sessions
Average session duration
Engagement rate
Page Statistics
Most viewed page
Most interacted page
Most visited project
Most engaging page
Portfolio Activity
Total projects viewed
Total resume downloads
Total external link clicks
Total interactions
Play Statistics
Most selected preset
Total Play visits
Most interacted preset
Average time spent in Play

Only statistics that are appropriate for public display should be exposed.

15.3 Real Data

The public analytics section should use actual analytics data generated by the portfolio.

It should NOT use:

Fake visitor numbers
Hardcoded statistics
Randomly generated numbers
Demo data in production

Example:

Visitor
   ↓
Portfolio Interaction
   ↓
Analytics Event
   ↓
Backend
   ↓
Database
   ↓
Analytics Processing
   ↓
Public Analytics API
   ↓
Viewer Analytics Section

The same underlying analytics system should power both the Admin Dashboard and the public statistics.

15.4 Public Analytics API

The backend should provide a separate endpoint for public-safe analytics.

Conceptually:

/admin/analytics

For private, detailed analytics.

And:

/public/analytics

For statistics that are safe to expose publicly.

The public endpoint must NOT expose raw analytics events or sensitive information.

Example response:

{
  "visitors": 12482,
  "pageViews": 23891,
  "sessions": 9310,
  "averageSessionDuration": 252,
  "mostViewedPage": "/projects",
  "mostInteractedPage": "/play",
  "play": {
    "totalVisits": 4820,
    "mostPopularPreset": "Vaporwave"
  }
}

The exact API structure will be decided during implementation.

15.5 Privacy

Public analytics must remain aggregated and privacy-conscious.

Visitors should never be able to see:

Individual visitor identities
IP addresses
Individual sessions
Raw event records
Precise visitor locations
Personal information
Identifiable browsing histories

The public view should only expose aggregated statistics.

Example:

GOOD

12,482 visitors
23,891 page views
Most viewed page: Projects

BAD

Visitor #4921
Visited Home → Projects → Contact
IP: xxx.xxx.xxx.xxx
Location: ...
15.6 Visualization

The public analytics should prioritize visual presentation over detailed tables.

Possible visualizations:

Statistic cards
Simple charts
Activity graphs
Progress indicators
Page popularity bars
Interaction charts
Play preset comparison
Visitor growth graph

The visualization should fit the portfolio's overall design.

It should feel like part of the portfolio rather than an external analytics application.

15.7 Time Period

The public analytics may use a simplified time period selector.

Possible options:

All Time
30 Days
7 Days
Today

Alternatively, the public page can simply show a fixed period such as:

Last 30 Days

The exact presentation will depend on the final UI.

The Admin Dashboard will retain the more advanced time filtering system.

15.8 Public vs Admin Analytics

The two analytics experiences should have different purposes.

Admin Dashboard

Designed for detailed analysis.

Includes:

Full metrics
Detailed page analytics
Rawer event analysis
Visitor flow
Device analytics
Location analytics
Detailed interaction analytics
Time analysis
Engagement scoring
Advanced filtering
Future conversion analytics
Future real-time analytics
Public Analytics

Designed for simple visualization.

Includes:

Visitor count
Page views
General engagement
Popular pages
Popular projects
Play statistics
Simple trends
Selected portfolio activity

The public version should intentionally contain less information.

15.9 Purpose of Public Analytics

Public analytics serves two purposes.

1. Transparency

Visitors can see that the portfolio is actively being used.

Instead of simply claiming:

"This portfolio has analytics."

The portfolio can demonstrate real activity.

2. Portfolio Demonstration

The analytics itself becomes part of the developer's portfolio.

It demonstrates the ability to build:

Event tracking
Backend analytics
Data aggregation
APIs
Data visualization
Privacy-conscious analytics
Interactive dashboards
Real-time or near-real-time data systems

The analytics page therefore becomes both:

A feature of the portfolio

and

A demonstration of the developer's technical ability.
15.10 Recommended Placement

The public analytics should NOT necessarily become the primary landing-page content.

The preferred approach is to expose it through a dedicated section or page.

Possible structure:

Portfolio
│
├── Home
├── About
├── Projects
├── Experience
├── Play
├── Analytics / Insights
└── Contact

Alternatively, a smaller statistics section can appear on Home:

Home
│
├── Hero
├── About
├── Projects
├── Skills
├── Portfolio Statistics
└── Contact

The dedicated Analytics / Insights page can then contain more visualizations.

The final placement will depend on the portfolio's overall UX.

15.11 Real-Time Consideration

A future version may display live or near-real-time statistics.

Examples:

● 3 visitors exploring now

Portfolio activity today
1,248 views

However, real-time visitor information should only be implemented if it can be presented in a privacy-conscious way.

This is considered a future enhancement rather than a requirement for the initial public analytics implementation.

15.12 Core Rule

The public analytics should follow this principle:

Show the story, not the raw data.

Admin users need detailed data to analyze the portfolio.

Visitors only need enough information to understand:

How much the portfolio is being used
What people are interested in
Which parts are most engaging
How the portfolio has performed over time

The public analytics should therefore remain:

Simple
Visual
Aggregated
Privacy-conscious
Real
Consistent with the portfolio design
16. Updated Analytics Architecture

The analytics architecture now supports two consumers.

                    PORTFOLIO
                        │
                        ▼
                Analytics Events
                        │
                        ▼
                   Backend API
                        │
                        ▼
                    Database
                        │
                        ▼
              Analytics Processing
                        │
              ┌─────────┴─────────┐
              ▼                   ▼
       Admin Analytics      Public Analytics
              │                   │
              ▼                   ▼
       Admin Dashboard       Viewer Pages
       Detailed Data        Aggregated Data

Both systems use the same underlying analytics infrastructure.

The difference is what data each system is allowed to access.

17. Updated Core Principle

The analytics system should serve both the developer and the visitor.

Admin
→ Analyze the portfolio.

Visitor
→ Experience the portfolio and see selected real statistics.

Analytics System
→ Measure what actually happens.

The portfolio should therefore not only be interactive and visually engaging.

It should also be capable of demonstrating its own usage through real, aggregated analytics.


**One architectural point I'd strongly keep:** don't create a completely separate tracking system for the viewer analytics. Use the **same event pipeline and database**, then expose a sanitized/aggregated public API. That way, you're building the analytics system once instead of accidentally creating *Analytics System #2: Electric Boogaloo*. 😭

Status

Planned feature

The current Dashboard is intentionally empty and will later be transformed into the portfolio's private analytics and insights center.

The analytics system should be designed alongside the portfolio's other features so that visitor interactions can be measured from the beginning rather than retrofitted later.