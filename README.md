# MMoney — personal finance interface

Web interface for organizing personal finances, integrated with the MMoney API.

## Features

- Login and registration screens.
- Bank, account, category and expense management.
- Expense charts and category views.
- Protected routes and token-based API requests.

## Technologies

React, TypeScript and Vite. Libraries and versions are listed in [package.json](package.json).

## Run locally

Requires Node.js and npm.

```bash
git clone https://github.com/chruscinskiDiego/mmoney-frontend.git
cd mmoney-frontend
npm ci
# Configure .env before starting.
npm run dev
```

### Configuration

Set VITE_SERVER_ADDRESS in .env to the backend URL. Check the server's HTTPS settings and allowed CORS origin as well.

## Commands

- `npm run dev`: development server.
- `npm run build`: TypeScript checks and build.
- `npm run preview`: preview the build.
- `npm run lint`: static analysis.

## Integration

Backend: [mmoney-backend](https://github.com/chruscinskiDiego/mmoney-backend).

## Scope

Personal project that depends on the backend for authentication and data. The local environment uses specific HTTPS settings that must be aligned between client and server.
