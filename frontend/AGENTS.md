# frontend/AGENTS.md

Guidance for working under `frontend/`. Cross-cutting repo info is in the root `AGENTS.md`.

## 🛠 Stack

React 19 + TypeScript (strict) + Vite + Tailwind CSS + Shadcn UI + TanStack Query v5 + Framer Motion + Lucide Icons + QRCode.react.

## 🚀 Commands

```bash
npm install
npm run dev        # start Vite dev server
npm run build      # tsc -b && vite build
npm run preview    # preview production build
make docker-up     # launch standalone Nginx container
```

## 📂 Layout

```
frontend/src/
├── components/    # UI components (AdminDashboard, AuthModal, RewardsCatalog, CouponWallet, POSScannerModal, QRModal, etc.)
├── constants/     # Application constants & store presets
├── hooks/         # Custom TanStack Query hooks (useUserProfile, useRewards, useCoupons, useAuth, etc.)
├── lib/           # Helper re-exports & API hooks
├── services/      # apiClient fetch wrapper with auth header injection
├── types/         # TypeScript interfaces matching backend DTOs & Domain entities
├── utils/         # Currency & date formatters
├── App.tsx        # Application root layout & tab router
└── main.tsx       # Vite React entry point
```

## 🔑 Key Patterns

- **Server State**: Managed via TanStack Query hooks in `src/hooks/`.
- **Auth Token Persistence**: Tokens and user IDs are stored in `localStorage` (`lh_auth_token`, `lh_user_id`) and injected automatically into every API request by `services/apiClient.ts`.
- **Realtime QR Expiry**: 30-second auto-refreshing QR code token countdown in `components/QRModal.tsx`.
