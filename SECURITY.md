# Security Policy

## Supported Versions

Security updates target the `main` branch and currently deployed production version.

## Reporting a Vulnerability

Please report vulnerabilities privately to the maintainers with:
- impact summary
- reproduction steps
- affected components

Do not open public issues for unpatched security vulnerabilities.

## Security Controls Baseline

- Supabase-authenticated access to protected app routes and backend APIs.
- Role-based authorization checks for workflow/agent execution and audit event access.
- Request rate limiting on AI chat endpoints.
- Dependency checks in CI (`npm audit`, `pip-audit`).
- Incident and rollback runbooks in `docs/runbooks/`.
