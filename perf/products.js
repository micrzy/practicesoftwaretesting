import http from "k6/http";
import { sleep,check } from "k6";


export const options = {
  vus: 10,
  duration: "30s",
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
