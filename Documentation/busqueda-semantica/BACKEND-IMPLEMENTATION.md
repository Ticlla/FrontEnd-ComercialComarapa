# Backend Implementation: Enhanced Search System

This document details the backend implementation steps for the enhanced search system, incorporating senior software engineering feedback for robustness and performance.

## 🏗️ Architecture Summary

The search system shifts from basic pattern matching to a **Hybrid Search Engine** within PostgreSQL:
1. **Full-Text Search (FTS)**: Spanish stemming, stopword handling, and ranking.
2. **Trigram Similarity**: Typo tolerance and phonetic-like matching.
3. **Normalization**: Accent-insensitive matching using `unaccent`.

---

## 🛠️ Step 1: Database Setup (Local Docker)

### 1.1 Schema Update
The schema in `BackEnd-CC/db/schema.sql` has been updated to **Version 2.1**.

**Key Engineering Improvements:**
- **Unaccent Extension**: Enabled to make "azúcar" match "azucar".
- **Immutable Wrapper**: Created `immutable_unaccent()` to allow normalization within `GENERATED STORED` columns and indexes, bypassing PostgreSQL's default immutability restrictions for the `unaccent` extension.
- **Robust Triggers**: `BEFORE INSERT OR UPDATE` trigger ensures `category_name` is populated *before* the `search_vector` is calculated.
- **RPC Refinements**: The search function `search_products_hybrid` now uses direct similarity comparisons (`>= similarity_threshold`) instead of `set_limit()`, ensuring thread safety in connection-pooled environments.
- **ILIKE Normalization**: Fallback pattern matching now applies `immutable_unaccent()` to both sides for consistent accent-insensitive matching.

### 1.2 Execution
```bash
cd BackEnd-CC
# Restart with fresh volume to apply new schema and seeds
docker-compose down -v && docker-compose up -d
```

### 1.3 Verification (pgAdmin)
Connect to `http://localhost:5050` and run:
```sql
-- Verify search works with typos and accents
SELECT name, relevance 
FROM search_products_hybrid('aciete de oliva', 5, 0.15);
```

---

## 🐍 Step 2: Repository Layer (`product.py`)

### 2.1 Input Validation & Normalization
The repository handles initial cleaning and delegates complexity to the database RPC.

**Location**: `BackEnd-CC/src/comercial_comarapa/db/repositories/product.py`

```python
def search(
    self,
    term: str,
    is_active: bool = True,
    limit: int = 20,
) -> list[ProductResponse]:
    """Search products using hybrid search (FTS + Trigram)."""
    # 1. Guard against non-string or null inputs
    safe_term = str(term or "").strip()
    
    # 2. Return empty immediately if term is empty to save DB resources
    if not safe_term:
        return []

    # 3. Call the Hybrid Search RPC
    result = self.db.rpc(
        "search_products_hybrid",
        {
            "search_term": safe_term,
            "result_limit": limit,
            "similarity_threshold": 0.15, # Optimized for Spanish inventory terms
            "is_active_filter": is_active,
        },
    ).execute()
    
    return [self.response_model.model_validate(row) for row in result.data or []]
```

---

## 🧪 Step 3: Backend Testing

### 3.1 Automated Tests
Cases added to `BackEnd-CC/tests/api/test_products.py`:

| Test Case | Purpose |
|-----------|---------|
| `test_search_accent_insensitive` | Verify "azucar" finds "Azúcar" |
| `test_search_typo_tolerance` | Verify "aciete" finds "Aceite" |
| `test_search_empty_input` | Verify system handles `""` or `None` |
| `test_search_relevance_ranking` | Verify exact matches appear above fuzzy matches |

---

## 📋 Backend Checklist

- [x] Extension `unaccent` and `pg_trgm` enabled in PostgreSQL.
- [x] `immutable_unaccent` wrapper created for generated columns.
- [x] GIN indexes created for `search_vector` and trigrams.
- [x] `search_products_hybrid` function tested with sample data.
- [x] Repository `search` method updated with string guards and RPC call.
- [x] Similarity threshold optimized to `0.15` for Spanish typo tolerance.
- [x] Pytest passing with 100% coverage for search scenarios.
