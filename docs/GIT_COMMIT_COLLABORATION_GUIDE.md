# Git Commit Distribution & Collaboration Guide
**Project:** AttributionIQ (Omnichannel Marketing Attribution Engine)  
**Target Repository:** `https://github.com/LakshanyaaN/DBMS-miniproject`  
**Team Members:**  
- **Lakshanyaa (You):** Full-Stack Developer & System Architect  
- **Kshama (Teammate):** Frontend, Visualization & QA Engineer  

---

## 1. Overview & Commit Distribution Strategy

To ensure both contributors have an equal, professional commit history reflecting their assigned responsibilities:
- **Lakshanyaa (5 Commits):** Backend APIs, PostgreSQL & MongoDB integrations, authentication middleware & session management, SQL attribution algorithms, and test harness execution.
- **Kshama (5 Commits):** Login UI & collage components, dashboard layout refinements, interactive marketing analytics charts, responsive styling & accessibility, and documentation.

```
Total: 10 Commits (5 Lakshanyaa + 5 Kshama, alternating logically)
```

---

## 2. Preliminary Step: Connect to the New GitHub Remote

Open PowerShell or terminal in your project directory:
```powershell
cd "C:\Users\nlaks\.gemini\antigravity\scratch\omnichannel-attribution"

# Update remote URL to your new repository
git remote set-url origin https://github.com/LakshanyaaN/DBMS-miniproject.git

# Verify the remote points to the new repo
git remote -v
```

---

## 3. Step-by-Step Commit Sequence

Follow these 10 steps in order. Each step stages specific files and uses the appropriate author identity (`--author`) so GitHub attributes the work cleanly to both accounts.

> **Note for Kshama's commits:** Replace `kshama@example.com` with Kshama's actual GitHub email address so her GitHub profile is credited.

---

### Commit 1 — Lakshanyaa (System Architect & Auth)
**Task:** Authentication & Session Management Architecture  
*Files:* Server middleware, auth API route, role connection pool integration.

```powershell
git add web/middleware.ts web/app/api/auth/ web/lib/pg.ts web/lib/mongodb.ts

git commit --author="Lakshanyaa <nlakshanyaa@gmail.com>" -m "feat(auth): implement server-side auth middleware and session management API"
```

---

### Commit 2 — Kshama (Frontend & Login UI)
**Task:** Vintage Collage Login UI & Role Selector  
*Files:* Login page component, collage artwork assets, and visual styles.

```powershell
git add web/app/login/ web/public/collage/ web/app/globals.css

git commit --author="Kshama <kshama@example.com>" -m "feat(ui): build vintage collage login interface with interactive role switcher"
```

---

### Commit 3 — Lakshanyaa (Backend APIs)
**Task:** Event Intelligence & MongoDB Ingestion APIs  
*Files:* MongoDB aggregation, stats, and related user context routes.

```powershell
git add web/app/api/raw-events/ web/app/api/raw-events/stats/ web/app/api/raw-events/aggregate/ web/app/api/raw-events/context/

git commit --author="Lakshanyaa <nlakshanyaa@gmail.com>" -m "feat(api): create MongoDB aggregation, statistics, and user journey context endpoints"
```

---

### Commit 4 — Kshama (Visualizations)
**Task:** Event Intelligence Hub & Multi-Mode Inspector UI  
*Files:* Raw events observability dashboard, platform bar chart, timeline, and inspector modes.

```powershell
git add web/app/raw-events/page.tsx

git commit --author="Kshama <kshama@example.com>" -m "feat(visuals): design Event Intelligence Hub with interactive charts and document inspector"
```

---

### Commit 5 — Lakshanyaa (Database Engine)
**Task:** SQL Audit, RBAC Privileges & EXPLAIN Analyzer  
*Files:* Database introspection routes, permission simulator, audit log querying, and EXPLAIN performance lab.

```powershell
git add web/app/api/system/ web/app/api/system/permissions/ web/app/api/system/simulate/ web/app/api/system/audit-logs/ web/app/api/system/performance/

git commit --author="Lakshanyaa <nlakshanyaa@gmail.com>" -m "feat(database): implement PostgreSQL RBAC grant introspection and EXPLAIN performance lab"
```

---

### Commit 6 — Kshama (Dashboard Refinements)
**Task:** Database Control Center & RBAC Matrix UI  
*Files:* SQL Audit & RBAC page layout, permission matrix table, and query runner workbench.

```powershell
git add web/app/sql-audit/page.tsx

git commit --author="Kshama <kshama@example.com>" -m "feat(dashboard): refine SQL Control Center layout with privilege matrix and query lab"
```

---

### Commit 7 — Lakshanyaa (Attribution Logic)
**Task:** Algorithmic Multi-Touch Attribution & Vector Search API  
*Files:* Vector 2D projection map route, creative search, ROAS calculation API.

```powershell
git add web/app/api/creatives/ web/app/api/roas/ web/app/api/campaigns/ web/app/api/journeys/ web/app/api/overview/

git commit --author="Lakshanyaa <nlakshanyaa@gmail.com>" -m "feat(attribution): integrate multi-touch mathematical models and pgvector projection APIs"
```

---

### Commit 8 — Kshama (Interactive Charts)
**Task:** Interactive Marketing Charts & Dynamic Lookback Windows  
*Files:* Overview performance graphs, 7D/30D/90D animated progress curves, and channel cards.

```powershell
git add web/app/page.tsx web/app/channels/page.tsx web/app/attribution/page.tsx web/app/journeys/page.tsx web/app/campaigns/page.tsx web/app/creatives/page.tsx web/app/vector-search/page.tsx

git commit --author="Kshama <kshama@example.com>" -m "feat(charts): add dynamic 7D/30D/90D timeline graphs and responsive channel spotlight cards"
```

---

### Commit 9 — Lakshanyaa (Architecture & Tests)
**Task:** AppShell Architecture & Core Backend Verification  
*Files:* Root layout, AppShell role provider, Navigation, and package dependencies.

```powershell
git add web/app/layout.tsx web/app/not-found.tsx web/components/AppShell.tsx web/components/Navigation.tsx web/package.json web/package-lock.json web/.eslintrc.json

git commit --author="Lakshanyaa <nlakshanyaa@gmail.com>" -m "refactor(arch): structure AppShell role provider and integrate full-stack application routing"
```

---

### Commit 10 — Kshama (Documentation & QA)
**Task:** Comprehensive System Documentation & QA Guide  
*Files:* Detailed README, academic syllabus mapping, and leftover components.

```powershell
git add README.md docs/academic_evaluation.md web/components/

git commit --author="Kshama <kshama@example.com>" -m "docs: author comprehensive system architecture README, rubric mapping, and user guide"
```

---

## 4. Final Push to GitHub

Once all 10 commits are recorded:

```powershell
# Verify git status is completely clean
git status

# Push your feature branch to GitHub
git push -u origin feature/secure-auth

# (Optional) If you want this on main branch:
git checkout main
git merge feature/secure-auth
git push -u origin main
```

---

## 5. Summary Table for Viva / Submission

| # | Contributor | Commit Summary | Primary Files Changed |
|---|---|---|---|
| **1** | Lakshanyaa | Server-side auth middleware & session management | `middleware.ts`, `api/auth/*`, `lib/pg.ts`, `lib/mongodb.ts` |
| **2** | Kshama | Vintage collage login UI & role switcher | `app/login/page.tsx`, `public/collage/*`, `globals.css` |
| **3** | Lakshanyaa | MongoDB aggregation & context backend APIs | `api/raw-events/*`, `stats/`, `aggregate/`, `context/` |
| **4** | Kshama | Event Intelligence Hub charts & document inspector | `app/raw-events/page.tsx` |
| **5** | Lakshanyaa | PostgreSQL RBAC introspection & EXPLAIN API | `api/system/*`, `permissions/`, `simulate/`, `performance/` |
| **6** | Kshama | SQL Control Center & privilege matrix UI | `app/sql-audit/page.tsx` |
| **7** | Lakshanyaa | Multi-touch attribution & pgvector APIs | `api/creatives/*`, `api/roas/*`, `api/campaigns/*` |
| **8** | Kshama | Interactive 7D/30D/90D charts & channel spotlight | `app/page.tsx`, `channels/`, `attribution/`, `journeys/` |
| **9** | Lakshanyaa | AppShell role architecture & full-stack routing | `AppShell.tsx`, `layout.tsx`, `package.json` |
| **10** | Kshama | System architecture README & academic docs | `README.md`, `academic_evaluation.md`, `components/*` |
