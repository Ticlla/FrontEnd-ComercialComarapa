# Product Import from Invoice Images

This folder contains all documentation related to the **Product Import** feature, which allows users to upload photos of purchase invoices (notas de venta) and automatically extract product information using AI.

## Contents

| File | Description |
|------|-------------|
| [ARCHITECTURE.md](./ARCHITECTURE.md) | High-level architecture overview |
| [PRD.md](./PRD.md) | Product Requirements Document (v1.5) |
| [IMPLEMENTATION-PLAN.md](./IMPLEMENTATION-PLAN.md) | Technical implementation plan (4 weeks) |

## Feature Overview

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  📷 Upload   │ ──▶ │  🤖 AI       │ ──▶ │  🔍 Match    │ ──▶ │  ✨ Create   │
│  Images      │     │  Extraction  │     │  Products    │     │  New Items   │
└──────────────┘     └──────────────┘     └──────────────┘     └──────────────┘
```

## Key Features

- **Multi-image upload** - Upload up to 20 invoice images at once
- **AI extraction** - Gemini Flash Vision for extraction of handwritten invoices
- **Smart matching** - Fuzzy search (pg_trgm) against existing product catalog
- **Inline editing** - Correct extraction errors before creating products
- **AI autocomplete** - Get suggestions for standardized product names & descriptions
- **Category detection** - Automatic category suggestions for new products
- **Bulk creation** - Create multiple products and categories at once
- **Consolidated view** - See all products from all invoices in one table

## Tech Stack

- **Frontend:** React + TypeScript + TailwindCSS
- **Backend:** FastAPI + Python
- **AI:** Google Gemini Flash (Vision)
- **Database:** PostgreSQL with pg_trgm for fuzzy search
- **Templating:** Jinja2 for dynamic AI prompts

## Implementation Status

| Phase | Description | Status |
|-------|-------------|--------|
| Phase 1 | Backend AI Extraction Service | ✅ Complete |
| Phase 2 | Backend Matching & Autocomplete | ✅ Complete |
| Phase 3 | Frontend UI Implementation | 🔜 Next |
| Phase 4 | Integration & Testing | ⏳ Pending |

### Backend Endpoints

| Method | Endpoint | Description | Phase |
|--------|----------|-------------|-------|
| `POST` | `/api/v1/import/extract-from-image` | Single image extraction | 1 ✅ |
| `POST` | `/api/v1/import/extract-from-images` | Batch extraction (up to 20) | 1 ✅ |
| `POST` | `/api/v1/import/autocomplete-product` | AI autocomplete suggestions | 1 ✅ |
| `GET` | `/api/v1/import/health` | Service health check | 1 ✅ |
| `POST` | `/api/v1/import/match-products` | Match product against catalog (pg_trgm) | 2 ✅ |
| `POST` | `/api/v1/import/bulk-create` | Bulk create products & categories | 2 ✅ |

### Configuration Required

```env
# Add to Backend-ComercialComarapa/.env.development
GEMINI_API_KEY=your_api_key_here
GEMINI_MODEL=gemini-flash-latest
```

### Backend Files (Phase 1 & 2)

```
Backend-ComercialComarapa/src/comercial_comarapa/
├── api/v1/import_products.py       # All import endpoints
├── services/
│   ├── ai_extraction_service.py    # AI Vision extraction
│   └── matching_service.py         # DB fuzzy matching with caching
├── prompts/
│   ├── template_service.py         # Jinja2 prompt rendering
│   └── templates/
│       ├── extraction.j2           # AI extraction prompt
│       └── autocomplete.j2         # AI autocomplete prompt
└── models/import_extraction.py     # Pydantic models
```

## Related Documents

- [PRD-001: Product Search](../prd/PRD-001-product-search.md) - Search interface (implemented)
- [Architecture](../ARQUITECTURA.md) - Overall frontend architecture

