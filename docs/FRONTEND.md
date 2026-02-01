# Frontend Documentation

Next.js 14+ (App Router) + Tailwind CSS v4 + TypeScript.

## Key Features

- **Auth**: Login/Register via cookie-based sessions.
- **State Management**: Zustand stores auth user.
- **Styling**: Tailwind v4 with CSS variables in `globals.css`.
- **Components**: Reusable UI in `src/components/ui`.

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_API_URL` | Backend API URL (default: http://localhost:5000/api) |
| `NEXT_PUBLIC_SOCKET_URL` | Socket.io URL (default: http://localhost:5000) |

## Directory Structure

- `src/app`: Routes & Pages.
  - `(dashboard)`: Protected dashboard routes.
  - `auth`: Public auth routes.
  - `page.tsx`: Landing page.
- `src/components`:
  - `ui`: Atomic components (Button, Input).
  - `layout`: Navbar, Sidebar.
- `src/services`: API client (Axios).
- `src/store`: Zustand stores.

## How to Run

```bash
npm run dev
```
(Run from root, starts everything)
