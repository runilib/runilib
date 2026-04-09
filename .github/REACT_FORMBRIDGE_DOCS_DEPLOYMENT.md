# React FormBridge Docs Deployment

This guide explains how to deploy `apps/react-formbridge-docs` through GitHub Actions and Vercel without surprises.

## What is already wired

- GitHub Actions workflow:
  - `.github/workflows/deploy-react-formbridge-docs-vercel.yml`
- Docs app path:
  - `apps/react-formbridge-docs`
- Production GitHub environment:
  - `react-formbridge-docs-production`

The workflow does three things:
- validates the docs app on pull requests and `main`
- deploys a preview build for pull requests from branches inside this repository
- deploys production on pushes to `main`

## Deployment model

The docs app is a real Next.js app, not a static export.

That matters because it includes a server route for feedback email sending:
- `apps/react-formbridge-docs/src/app/api/feedback/route.ts`

So the recommended target is Vercel, not GitHub Pages.

## One-time Vercel setup

1. Create a Vercel project for the docs app.
2. Set the project root directory to:

```text
apps/react-formbridge-docs
```

3. Keep the framework as Next.js.
4. Make sure the project belongs to the same Vercel scope as the token you will use in CI.

## GitHub repository secrets

Open:

```text
GitHub -> Settings -> Secrets and variables -> Actions
```

Add these repository secrets:

- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID_REACT_FORMBRIDGE_DOCS`

Notes:
- `VERCEL_TOKEN` and `VERCEL_ORG_ID` can be shared with the landing workflow if they target the same Vercel account/team.
- `VERCEL_PROJECT_ID_REACT_FORMBRIDGE_DOCS` should be specific to the docs project.

## How to get the Vercel values

### `VERCEL_TOKEN`

1. Sign in to Vercel.
2. Open account settings.
3. Go to tokens.
4. Create a CI token.
5. Save it as `VERCEL_TOKEN`.

### `VERCEL_ORG_ID` and `VERCEL_PROJECT_ID_REACT_FORMBRIDGE_DOCS`

Run this locally:

```bash
cd apps/react-formbridge-docs
vercel login
vercel link
cat .vercel/project.json
```

Then copy:
- `orgId` -> `VERCEL_ORG_ID`
- `projectId` -> `VERCEL_PROJECT_ID_REACT_FORMBRIDGE_DOCS`

Do not commit the `.vercel/` folder.

## Vercel environment variables

In Vercel, open the docs project and add these variables for both Preview and Production:

```env
NEXT_PUBLIC_SITE_URL=https://your-docs-domain.com

FEEDBACK_SMTP_HOST=smtp.gmail.com
FEEDBACK_SMTP_PORT=587
FEEDBACK_SMTP_SECURE=false
FEEDBACK_SMTP_USER=akladekouassi@gmail.com
FEEDBACK_SMTP_PASS=your-google-app-password
FEEDBACK_FROM_EMAIL=akladekouassi@gmail.com
```

Important:
- `NEXT_PUBLIC_SITE_URL` should match the actual deployed docs URL for that environment
- for Preview you can either reuse the production domain value if that is acceptable, or use a preview-safe URL if you prefer
- `FEEDBACK_SMTP_PASS` must be a Google app password, not the normal Gmail password

## GitHub environment

Create this GitHub environment:

```text
react-formbridge-docs-production
```

Recommended settings:
- required reviewers before production deployment
- optional wait timer
- branch restriction to `main`

This environment is only used for production protection. The Vercel credentials still need to exist as repository secrets because preview deployments also use them.

## What triggers the workflow

The workflow runs when these areas change:
- `apps/react-formbridge-docs/**`
- `packages/**`
- root dependency and turbo files
- the docs deployment workflow itself
- `.github/actions/setup-monorepo/action.yml`

Behavior:
- pull request to `main`:
  - validates the docs app
  - deploys a preview build
  - comments the preview URL on the PR
- push to `main`:
  - validates the docs app
  - deploys production
- manual run:
  - lets you choose `preview` or `production`

## Recommended first test

1. Add the GitHub secrets.
2. Add the Vercel environment variables.
3. Create the `react-formbridge-docs-production` environment in GitHub.
4. Open a small PR touching `apps/react-formbridge-docs`.
5. Wait for the workflow `Deploy React FormBridge Docs to Vercel`.
6. Confirm that:
   - the preview deployment succeeds
   - the PR gets a preview URL comment
   - the feedback form sends email in preview if you configured Preview env vars

After that, merge to `main` to test production deployment.

## Troubleshooting

### Workflow says a Vercel secret is missing

Check repository secrets for:
- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID_REACT_FORMBRIDGE_DOCS`

### Vercel build works locally but fails in CI

Check:
- the Vercel project root directory is `apps/react-formbridge-docs`
- the linked project ID matches the docs project, not the landing project
- the docs app builds locally with:

```bash
yarn workspace react-formbridge-docs check
yarn workspace react-formbridge-docs typecheck
yarn workspace react-formbridge-docs build
```

### Feedback says email is not configured

That means the server runtime cannot see one or more of these:
- `FEEDBACK_SMTP_HOST`
- `FEEDBACK_SMTP_PORT`
- `FEEDBACK_SMTP_USER`
- `FEEDBACK_SMTP_PASS`
- `FEEDBACK_FROM_EMAIL`

Check the Vercel environment variables for the active environment and redeploy after updating them.

### Gmail rejects the SMTP login

Most common cause:

- `FEEDBACK_SMTP_PASS` is not a Google app password

Use an app password from the Google account security page after enabling 2-step verification.

create from here:

https://myaccount.google.com/apppasswords
