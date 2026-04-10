# Unit Test Instructions

Current backend scaffold includes runtime validation but no full unit test suite yet.

Recommended immediate test commands:
1. Syntax check:
   - /home/honours/offgrid/.venv/bin/python -m compileall backend/app
2. API smoke test:
   - Start backend with uvicorn
   - Hit /health and auth endpoints with valid/invalid payloads

Next action for full coverage:
- Add pytest + hypothesis tests for service-layer invariants and auth flows.
