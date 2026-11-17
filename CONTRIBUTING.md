# Contributing

Thanks for helping. This is the frontend (React 19, TypeScript, Vite, TanStack Query). The backend lives in [subscription-master](https://github.com/mirkamol-code/subscription-master).

## Before you start

- For anything bigger than a small fix, open an issue first so we can agree on the approach.
- Security problems go through [SECURITY.md](SECURITY.md), never a public issue.
- Changes that need a new or different API field start in the backend repository.

## Set up

Follow [Run locally](README.md#run-locally). You need Node.js 22 and a running backend.

## Making a change

1. Fork the repo and create a branch off `main` with a plain kebab-case name, for example `trial-card-calendar`.
2. Code lives in feature folders under `src/features/<feature>`. Server data goes through TanStack Query hooks and the shared Axios client in `src/api`.
3. Add or update tests next to the code (`*.test.ts` / `*.test.tsx`). Mark test sections with `// given`, `// when`, `// then`.
4. Never put secrets in `VITE_*` variables: everything in them ships to the browser.
5. Run the same checks as CI before pushing:

   ```bash
   npm run lint && npm test && npm run build
   ```

## Commits and pull requests

- Commit messages and PR titles follow [Conventional Commits](https://www.conventionalcommits.org/): imperative, lowercase, under 50 characters, for example `feat(trial): show trial end on calendar`.
- One topic per pull request. Describe what changed, why, and how you tested it; add screenshots for UI changes (with no real email addresses or billing data).
- CI must pass. A maintainer reviews every PR.

By contributing, you agree that your contributions are licensed under the [MIT License](LICENSE).
