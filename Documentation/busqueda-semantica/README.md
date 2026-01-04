# Enhanced Search System Documentation

This folder contains documentation for the enhanced product search feature.

## Contents

| File | Description |
|------|-------------|
| `README.md` | This file - index and quick start guide |
| `PRD.md` | Product Requirements Document - Requirements & Design |
| `BACKEND-IMPLEMENTATION.md` | **Detailed** backend steps & engineering notes |
| `FRONTEND-IMPLEMENTATION.md` | **Detailed** frontend steps & UI/UX notes |

**Schema location:** `BackEnd-CC/db/schema.sql` (v2.1 with accent-insensitive search)

## Quick Start

### 1. Review the PRD
Read `PRD.md` for complete requirements and technical design.

### 2. Start Local Database (Docker)

```bash
cd BackEnd-CC

# Start fresh (removes old data, auto-runs schema + seeds)
docker-compose down -v && docker-compose up -d

# Check it's running
docker-compose ps
```

**Access**:
- PostgreSQL: `localhost:5432`
- pgAdmin: `http://localhost:5050` (admin@local.com / admin)

The schema includes:
- ✅ Tables (categories, products)
- ✅ FTS search vector column
- ✅ Trigram indexes
- ✅ Sync triggers
- ✅ Hybrid search function
- ✅ Sample data for testing

### 3. Test the Search

```sql
-- Exact match
SELECT name, relevance FROM search_products_hybrid('coca cola', 5);

-- Typo tolerance (aciete → aceite)
SELECT name, relevance FROM search_products_hybrid('aciete', 5);

-- Spanish stemming (azúcares → azúcar)
SELECT name, relevance FROM search_products_hybrid('azucares', 5);

-- Search by category
SELECT name, category_name FROM search_products_hybrid('lacteos', 5);

-- Search by description
SELECT name, description FROM search_products_hybrid('españa', 5);
```

### 4. Update Backend
Update the Python repository to use `search_products_hybrid()`.

## Feature Summary

### Current Search (ILIKE)
```
"aciete" → ❌ No results (typo)
"azúcares" → ❌ No results (no stemming)
"españa" → ❌ No results (description not searched)
```

### Enhanced Search (FTS + pg_trgm)
```
"aciete" → ✅ Finds "Aceite de Oliva" (fuzzy match)
"azúcares" → ✅ Finds "Azúcar 1kg" (Spanish stemming)
"españa" → ✅ Finds "Aceite de Oliva" (description search)
"lacteos" → ✅ Finds all dairy products (category search)
```

## Search Fields & Weights

| Field | Weight | Search Type |
|-------|--------|-------------|
| name | A (highest) | FTS + Fuzzy + ILIKE |
| sku | A (highest) | FTS + Fuzzy + ILIKE |
| category_name | B (high) | FTS + Fuzzy |
| description | C (medium) | FTS + Fuzzy + ILIKE |

## Technologies

- **PostgreSQL FTS**: Full-text search with Spanish dictionary
- **pg_trgm**: Trigram-based fuzzy matching for typo tolerance
- **GIN Indexes**: Fast inverted indexes for text search

## Implementation Status

- [x] PRD drafted
- [x] Schema script created
- [x] Sample data included
- [ ] Database created in Supabase
- [ ] Backend updated to use new function
- [ ] Testing completed
- [ ] Deployed to production
