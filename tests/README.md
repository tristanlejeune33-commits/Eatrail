# eatrail · E2E tests (Playwright)

## Setup

```bash
cd tests
npm install
npm run install:browsers
```

## Run

```bash
# Make sure the API is running first:
#   cd ../api && npm run dev
# Then in another terminal:

npm test                    # headless
npm run test:headed         # with browser window
npm run test:ui             # interactive Playwright UI
```

## CI

```yaml
# .github/workflows/test.yml
- run: cd tests && npm install && npx playwright install --with-deps chromium
- run: cd tests && npm test
  env:
    BASE_URL: ${{ secrets.STAGING_URL }}
```

## What's covered (smoke tests)

1. Home page loads with greeting + recipes
2. Recipes catalog (30 cards)
3. Recipe detail (carbonara)
4. Signup → /me returns user
5. Calendar page loads
6. Service worker registers (PWA)
7. Shops page renders
8. Flavor DNA page renders
9. Mobile bottom nav visible
10. /health endpoint OK

Add more tests in `e2e/*.spec.js`.
