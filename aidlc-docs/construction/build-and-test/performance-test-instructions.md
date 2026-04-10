# Performance Test Instructions

## Goals
- P95 latency for read APIs under 500 ms in local baseline
- Error rate under 1% during 100 concurrent virtual users

## Suggested Tool
- k6 or Locust

## Basic k6 Flow
1. Authenticate once and reuse bearer token.
2. Run mixed traffic against analytics, ai/history, content/history.
3. Record response latency and failure rate.

## Exit Criteria
- No sustained 5xx spikes
- Stable DB connections and memory usage under load
