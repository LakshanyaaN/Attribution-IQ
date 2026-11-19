# AttributionIQ — Omnichannel Marketing Attribution Engine & Analytics Warehouse

[![PostgreSQL 16](https://img.shields.io/badge/PostgreSQL-16%20%7C%20pgvector-336791?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![MongoDB 7.0](https://img.shields.io/badge/MongoDB-7.0%20NoSQL-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Next.js 15](https://img.shields.io/badge/Next.js-15%20App%20Router-black?logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white)](https://www.docker.com/)


## Team Members

| Name | SRN |
|------|-----|
| N LAKSHANYAA | PES1UG24AM169 |
| KSHAMA | PES1UG24AM142 |


An enterprise-grade analytical data warehouse, multi-touch algorithmic attribution engine, and full-stack marketing intelligence web application. Engineered to ingest high-velocity multi-platform clickstreams, reconstruct complex multi-touch customer journeys, and reallocate conversion revenue accurately using advanced analytical SQL and dense vector semantic search.

---

## 1. Problem Statement & Motivation

Modern consumers rarely convert on their first advertisement exposure. A customer typically discovers a brand through **Meta**, engages with video demonstrations on **TikTok**, receives a targeted promotional coupon via **Email**, and finally completes their checkout by clicking a high-intent branded **Google Search** ad.

Traditional **last-click attribution** awards 100% of conversion revenue to the final Google click. This systematically undervalues awareness-generating upper-funnel channels, leading marketing teams to misallocate millions of dollars in budget.

**AttributionIQ** ingests raw multi-platform clickstreams, models customer journeys, and evaluates revenue credit across four mathematical attribution models:
- **First-Touch:** 100% credit to the earliest touchpoint (discovery channel).
- **Last-Touch:** 100% credit to the final conversion touchpoint (industry legacy default).
- **Linear:** Uniformly distributed credit (1/N) across all touchpoints in the path.
- **Time-Decay (7-Day Half-Life):** Exponential decay weighting prioritizing recency while fairly acknowledging discovery:
  $$w_i = 2^{-\frac{t_{\text{conv}} - t_i}{7 \times 86400}}, \quad \hat{w}_i = \frac{w_i}{\sum_{j=1}^N w_j}$$

---

## 2. System Architecture

```
                             [ Synthetic Clickstream Generator ]
                               (Baseline & AI-Shift Scenarios)
                                              |
                      +-----------------------+-----------------------+
                      | Raw JSON Clickstream                          | Relational CSVs
                      v                                               v
            [ MongoDB 7.0 ]                                 [ PostgreSQL 16 (Star Schema) ]
          raw_clickstream_events                              |-- dim_user (BCNF)
         (13,138 Stored BSON Docs)                            |-- dim_campaign (Superclass)
          |-- Aggregation Pipelines                           |-- dim_paid_campaign (EER Subclass)
          |-- Ingestion Velocity Timeline                     |-- dim_email_campaign (EER Subclass)
          |-- Related User Context                            |-- dim_creative (384d pgvector + TSVector)
                                                              |-- dim_date (Analytical Denormalization)
                                                              |-- fact_touchpoint (Composite FK)
                                                              |-- fact_conversion & fact_refund
                                                              |-- fact_spend & audit_log
                                                                   |
                                                         [ Advanced SQL Engine ]
                                                         |-- Window Functions (4 Models)
                                                         |-- Recursive CTE (Journey Path Traversal)
                                                         |-- Triggers (Net Rev Refund & Budget Diff)
                                                         |-- Materialized Views (mv_channel_roas_comparison)
                                                         |-- Database RBAC (app_analyst vs app_manager)
                                                                   |
                                                         [ Next.js 15 Web Application ]
                                                         |-- Vintage Collage / Paper-Card Design System
                                                         |-- Role-Based Authentication Portal (/login)
                                                         |-- Workspace Modules (Overview, Channels, Attribution...)
                                                         |-- Vector Ad Search (Gallery, Map, Inspector)
                                                         |-- Event Intelligence Hub (Raw MongoDB Events)
                                                         |-- SQL Control Center & RBAC Lab (/sql-audit)
```

---

## 3. Repository Directory Structure

All files reside in your local project workspace:
```
omnichannel-attribution/
├── compose.yml                 # Docker Compose configuration (PostgreSQL 16 + pgvector, MongoDB 7.0)
├── Makefile                    # Automation shortcuts (up, down, init, test, seed)
├── requirements.txt            # Python dependencies (psycopg2, pymongo, numpy, sentence-transformers)
├── .env.example                # Sample environment variables template
├── sql/                        # Production SQL DDL, DML, and Programmability Scripts
│   ├── 01_schema_ddl.sql       # PostgreSQL DDL (Tables, Extensions, Domains, HNSW/B-Tree Indexes)
│   ├── 02_roles_rbac.sql       # Database Role Creation & Privilege Grants (app_analyst, app_manager)
│   ├── 03_dml_operations.sql   # Relational Data Insertion Scripts
│   ├── 04_attribution_models.sql # Window Functions, Recursive CTEs, & Materialized Views
│   ├── 05_programmability.sql  # Stored Procedures, UDFs, and Audit Triggers
│   ├── 06_vector_search.sql    # pgvector Cosine Distance Search & Hybrid FTS Queries
│   ├── 07_concurrency_locking.sql # Row-Level Pessimistic Locking & SKIP LOCKED Tests
│   └── 08_query_optimization_demo.sql # EXPLAIN (ANALYZE, BUFFERS) Execution Plan Profiling
├── data/                       # Data generation & loader scripts
│   ├── generator.py            # Generates realistic omnichannel customer journeys & embeddings
│   └── load.py                 # Polyglot loader into PostgreSQL and MongoDB
├── tests/                      # Automated Verification Test Suites
│   ├── run_all_tests.py        # Master test runner
│   ├── test_constraints.py     # Check constraints, FK cascades, and domain validations
│   ├── test_attribution.py     # Mathematical verification of 4 attribution models
│   ├── test_rbac.py            # Security test verifying app_analyst write-denials
│   └── test_concurrency.py     # Concurrency locking and dead-lock prevention
├── docs/                       # Technical and academic design specifications
│   ├── 01_relational_schema.md # Relational schema specifications & data dictionary
│   ├── 02_normalization.md     # Formal BCNF normalization proofs & dimensional design
│   ├── 03_technology_justification.md # PostgreSQL vs MongoDB vs pgvector trade-offs
│   ├── 04_nosql_and_vector.md  # Vector distance math, HNSW index internals, hybrid search
│   └── 05_query_optimization_and_concurrency.md # Cost-based optimizer analysis & 2PL locking
└── web/                        # Next.js 15 Full-Stack Analytics Application
    ├── package.json            # Node.js dependencies (Next.js 15, React 19, Lucide, pg, mongodb)
    ├── public/
    │   └── collage/            # Pop-art & vintage collage assets (Megaphone, Statue, Stickers, etc.)
    ├── components/
    │   └── AppShell.tsx        # Shell layout, persistent role context, and navigation sidebar
    ├── lib/
    │   ├── mongodb.ts          # MongoDB client singleton connection
    │   └── pg.ts               # Dual PostgreSQL connection pools enforcing server RBAC
    └── app/
        ├── login/              # Brand Login Portal with 2-Role RBAC Switcher
        ├── page.tsx            # Executive Overview & KPI Spotlight
        ├── creatives/          # Full Ad Creative Library
        ├── channels/           # Omnichannel Economics (CAC, Channel ROAS)
        ├── attribution/        # Multi-Touch Model Comparison Ledger
        ├── journeys/           # Recursive CTE Customer Journey Path Visualizer
        ├── campaigns/          # Campaign Ledger & Live Permission Simulator
        ├── vector-search/      # pgvector Semantic Ad Search (Gallery, Vector Map, Inspector)
        ├── raw-events/         # Event Intelligence Hub (MongoDB Ingestion, Timeline, Aggregator)
        ├── sql-audit/          # Database Control Center (RBAC Matrix, Audit Log, Query Lab)
        └── api/                # Next.js REST API routes (secure, role-aware database endpoints)
```

---

## 4. Web Application Features & Modules

### 4.1 Authentication & Role Selection (`/login`)
- Styled with the vintage collage design system (Megaphone, Classical Statue with pink glasses, *"Advertising Works!"* sign, *"Measure Smarter. Advertise Better."* sticker).
- **Two Distinct Database Roles**:
  - **Analyst (`app_analyst`)**: Least-privilege read-only persona for running analytical reports and querying views. Direct writes or mutations are blocked by the database engine.
  - **Manager (`app_manager`)**: Operational read-write persona authorized to insert campaigns, update daily budgets, add creatives, and manage spend.
- Selecting a role configures the connection pool for all subsequent API requests.

### 4.2 Workspace Modules
1. **Executive Overview (`/`)**: High-level spend, conversion volume, blended ROAS, interactive lookback toggles (7D, 30D, 90D), and campaign creative spotlights.
2. **Channel Analytics (`/channels`)**: CAC, conversion counts, media spend, and ROAS broken down by network (Google, Meta, TikTok, Email).
3. **Attribution & ROAS (`/attribution`)**: Compares First-Touch, Last-Touch, Linear, and Time-Decay attribution models directly from the `mv_channel_roas_comparison` materialized view.
4. **Customer Journeys (`/journeys`)**: Visualizes multi-touch conversion paths assembled by the recursive CTE.
5. **Campaigns & RBAC (`/campaigns`)**: Active campaign ledger with an interactive permission tester demonstrating engine-level access control.

### 4.3 Data & Systems Modules
1. **Vector Ad Search (`/vector-search`)**:
   - Semantic ad search powered by dense 384-dimensional embeddings stored in `dim_creative`.
   - **Three View Modes**: Creative Gallery with vintage artwork, 2D Vector Projection Map, and Query Inspector.
   - *"Why did this match?"* modal displaying cosine similarity, vector slice metrics, and headline matches.
2. **Event Intelligence Hub (`/raw-events`)**:
   - Real-time observability interface for **13,138 raw MongoDB clickstream documents**.
   - **4 KPI Cards**: Total Stored, Clicks, Impressions, and ETL Processed Rate.
   - **Interactive Visualizations**: Click-to-filter platform breakdown and daily UTC ingestion velocity timeline.
   - **3-Mode Document Inspector**: Readable touchpoint metadata, syntax-highlighted raw BSON, and related user journey chain.
   - **MongoDB Aggregation Explorer**: Execute allowlisted aggregation pipelines (`platform_summary`, `device_distribution`, `hourly_velocity`, `utm_source_performance`) with real pipeline code and result preview.
3. **SQL Control Center & RBAC Infrastructure (`/sql-audit`)**:
   - **Database Health**: Real-time buffer cache hit ratio (`99.8%`), relation sizes (`pg_stat_user_tables`), and index scans (`pg_stat_user_indexes`).
   - **Live RBAC Matrix**: Real grants introspected from `information_schema.role_table_grants` for both roles across all catalog tables.
   - **Safe Permission Simulator**: Dispatches test SQL operations directly against database connection pools to demonstrate server-enforced security boundaries (e.g. `42501 insufficient_privilege` on write attempts by analysts).
   - **Persisted Security Audit Trail**: Filterable table of `audit_log` records with before/after JSONB state diffs generated by triggers.
   - **Query Performance Lab**: Allowlisted query library executing live `EXPLAIN (ANALYZE, BUFFERS)` to profile execution time, planning time, and shared buffer hits.

---

## 5. Prerequisites & System Requirements

- **Operating System:** Windows 10/11, macOS, or Linux.
- **Docker & Docker Compose:** Docker Desktop installed and running.
- **Node.js:** v18.18.0 or later (v20+ recommended).
- **Python:** v3.10, v3.11, or v3.12.
- **Memory & Storage:** At least 4 GB RAM and 2 GB free disk space.

---

## 6. Installation & Setup Guide

### Step 1: Clone or Navigate to the Workspace
```bash
cd "C:\Users\nlaks\.gemini\antigravity\scratch\omnichannel-attribution"
```

### Step 2: Configure Environment Variables
Copy `.env.example` to `.env` in the root folder and in `web/.env.local`:
```bash
cp .env.example .env
cp .env.example web/.env.local
```
*(Default credentials match the Docker Compose configuration).*

### Step 3: Start PostgreSQL & MongoDB Containers
```bash
docker compose up -d
```
Verify containers are running:
- PostgreSQL 16 with `pgvector`: `localhost:5433`
- MongoDB 7.0: `localhost:27017`

### Step 4: Initialize Schemas, RBAC Roles & Programmability
Apply the SQL scripts to PostgreSQL:
```bash
docker exec -i attribution_postgres psql -U postgres -d attribution_db < sql/01_schema_ddl.sql
docker exec -i attribution_postgres psql -U postgres -d attribution_db < sql/02_roles_rbac.sql
docker exec -i attribution_postgres psql -U postgres -d attribution_db < sql/04_attribution_models.sql
docker exec -i attribution_postgres psql -U postgres -d attribution_db < sql/05_programmability.sql
```

### Step 5: Install Python Dependencies & Seed Data
```bash
pip install -r requirements.txt
python data/generator.py --scale small --scenario ai_shift
python data/load.py
```
This populates:
- **13,138 raw documents** into MongoDB `raw_clickstream.raw_clickstream_events`.
- Dimensions (`dim_user`, `dim_campaign`, `dim_creative` with embeddings, `dim_date`).
- Fact tables (`fact_touchpoint`, `fact_conversion`, `fact_spend`, `fact_refund`).
- Materialized views (`mv_channel_roas_comparison`).

### Step 6: Run Automated Test Suites
```bash
python tests/run_all_tests.py
```
Validates:
- Domain constraints & foreign key cascades
- Mathematical correctness of all 4 attribution models
- Database engine RBAC privilege boundaries (`app_analyst` vs `app_manager`)
- Concurrency locking & pessimistic spend deduction

### Step 7: Launch the Web Application
```bash
cd web
npm install
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 7. Role Credentials Reference

| Role | Username | Password | Database Privileges |
|---|---|---|---|
| **Analyst** | `app_analyst` | `analyst_password_2026` | `SELECT` on all public tables, views, and dimensions. Read-only analytical access. |
| **Manager** | `app_manager` | `manager_password_2026` | `SELECT`, `INSERT`, `UPDATE`, `DELETE` on all operational tables and sequences. |
| **Superuser / Admin** | `postgres` | `postgrespassword` | Full administrative database privileges (DDL, migrations, user administration). |

---

## 8. Verification & Production Build
To run a static typecheck and production build of the Next.js app:
```bash
cd web
npx tsc --noEmit
npm run build
```
All 28 routes (pages and API endpoints) will compile and validate successfully.
