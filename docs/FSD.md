# Functional Specification Document (FSD)
## EV Vehicles Listing Platform — Stellarz

**Version:** 1.0  
**Date:** June 2026  
**Document Owner:** Stellarz Product Team  
**Status:** Draft  

---

## 1. Introduction

This document describes the functional behaviour of every module of the Stellarz platform from a user and system perspective. It translates the business requirements in the BRD into precise functional specifications for the engineering team.

---

## 2. User Roles & Permissions

| Role | Description |
|---|---|
| **Guest** | Unauthenticated visitor |
| **Consumer** | Registered end user |
| **Dealer / OEM** | Business account managing vehicle listings and leads |
| **Station Operator** | Business account managing charging station listings |
| **Admin** | Internal Stellarz staff with full CMS access |

---

## 3. Module Specifications

---

### 3.1 Homepage

**FS-HP-01 — Hero Section**  
- Displays a search bar with two tabs: "Find a Vehicle" and "Find a Charging Station".
- Find a Vehicle: dropdowns for Category (Cars / Two-Wheelers / E-Bikes / All), Brand, and a free-text model search with autocomplete.
- Find a Charging Station: city/pincode input with a "Locate Near Me" button using browser Geolocation API.

**FS-HP-02 — Featured Listings Carousel**  
- Displays up to 8 featured vehicles rotated automatically every 4 s.
- Each card shows: vehicle image, name, starting price (₹), range (km), and a "View Details" CTA.

**FS-HP-03 — Category Quick Links**  
- Grid of 5 icons: Electric Cars, Two-Wheelers, E-Bikes, Batteries & Accessories, EV Stations.

**FS-HP-04 — Latest News / Articles**  
- Shows the 3 most recently published editorial articles with thumbnail, headline, and date.

---

### 3.2 Vehicle Listing Pages

#### 3.2.1 Listing Index (e.g., `/electric-cars`, `/electric-two-wheelers`, `/e-bikes`)

**FS-VL-01 — Filters Panel (Left sidebar / collapsible on mobile)**  
| Filter | Type | Values |
|---|---|---|
| Category | Checkbox | Cars / SUV, Hatchback, Sedan, Two-Wheelers, E-Bikes |
| Brand | Checkbox (multi-select) | Dynamic from DB |
| Price | Range slider | ₹0 – ₹50,00,000 |
| Range | Range slider | 0 – 800 km |
| Charging Time | Checkbox | < 1 hr, 1–4 hrs, 4–8 hrs, > 8 hrs |
| Body Type | Checkbox | (Cars only) SUV, Hatchback, Sedan, MPV |
| City | Dropdown | List of cities from DB |

**FS-VL-02 — Listing Grid**  
- Default: 12 cards per page, paginated.
- Each card: vehicle image (primary), brand logo, name + variant label, ex-showroom price, ARAI range, "Compare" checkbox, "Wishlist" heart icon (consumers only), "View Details" button.
- Clicking "Compare" adds vehicle to a sticky comparison tray at the bottom (max 3).

**FS-VL-03 — Sort Options**  
- Sort by: Popularity (default), Price Low–High, Price High–Low, Range (highest first), Newest.

**FS-VL-04 — Pagination**  
- Server-side pagination; URL query params `?page=N`.

#### 3.2.2 Vehicle Detail Page (e.g., `/electric-cars/tata-nexon-ev-max`)

**FS-VD-01 — Gallery**  
- Responsive image gallery with thumbnail strip; supports full-screen lightbox.
- Colour picker updates the displayed image to the selected colour variant.

**FS-VD-02 — Key Specs Strip**  
- Horizontal strip below gallery: Range, Top Speed, Battery, Charging Time, Price.

**FS-VD-03 — Full Specifications Table**  
Sections: Overview, Battery & Range, Performance, Charging, Dimensions, Features & Safety. Each spec shown as label–value rows.

**FS-VD-04 — Variants Table**  
- Lists all variants with their price difference and key differentiators.

**FS-VD-05 — EMI Calculator**  
- Inputs: On-road price (pre-filled), down payment (₹ or %), loan tenure (12–84 months), interest rate (%).
- Output: Monthly EMI (₹), Total payable amount.
- Calculation: Standard reducing-balance EMI formula.

**FS-VD-06 — Range Estimator**  
- Input: Average daily commute (km).
- Output: Estimated days between charges, estimated monthly electricity cost (at ₹7/kWh default, editable).

**FS-VD-07 — Enquiry / Test Drive Form**  
- Fields: Name, Mobile, City, Preferred Dealer (dropdown, filtered by city), Message (optional).
- On submit: lead saved to `leads` table in Supabase; confirmation email sent to consumer; notification email sent to dealer.
- Guest users are prompted to log in or continue as guest (name + mobile required).

**FS-VD-08 — Reviews & Ratings**  
- Overall rating (1–5 stars) and breakdown by: Performance, Range, Comfort, Value for Money.
- Consumers can submit one review per vehicle (text + rating). Reviews require approval before display.

**FS-VD-09 — Similar Vehicles**  
- Shows 4 vehicles in the same category within ±25% price band.

---

### 3.3 Battery & Accessories Listings

**FS-BA-01 — Listing Index `/batteries-accessories`**  
- Sub-category tabs: Batteries, Home Chargers, Portable Chargers, Accessories.
- Filters: Brand, Compatibility (vehicle make), Price range.
- Each card: image, name, price (if available), "View Details" / "Enquire" CTA.

**FS-BA-02 — Detail Page**  
- Specs table (type-specific: e.g., capacity, chemistry, warranty for batteries; output, cable length for chargers).
- Seller/brand contact CTA.

---

### 3.4 EV Charging Station Locator

**FS-CS-01 — Search Interface (`/ev-stations`)**  
- Two modes switchable by toggle: **List View** and **Map View**.
- Search bar: city, pincode, or landmark text input with autocomplete (Google Places API).
- "Use My Location" button triggers browser Geolocation.

**FS-CS-02 — Filters**  
| Filter | Values |
|---|---|
| Connector Type | CCS2, CHAdeMO, Type 2, Bharat AC001, Bharat DC001 |
| Charging Speed | Slow (< 7 kW), Fast (7–22 kW), Rapid (22–50 kW), Ultra-Rapid (> 50 kW) |
| Network / Operator | Dynamic from DB |
| Open Now | Toggle (uses working hours field) |
| Availability | Available / Unknown (real-time data if operator provides feed) |

**FS-CS-03 — List View**  
- Cards show: station name, operator logo, address, distance from search point, connector icons, number of ports, rating.
- Clicking a card opens the Station Detail Page.

**FS-CS-04 — Map View**  
- Google Maps embedded map centred on search location.
- Markers clustered when zoomed out; individual markers on zoom-in.
- Clicking a marker opens an info window with: station name, connector types, ports, "Get Directions" link (Google Maps redirect), "View Details" link.

**FS-CS-05 — Station Detail Page (`/ev-stations/{slug}`)**  
- Full address, operating hours, photos gallery, all connector types with port counts.
- Embedded mini-map with "Get Directions" CTA.
- User can submit a review/report (e.g., charger out of service).

---

### 3.5 Comparison Tool

**FS-CP-01 — Comparison Tray**  
- Sticky bar at page bottom (active when ≥ 1 vehicle selected for comparison).
- Shows selected vehicle thumbnails; "Compare Now" button activates when 2–3 selected.
- Persists across listing pages using local storage.

**FS-CP-02 — Comparison Page (`/compare`)**  
- URL encodes vehicle slugs: `/compare?v=tata-nexon-ev-max,mg-zs-ev,hyundai-ioniq-5`.
- Full spec-by-spec table; differences highlighted in yellow.
- "Add Another Vehicle" button (up to 3 total).
- "Generate PDF" button exports comparison as a styled PDF (client-side).

---

### 3.6 User Authentication & Profile

**FS-AU-01 — Registration**  
- Options: Email + password, Mobile OTP (SendGrid/MSG91), Google OAuth.
- Required fields: Name, Email or Mobile, Password (if email).
- OTP valid for 10 minutes; 3 resend attempts per session.

**FS-AU-02 — Login / Logout**  
- JWT session token stored in httpOnly cookie; managed by Supabase Auth.
- "Remember me" option extends session to 30 days.

**FS-AU-03 — Profile Page (`/profile`)**  
- Editable: name, mobile, city, profile photo (uploaded to Supabase Storage).
- Tabs: Wishlist, My Enquiries, My Reviews.

**FS-AU-04 — Wishlist**  
- Consumer can add/remove vehicles to wishlist.
- Wishlist persists across devices when logged in; stored in `wishlists` table.

---

### 3.7 Dealer / OEM Portal

**FS-DP-01 — Dashboard**  
- Summary cards: Total Listings, Active Listings, New Leads (7 days), Total Views.
- Chart: leads over last 30 days (line chart).

**FS-DP-02 — Listing Management**  
- CRUD for vehicle listings; listing status: Draft / Pending Review / Published / Rejected.
- Image upload (up to 20 images per listing, stored in Supabase Storage).
- Admin must approve listings before publishing.

**FS-DP-03 — Lead Management**  
- Table of leads: consumer name, vehicle of interest, date, status.
- Status options: New, Contacted, Test Drive Scheduled, Converted, Closed.
- Export leads to CSV.

**FS-DP-04 — Featured Listings**  
- Option to feature a listing for 7/15/30 days.
- Featured listing displays a "Sponsored" badge and appears in the homepage carousel.
- Billing handled offline (Phase 1); payment gateway (Phase 2).

---

### 3.8 Admin CMS

**FS-AD-01 — Global Dashboard**  
- Platform-wide stats: total users, listings, leads, station listings, page views (via analytics integration).

**FS-AD-02 — Content Management**  
- Full CRUD for all vehicle, battery, accessory, and station listings.
- Bulk publish/unpublish.
- Manage editorial articles (title, body, author, tags, thumbnail, published date).

**FS-AD-03 — User Management**  
- View, suspend, delete, promote user accounts.
- View consumer enquiry and review history.

**FS-AD-04 — Review Moderation**  
- Approve or reject pending vehicle reviews.
- Flag inappropriate reviews.

---

### 3.9 SEO & Technical Pages

- Sitemap auto-generated at `/sitemap.xml` from all published listing slugs.
- `robots.txt` managed in CMS.
- Each listing page has meta title, meta description, Open Graph, Twitter Card, and JSON-LD structured data (Product / LocalBusiness schema).
- Canonical URLs enforced on all pages.

---

## 4. Notifications & Emails

| Trigger | Recipients | Channel |
|---|---|---|
| New consumer registration | Consumer | Email (welcome) |
| Enquiry submitted | Consumer + Dealer | Email |
| Review approved | Consumer | Email |
| New lead received | Dealer | Email + portal notification |
| Listing approved/rejected | Dealer | Email |
| Station report submitted | Admin | Email |

---

## 5. Error Handling

| Scenario | Behaviour |
|---|---|
| Vehicle not found | 404 page with search suggestion |
| Station search returns 0 results | "No stations found" message with suggestion to expand radius |
| Form validation failure | Inline error messages per field |
| API timeout | User-friendly error with retry CTA |
| Unauthorised access | Redirect to login page |

---

## 6. Wireframe References

*(Wireframes to be provided separately as Figma links)*

- Homepage
- Vehicle Listing Index
- Vehicle Detail Page
- EV Station Map View
- Comparison Page
- Dealer Dashboard

---

*End of FSD*
