# Business Requirements Document (BRD)
## EV Vehicles Listing Platform — Stellarz

**Version:** 1.0  
**Date:** June 2026  
**Document Owner:** Stellarz Product Management  
**Status:** Draft  

---

## 1. Introduction

### 1.1 Purpose
This Business Requirements Document defines the business needs, goals, stakeholders, and high-level requirements for the Stellarz EV Vehicles Listing Platform. It serves as the primary input for functional and technical specifications.

### 1.2 Background
Electric vehicle adoption in India is accelerating, yet buyers face fragmented information across multiple sources. Stellarz aims to consolidate EV discovery, comparison, and charging infrastructure data into a single authoritative platform, similar to how CardDekho serves the broader auto market.

### 1.3 Scope
The platform covers:
- Listing and discovery of new electric four-wheelers, two-wheelers, e-bikes
- Battery packs and EV accessories listings
- EV charging station directory with map-based search
- Dealer/OEM and station operator onboarding

### 1.4 Definitions

| Term | Definition |
|---|---|
| OEM | Original Equipment Manufacturer (vehicle brand) |
| EV | Electric Vehicle |
| BEV | Battery Electric Vehicle |
| EV Station | Electric Vehicle Charging Station |
| Lead | A consumer enquiry submitted to a dealer/OEM |
| RLS | Row-Level Security (Supabase/PostgreSQL feature) |

---

## 2. Business Objectives

| ID | Objective |
|---|---|
| BO-01 | Become the leading EV listing destination in India within 2 years of launch |
| BO-02 | Generate revenue through listing fees, featured placements, and lead generation |
| BO-03 | Support 500+ vehicle model listings and 1,000+ EV station listings within 6 months |
| BO-04 | Achieve 100,000 monthly unique visitors within 12 months of launch |
| BO-05 | Onboard 50 dealers/OEMs and 20 charging station operators in Phase 1 |

---

## 3. Stakeholders

| Stakeholder | Role | Interest |
|---|---|---|
| Stellarz Management | Project sponsor | ROI, brand positioning |
| Product Team | Requirements, roadmap | Feature completeness |
| Engineering Team | Build and maintain platform | Technical feasibility |
| Dealers / OEMs | List vehicles, receive leads | Lead volume, listing visibility |
| Charging Station Operators | List stations, manage info | Footfall, visibility |
| End Consumers | Browse, compare, enquire | Accurate info, ease of use |
| Regulatory Bodies | Compliance | Data accuracy, privacy |

---

## 4. Business Requirements

### 4.1 Vehicle Listings

| ID | Requirement | Priority |
|---|---|---|
| BR-VL-01 | The platform shall list electric cars and SUVs with full specifications | Must Have |
| BR-VL-02 | The platform shall list electric two-wheelers (scooters and motorcycles) | Must Have |
| BR-VL-03 | The platform shall list e-bikes (pedal-assist and throttle) | Must Have |
| BR-VL-04 | Each vehicle listing shall include: make, model, variant, price (ex-showroom), range (ARAI), top speed, charging time, battery capacity, images, colours, and key features | Must Have |
| BR-VL-05 | Listings shall be filterable by category, brand, price range, range (km), city | Must Have |
| BR-VL-06 | Listings shall be sortable by price, range, popularity, newest | Must Have |
| BR-VL-07 | Users shall be able to compare up to 3 vehicles side-by-side | Must Have |
| BR-VL-08 | Each listing page shall display user reviews and ratings | Should Have |
| BR-VL-09 | Each listing shall include an EMI calculator | Should Have |
| BR-VL-10 | Listings shall be SEO-optimised with canonical URLs and structured data | Must Have |

### 4.2 Battery & Accessories

| ID | Requirement | Priority |
|---|---|---|
| BR-BA-01 | The platform shall list EV battery packs with specs (capacity, chemistry, warranty) | Must Have |
| BR-BA-02 | The platform shall list EV accessories (chargers, cables, helmets, etc.) | Should Have |
| BR-BA-03 | Accessory listings shall link to compatible vehicles where applicable | Nice to Have |

### 4.3 EV Charging Station Directory

| ID | Requirement | Priority |
|---|---|---|
| BR-CS-01 | The platform shall list EV charging stations across India | Must Have |
| BR-CS-02 | Station listings shall include: name, address, operator, connector types, number of ports, working hours, photos | Must Have |
| BR-CS-03 | Users shall be able to search for stations by city, pincode, or current location | Must Have |
| BR-CS-04 | Station results shall be displayed on an interactive map (Google Maps) | Must Have |
| BR-CS-05 | Users shall be able to filter stations by connector type (AC/DC, CCS2, CHAdeMO, Type 2, Bharat AC/DC) | Must Have |
| BR-CS-06 | Station operators shall be able to claim and update their listings via a portal | Should Have |

### 4.4 User Accounts

| ID | Requirement | Priority |
|---|---|---|
| BR-UA-01 | Consumers shall be able to register using email, mobile OTP, or Google OAuth | Must Have |
| BR-UA-02 | Registered users shall be able to save vehicles to a wishlist | Must Have |
| BR-UA-03 | Registered users shall be able to submit enquiries to dealers | Must Have |
| BR-UA-04 | Registered users shall be able to write vehicle reviews | Should Have |
| BR-UA-05 | Users shall receive email/SMS confirmation for enquiries and registration | Should Have |

### 4.5 Dealer / OEM Portal

| ID | Requirement | Priority |
|---|---|---|
| BR-DP-01 | Dealers and OEMs shall be able to register and manage their own listings | Must Have |
| BR-DP-02 | Dealers shall receive consumer leads (enquiries) via their portal | Must Have |
| BR-DP-03 | Dealers shall be able to mark leads as contacted, converted, or closed | Should Have |
| BR-DP-04 | Dealers shall have access to basic analytics (views, leads, enquiries) | Should Have |
| BR-DP-05 | Featured listing upgrades shall be available as a paid option | Should Have |

### 4.6 Admin CMS

| ID | Requirement | Priority |
|---|---|---|
| BR-AD-01 | Admins shall be able to create, edit, publish, and unpublish any listing | Must Have |
| BR-AD-02 | Admins shall be able to manage all user and dealer accounts | Must Have |
| BR-AD-03 | Admins shall be able to manage EV station data | Must Have |
| BR-AD-04 | Admins shall be able to publish editorial content (news, buying guides) | Should Have |
| BR-AD-05 | Admins shall be able to run and export reports on traffic and leads | Should Have |

---

## 5. Business Rules

| ID | Rule |
|---|---|
| BB-01 | Vehicle prices displayed are ex-showroom (Delhi) by default; users can switch city |
| BB-02 | A dealer cannot view leads submitted to another dealer |
| BB-03 | Listing approvals for dealer-submitted content require admin review |
| BB-04 | Featured listings expire after the paid period and revert to standard |
| BB-05 | Duplicate station listings for the same address are blocked at submission |
| BB-06 | Users under 18 (as declared at registration) cannot submit dealer enquiries |

---

## 6. Assumptions

- Google Maps API will be used for the station locator.
- Supabase Pro plan will be in place before production launch.
- OEM/dealer data will be seeded manually in Phase 1; automation in Phase 2.
- Indian phone number (+91) format is the primary contact format.
- Content is initially in English; multilingual support is Phase 2.

---

## 7. Constraints

| Constraint | Detail |
|---|---|
| Hosting | Platform must be deployable on Hostinger VPS (Ubuntu, Node.js) |
| Database | Must use Supabase (PostgreSQL) as the primary datastore |
| Budget | Phase 1 must operate within Supabase Pro + Hostinger VPS cost band |
| Compliance | DPDP Act (India Digital Personal Data Protection) compliance required |
| Timeline | Phase 1 MVP in 3 months |

---

## 8. Success Metrics

| Metric | Target (6 months post-launch) |
|---|---|
| Monthly Unique Visitors | 50,000+ |
| Vehicle Listings | 500+ |
| EV Station Listings | 1,000+ |
| Dealer / OEM Accounts | 50+ |
| Monthly Leads Generated | 1,000+ |
| Page Load (LCP) | < 2.5 s |
| Bounce Rate | < 55% |

---

*End of BRD*
