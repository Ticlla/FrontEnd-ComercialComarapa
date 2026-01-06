# PRD-002: Product Import from Invoice Images

**Version:** 1.2  
**Created:** January 6, 2026  
**Updated:** January 6, 2026  
**Status:** Draft  

---

## 1. Overview

### 1.1 Problem Statement

Comercial Comarapa receives purchase invoices (notas de venta) from suppliers as handwritten paper documents. Currently, there is no efficient way to:

1. Identify which products from invoices are not yet in the catalog
2. Add new products to the inventory system
3. Update pricing information from suppliers

Staff must manually compare invoices against the system, which is time-consuming and error-prone.

### 1.2 Solution

A minimalist interface that allows staff to:

1. Upload a photo of a purchase invoice
2. Automatically extract product information using AI (Gemini Flash Vision)
3. Match extracted products against existing catalog
4. Easily create new products for items not found

### 1.3 Success Metrics

| Metric | Target |
|--------|--------|
| Time to process one invoice | < 2 minutes (vs 10+ min manual) |
| OCR extraction accuracy | > 85% for handwritten text |
| New product detection rate | 100% (all unmatched items flagged) |
| User adoption | Staff using within first week |

---

## 2. User Stories

### Primary User: Store Manager / Inventory Staff

```
AS A store manager
I WANT TO upload a photo of a purchase invoice
SO THAT I can quickly identify and add new products to the catalog
```

### Acceptance Criteria

- [ ] **Can upload multiple invoice images (drag & drop or click)**
- [ ] System extracts product lines automatically (AI-powered)
- [ ] Each extracted item shows: quantity, description, unit price
- [ ] **Can manually edit any extracted field (inline editing)**
- [ ] **AI autocomplete for product description/name**
- [ ] System attempts to match with existing products (fuzzy search)
- [ ] Unmatched products clearly marked as "new"
- [ ] Can create new product directly from extracted data
- [ ] Can edit extracted data before creating product
- [ ] **Can navigate between multiple uploaded invoices**
- [ ] **Consolidated view of all products from all invoices**
- [ ] Works on desktop (primary) and tablet

### Secondary User Story: Manual Correction

```
AS A store staff member
I WANT TO edit the AI-extracted product data
SO THAT I can correct OCR errors before creating products
```

### Secondary User Story: AI Autocomplete

```
AS A store staff member
I WANT TO get AI suggestions while typing a product name
SO THAT I can standardize product names and save time
```

---

## 3. User Interface Design

### 3.1 Layout Overview - Initial State (Multiple Images)

```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│  ← Volver                 IMPORTAR PRODUCTOS                        │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                                                             │   │
│  │                                                             │   │
│  │           📷  Arrastra una o varias imágenes aquí           │   │
│  │                                                             │   │
│  │                  o haz clic para seleccionar                │   │
│  │                                                             │   │
│  │           Formatos: JPG, PNG (máx. 10MB por imagen)         │   │
│  │                Puedes subir hasta 20 imágenes               │   │
│  │                                                             │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 3.2 Layout Overview - Processing State (Multiple Images)

```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│  ← Volver                 IMPORTAR PRODUCTOS                        │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                                                             │   │
│  │              ⏳ Procesando 5 imágenes...                     │   │
│  │                                                             │   │
│  │   ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐                  │   │
│  │   │ ✅  │ │ ✅  │ │ ⏳  │ │ ⏸️  │ │ ⏸️  │                  │   │
│  │   │img1 │ │img2 │ │img3 │ │img4 │ │img5 │                  │   │
│  │   └─────┘ └─────┘ └─────┘ └─────┘ └─────┘                  │   │
│  │                                                             │   │
│  │              ████████████░░░░░░░░░░░░  60%                  │   │
│  │                                                             │   │
│  │              Procesando imagen 3 de 5...                    │   │
│  │              Extrayendo productos con AI                     │   │
│  │                                                             │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 3.3 Layout Overview - Results State (Multi-Image with Tabs)

```
┌─────────────────────────────────────────────────────────────────────┐
│  ← Volver                 IMPORTAR PRODUCTOS                        │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  [📋 Todos (18)]  [📄 Nota 1 (6)]  [📄 Nota 2 (4)] ...     │   │
│  └─────────────────────────────────────────────────────────────┘   │
├────────────────────────────────┬────────────────────────────────────┤
│                                │                                    │
│  ┌──────────────────────────┐  │  Productos Detectados (6)          │
│  │                          │  │  de Nota 1 - Sanchez               │
│  │                          │  │                                    │
│  │    [IMAGEN DE NOTA]      │  │  ┌────────────────────────────────┐│
│  │                          │  │  │ ✅ Mopa colores          [✏️] ││
│  │                          │  │  │    12 × Bs.40 = Bs.480         ││
│  │                          │  │  │    → Mopa Color Grande [90%]   ││
│  │                          │  │  └────────────────────────────────┘│
│  │                          │  │                                    │
│  │                          │  │  ┌────────────────────────────────┐│
│  │                          │  │  │ ⚠️ Basurera max grande   [✏️] ││
│  │                          │  │  │    12 × Bs.30 = Bs.360         ││
│  │                          │  │  │    → No encontrado [+ Crear]   ││
│  └──────────────────────────┘  │  └────────────────────────────────┘│
│                                │                                    │
│  ┌─────┐ ┌─────┐ ┌─────┐      │  ─────────────────────────────────│
│  │[●1 ]│ │[ 2 ]│ │[ 3 ]│ [+]  │  Resumen: 5 nuevos de 18 total     │
│  └─────┘ └─────┘ └─────┘      │                                    │
│  Miniaturas de notas          │  [Crear 5 productos]  [Cancelar]  │
└────────────────────────────────┴────────────────────────────────────┘
```

### 3.3.1 Consolidated View (Tab "Todos")

```
┌─────────────────────────────────────────────────────────────────────┐
│  ← Volver                 IMPORTAR PRODUCTOS                        │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  [📋 Todos (18)] ●  [📄 Nota 1 (6)]  [📄 Nota 2 (4)] ...   │   │
│  └─────────────────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Filtrar: [Todos ▼]  [Solo nuevos ▼]              Buscar: [____]   │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ Nota │ Descripción              │ Cant │ P.U.   │ Estado    │   │
│  ├──────┼──────────────────────────┼──────┼────────┼───────────┤   │
│  │  1   │ Mopa colores             │  12  │ Bs.40  │ ✅ Match  │   │
│  │  1   │ Basurera max grande      │  12  │ Bs.30  │ ⚠️ Nuevo  │   │
│  │  1   │ Papelera grande          │   6  │ Bs.60  │ ✅ Match  │   │
│  │  2   │ Gato hidráulico          │   1  │ Bs.285 │ ✅ Match  │   │
│  │  2   │ Cámara GRIS              │   4  │ Bs.90  │ ⚠️ Nuevo  │   │
│  │  3   │ Escoba metálica          │   3  │ Bs.70  │ ⚠️ Nuevo  │   │
│  │ ...  │ ...                      │ ...  │ ...    │ ...       │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  Mostrando 18 productos de 3 notas                                 │
│  ✅ 13 existentes  ⚠️ 5 nuevos                                      │
│                                                                     │
│  [Crear 5 productos nuevos]                          [Cancelar]    │
└─────────────────────────────────────────────────────────────────────┘
```

### 3.4 Inline Edit Mode (Click ✏️)

```
┌────────────────────────────────────────────────────────────────┐
│  📝 Editando producto                                    [✕]  │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  Descripción                                                   │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │ Basurera max gra|                              [✨ AI]   │ │
│  └──────────────────────────────────────────────────────────┘ │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │ 💡 Sugerencias AI:                                       │ │
│  │    • Basurera Max Grande Plástico                        │ │
│  │    • Basurera Máxima Grande con Tapa                     │ │
│  │    • Basurera Grande Max 50L                             │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                │
│  ┌─────────────────┐  ┌─────────────────┐  ┌───────────────┐  │
│  │ Cantidad        │  │ Precio Unit.    │  │ Total         │  │
│  │ [12___________] │  │ [Bs. 30.00____] │  │ Bs. 360.00    │  │
│  └─────────────────┘  └─────────────────┘  └───────────────┘  │
│                                                                │
│                              [Cancelar]  [💾 Guardar cambios] │
└────────────────────────────────────────────────────────────────┘
```

### 3.5 AI Autocomplete Dropdown

```
┌──────────────────────────────────────────────────────────────┐
│  Descripción                                                  │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ Escoba met|                                     [✨ AI] │  │
│  └────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ ⏳ Generando sugerencias...                             │  │
│  └────────────────────────────────────────────────────────┘  │
│                        ↓                                      │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ 💡 Sugerencias:                                        │  │
│  │ ┌────────────────────────────────────────────────────┐ │  │
│  │ │ Escoba Metálica Industrial                     ← │ │  │
│  │ ├────────────────────────────────────────────────────┤ │  │
│  │ │ Escoba Metálica con Mango Telescópico             │ │  │
│  │ ├────────────────────────────────────────────────────┤ │  │
│  │ │ Escoba Metal Grande para Exteriores               │ │  │
│  │ └────────────────────────────────────────────────────┘ │  │
│  │                                                        │  │
│  │ ↑↓ para navegar • Enter para seleccionar • Esc cerrar │  │
│  └────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
```

### 3.6 Create Product Modal

```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│  ✕                    CREAR NUEVO PRODUCTO                          │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  Nombre *                                                    │   │
│  │  [Basurera Max Grande_________________________________]      │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ┌──────────────────────┐  ┌────────────────────────────────────┐  │
│  │  SKU (auto)          │  │  Categoría                         │  │
│  │  [BAS-001__________] │  │  [Limpieza ▼]                      │  │
│  └──────────────────────┘  └────────────────────────────────────┘  │
│                                                                     │
│  ┌──────────────────────┐  ┌────────────────────────────────────┐  │
│  │  Precio Costo        │  │  Precio Venta                      │  │
│  │  [Bs. 30.00________] │  │  [Bs. 45.00__________]             │  │
│  └──────────────────────┘  └────────────────────────────────────┘  │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │  Descripción (opcional)                                      │   │
│  │  [_____________________________________________________]     │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│                           [Cancelar]  [💾 Crear Producto]          │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 3.7 Component States

#### Upload Zone States

| State | Appearance |
|-------|------------|
| Empty | Dashed border, upload icon, hint text |
| Drag over | Blue border, highlighted background |
| Uploading | Progress indicator |
| Error | Red border, error message |

#### Extracted Item States

| State | Visual Indicator |
|-------|------------------|
| Matched (high confidence >80%) | ✅ Green check, product name shown |
| Matched (low confidence 50-80%) | 🔶 Orange, "Revisar" suggestion |
| Not matched | ⚠️ Yellow warning, "[+ Crear]" button |
| **Editing** | 📝 Blue border, expanded edit panel |
| **Modified** | 🔄 Indicator showing item was edited |
| Creating... | Spinner, disabled |
| Created | ✅ "Producto creado" toast |

#### AI Autocomplete States

| State | Visual Indicator |
|-------|------------------|
| Idle | ✨ AI button visible, inactive |
| Loading | ⏳ Spinner in dropdown, "Generando..." |
| Suggestions ready | 💡 Dropdown with 5 suggestions |
| No suggestions | "No hay sugerencias" message |
| Error | Red text, retry option |

### 3.8 Interactions

| Action | Behavior |
|--------|----------|
| **Drop multiple images** | Upload all and start batch AI extraction |
| **Click [+] add more** | Add more images to current batch |
| Click matched item | Show match details |
| Click "[+ Crear]" | Open create product modal |
| Click product suggestion | Confirm match (link to existing) |
| Click "Nueva imagen" | Clear all and start over |
| Click "Crear X productos" | Batch create all new products |
| **Click ✏️ (edit)** | Open inline edit mode for that item |
| **Edit description field** | Enable save button, recalculate match |
| **Click ✨ AI button** | Trigger AI autocomplete suggestions |
| **Type in description** | Debounce 500ms, then fetch AI suggestions |
| **Arrow keys in suggestions** | Navigate through AI suggestions |
| **Enter on suggestion** | Select suggestion, close dropdown |
| **Esc in edit mode** | Cancel changes, close edit panel |
| **Click "Guardar cambios"** | Save edits, re-run product matching |

#### Multi-Image Navigation

| Action | Behavior |
|--------|----------|
| Click tab "Todos" | Show consolidated view of all products |
| Click tab "Nota X" | Show products from specific invoice |
| Click thumbnail | Switch to that invoice view |
| Click ✕ on thumbnail | Remove that invoice from batch |
| Filter "Solo nuevos" | Show only unmatched products |
| Search in consolidated | Filter products by description |

---

## 4. Technical Requirements

### 4.1 API Endpoints

#### Extract Products from Single Image

```typescript
// Request
POST /api/v1/import/extract-from-image
Content-Type: multipart/form-data

{
  "image": <file>
}

// Response
{
  "success": true,
  "data": {
    "extracted_items": [
      {
        "raw_description": "Mopa colores",
        "quantity": 12,
        "unit_price": 40.00,
        "total": 480.00,
        "confidence": 0.92
      },
      {
        "raw_description": "Basurera max gde",
        "quantity": 12,
        "unit_price": 30.00,
        "total": 360.00,
        "confidence": 0.85
      }
    ],
    "invoice_metadata": {
      "supplier_name": "Sanchez",
      "invoice_number": "000498",
      "date": "2026-01-06"
    }
  }
}
```

#### Extract Products from Multiple Images (Batch)

```typescript
// Request
POST /api/v1/import/extract-from-images
Content-Type: multipart/form-data

{
  "images": [<file1>, <file2>, <file3>, ...]  // up to 20 images
}

// Response
{
  "success": true,
  "data": {
    "invoices": [
      {
        "image_index": 0,
        "filename": "nota_sanchez.jpg",
        "status": "success",
        "extracted_items": [
          {
            "raw_description": "Mopa colores",
            "quantity": 12,
            "unit_price": 40.00,
            "total": 480.00,
            "confidence": 0.92
          }
        ],
        "invoice_metadata": {
          "supplier_name": "Sanchez",
          "invoice_number": "000498",
          "date": "2026-01-06"
        }
      },
      {
        "image_index": 1,
        "filename": "nota_huarachi.jpg",
        "status": "success",
        "extracted_items": [...],
        "invoice_metadata": {...}
      },
      {
        "image_index": 2,
        "filename": "nota_borrosa.jpg",
        "status": "error",
        "error": "Could not extract text from image",
        "extracted_items": [],
        "invoice_metadata": null
      }
    ],
    "summary": {
      "total_images": 3,
      "successful": 2,
      "failed": 1,
      "total_items_extracted": 12
    }
  }
}
```

#### Match Products

```typescript
// Request
POST /api/v1/import/match-products

{
  "items": [
    { "description": "Mopa colores", "unit_price": 40.00 },
    { "description": "Basurera max gde", "unit_price": 30.00 }
  ]
}

// Response
{
  "success": true,
  "data": {
    "matches": [
      {
        "input_description": "Mopa colores",
        "matched_product": {
          "id": "uuid",
          "name": "Mopa Color Grande",
          "sku": "MOP-001",
          "unit_price": 45.00
        },
        "confidence": 0.90
      },
      {
        "input_description": "Basurera max gde",
        "matched_product": null,
        "confidence": 0,
        "suggested_name": "Basurera Max Grande",
        "suggested_sku": "BAS-001"
      }
    ]
  }
}
```

#### AI Autocomplete Description

```typescript
// Request
POST /api/v1/import/autocomplete-description

{
  "partial_text": "Escoba met",
  "context": "cleaning supplies",  // optional, from invoice
  "limit": 5
}

// Response
{
  "success": true,
  "data": {
    "suggestions": [
      "Escoba Metálica Industrial",
      "Escoba Metálica con Mango Telescópico",
      "Escoba Metal Grande para Exteriores",
      "Escoba Metálica Reforzada",
      "Escoba Met. Cerdas Duras"
    ]
  }
}
```

### 4.2 AI Integration (Gemini Flash Vision)

```typescript
// Prompt for extraction (OCR)
const EXTRACTION_PROMPT = `
Analiza esta imagen de una nota de venta/factura y extrae los productos.

Para cada línea de producto, extrae:
- cantidad (número)
- descripción (texto del producto)
- precio_unitario (número)
- total (número)

Responde SOLO con JSON válido en este formato:
{
  "items": [
    {"cantidad": 12, "descripcion": "Mopa colores", "precio_unitario": 40, "total": 480}
  ],
  "proveedor": "nombre si es visible",
  "numero_nota": "número si es visible",
  "fecha": "fecha si es visible"
}
`;

// Prompt for autocomplete
const AUTOCOMPLETE_PROMPT = `
Eres un asistente para una tienda de artículos variados en Bolivia.
El usuario está escribiendo el nombre de un producto.

Texto parcial: "{partial_text}"
Contexto (si hay): "{context}"

Genera 5 nombres de productos COMPLETOS y PROFESIONALES que podrían 
coincidir con lo que el usuario está escribiendo.

Reglas:
- Nombres claros y descriptivos
- Incluir tamaño/variante si es relevante (Grande, Chico, etc.)
- Usar español boliviano/latinoamericano
- NO incluir precios ni códigos

Responde SOLO con JSON: {"suggestions": ["nombre1", "nombre2", ...]}
`;
```

### 4.3 Frontend Components

```
src/
├── components/
│   └── import/
│       ├── MultiImageUploader.tsx    # 🆕 Multi-file drag & drop zone
│       ├── ImageThumbnails.tsx       # 🆕 Thumbnail navigation bar
│       ├── InvoiceTabs.tsx           # 🆕 Tab navigation (Todos, Nota 1, etc.)
│       ├── ProcessingIndicator.tsx   # Loading/progress state (multi-image)
│       ├── ExtractedItemsList.tsx    # List of extracted products
│       ├── ExtractedItem.tsx         # Single item with match status
│       ├── ExtractedItemEditor.tsx   # Inline edit panel for item
│       ├── AIAutocomplete.tsx        # AI suggestions dropdown
│       ├── ConsolidatedView.tsx      # 🆕 Table view of all products
│       ├── CreateProductModal.tsx    # Modal for new product creation
│       └── index.ts
├── hooks/
│   ├── useBatchImageExtraction.ts    # 🆕 React Query for batch OCR
│   ├── useImageExtraction.ts         # React Query mutation for single OCR
│   ├── useProductMatching.ts         # Hook for fuzzy matching
│   ├── useAIAutocomplete.ts          # Hook for AI description suggestions
│   └── useImportState.ts             # 🆕 State management for multi-invoice
├── services/
│   └── import.ts                     # API calls for import
└── pages/
    └── ImportPage.tsx                # Main import page
```

### 4.4 Performance Requirements

| Requirement | Target |
|-------------|--------|
| Single image upload | < 2s for 5MB image |
| **Batch upload (20 images)** | < 10s total upload |
| AI extraction (single) | < 5s (Gemini Flash) |
| **AI extraction (batch)** | Parallel processing, < 15s for 10 images |
| Product matching | < 500ms (local fuzzy search) |
| Total flow (single) | < 10s from upload to results |
| **Total flow (batch 5 images)** | < 30s from upload to all results |
| Max image size | 10MB per image |
| **Max batch size** | 20 images |
| Supported formats | JPEG, PNG, WebP |

---

## 5. Design Specifications

### 5.1 Typography

| Element | Font | Size | Weight |
|---------|------|------|--------|
| Page title | Inter | 20px | 600 |
| Item description | Inter | 16px | 500 |
| Item details | Inter | 14px | 400 |
| Match suggestion | Inter | 13px | 400 |
| Confidence % | Inter | 12px | 500 |

### 5.2 Colors

```css
/* Status Colors */
--color-matched: #188038;       /* Green - product found */
--color-review: #f9ab00;        /* Amber - low confidence */
--color-new: #ea8600;           /* Orange - not found */
--color-error: #d93025;         /* Red - extraction error */

/* Confidence Badge */
--bg-confidence-high: #e6f4ea;  /* >80% */
--bg-confidence-med: #fef7e0;   /* 50-80% */
--bg-confidence-low: #fce8e6;   /* <50% */

/* Upload Zone */
--border-upload: #dfe1e5;
--border-upload-active: #1a73e8;
--bg-upload-hover: #f8f9fa;
```

### 5.3 Spacing

| Element | Spacing |
|---------|---------|
| Split view gap | 24px |
| Image preview max height | 500px |
| Item card padding | 16px |
| Item card gap | 12px |
| Modal padding | 24px |

---

## 6. AI/OCR Considerations

### 6.1 Handwriting Challenges

Based on sample invoices analyzed:

| Challenge | Mitigation |
|-----------|------------|
| Varying handwriting styles | Use Gemini Flash (good with handwriting) |
| Abbreviated product names | Fuzzy matching with existing catalog |
| Missing unit prices | Allow manual entry |
| Unclear quantities | Show confidence score, allow edit |

### 6.2 Extraction Confidence

| Confidence | Action |
|------------|--------|
| > 90% | Auto-accept, show as matched |
| 70-90% | Show match but prompt review |
| < 70% | Mark as "needs review" |

### 6.3 Cost Estimation

| Usage | Cost (Gemini Flash) |
|-------|---------------------|
| 1 image (~1000 tokens) | ~$0.0001 |
| 100 images/month | ~$0.01 |
| 500 images/month | ~$0.05 |

---

## 7. Error Handling

| Error | User Message | Recovery |
|-------|--------------|----------|
| Image too large | "La imagen es muy grande. Máximo 10MB" | Compress or resize |
| Invalid format | "Formato no soportado. Usa JPG o PNG" | Upload different file |
| AI extraction failed | "No pudimos leer la imagen. Intenta con mejor iluminación" | Retry or manual entry |
| No products found | "No se detectaron productos. Verifica la imagen" | Retry or manual |
| Network error | "Error de conexión. Intenta de nuevo" | Retry button |

---

## 8. Accessibility

| Requirement | Implementation |
|-------------|----------------|
| Keyboard navigation | Tab through items, Enter to create |
| Screen reader | ARIA labels for upload zone, item status |
| Focus management | Focus modal on open, return on close |
| Color contrast | WCAG AA for all text |
| Alternative input | Manual entry option if OCR fails |

---

## 9. Out of Scope (Phase 1)

- [ ] Supplier management/linking
- [ ] Purchase history tracking
- [ ] Automatic stock updates
- [ ] Price history tracking
- [ ] Invoice storage/archival
- [ ] Offline mode
- [ ] Mobile camera integration
- [ ] More than 20 images per batch

---

## 10. Implementation Phases

### Phase 2.1: Core Import (This PRD)
- Image upload with drag & drop
- AI extraction (Gemini Flash)
- Product matching display
- Create single product from extracted data

### Phase 2.2: Enhanced Matching (Future)
- Batch create multiple products
- Improved fuzzy matching
- Learning from user corrections

### Phase 2.3: Full Purchase Flow (Future)
- Supplier management
- Purchase history
- Automatic inventory updates

---

## 11. Open Questions

| # | Question | Status |
|---|----------|--------|
| 1 | Store original invoice images? | Defer to Phase 2.3 |
| 2 | Auto-suggest selling price markup? | Yes, default 30% |
| 3 | Category auto-detection from AI? | Try it, fallback to manual |
| 4 | Limit extraction to N items? | 50 items max per invoice |

---

## Appendix A: Sample Invoice Analysis

Based on provided samples (`productos_1.jpeg` - `productos_14.jpeg`):

### Common Invoice Format
```
┌────────────────────────────────────────┐
│  [SUPPLIER HEADER]                     │
│  PRO-FORMA          Nº 000498          │
├────────────────────────────────────────┤
│  CANT. │ DETALLE      │ P.U.  │ TOTAL  │
│  12    │ Mopa colores │ 40    │ 480    │
│  6     │ Papelera gde │ 60    │ 360    │
│  ...   │ ...          │ ...   │ ...    │
├────────────────────────────────────────┤
│                        TOTAL:  2420    │
└────────────────────────────────────────┘
```

### Identified Suppliers
- Sanchez (limpieza)
- Huarachi (automotriz)
- Pro-Forma (ferretería/varios)

### Product Categories Detected
- Limpieza: mopa, basurera, papelera, escoba
- Ferretería: clavo, grampa, soga
- Automotriz: gato hidráulico, cámara, borne
- Varios: spray, batería, brocha

---

**Document History**

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-01-06 | - | Initial PRD |
| 1.1 | 2026-01-06 | - | Added inline editing & AI autocomplete features |
| 1.2 | 2026-01-06 | - | Added multi-image upload & consolidated view |

