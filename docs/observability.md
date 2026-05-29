# Observability Baseline

## Logging
- Backend emits request logs with:
  - method
  - path
  - status
  - request_id
  - duration
- `x-request-id` is returned for every response.

## Health Endpoints
- `/health`: liveness and provider-config flags.
- `/ready`: readiness with database dependency check.

## Recommended Alerts
- API 5xx error rate > 2% for 5 minutes.
- `/ready` returns non-200 for 2 consecutive checks.
- P95 latency > 1500ms on `/api/v1/chat` or `/api/v1/agents/workflow`.
- Auth failures (401/403) spike > 3x baseline.

## SLO Starter Targets
- API availability: 99.9%
- P95 response time:
  - read endpoints: < 600ms
  - AI endpoints: < 2500ms
- Deployment rollback time: < 15 minutes
