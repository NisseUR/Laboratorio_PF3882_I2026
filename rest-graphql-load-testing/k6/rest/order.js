import http from "k6/http";
import { check, sleep } from "k6";

import {
  BASE_URL,
  HEADERS,
  ORDER_ID_MAX,
  ORDER_ID_MIN,
  REQUEST_PARAMS,
  THINK_TIME_SECONDS,
  randomInt,
} from "../config.js";
import { recordResponse } from "../metric.js";
import { buildOptions } from "../scenarios.js";

const TAGS = { technology: "rest", scenario: "order" };

export const options = buildOptions("rest_order");

export default function () {
  const orderId = randomInt(ORDER_ID_MIN, ORDER_ID_MAX);
  const response = http.get(`${BASE_URL}/orders/${orderId}`, {
    ...REQUEST_PARAMS,
    headers: HEADERS,
    tags: TAGS,
  });

  recordResponse(response, TAGS);

  check(response, {
    "status is 200": (res) => res && res.status === 200,
  });

  if (response.status === 200 && response.body) {
    const data = response.json();

    check(response, {
      "customer orders is an array": () =>
        Array.isArray(data),

      "customer has at least one order": () =>
        Array.isArray(data) && data.length > 0,
    });
  }

  sleep(THINK_TIME_SECONDS);
}
