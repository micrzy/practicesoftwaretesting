import http from "k6/http";
import { sleep, check } from "k6";

export const options = {
  stages: [
    { duration: "30s", target: 20 }, // Ramp-up to 20 VUs over 30 seconds
    { duration: "1m", target: 20 }, // Stay at 20 VUs for 1 minute
    { duration: "20s", target: 0 }, // Ramp-down to 0 VUs over 20 seconds
  ],
  thresholds: {
    http_req_duration: ["p(95)<500"], // 95% of requests must complete below 500ms
    http_req_failed: ["rate<0.01"], // error rate should be less than 1%
  },
};

export default function () {
  const res = http.get("http://localhost:8091/products");
  check(res, {
    "is status 200": (r) => r.status === 200,
  });
  sleep(1);
}