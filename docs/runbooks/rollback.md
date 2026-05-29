# Rollback Runbook

## Trigger Conditions
- Elevated 5xx rates after deployment.
- Auth failures across protected routes.
- Database migration regression.

## Frontend Rollback
1. Promote the previous stable Vercel deployment to production.
2. Verify `/sign-in`, `/dashboard`, and `/properties` route behavior.
3. Confirm no elevated frontend error events.

## Backend Rollback
1. Redeploy previous stable backend image.
2. If migration caused regressions, restore previous schema backup and re-run `prisma migrate deploy` to last known good revision.
3. Validate `/health` and `/ready` before reopening traffic.

## Validation Checklist
- `/health` returns `status: ok`.
- `/ready` returns HTTP 200.
- Chat endpoint responds for an authenticated user.
- Workflow execution returns non-error response.

## Communication
- Post rollback announcement in team channel.
- Create incident timeline with root cause and mitigation tasks.
