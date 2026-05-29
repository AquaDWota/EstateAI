# Incident Response Runbook

## Severity Levels
- **SEV-1**: Full outage or data/auth compromise.
- **SEV-2**: Major degradation for core flows.
- **SEV-3**: Minor degradation with workaround.

## Immediate Steps
1. Declare incident owner and severity.
2. Freeze production deploys.
3. Capture impacted routes, start time, and recent changes.
4. Check:
   - backend `/health`
   - backend `/ready`
   - auth provider status (Supabase)
   - AI provider status (OpenAI)

## Containment
- Disable high-cost endpoints (`/api/v1/chat*`, `/api/v1/agents/*`) if abuse or cascading failures occur.
- Rate-limit traffic or temporarily block offending API keys/users.
- Roll back latest deploy if regression confirmed.

## Recovery
1. Restore service to SLO baseline.
2. Validate core journey:
   - sign-in
   - dashboard load
   - property detail
   - workflow execution
3. Keep heightened monitoring for 60 minutes.

## Post-Incident
- Write postmortem within 24 hours.
- Add remediation tasks for root-cause and prevention.
