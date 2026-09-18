# Product Catalog

Assignment for Junior Mobile Developer role at Neurogine Sdn. Bhd.

A small React Native product catalog that lists, searches, and shows DummyJSON products.

## How to run

Prerequisites: Node.js 18+ and [Expo Go](https://expo.dev/go) (or iOS Simulator / Android Emulator).

```bash
npm install
npm start
```

Then press `i` for iOS, `a` for Android, or scan the QR code with Expo Go.

```bash
npm test
```

## Stack

- Expo SDK 57, React Native, TypeScript
- Expo Router for navigation
- Native `fetch` (no Axios / React Query)
- `expo-image` for thumbnails and the detail gallery
- Jest (Node test environment + `babel-jest`) for data-layer tests

## Architecture

Two layers, with Expo Router files kept thin:

- **Data** (`src/data`) — HTTP wrapper, product types, DummyJSON API, pagination helper
- **Presentation** (`src/presentation`) — screens, reusable UI, hooks that own screen state

```
app/                         # routes only
src/data/                    # API + types
src/presentation/            # UI + hooks
```

List and detail each keep their own state in a hook (`useProductList`, `useProductDetail`). That is enough for this scope without Redux or a query library, and it keeps loading / error / pagination logic visible.

### Search choice

Search is **server-side** via `GET /products/search?q=...&limit=20&skip=N`, debounced by 400ms.

Client-side filtering was not used because the catalog is paginated (`limit=20`). A local filter would only search rows already in memory and miss later pages. DummyJSON search also returns `total` / `skip` / `limit`, so infinite scroll still works while searching.

An empty query falls back to `GET /products`.

## Features

- Product list: thumbnail, title, price
- Infinite scroll with `skip` (page size 20)
- Product detail: description, price, rating, image gallery
- Distinct loading, error (+ Retry), empty, and success states
- Debounced search
- Pull-to-refresh
- Image placeholder color and a fallback when a URL fails
- Unit tests for pagination and the products API client

### Small UX details

- Search stays visible during loading / empty / error so the query can be changed without leaving the screen
- Pagination errors keep the already-loaded list and show a footer Retry, instead of replacing the screen
- Currency is formatted with `Intl.NumberFormat`
- Rating is shown as stars plus the numeric value

## TODOs (time-boxed leftovers)

- No offline cache or request retry/backoff beyond the Retry button
- Detail images are a simple swipe gallery, not a lightbox
- No automated UI tests (only data-layer unit tests)
- Layout is phone-first; tablet/web is not specially designed

## AI assistance

Cursor (AI) was used to scaffold the Expo project, type against the DummyJSON responses, and draft this README. The architecture (data vs presentation, server-side search, skip pagination, abort + retry) and the screen-state handling were planned up front and implemented in that structure. I can walk through every file in a demo.
