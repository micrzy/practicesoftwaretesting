# Performance Test Results

## Test Environment
Tests ran locally. k6 and the web app (Docker) ran on the same PC, so they
competed for CPU and memory. Results show trends, not production capacity.

## Test Scenarios
**Load test** (`perf/load.js`): ramp up to 20 virtual users (VUs) in 30s,
hold 20 VUs for 1 min, ramp down to 0 in 20s.

**Stress test** (`perf/stress.js`): increase VUs step by step every 30s
(20 → 50 → 100 → 200 → 400), then ramp down to 0 in 30s.

Each VU sends `GET /products` and waits 1s (think time).

Thresholds for both: p95 response time < 500ms, error rate < 1%.

## Results
| Scenario | Peak VUs | Throughput | p95 | Error rate | Thresholds |
|---|---|---|---|---|---|
| Load | 20 | ~19 req/s | 65ms | 0% | ✅ Passed |
| Stress | 200 | ~165 req/s | ~150ms | 0% | ✅ Passed |
| Stress | 400 | ~240 req/s (max) | 648ms overall, 751ms peak | 0% | ❌ p95 failed |

## Conclusion
- The system performs well up to 200 VUs: p95 stays below 150ms with no errors.
- **Saturation point: ~240 req/s.** Above this, throughput stops increasing
  while p95 rises sharply (from ~150ms to ~750ms). Requests are queuing.
- The 500ms p95 target is broken somewhere between 200 and 400 VUs.
- No errors even at 400 VUs: the system slows down but does not fail yet.
  The breaking point was not reached.

## Recommendations
1. Re-run on a production-like environment, with k6 on a separate machine.
2. Run each test several times to confirm the results are consistent.
3. Use smaller steps between 200 and 400 VUs (250, 300, 350) to find
   exactly where the 500ms target breaks.
4. Monitor the server (CPU, memory, database, PHP workers) during the test
   to find the bottleneck.
5. Test realistic user journeys (browse → add to cart → checkout),
   not only one endpoint.
6. Add spike and soak tests before release.