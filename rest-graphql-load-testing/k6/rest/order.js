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
    "status is 200": (res) => res.status === 200,
    "order has customer": (res) => Boolean(res.json("customer.id")),
    "order has items": (res) => {
      const items = res.json("items");
      return Array.isArray(items) && items.length > 0;
    },
  });

  sleep(THINK_TIME_SECONDS);
}
