# Product Import from Invoice Images

This folder contains all documentation related to the **Product Import** feature, which allows users to upload photos of purchase invoices (notas de venta) and automatically extract product information using AI.

## Contents

| File | Description |
|------|-------------|
| [ARCHITECTURE.md](./ARCHITECTURE.md) | High-level architecture overview |
| [PRD.md](./PRD.md) | Product Requirements Document (v1.4) |
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
- **Smart matching** - Fuzzy search against existing product catalog
- **Inline editing** - Correct extraction errors before creating products
- **AI autocomplete** - Get suggestions for standardized product names & descriptions
- **Category detection** - Automatic category suggestions for new products
- **Consolidated view** - See all products from all invoices in one table

## Tech Stack

- **Frontend:** React + TypeScript + TailwindCSS
- **Backend:** FastAPI + Python
- **AI:** Google Gemini Flash 2.0 (Vision)
- **Database:** PostgreSQL (existing products table)

## Implementation Status

| Phase | Description | Status |
|-------|-------------|--------|
| Phase 1 | Backend AI Extraction Service | ✅ Complete |
| Phase 2 | Backend Matching & Autocomplete | 🔜 Next |
| Phase 3 | Frontend UI Implementation | ⏳ Pending |
| Phase 4 | Integration & Testing | ⏳ Pending |

### Backend Endpoints (Phase 1)

| Method | Endpoint | Description | Status |
|--------|----------|-------------|--------|
| `POST` | `/api/v1/import/extract-from-image` | Single image extraction | ✅ |
| `POST` | `/api/v1/import/extract-from-images` | Batch extraction (up to 20) | ✅ |
| `POST` | `/api/v1/import/autocomplete-product` | AI autocomplete suggestions | ✅ |
| `GET` | `/api/v1/import/health` | Service health check | ✅ |

### Configuration Required

```env
# Add to Backend-ComercialComarapa/.env.development
GEMINI_API_KEY=your_api_key_here
GEMINI_MODEL=gemini-2.0-flash
```

## Related Documents

- [PRD-001: Product Search](../prd/PRD-001-product-search.md) - Search interface (implemented)
- [Architecture](../ARQUITECTURA.md) - Overall frontend architecture

