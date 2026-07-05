import { Counter, Rate, Trend } from "k6/metrics";

export const operationDuration = new Trend("operation_duration", true);
export const operationSuccess = new Rate("operation_success");
export const operationBytes = new Counter("operation_bytes");
export const operationRequests = new Counter("operation_requests");

export function recordResponse(response, tags) {
  operationDuration.add(response.timings.duration, tags);
  operationSuccess.add(response.status >= 200 && response.status < 400, tags);
  operationBytes.add(response.body ? response.body.length : 0, tags);
  operationRequests.add(1, tags);
}
