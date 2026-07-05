import http from "k6/http";
import { check, sleep } from "k6";

import {
  BASE_URL,
  HEADERS,
  PRODUCTS_LIMIT,
  PRODUCTS_MAX_OFFSET,
  REQUEST_PARAMS,
  THINK_TIME_SECONDS,
  randomInt,
} from "../config.js";
import { recordResponse } from "../metric.js";
import { buildOptions } from "../scenarios.js";

const TAGS = { technology: "rest", scenario: "products" };

export const options = buildOptions("rest_products");

export default function () {
  const offset = randomInt(0, PRODUCTS_MAX_OFFSET);
  const response = http.get(`${BASE_URL}/products?limit=${PRODUCTS_LIMIT}&offset=${offset}`, {
    ...REQUEST_PARAMS,
    headers: HEADERS,
    tags: TAGS,
  });

  recordResponse(response, TAGS);

  check(response, {
    "status is 200": (res) => res.status === 200,
    "products is an array": (res) => Array.isArray(res.json()),
    "products are returned": (res) => res.json().length > 0,
  });

  sleep(THINK_TIME_SECONDS);
}
