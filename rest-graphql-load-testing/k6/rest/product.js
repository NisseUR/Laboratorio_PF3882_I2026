import http from "k6/http";
import { check, sleep } from "k6";

import {
  BASE_URL,
  HEADERS,
  PRODUCT_ID_MAX,
  PRODUCT_ID_MIN,
  REQUEST_PARAMS,
  THINK_TIME_SECONDS,
  randomInt,
} from "../config.js";
import { recordResponse } from "../metric.js";
import { buildOptions } from "../scenarios.js";

const TAGS = { technology: "rest", scenario: "product" };

export const options = buildOptions("rest_product");

export default function () {
  const productId = randomInt(PRODUCT_ID_MIN, PRODUCT_ID_MAX);
  const response = http.get(`${BASE_URL}/products/${productId}`, {
    ...REQUEST_PARAMS,
    headers: HEADERS,
    tags: TAGS,
  });

  recordResponse(response, TAGS);

  check(response, {
    "status is 200": (res) => res.status === 200,
    "product has id": (res) => Boolean(res.json("id")),
    "product has over-fetched fields": (res) =>
      Boolean(res.json("description")) && Boolean(res.json("category")),
  });

  sleep(THINK_TIME_SECONDS);
}
