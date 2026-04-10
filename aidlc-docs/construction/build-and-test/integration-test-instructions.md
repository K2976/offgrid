# Integration Test Instructions

## Scenarios
1. Register -> Login -> Refresh token flow
2. Authenticated access to analytics, ai, and content endpoints
3. Competitor CRUD and analysis flow
4. Report generation and retrieval flow

## Manual Run Steps
1. Start backend server.
2. Use API client (curl/Postman/Insomnia) with bearer token.
3. Execute scenarios above with same user workspace.
4. Verify resource ownership constraints by trying cross-user IDs.
