# Academic Evaluation & Rubric Traceability Guide

**Course:** Database Management Systems — Experiential Learning (Level 3)  
**Institution:** PES University  
**Target Score:** 50 / 50 Marks  

This reference document maps the project's engineering deliverables directly to the 14 formal evaluation components outlined in the department syllabus and assessment rubric.

---

## Evaluation Components Mapping (50 Marks)

| # | Evaluation Component | Max Marks | Implementation & Architectural Evidence | Code / Document Reference |
|---|---|:---:|---|---|
| **1** | **ER Diagram** | 2 | Star schema with dimension tables (`dim_user`, `dim_campaign`, `dim_creative`, `dim_date`) and fact tables (`fact_touchpoint`, `fact_conversion`, `fact_refund`, `fact_spend`), including Campaign EER Specialization (`paid_campaign`, `email_campaign`). | [`docs/01_relational_schema.md`](01_relational_schema.md) |
| **2** | **Relational Schema** | 3 | Formal mapping showing Primary Keys, Foreign Keys, cascade behaviors (`ON DELETE RESTRICT` vs `CASCADE`), and domain integrity constraints. | [`docs/01_relational_schema.md`](01_relational_schema.md) |
| **3** | **SQL DDL with Constraints** | 4 | 11 tables with `CHECK` constraints (e.g., `spend >= 0`, `gross_revenue > 0`), composite `UNIQUE` idempotency constraints, and stored generated columns. | [`sql/01_schema_ddl.sql`](../sql/01_schema_ddl.sql) |
| **4** | **NoSQL / Vector DB Creation** | 4 | MongoDB 7.0 database creation with compound indexes + PostgreSQL `pgvector` extension setup with HNSW index. | [`docs/04_nosql_and_vector.md`](04_nosql_and_vector.md) |
| **5** | **Technology Justification** | 1 | Architectural evaluation detailing why PostgreSQL (OLAP warehouse), MongoDB (unstructured clickstream staging), and pgvector (co-located vector search) were selected. | [`docs/03_technology_justification.md`](03_technology_justification.md) |
| **6** | **DML Operations** | 4 | Dedicated script demonstrating single-row, bulk, and subquery `INSERT`, conditional `UPDATE`, and cascading `DELETE` operations with before/after count checks. | [`sql/03_dml_operations.sql`](../sql/03_dml_operations.sql) |
| **7** | **Nested, Correlated, Recursive & Join SQL** | 4 | • **Recursive CTE:** Reconstructs multi-hop journey paths (`Google -> Meta -> Email -> Conversion`).<br>• **Correlated Subquery:** Identifies high-performing anomalous campaigns exceeding channel averages.<br>• **Complex Joins:** Multi-way dimension-to-fact joins computing Return on Ad Spend (ROAS). | [`sql/04_attribution_models.sql`](../sql/04_attribution_models.sql) |
| **8** | **Advanced SQL (Proc, Trigger, CTE)** | 6 | • `sp_ingest_touchpoint` stored procedure with transaction blocks.<br>• `trg_deduct_refund` automatically updates net conversion revenue.<br>• `trg_audit_campaign_budget` tracks budget modifications in `audit_log`. | [`sql/05_programmability.sql`](../sql/05_programmability.sql) |
| **9** | **NoSQL / Vector Feature RUD** | 7 | Full Read, Update, Delete test suite on MongoDB raw events and `pgvector` dense vector embeddings. | [`tests/03_nosql_vector_rud_test.py`](../tests/03_nosql_vector_rud_test.py) |
| **10** | **Next.js Interface** | 3 | Full-stack Next.js 15 App Router web interface featuring multi-model ROAS analytics, recursive journey breadcrumbs, semantic creative search, and MongoDB event management. | [`web/app/`](../web/app/) |
| **11** | **Backend / API Integration** | 2 | Serverless route handlers with dual-connection pooling (`pg` and `mongodb`) executing parameterized SQL queries. | [`web/app/api/`](../web/app/api/) |
| **12** | **Authentication & Database RBAC** | 4 | Role-Based Access Control enforced directly inside PostgreSQL (`app_analyst` with `SELECT` only vs `app_manager` with `INSERT/UPDATE`). Unauthorized writes are blocked at the database engine level. | [`sql/02_roles_rbac.sql`](../sql/02_roles_rbac.sql) |
| **13** | **Documentation & Git** | 2 | Comprehensive engineering dossiers, clean Git history, reproducible quickstart instructions. | [`docs/`](../docs/) |
| **14** | **Originality & Viva Defense** | 4 | Original "AI-Search Market Shift" scenario simulating the real-world 2026 advertising redistribution from Google to Meta/Email + comprehensive live examiner modification cheat sheet. | [`docs/07_viva_defense_and_modifications.md`](07_viva_defense_and_modifications.md) |
| **Total** | | **50** | | |
