# GasLens - Multi-Chain EVM Gas Tracker

## Overview

GasLens is a standalone, free, multi-chain EVM gas tracker. It shows real-time gas prices across 8 EVM chains in a single dashboard. The goal is immediate adoption through utility, SEO, and shareability - driving traffic back to Benjamin Lassaut's portfolio.

**Target audience:** Web3 developers, QA engineers, and anyone transacting on EVM chains.

**Domain:** gaslens.xyz (or .dev), standalone app separate from the portfolio site.

## Phased Roadmap

- **v1 (this spec):** Real-time gas prices across 8 chains. Simple grid dashboard.
- **v2:** Historical trends - 1h/24h/7d charts per chain. Leverages data accumulated since v1 launch.
- **v3:** Smart recommendations - "best time to transact" insights based on historical patterns.

## Architecture

```
RPC endpoints --> Supabase Edge Function (cron, every 1min, 4 cycles internally) --> Postgres --> Realtime subscription --> React frontend
```

**Frontend:** React + Vite + TypeScript + Tailwind CSS v4, deployed on Vercel.

**Backend:** Supabase (free tier) - Postgres, Edge Functions, Realtime, pg_cron.

The frontend is completely stateless. On page load, it fetches the latest gas price per chain, then subscribes to Supabase Realtime INSERT events on the `gas_prices` table. It maintains an in-memory map of `chain_id -> latest row`, updating on each new insert. No RPC calls from the browser, no API keys on the client.

## Supported Chains (v1)

| Chain | Chain ID | Primary RPC | Fallback RPC |
|-------|----------|-------------|--------------|
| Ethereum | 1 | Cloudflare ETH | Ankr |
| Arbitrum | 42161 | Ankr | LlamaNodes |
| Optimism | 10 | Ankr | LlamaNodes |
| Base | 8453 | Base public RPC | Ankr |
| Polygon | 137 | Polygon public RPC | Ankr |
| Avalanche | 43114 | Avalanche public RPC | Ankr |
| BNB Chain | 56 | BNB Chain public RPC | Ankr |
| zkSync | 324 | zkSync public RPC | Ankr |

EVM-only. Non-EVM chains (Solana, Cosmos, etc.) are out of scope.

## Data Model

### `gas_prices` table

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key (gen_random_uuid) |
| chain_id | int | EVM chain ID |
| chain_name | text | Human-readable name |
| gas_low | numeric | Slow priority in gwei |
| gas_medium | numeric | Standard priority in gwei |
| gas_high | numeric | Fast priority in gwei |
| base_fee | numeric | Current base fee in gwei |
| usd_cost_medium | numeric | Estimated USD cost for a standard transfer (21k gas) |
| fetched_at | timestamptz | Timestamp of this reading |

**Index:** `(chain_id, fetched_at DESC)` for fast latest-per-chain and historical queries.

**Row Level Security:** Read-only for `anon` role. Only the service role (Edge Function) can insert.

### `gas_prices_5m` table (aggregated)

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key (gen_random_uuid) |
| chain_id | int | EVM chain ID |
| chain_name | text | Human-readable name |
| gas_low_avg | numeric | Average low priority in gwei |
| gas_medium_avg | numeric | Average standard priority in gwei |
| gas_high_avg | numeric | Average fast priority in gwei |
| base_fee_avg | numeric | Average base fee in gwei |
| usd_cost_medium_avg | numeric | Average USD cost |
| bucket | timestamptz | Start of the 5-minute window |

**Index:** `(chain_id, bucket DESC)`.

**RLS:** Read-only for `anon` role. Only the service role can insert.

### Data Retention & Compaction

- Granular data (`gas_prices`, ~15s intervals): retained for 24 hours.
- A pg_cron job runs every 5 minutes:
  1. Averages all `gas_prices` rows older than 24h into `gas_prices_5m` (grouped by chain_id and 5-minute bucket).
  2. Deletes the compacted granular rows.
- **Sizing:** 8 chains x 4 rows/min x 1440 min/day = ~46,080 rows/day granular. At ~200 bytes/row, that's ~9 MB/day before compaction. After compaction, 24h of granular data (~9 MB) + aggregated history grows at ~0.5 MB/day. Well within the 500 MB free tier.

## Edge Function: `poll-gas`

Triggered by pg_cron every **1 minute** (pg_cron minimum granularity). The function internally runs **4 polling cycles** with ~15s sleep between them, achieving ~15s update frequency.

**Each cycle:**
1. For each chain, call `eth_gasPrice` and `eth_feeHistory` via the primary RPC. If the primary fails, retry once with the fallback RPC. If both fail, skip that chain for this cycle (do not block other chains).
2. Derive low/medium/high from fee history percentiles.
3. Fetch native token USD prices from CoinGecko free API via a **single batched call** (`/simple/price?ids=ethereum,matic-network,avalanche-2,binancecoin&vs_currencies=usd`). Cache the price response across all 4 cycles within the same invocation (token prices don't change meaningfully in 1 minute).
4. Batch insert all chains in one call (one row per chain).

**Error handling:** Individual chain failures are skipped silently. If CoinGecko fails, use the last known prices from the previous cycle. If all RPCs fail, the function logs an error but does not crash.

**Invocation budget:** 1 invocation/min x 60 x 24 x 30 = ~43,200/month. Well within the 500K free tier limit, leaving ample headroom.

RPC URLs are stored as Supabase Edge Function secrets (server-side only).

## Frontend UX

### Data Loading

1. On mount, fetch latest gas price per chain: `SELECT DISTINCT ON (chain_id) * FROM gas_prices ORDER BY chain_id, fetched_at DESC`.
2. Subscribe to Supabase Realtime `INSERT` events on `gas_prices`.
3. On each insert, update the in-memory map for that `chain_id`.

This ensures gas prices appear immediately on page load, with live updates thereafter.

### Layout

Single page, no routing needed.

1. **Header:** GasLens logo + tagline ("Multi-chain gas prices at a glance") + "Built by Benjamin Lassaut" link to portfolio.
2. **Dashboard:** Grid of cards, one per chain (2x4 desktop, 1 column mobile).
3. **Footer:** Credits, links to portfolio/GitHub/LinkedIn, open source badge.

### Chain Card

Each card displays:
- Chain logo + name
- Low / Medium / High gas in gwei
- USD cost for a standard transfer (21k gas)
- Color indicator: green (cheap) / yellow (moderate) / red (expensive)

**Color thresholds (static, per chain for v1):**

| Chain | Green (< gwei) | Yellow (< gwei) | Red (>= gwei) |
|-------|----------------|-----------------|----------------|
| Ethereum | 15 | 40 | 40 |
| Arbitrum | 0.1 | 0.5 | 0.5 |
| Optimism | 0.01 | 0.05 | 0.05 |
| Base | 0.01 | 0.05 | 0.05 |
| Polygon | 30 | 100 | 100 |
| Avalanche | 25 | 75 | 75 |
| BNB Chain | 3 | 10 | 10 |
| zkSync | 0.25 | 1 | 1 |

These are approximate thresholds based on typical gas ranges. In v2, thresholds will be replaced by dynamic percentiles from historical data.

### Principles

- No auth, no settings, no onboarding.
- Land on the page, immediately see gas prices.
- Cards update in real-time via Supabase Realtime (no page refresh).
- Zero friction. Zero clicks needed.

### Design Language

Dark theme, clean and data-dense. The kind of dashboard that looks good in a screenshot on X. Similar aesthetic to the portfolio site (dark background, teal accents) but its own brand identity.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend framework | React 19 + Vite + TypeScript |
| Styling | Tailwind CSS v4 |
| Backend | Supabase (Postgres + Edge Functions + Realtime + pg_cron) |
| Supabase client | @supabase/supabase-js |
| Edge Function runtime | Deno (TypeScript) |
| Hosting | Vercel (free tier) |
| Domain | gaslens.xyz or gaslens.dev |

## Repo Structure

```
gaslens/
  src/                    # React frontend
    components/           # UI components
    lib/                  # Supabase client, types
    App.tsx
    main.tsx
  supabase/
    migrations/           # SQL schema, RLS policies, compaction function
    functions/
      poll-gas/           # Edge Function (cron)
  public/                 # Static assets, chain logos
  package.json
  vite.config.ts
  tailwind.config.ts
```

## Environment Variables

**Frontend (public, safe):**
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

**Supabase Edge Function secrets (server-side only):**
- RPC URLs per chain (primary + fallback)
- CoinGecko API key (optional - free tier demo plan works without one at 10-30 calls/min)

## Known Scaling Constraints

- **Supabase Realtime:** Free tier allows 200 concurrent connections. If the tool gains significant traction (200+ simultaneous users), Realtime will start rejecting connections. Mitigation: upgrade to Supabase Pro, or fall back to polling the REST API every 15s from the frontend.
- **Edge Function invocations:** ~43K/month used by polling, leaving ~457K for other uses. Comfortable headroom.
- **Database storage:** With compaction, growth is ~0.5 MB/day for aggregated data. Years of runway on the free tier.

## SEO & Lead Generation

- Meta tags optimized for "gas tracker", "ethereum gas", "multi-chain gas prices"
- Open Graph image showing the dashboard for social sharing
- "Built by Benjamin Lassaut" with portfolio link in header and footer
- Open source repo linked prominently

## Out of Scope (v1)

- Historical charts (v2)
- Smart recommendations (v3)
- Non-EVM chains
- Wallet connection
- User accounts or preferences
- Push notifications or alerts
- Mobile app
