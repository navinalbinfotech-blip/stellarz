# Technical Specification Document (TSD)
## EV Vehicles Listing Platform — Stellarz

**Version:** 1.0  
**Date:** June 2026  
**Document Owner:** Stellarz Engineering Team  
**Status:** Draft  

---

## 1. Introduction

This document provides the complete technical specification for the Stellarz EV Vehicles Listing Platform. It covers system architecture, technology stack, database schema, API design, security model, deployment topology, and third-party integrations.

---

## 2. Technology Stack

| Layer | Technology | Version / Notes |
|---|---|---|
| Framework | Next.js | 14.x (App Router, SSR + SSG) |
| UI Library | React | 18.x |
| Styling | Tailwind CSS | 3.x + shadcn/ui component library |
| Language | TypeScript | 5.x |
| Database | PostgreSQL (via Supabase) | PG 15 |
| ORM / Query | Supabase JS Client + PostgREST | v2 |
| Authentication | Supabase Auth | Email, OTP, Google OAuth 2.0 |
| File Storage | Supabase Storage | S3-compatible |
| Maps | Google Maps JavaScript API | v3 |
| Geocoding | Google Geocoding API | REST |
| Email | SendGrid | v3 API |
| Hosting | Hostinger VPS | Ubuntu 22.04 LTS, Node.js 20 LTS |
| Process Manager | PM2 | Latest stable |
| Reverse Proxy | Nginx | 1.24 |
| SSL | Let's Encrypt (Certbot) | Auto-renew |
| CI/CD | GitHub Actions | Deploy to Hostinger VPS via SSH |
| Analytics | Google Analytics 4 + Vercel Analytics (optional) | |
| Monitoring | UptimeRobot (uptime) + Sentry (error tracking) | |

---

## 3. Repository Structure

```
stellarz/
├── app/                         # Next.js App Router
│   ├── (public)/
│   │   ├── page.tsx             # Homepage
│   │   ├── electric-cars/
│   │   │   ├── page.tsx         # Listing index
│   │   │   └── [slug]/page.tsx  # Detail page
│   │   ├── electric-two-wheelers/
│   │   ├── e-bikes/
│   │   ├── batteries-accessories/
│   │   ├── ev-stations/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx
│   │   └── compare/page.tsx
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── (portal)/
│   │   ├── dealer/
│   │   └── admin/
│   ├── api/
│   │   ├── vehicles/route.ts
│   │   ├── stations/route.ts
│   │   ├── leads/route.ts
│   │   └── reviews/route.ts
│   └── layout.tsx
├── components/
│   ├── ui/                      # shadcn/ui base components
│   ├── vehicle/
│   ├── station/
│   ├── comparison/
│   └── shared/
├── lib/
│   ├── supabase/
│   │   ├── client.ts            # Browser client
│   │   └── server.ts            # Server-side client
│   ├── utils.ts
│   └── constants.ts
├── types/
│   └── database.types.ts        # Auto-generated from Supabase
├── public/
├── docs/
├── .env.local                   # Local environment variables
└── next.config.ts
```

---

## 4. Database Schema (Supabase / PostgreSQL)

### 4.1 Enumerations

```sql
CREATE TYPE vehicle_category AS ENUM ('car', 'two_wheeler', 'ebike');
CREATE TYPE listing_status   AS ENUM ('draft', 'pending_review', 'published', 'rejected');
CREATE TYPE lead_status      AS ENUM ('new', 'contacted', 'test_drive', 'converted', 'closed');
CREATE TYPE connector_type   AS ENUM ('CCS2', 'CHAdeMO', 'Type2', 'BharatAC001', 'BharatDC001', 'TypeB');
CREATE TYPE charger_speed    AS ENUM ('slow', 'fast', 'rapid', 'ultra_rapid');
CREATE TYPE user_role        AS ENUM ('consumer', 'dealer', 'station_operator', 'admin');
```

### 4.2 Core Tables

```sql
-- Users (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role          user_role NOT NULL DEFAULT 'consumer',
  full_name     TEXT,
  mobile        TEXT,
  city          TEXT,
  avatar_url    TEXT,
  is_active     BOOLEAN DEFAULT TRUE,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Brands
CREATE TABLE public.brands (
  id            SERIAL PRIMARY KEY,
  name          TEXT NOT NULL UNIQUE,
  slug          TEXT NOT NULL UNIQUE,
  logo_url      TEXT,
  country       TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Vehicles
CREATE TABLE public.vehicles (
  id                   SERIAL PRIMARY KEY,
  slug                 TEXT NOT NULL UNIQUE,
  brand_id             INT REFERENCES public.brands(id),
  name                 TEXT NOT NULL,
  category             vehicle_category NOT NULL,
  body_type            TEXT,
  status               listing_status NOT NULL DEFAULT 'draft',
  -- Pricing
  ex_showroom_price    NUMERIC(12,2),
  on_road_price_delhi  NUMERIC(12,2),
  -- Performance
  range_km             INT,
  top_speed_kmh        INT,
  acceleration_0_100   NUMERIC(4,1),
  -- Battery & Charging
  battery_capacity_kwh NUMERIC(6,2),
  charging_time_ac_h   NUMERIC(4,1),
  charging_time_dc_min INT,
  fast_charge_kw       NUMERIC(6,1),
  -- Dimensions
  length_mm            INT,
  width_mm             INT,
  height_mm            INT,
  wheelbase_mm         INT,
  -- Additional
  colours              JSONB,          -- [{"name":"Pearl White","hex":"#fff","image_url":"..."}]
  variants             JSONB,          -- [{variant details}]
  features             JSONB,          -- Key-value pairs
  full_specs           JSONB,          -- Nested spec groups
  meta_title           TEXT,
  meta_description     TEXT,
  dealer_id            UUID REFERENCES public.profiles(id),
  created_at           TIMESTAMPTZ DEFAULT NOW(),
  updated_at           TIMESTAMPTZ DEFAULT NOW()
);

-- Vehicle Images
CREATE TABLE public.vehicle_images (
  id          SERIAL PRIMARY KEY,
  vehicle_id  INT REFERENCES public.vehicles(id) ON DELETE CASCADE,
  url         TEXT NOT NULL,
  alt_text    TEXT,
  colour      TEXT,
  is_primary  BOOLEAN DEFAULT FALSE,
  sort_order  INT DEFAULT 0
);

-- Battery & Accessories
CREATE TABLE public.accessories (
  id           SERIAL PRIMARY KEY,
  slug         TEXT NOT NULL UNIQUE,
  name         TEXT NOT NULL,
  sub_category TEXT NOT NULL,  -- 'battery','home_charger','portable_charger','accessory'
  brand_id     INT REFERENCES public.brands(id),
  price        NUMERIC(12,2),
  specs        JSONB,
  description  TEXT,
  image_urls   TEXT[],
  status       listing_status DEFAULT 'draft',
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- EV Charging Stations
CREATE TABLE public.ev_stations (
  id              SERIAL PRIMARY KEY,
  slug            TEXT NOT NULL UNIQUE,
  name            TEXT NOT NULL,
  operator_id     UUID REFERENCES public.profiles(id),
  address         TEXT NOT NULL,
  city            TEXT NOT NULL,
  state           TEXT,
  pincode         TEXT,
  latitude        NUMERIC(10,7) NOT NULL,
  longitude       NUMERIC(10,7) NOT NULL,
  working_hours   JSONB,   -- {"mon_fri":"08:00-22:00","sat":"09:00-20:00","sun":"closed"}
  connectors      JSONB,   -- [{"type":"CCS2","speed":"ultra_rapid","ports":4,"kw":150}]
  phone           TEXT,
  website         TEXT,
  amenities       TEXT[],  -- ['wifi','restroom','cafe']
  photo_urls      TEXT[],
  is_active       BOOLEAN DEFAULT TRUE,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Leads / Enquiries
CREATE TABLE public.leads (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id  INT REFERENCES public.vehicles(id),
  consumer_id UUID REFERENCES public.profiles(id),
  dealer_id   UUID REFERENCES public.profiles(id),
  name        TEXT NOT NULL,
  mobile      TEXT NOT NULL,
  city        TEXT,
  message     TEXT,
  status      lead_status DEFAULT 'new',
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Wishlists
CREATE TABLE public.wishlists (
  id          SERIAL PRIMARY KEY,
  user_id     UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  vehicle_id  INT REFERENCES public.vehicles(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, vehicle_id)
);

-- Reviews
CREATE TABLE public.reviews (
  id              SERIAL PRIMARY KEY,
  vehicle_id      INT REFERENCES public.vehicles(id) ON DELETE CASCADE,
  user_id         UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  rating          SMALLINT CHECK (rating BETWEEN 1 AND 5),
  performance_r   SMALLINT CHECK (performance_r BETWEEN 1 AND 5),
  range_r         SMALLINT CHECK (range_r BETWEEN 1 AND 5),
  comfort_r       SMALLINT CHECK (comfort_r BETWEEN 1 AND 5),
  value_r         SMALLINT CHECK (value_r BETWEEN 1 AND 5),
  title           TEXT,
  body            TEXT,
  is_approved     BOOLEAN DEFAULT FALSE,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(vehicle_id, user_id)
);

-- Articles (Editorial)
CREATE TABLE public.articles (
  id               SERIAL PRIMARY KEY,
  slug             TEXT NOT NULL UNIQUE,
  title            TEXT NOT NULL,
  body             TEXT,
  thumbnail_url    TEXT,
  author_id        UUID REFERENCES public.profiles(id),
  tags             TEXT[],
  is_published     BOOLEAN DEFAULT FALSE,
  published_at     TIMESTAMPTZ,
  meta_title       TEXT,
  meta_description TEXT,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);
```

### 4.3 Indexes

```sql
CREATE INDEX idx_vehicles_category  ON public.vehicles(category);
CREATE INDEX idx_vehicles_brand     ON public.vehicles(brand_id);
CREATE INDEX idx_vehicles_status    ON public.vehicles(status);
CREATE INDEX idx_vehicles_price     ON public.vehicles(ex_showroom_price);
CREATE INDEX idx_vehicles_range     ON public.vehicles(range_km);
CREATE INDEX idx_stations_city      ON public.ev_stations(city);
CREATE INDEX idx_stations_location  ON public.ev_stations USING GIST(
  ST_MakePoint(longitude, latitude)
);  -- requires PostGIS extension
CREATE INDEX idx_leads_dealer       ON public.leads(dealer_id);
CREATE INDEX idx_leads_vehicle      ON public.leads(vehicle_id);
```

### 4.4 Row-Level Security (RLS) Policies

```sql
-- Profiles: users can only update their own profile
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile"   ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Vehicles: published listings readable by all; dealers manage own
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read published vehicles" ON public.vehicles FOR SELECT USING (status = 'published');
CREATE POLICY "Dealers manage own listings" ON public.vehicles FOR ALL USING (
  auth.uid() = dealer_id OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Leads: dealers see only their own leads
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Dealers see own leads" ON public.leads FOR SELECT USING (
  auth.uid() = dealer_id OR auth.uid() = consumer_id OR
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Wishlists: users manage their own
ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own wishlist" ON public.wishlists FOR ALL USING (auth.uid() = user_id);
```

---

## 5. API Design

All API routes live under `/api/`. Protected routes require a valid Supabase JWT in the `Authorization: ****** header.

### 5.1 Vehicles API

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/vehicles` | None | List vehicles with filters & pagination |
| GET | `/api/vehicles/[slug]` | None | Get vehicle detail |
| POST | `/api/vehicles` | Dealer/Admin | Create new vehicle listing |
| PUT | `/api/vehicles/[slug]` | Dealer/Admin | Update vehicle listing |
| DELETE | `/api/vehicles/[slug]` | Admin | Delete vehicle listing |

**GET `/api/vehicles` Query Parameters:**
```
category=car|two_wheeler|ebike
brand=slug
minPrice=number
maxPrice=number
minRange=number
maxRange=number
city=string
sort=popularity|price_asc|price_desc|range_desc|newest
page=number (default 1)
limit=number (default 12, max 50)
```

**Response Schema:**
```json
{
  "data": [
    {
      "id": 1,
      "slug": "tata-nexon-ev-max",
      "name": "Tata Nexon EV MAX",
      "brand": { "id": 1, "name": "Tata", "logo_url": "..." },
      "category": "car",
      "ex_showroom_price": 1949000,
      "range_km": 437,
      "primary_image": "https://..."
    }
  ],
  "meta": {
    "total": 120,
    "page": 1,
    "limit": 12,
    "total_pages": 10
  }
}
```

### 5.2 EV Stations API

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/stations` | None | List / search stations |
| GET | `/api/stations/[slug]` | None | Get station detail |
| POST | `/api/stations` | Station Operator / Admin | Create station |
| PUT | `/api/stations/[slug]` | Station Operator / Admin | Update station |

**GET `/api/stations` Query Parameters:**
```
lat=number
lng=number
radius=number (km, default 10)
city=string
pincode=string
connector=CCS2|CHAdeMO|Type2|...
speed=slow|fast|rapid|ultra_rapid
page=number
limit=number (default 20)
```

### 5.3 Leads API

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/leads` | None (guest allowed) | Submit enquiry |
| GET | `/api/leads` | Dealer / Admin | List leads |
| PATCH | `/api/leads/[id]` | Dealer / Admin | Update lead status |

### 5.4 Reviews API

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/reviews?vehicle_id=` | None | Get approved reviews |
| POST | `/api/reviews` | Consumer | Submit review |
| PATCH | `/api/reviews/[id]/approve` | Admin | Approve review |

---

## 6. Authentication Flow

```
1. User enters email/mobile on login form.
2. supabase.auth.signInWithOtp() called → Supabase sends OTP/magic link.
3. User enters OTP → supabase.auth.verifyOtp() → returns session JWT.
4. JWT stored in httpOnly cookie via Next.js middleware.
5. All API routes extract user via createServerClient(cookies()).
6. Role checked via profiles.role before authorised operations.
```

---

## 7. Google Maps Integration

```typescript
// lib/maps.ts
export const MAPS_CONFIG = {
  apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY,
  libraries: ['places', 'geometry'] as const,
  defaultCenter: { lat: 20.5937, lng: 78.9629 }, // India center
  defaultZoom: 5,
};

// Station search uses PostGIS ST_DWithin for geo-queries:
// SELECT * FROM ev_stations
// WHERE ST_DWithin(
//   ST_MakePoint(longitude, latitude)::geography,
//   ST_MakePoint($lng, $lat)::geography,
//   $radius_meters
// )
// ORDER BY ST_Distance(...) ASC;
```

---

## 8. File Storage (Supabase Storage)

| Bucket | Access | Contents |
|---|---|---|
| `vehicle-images` | Public (read) | Vehicle photos, organised by vehicle slug |
| `station-photos` | Public (read) | EV station photos |
| `accessory-images` | Public (read) | Battery/accessory photos |
| `avatars` | Private | User profile pictures |
| `dealer-docs` | Private | Dealer verification documents |

Upload size limits: images 5 MB max, JPEG/PNG/WebP accepted.  
Image optimisation: Next.js `<Image>` with Supabase Storage CDN URL.

---

## 9. Deployment Architecture (Hostinger VPS)

```
Internet
   │
   ▼
Hostinger VPS (Ubuntu 22.04, 4 vCPU, 8 GB RAM)
├── Nginx (port 80/443)
│     ├── SSL termination (Let's Encrypt)
│     └── Reverse proxy → localhost:3000
├── PM2
│     └── next start (port 3000)
└── Node.js 20 LTS
```

**Nginx config snippet:**
```nginx
server {
    listen 443 ssl;
    server_name stellarz.in www.stellarz.in;

    ssl_certificate     /etc/letsencrypt/live/stellarz.in/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/stellarz.in/privkey.pem;

    location / {
        proxy_pass         http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header   Upgrade $http_upgrade;
        proxy_set_header   Connection 'upgrade';
        proxy_set_header   Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**PM2 ecosystem.config.js:**
```js
module.exports = {
  apps: [{
    name: 'stellarz',
    script: 'node_modules/.bin/next',
    args: 'start',
    instances: 'max',
    exec_mode: 'cluster',
    env: { NODE_ENV: 'production', PORT: 3000 }
  }]
};
```

---

## 10. CI/CD Pipeline (GitHub Actions)

```yaml
# .github/workflows/deploy.yml
name: Deploy to Hostinger VPS

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20' }
      - run: npm ci
      - run: npm run build
      - name: Deploy via SSH
        uses: appleboy/ssh-action@v1
        with:
          host: ${{ secrets.VPS_HOST }}
          username: ${{ secrets.VPS_USER }}
          key: ${{ secrets.VPS_SSH_KEY }}
          script: |
            cd /var/www/stellarz
            git pull origin main
            npm ci --production
            npm run build
            pm2 reload stellarz
```

---

## 11. Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon_key>
SUPABASE_SERVICE_ROLE_KEY=<service_role_key>

# Google Maps
NEXT_PUBLIC_GOOGLE_MAPS_KEY=<maps_api_key>

# SendGrid
SENDGRID_API_KEY=<sendgrid_key>
SENDGRID_FROM_EMAIL=noreply@stellarz.in

# App
NEXT_PUBLIC_APP_URL=https://stellarz.in
```

---

## 12. Security Measures

| Concern | Implementation |
|---|---|
| Authentication | Supabase Auth with JWT; httpOnly cookies |
| Authorisation | RLS policies enforced at DB level; role checks in API routes |
| XSS | React's default HTML escaping; CSP headers via Next.js config |
| SQL Injection | Parameterised queries via Supabase client; no raw SQL from user input |
| CSRF | SameSite=Strict cookies; CSRF tokens for form submissions |
| Rate Limiting | Nginx rate limit directives on `/api/leads`, `/api/auth` |
| Secrets | All keys in environment variables; never committed to git |
| HTTPS | Let's Encrypt TLS, HSTS header, HTTP → HTTPS redirect |
| File Uploads | Type/size validation server-side; Supabase Storage MIME checks |
| DPDP Compliance | Privacy policy, data retention policy, consent on registration |

---

## 13. Performance Optimisation

| Strategy | Implementation |
|---|---|
| SSG for listing pages | `generateStaticParams` for all vehicle/station detail pages |
| ISR | 1-hour revalidation for listing index pages |
| Image optimisation | Next.js `<Image>` with WebP conversion and lazy loading |
| Database | Indexed queries; PostgREST caching headers |
| Caching | Nginx `proxy_cache` for static assets; `Cache-Control` headers |
| Code splitting | Next.js automatic per-route splitting |
| Google Maps | Load Maps JS API asynchronously; cluster markers to reduce renders |
| CDN | Supabase Storage CDN for all media assets |

---

## 14. Monitoring & Alerting

| Tool | Purpose |
|---|---|
| UptimeRobot | HTTP uptime monitoring every 5 min; email alert on downtime |
| Sentry | Frontend and API error tracking; alert on spike |
| PM2 | Process health; auto-restart on crash |
| Supabase Dashboard | DB query performance, storage usage, auth metrics |
| Google Search Console | SEO index coverage, Core Web Vitals |

---

## 15. Third-Party Services Summary

| Service | Purpose | Plan |
|---|---|---|
| Supabase | Database, Auth, Storage | Pro ($25/mo) |
| Hostinger | VPS Hosting | KVM 2 or higher |
| Google Maps | Maps, Places, Geocoding | Pay-as-you-go |
| SendGrid | Transactional email | Free (100/day) → Essentials |
| Sentry | Error monitoring | Free tier |
| UptimeRobot | Uptime monitoring | Free tier |
| Let's Encrypt | SSL certificate | Free |

---

*End of TSD*
