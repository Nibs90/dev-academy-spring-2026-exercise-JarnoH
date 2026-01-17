# Copilot / AI agent instructions for ElectricityData

## Purpose
Short, actionable guidance for code-gen and PR assistance in this repo — focus on TypeScript/Node (Express) server work, small iterative changes, and respecting existing tsconfig choices.

## Big picture (what this repo is)
- Minimal TypeScript Node project using **Express** (see `package.json` dependency). The entry point is `src/index.ts` (currently empty). The project is configured as **CommonJS** via `package.json` + `tsconfig.json`.
- No tests or routes yet; changes are typically small feature additions or scaffolding for an Express-based API.

## How to build, run, and iterate 🔧
- Install: `npm install`
- Dev (recommended): use `ts-node-dev` (present in `devDependencies`). Example dev command:
  - `npx ts-node-dev --respawn --transpile-only src/index.ts`
- Production build (not currently configured): compile with `tsc` and run `node` on the emitted JS files. `tsconfig.json` currently does not have `outDir`/`rootDir` set — changes that rely on emit should add those fields.
- Tests: no test framework or scripts exist; `npm test` currently prints an error string. When adding tests, prefer Jest or vitest and add `test` scripts to `package.json`.

## Project-specific conventions and config ⚙️
- TypeScript config highlights (see `tsconfig.json`): `strict: true`, `isolatedModules: true`, `declaration: true`, `noUncheckedIndexedAccess: true`. Keep changes conservative: these enforce strict typing and ESM/interop rules.
- `type: "commonjs"` in `package.json` — runtime module system is CommonJS.
- Use `src/index.ts` as the canonical entrypoint for server startup. If you add other modules, place them under `src/`.

## Integration points & dependencies
- main runtime dependency: `express` (v5). Expect Express 5 semantics (e.g., `express()` app, router usage).
- dev-time hot reload: `ts-node-dev` — useful for iterative server route additions.
- No database or external services are present in repository; add configuration and docs when integrating external services.

## Concrete guidance for PRs and code generation ✅
- When adding server code, export small modules (e.g., routers, middleware) from `src/` and import them in `src/index.ts`.
- Add or update `scripts` in `package.json` for convenience (e.g., `dev`, `build`, `start`) when adding compile or run steps.
- If a change requires emitted JS files, add `outDir` and `rootDir` to `tsconfig.json` and update `package.json` `main` if necessary.
- Tests: add a `test` script and a minimal test scaffold (prefer single-file tests until the project grows).

> Note: The repo currently lacks non-trivial code (empty `src/index.ts`) and no CI or test files. Document any new conventions you add in `README.md` and keep `.github/copilot-instructions.md` updated.

## Helpful files to inspect
- `package.json` — dependencies and scripts
- `tsconfig.json` — compiler and module choices
- `src/index.ts` — project entrypoint (add server scaffolding here)

---

If anything here is unclear or you want more prescriptive patterns (e.g., route layout, logging, request validation), tell me which area to expand and I will iterate.