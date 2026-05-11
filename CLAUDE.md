# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Start dev server (requires --use-system-ca due to corporate SSL proxy)
NODE_OPTIONS="--use-system-ca" npm start        # http://localhost:4200

# Build for production
NODE_OPTIONS="--use-system-ca" npm run build

# Install packages (same SSL flag required)
NODE_OPTIONS="--use-system-ca" npm install <package>

# Run tests
npm test
```

If `ng serve` crashes immediately after bundle generation with an esbuild platform error, `node_modules` was installed on a different OS. Delete `node_modules` and `package-lock.json`, then reinstall.

## Architecture

Angular 19 standalone-component app — no NgModules anywhere. All components use `standalone: true`.

**Public site** (`src/app/pages/`) — lazy-loaded page components, each self-contained with inline template + styles. Shared `HeaderComponent` and `FooterComponent` wrap every page via `AppComponent`.

**Admin panel** (`src/app/admin/`) — separate lazy-loaded subtree at `/admin`. Protected by a simple `localStorage` token (`admin_token`). Layout: fixed sidebar (`AdminLayoutComponent`) + `<router-outlet>` for dashboard/news/gallery/camps list views. Login at `/admin/login` (outside the layout shell). Auth guard is not yet implemented — the token check is only in `LoginComponent.login()`.

**Routing** (`app.routes.ts` + `admin/admin.routes.ts`) — all routes use `loadComponent`/`loadChildren` for code splitting.

**Theming** — PrimeNG 19 + `@primeuix/themes`. Custom amber/dark theme (`OlimpijczykTheme`) is defined once in `app.config.ts` using `definePreset(Lara, {...})` and registered via `providePrimeNG()`. Dark mode selector is `body`. Global CSS variables in `src/styles.scss` mirror the PrimeNG palette (`--color-primary: #F5A623`, etc.). Fonts: Oswald (headings), Open Sans (body) — loaded externally.

**PrimeNG usage** — import individual `*Module` classes (e.g. `ButtonModule`, `TableModule`) from their subpaths (`primeng/button`, `primeng/table`). Icons via `primeicons` CSS (`pi pi-*` classes).

## Key constraints

- `@` in HTML templates is an Angular block syntax character — use `&#64;` for literal `@` (e.g. email addresses in footer).
- `src/app/shared/footer/footer.component.ts` imports `RouterLink` but does not use it in the template — this produces a warning, not an error.
- Admin CRUD components (`news-list`, `gallery-list`, `camps-list`) are UI-only with hardcoded mock data. No backend integration exists yet.
