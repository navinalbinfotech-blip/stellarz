# High-Level Document (HLD)
## EV Vehicles Listing Platform — Stellarz

**Version:** 1.0  
**Date:** June 2026  
**Prepared by:** Stellarz Product Team  

---

## 1. Executive Summary

Stellarz is a comprehensive Electric Vehicle (EV) discovery and listing platform targeting the Indian market. It enables consumers to browse, compare, and locate electric four-wheelers, two-wheelers, e-bikes, batteries, accessories, and EV charging stations — all in one unified digital experience. The platform is hosted on **Hostinger** and powered by **Supabase** (PostgreSQL) as the primary database.

---

## 2. Business Objective

- Provide a one-stop destination for EV buyers, enthusiasts, and station operators.
- Educate and assist consumers in their EV purchase journey.
- Monetise through dealer/OEM listings, lead generation, banner advertising, and featured placements.
- Support India's EV adoption goals by surfacing charging infrastructure data.

---

## 3. Target Audience

| Segment | Description |
|---|---|
| Individual Buyers | Consumers researching EVs for personal use |
| Fleet Operators | Businesses evaluating EVs for commercial fleets |
| Dealers / OEMs | Manufacturers and dealers listing vehicles |
| Charging Station Operators | Businesses listing and managing EV stations |
| Accessory Sellers | Sellers listing EV-related accessories and batteries |

---

## 4. Product Scope

### 4.1 In Scope
- Vehicle listings: electric cars, SUVs, two-wheelers, e-bikes
- Battery and accessory marketplace listings
- EV charging station directory with search and map view
- User registration and profile management
- Comparison tool (up to 3 vehicles)
- EMI calculator and range estimator
- Dealer/OEM and station operator portals
- Admin CMS for content and listing management
- SEO-optimised public pages

### 4.2 Out of Scope (Phase 1)
- Direct online vehicle purchase / e-commerce checkout
- Insurance integration
- Used / pre-owned EV listings
- Mobile native apps (iOS / Android)

---

## 5. High-Level Architecture

```
┌──────────────────────────────────────────────────────────┐
│                     End Users (Browser)                   │
└────────────────────────┬─────────────────────────────────┘
                         │ HTTPS
┌────────────────────────▼─────────────────────────────────┐
│              Hostinger Web Hosting                        │
│  ┌─────────────────────────────────────────────────────┐  │
│  │  Next.js (SSR / SSG) Front-end Application          │  │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────────────────┐ │  │
│  │  │ Listings │ │  Maps    │ │  Admin / Dealer CMS  │ │  │
│  │  │  Module  │ │  Module  │ │       Module         │ │  │
│  │  └──────────┘ └──────────┘ └──────────────────────┘ │  │
│  └─────────────────────────────────────────────────────┘  │
│  ┌─────────────────────────────────────────────────────┐  │
│  │  Next.js API Routes / Edge Functions                │  │
│  └─────────────────────┬───────────────────────────────┘  │
└────────────────────────┼─────────────────────────────────┘
                         │ REST / PostgREST
┌────────────────────────▼─────────────────────────────────┐
│                     Supabase                              │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────────┐  │
│  │  PostgreSQL  │  │  Auth        │  │  Storage       │  │
│  │  Database    │  │  (JWT / OTP) │  │  (Images/Docs) │  │
│  └──────────────┘  └──────────────┘  └────────────────┘  │
└──────────────────────────────────────────────────────────┘
                         │
┌────────────────────────▼─────────────────────────────────┐
│              Third-Party Integrations                     │
│  Google Maps API  │  Razorpay (future)  │  SendGrid Email │
└──────────────────────────────────────────────────────────┘
```

---

## 6. Key Modules

| Module | Description |
|---|---|
| **Vehicle Listings** | Catalogue of EVs with filters, specs, images, pricing |
| **EV Station Locator** | Search + Google Maps integration for charging stations |
| **Comparison Engine** | Side-by-side comparison of up to 3 EVs |
| **Battery & Accessories** | Separate listing section for batteries and accessories |
| **User Portal** | Registration, wishlist, enquiry history |
| **Dealer / OEM Portal** | Listing management, lead inbox, analytics |
| **Admin CMS** | Full content and user management dashboard |
| **EMI / Range Tools** | On-page calculators for purchase assistance |

---

## 7. Technology Stack Summary

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (React), Tailwind CSS |
| Backend / API | Next.js API Routes (Node.js) |
| Database | Supabase (PostgreSQL) |
| Authentication | Supabase Auth (email/OTP/OAuth) |
| File Storage | Supabase Storage |
| Maps | Google Maps JavaScript API |
| Hosting | Hostinger VPS / Business Shared Hosting |
| CDN | Hostinger CDN / Cloudflare (optional) |
| Email | SendGrid / Supabase Edge Functions |

---

## 8. Non-Functional Requirements (High Level)

| Attribute | Target |
|---|---|
| Page Load Time | < 2.5 s (LCP) on 4G |
| Uptime | 99.9% |
| Concurrent Users | 5,000 (Phase 1) |
| SEO | Core Web Vitals passing; SSR for all listing pages |
| Security | HTTPS, RLS on Supabase, OWASP Top-10 compliance |
| Accessibility | WCAG 2.1 AA |
| Mobile Responsiveness | Full responsive on 320 px – 2560 px viewports |

---

## 9. Milestones

| Phase | Description | Timeline |
|---|---|---|
| Phase 1 | Core listings (cars, 2W, e-bikes), station locator, user auth | Month 1–3 |
| Phase 2 | Battery/accessories listings, comparison, EMI calculator | Month 4–5 |
| Phase 3 | Dealer/OEM portal, admin CMS, lead management | Month 5–6 |
| Phase 4 | SEO optimisation, performance tuning, marketing launch | Month 7 |

---

## 10. Risks & Mitigations

| Risk | Mitigation |
|---|---|
| Data freshness of EV specs | Partner with OEMs / use admin CMS for manual updates |
| Google Maps API cost | Cache geocoded results in DB; use session tokens |
| Supabase free tier limits | Upgrade to Supabase Pro plan at launch |
| Hostinger shared hosting constraints | Use Hostinger VPS for Node.js/Next.js SSR |

---

*End of HLD*
