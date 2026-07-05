import http from "k6/http";
import { check, sleep } from "k6";

import {
  BASE_URL,
  CUSTOMER_ID_MAX,
  CUSTOMER_ID_MIN,
  HEADERS,
  REQUEST_PARAMS,
  THINK_TIME_SECONDS,
  randomInt,
} from "../config.js";
import { recordResponse } from "../metric.js";
import { buildOptions } from "../scenarios.js";

const TAGS = { technology: "rest", scenario: "customer_orders" };

export const options = buildOptions("rest_customer_orders");

export default function () {
  const customerId = randomInt(CUSTOMER_ID_MIN, CUSTOMER_ID_MAX);
  const response = http.get(`${BASE_URL}/customers/${customerId}/orders`, {
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
    });
  }

  sleep(THINK_TIME_SECONDS);
}
