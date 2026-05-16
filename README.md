# GigDrop

Freelance marketplace powered by DarkDrop zero-knowledge payments on Solana.

## How it works

1. **Client posts a job** with a SOL budget
2. **Funds are locked** in a DarkDrop escrow (claim code visible, password hidden)
3. **Freelancer completes work** and client approves
4. **Password is released** to freelancer who claims the payment
5. **Freelancer withdraws** SOL to any wallet

## Stack

- Next.js 14 (App Router)
- SQLite (better-sqlite3)
- DarkDrop Relayer API
- Tailwind CSS

## Getting started

```bash
npm install
cp .env.example .env
npm run dev
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/jobs` | List open jobs |
| POST | `/api/jobs` | Create a job |
| GET | `/api/jobs/[id]` | Get job details |
| PATCH | `/api/jobs/[id]` | Update job status |
| POST | `/api/escrow` | Fund job escrow |
| POST | `/api/escrow/release` | Release payment |

## Monetization

2% platform fee on every transaction (configurable via `PLATFORM_FEE_BPS`).

## License

MIT
