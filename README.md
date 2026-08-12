# 🎁 LoyaltyHub (Rewardly)

> **Modern Digital Loyalty & Rewards Platform** inspired by **7-Eleven ALL Member**, **Starbucks Rewards**, and **McDonald's App**.

Built with a high-performance **Golang REST API Backend**, a mobile-first **React 19 + Vite + TypeScript Frontend**, **Tailwind CSS + Shadcn UI**, **TanStack Query (React Query v5)**, **Framer Motion**, **Nginx**, **Docker Compose**, and **GitHub Actions CI/CD**.

---

## 🚀 Commercial Launch & Vendor Status: READY FOR LAUNCH ✅

LoyaltyHub is fully audited, containerized, and **ready to package, host, and sell to vendors or merchants**.

For complete commercial hosting instructions, white-labeling, SSL setup, and POS integration, see the [Vendor & Hosting Guide](file:///Users/nebula/Downloads/loyalty-hub/VENDOR_HOSTING_GUIDE.md).

---

## 🌟 Key Features

- 🎁 **Points Counter & Tier System**: Real-time points balance, lifetime points, and progress bars to tier levels (`Member`, `Silver`, `Gold`, `Platinum`).
- 📱 **Dynamic QR Code Token Engine**: Generates 30-second expiring customer QR barcodes for cashiers with countdown timers.
- 🏪 **Interactive Cashier POS Simulator**: Simulate barcode scans at cashier counters to instantly award points based on receipt totals.
- 🎟️ **Digital Coupon Wallet**: Active & redeemed voucher tickets with instant barcode popups and expiry countdowns.
- 🛒 **Rewards Catalog & Instant Redemption**: Browse items by category (`Drinks`, `Snacks`, `Vouchers`), check stock, and redeem points with ACID transaction safety.
- 🎉 **August Birthday Month Perk**: Special perk claiming popup for Gold members with celebratory confetti animations (`canvas-confetti`).
- 📊 **Points Statement History**: Filterable ledger log of points earned, spent, and bonus transactions.
- 🛡️ **Store Manager Admin Console**: Full management interface for adding rewards, reviewing CRM accounts, and granting bonus points.

---

## 🏗 Architecture & Stack

```
                          ┌────────────────────────┐
                          │   React 19 + Vite SPA  │
                          │ (Shadcn, React Query,  │
                          │   Zod, Framer Motion)  │
                          └───────────┬────────────┘
                                      │ REST API (JSON)
                                      ▼
                          ┌────────────────────────┐
                          │   Nginx Reverse Proxy  │
                          └───────────┬────────────┘
                                      │
                                      ▼
                          ┌────────────────────────┐
                          │    Go REST API Server  │
                          │     (Gin Framework)    │
                          └─────┬────────────┬─────┘
                                │            │
           ACID Transactions    │            │ Dynamic QR OTPs
                                ▼            ▼
                        ┌──────────────┐  ┌──────────────┐
                        │  PostgreSQL  │  │    Redis     │
                        └──────────────┘  └──────────────┘
```

---

## 🐳 1-Click Production Hosting (Docker Compose)

Launch the complete stack (PostgreSQL + Redis + Go API + Nginx Frontend):

```bash
# Launch production stack
make prod-up

# Stop production stack
make prod-down
```

---

## 🚀 Quick Start (Local Development)

### 1. Run Backend (Go REST API)
```bash
cd backend
go run main.go
# Server listens on http://localhost:8080
```
> *Note: If PostgreSQL/Redis containers are not running, the Go backend automatically falls back to SQLite (`loyaltyhub.db`) and in-memory cache seamlessly.*

### 2. Run Frontend (React + Vite SPA)
```bash
cd frontend
npm install
npm run dev
# App runs on http://localhost:3000
```

### 3. Package Software for Sale / Release
```bash
make package
# Generates release archive at dist_release/loyalty-hub-v1.0.0-vendor-package.tar.gz
```

---

## 📡 REST API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/v1/auth/register` | Register new member account (Earn 200 PTS bonus) |
| `POST` | `/api/v1/auth/login` | Sign in with email & password |
| `GET` | `/api/v1/user/profile` | Get user points balance & tier level |
| `GET` | `/api/v1/rewards` | Get catalog rewards filtered by category |
| `POST` | `/api/v1/rewards/redeem` | Deduct points & generate active coupon |
| `GET` | `/api/v1/coupons` | Get active or used coupons in wallet |
| `GET` | `/api/v1/campaigns` | Get active marketing banners |
| `GET` | `/api/v1/transactions` | Get statement ledger history |
| `GET` | `/api/v1/qr/generate` | Generate dynamic 30s customer QR token |
| `POST` | `/api/v1/qr/scan-earn` | POS Cashier barcode scan to award points |
| `POST` | `/api/v1/coupons/scan-redeem` | POS Cashier barcode scan to redeem voucher |
| `POST` | `/api/v1/campaigns/claim-bday` | Claim August Birthday gift perk |
| `GET` | `/api/v1/admin/analytics` | Get store manager KPI metrics |
| `POST` | `/api/v1/admin/rewards` | Add new reward item to catalog |
| `DELETE` | `/api/v1/admin/rewards/:id` | Delete reward item from catalog |
| `POST` | `/api/v1/admin/users/adjust-points` | Manually adjust member points balance |

---

## 🔄 GitHub Actions CI/CD

Workflows defined in `.github/workflows/ci-cd.yml`:
1. **Backend CI**: Go formatting check (`gofmt`), module verification, and binary build.
2. **Frontend CI**: TypeScript typecheck (`tsc -b`) and production build (`vite build`).
3. **Docker CI**: Verifies `docker-compose.yml` config and container buildability.
