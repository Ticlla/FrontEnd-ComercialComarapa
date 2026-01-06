# Product Import from Invoice Images

This folder contains all documentation related to the **Product Import** feature, which allows users to upload photos of purchase invoices (notas de venta) and automatically extract product information using AI.

## Contents

| File | Description |
|------|-------------|
| [ARCHITECTURE.md](./ARCHITECTURE.md) | High-level architecture overview |
| [PRD.md](./PRD.md) | Product Requirements Document (v1.2) |

## Feature Overview

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  📷 Upload   │ ──▶ │  🤖 AI OCR   │ ──▶ │  🔍 Match    │ ──▶ │  ✨ Create   │
│  Images      │     │  Extraction  │     │  Products    │     │  New Items   │
└──────────────┘     └──────────────┘     └──────────────┘     └──────────────┘
```

## Key Features

- **Multi-image upload** - Upload up to 20 invoice images at once
- **AI extraction** - Gemini Flash Vision for OCR of handwritten invoices
- **Smart matching** - Fuzzy search against existing product catalog
- **Inline editing** - Correct OCR errors before creating products
- **AI autocomplete** - Get suggestions for standardized product names
- **Consolidated view** - See all products from all invoices in one table

## Tech Stack

- **Frontend:** React + TypeScript + TailwindCSS
- **Backend:** FastAPI + Python
- **AI:** Google Gemini Flash 2.0 (Vision)
- **Database:** PostgreSQL (existing products table)

## Status

🚧 **Draft** - Ready for implementation

## Related Documents

- [PRD-001: Product Search](../prd/PRD-001-product-search.md) - Search interface (implemented)
- [Architecture](../ARQUITECTURA.md) - Overall frontend architecture

