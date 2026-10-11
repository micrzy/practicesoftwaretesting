import http from "k6/http";
import { sleep, check } from "k6";

export const options = {
  stages: [
    { duration: "30s", target: 20 },
    { duration: "30s", target: 50 },
    { duration: "30s", target: 100 },
    { duration: "30s", target: 200 },
    { duration: "30s", target: 400 },
    { duration: "30s", target: 0 },
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
