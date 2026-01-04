# PRD: Enhanced Product Search System

**Product Requirements Document**

| Field | Value |
|-------|-------|
| **Document Version** | 1.0 |
| **Created** | January 4, 2026 |
| **Last Updated** | January 4, 2026 |
| **Status** | Draft |
| **Owner** | Development Team |

---

## 1. Executive Summary

### 1.1 Problem Statement

The current product search system in Comercial Comarapa uses basic `ILIKE` pattern matching, which has significant limitations:

- **No typo tolerance**: "aciete" doesn't find "aceite"
- **No stemming**: "azúcares" doesn't find "azúcar"
- **No relevance ranking**: Results aren't ordered by best match
- **Limited field search**: Only searches name and SKU, not description or category
- **No fuzzy matching**: Requires exact substring match

These limitations impact store staff productivity when searching for products quickly during customer service.

### 1.2 Proposed Solution

Implement an enhanced search system using PostgreSQL's native Full-Text Search (FTS) combined with the `pg_trgm` extension for fuzzy matching. This approach:

- Requires no additional infrastructure or costs
- Is fully compatible with Supabase
- Provides typo tolerance, stemming, and relevance ranking
- Searches across name, SKU, description, and category

### 1.3 Success Metrics

| Metric | Current | Target |
|--------|---------|--------|
| Search accuracy (typos) | 0% | >80% |
| Average search time | ~200ms | <100ms |
| Fields searched | 2 (name, sku) | 4 (name, sku, description, category) |
| User satisfaction | Baseline | +30% improvement |

---

## 2. Background

### 2.1 Current Implementation

```
User Input → ILIKE '%term%' → name OR sku → Results (unranked)
```

**File**: `BackEnd-CC/src/comercial_comarapa/db/repositories/product.py`

```python
# Current implementation
pattern = f"%{term}%"
result = self.db.table("products")
    .ilike("name", pattern)
    .limit(limit)
```

### 2.2 Technical Constraints

- **Database**: PostgreSQL 16 (Docker local → Supabase production)
- **Backend**: FastAPI + Python 3.12
- **Frontend**: React 19 + TypeScript
- **Development**: Local Docker environment
- **No additional services**: Must use existing infrastructure

### 2.3 User Research

Store staff reported:
- Frequent misspellings when typing quickly
- Difficulty finding products by description keywords
- Need to remember exact product names

---

## 3. Requirements

### 3.1 Functional Requirements

#### FR-1: Typo Tolerance (Fuzzy Search)
| ID | Requirement | Priority |
|----|-------------|----------|
| FR-1.1 | System shall find products when search term has 1-2 character typos | P0 |
| FR-1.2 | System shall use `pg_trgm` similarity matching | P0 |
| FR-1.3 | Similarity threshold shall be configurable (default: 0.3) | P1 |

**Examples:**
- "aciete" → finds "aceite"
- "azukar" → finds "azúcar"
- "cocacola" → finds "Coca Cola"

#### FR-2: Full-Text Search with Spanish Stemming
| ID | Requirement | Priority |
|----|-------------|----------|
| FR-2.1 | System shall use PostgreSQL FTS with Spanish dictionary | P0 |
| FR-2.2 | System shall apply stemming to reduce words to root form | P0 |
| FR-2.3 | System shall support accented characters | P0 |

**Examples:**
- "azúcares" → finds "azúcar" (stemming)
- "bebidas" → finds "bebida" (stemming)
- "limpieza" → finds products with "limpiar" in description

#### FR-3: Multi-Field Search
| ID | Requirement | Priority |
|----|-------------|----------|
| FR-3.1 | System shall search in product name | P0 |
| FR-3.2 | System shall search in SKU | P0 |
| FR-3.3 | System shall search in description | P0 |
| FR-3.4 | System shall search in category name | P1 |

#### FR-4: Relevance Ranking
| ID | Requirement | Priority |
|----|-------------|----------|
| FR-4.1 | Results shall be ordered by relevance score | P0 |
| FR-4.2 | Name matches shall have higher weight than description | P0 |
| FR-4.3 | Exact matches shall rank higher than partial matches | P0 |

**Weight Configuration:**
| Field | Weight | Rationale |
|-------|--------|-----------|
| name | A (highest) | Primary identifier |
| sku | A (highest) | Direct lookup |
| category | B (high) | Category browsing |
| description | C (medium) | Supplementary info |

#### FR-5: Backward Compatibility
| ID | Requirement | Priority |
|----|-------------|----------|
| FR-5.1 | API endpoint shall remain `/api/v1/products/search` | P0 |
| FR-5.2 | Response format shall remain unchanged | P0 |
| FR-5.3 | Frontend shall require no changes | P0 |

### 3.2 Non-Functional Requirements

#### NFR-1: Performance
| ID | Requirement | Target |
|----|-------------|--------|
| NFR-1.1 | Search response time (p95) | <100ms |
| NFR-1.2 | Index rebuild time | <5 seconds |
| NFR-1.3 | Storage overhead | <10% increase |

#### NFR-2: Reliability
| ID | Requirement | Target |
|----|-------------|--------|
| NFR-2.1 | Search availability | 99.9% |
| NFR-2.2 | Graceful degradation to ILIKE if FTS fails | Required |

#### NFR-3: Maintainability
| ID | Requirement | Target |
|----|-------------|--------|
| NFR-3.1 | Automated index updates via triggers | Required |
| NFR-3.2 | No manual reindexing needed | Required |

---

## 4. Technical Design

### 4.1 Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         Frontend                                 │
│  SearchBar → useProductSearch → products.ts → /api/v1/search    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         Backend                                  │
│  products.py → ProductService → ProductRepository               │
│                                      │                          │
│                                      ▼                          │
│                         search_products_hybrid()                │
│                         (PostgreSQL Function)                   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      PostgreSQL / Supabase                       │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │  pg_trgm    │  │  tsvector   │  │  GIN Indexes            │  │
│  │  extension  │  │  column     │  │  - search_vector        │  │
│  │             │  │             │  │  - name (trigram)       │  │
│  │  Fuzzy      │  │  Full-Text  │  │  - sku (trigram)        │  │
│  │  Matching   │  │  Search     │  │  - description (trigram)│  │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### 4.2 Database Schema Changes

#### New Columns

```sql
-- Add category_name cache column
ALTER TABLE products ADD COLUMN category_name TEXT;

-- Add full-text search vector (auto-generated)
-- Note: Uses unaccent() for accent-insensitive matching
ALTER TABLE products ADD COLUMN search_vector tsvector
  GENERATED ALWAYS AS (
    setweight(to_tsvector('spanish', unaccent(coalesce(name, ''))), 'A') ||
    setweight(to_tsvector('spanish', unaccent(coalesce(sku, ''))), 'A') ||
    setweight(to_tsvector('spanish', unaccent(coalesce(category_name, ''))), 'B') ||
    setweight(to_tsvector('spanish', unaccent(coalesce(description, ''))), 'C')
  ) STORED;
```

#### New Indexes

```sql
-- Full-text search index
CREATE INDEX idx_products_search_vector ON products USING GIN(search_vector);

-- Trigram indexes for fuzzy matching (with unaccent support)
CREATE INDEX idx_products_name_trgm ON products USING GIN(unaccent(name) gin_trgm_ops);
CREATE INDEX idx_products_sku_trgm ON products USING GIN(unaccent(sku) gin_trgm_ops);
CREATE INDEX idx_products_desc_trgm ON products USING GIN(unaccent(description) gin_trgm_ops);
```

#### New Functions

```sql
-- Category name sync trigger
CREATE FUNCTION sync_category_name() RETURNS TRIGGER;
CREATE TRIGGER trigger_sync_category_name ON products;

-- Hybrid search function
CREATE FUNCTION search_products_hybrid(search_term TEXT, result_limit INT)
  RETURNS TABLE(...);
```

### 4.3 Backend Changes

#### Repository Layer

```python
# product.py - New method
def search_hybrid(
    self,
    term: str,
    limit: int = 20,
) -> list[ProductResponse]:
    """Search products using hybrid FTS + fuzzy matching."""
    result = self.db.rpc(
        'search_products_hybrid',
        {'search_term': term, 'result_limit': limit}
    ).execute()
    return [self.response_model.model_validate(row) for row in result.data]
```

#### Service Layer

```python
# product_service.py - Update existing method
def search_products(self, term: str, limit: int = 20) -> list[ProductResponse]:
    """Search products with enhanced matching."""
    return self.repository.search_hybrid(term=term, limit=limit)
```

### 4.4 Migration Strategy

1. **Phase 1**: Deploy database changes (non-breaking)
2. **Phase 2**: Update repository to use new function
3. **Phase 3**: Monitor and tune similarity thresholds
4. **Rollback**: Switch back to ILIKE-based search if issues

---

## 5. Implementation Plan

> **📋 Implementation details are separated by concern:**
> - [Backend Implementation Guide](./BACKEND-IMPLEMENTATION.md)
> - [Frontend Implementation Guide](./FRONTEND-IMPLEMENTATION.md)

### 5.1 Summary

| Phase | Scope | Duration | Status |
|-------|-------|----------|--------|
| **Phase 1** | Backend & Database | 1 day | 🔄 In Progress |
| **Phase 2** | Frontend & UI/UX | 2 hours | ⬜ Pending |

---

## 6. Risks and Mitigations

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| FTS index corruption | High | Low | Regular backups, monitoring |
| Performance degradation | Medium | Low | Index optimization, query analysis |
| Spanish dictionary issues | Medium | Low | Test with real product data |
| Supabase compatibility | High | Very Low | Tested extensions available |

---

## 7. Success Criteria

### 7.1 Acceptance Criteria

- [ ] Search "aciete" returns products with "aceite" in name
- [ ] Search "coca" returns "Coca Cola" products
- [ ] Search "limpieza" returns products in "Limpieza" category
- [ ] Search "importado" returns products with "importado" in description
- [ ] Results are ordered by relevance (best match first)
- [ ] Search response time <100ms for 95% of requests
- [ ] All existing tests pass
- [ ] No frontend changes required

### 7.2 Rollout Plan

1. **Stage 1**: Deploy to development environment
2. **Stage 2**: Internal testing (1 day)
3. **Stage 3**: Deploy to staging with sample data
4. **Stage 4**: Deploy to production during low-traffic hours
5. **Stage 5**: Monitor metrics for 24 hours

---

## 8. Appendix

### A. SQL Schema Script

See: `BackEnd-CC/db/schema.sql` (Version 2.0)

This script includes:
- Complete table definitions (categories, products, sales, etc.)
- FTS search_vector column (auto-generated)
- Trigram indexes for fuzzy matching
- Sync triggers for category_name
- `search_products_hybrid()` function

For test data, see: `BackEnd-CC/db/seeds/seed_data.sql`

### B. Search Algorithm Comparison

| Algorithm | Typos | Stemming | Speed | Complexity |
|-----------|-------|----------|-------|------------|
| ILIKE | ❌ | ❌ | Fast | Low |
| FTS | ❌ | ✅ | Very Fast | Medium |
| pg_trgm | ✅ | ❌ | Fast | Low |
| **FTS + pg_trgm** | ✅ | ✅ | Very Fast | Medium |
| pgvector (semantic) | ✅ | ✅ | Medium | High |

### C. Glossary

| Term | Definition |
|------|------------|
| **FTS** | Full-Text Search - PostgreSQL's built-in text search |
| **tsvector** | Text Search Vector - Optimized representation of document |
| **tsquery** | Text Search Query - Parsed search query |
| **pg_trgm** | Trigram extension for fuzzy string matching |
| **GIN Index** | Generalized Inverted Index - Fast for text search |
| **Stemming** | Reducing words to root form (azúcares → azúcar) |

### D. References

- [PostgreSQL Full-Text Search](https://www.postgresql.org/docs/current/textsearch.html)
- [pg_trgm Extension](https://www.postgresql.org/docs/current/pgtrgm.html)
- [Supabase Full-Text Search](https://supabase.com/docs/guides/database/full-text-search)

