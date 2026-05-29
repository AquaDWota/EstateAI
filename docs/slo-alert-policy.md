# SLO and Alert Policy

## Service Level Objectives

- **Availability:** 99.9% monthly for core API routes.
- **Latency:** P95 under 600ms for read APIs and under 2500ms for AI routes.
- **Workflow Success:** 99% successful workflow executions (excluding user validation errors).

## Alert Thresholds

- 5xx error rate > 2% for 5 minutes.
- `/ready` non-200 for 2 checks.
- P95 latency:
  - > 900ms on `/api/v1/properties` for 10 minutes
  - > 3000ms on `/api/v1/chat` for 10 minutes
- Auth failures (401/403) > 3x baseline for 15 minutes.

## On-Call Response Targets

- Acknowledge SEV-1 in < 5 minutes.
- Restore core user journey in < 30 minutes.
- Publish preliminary incident update in < 20 minutes.
