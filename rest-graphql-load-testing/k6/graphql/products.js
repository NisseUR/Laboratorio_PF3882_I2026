import http from "k6/http";
import { check, sleep } from "k6";

import {
  GRAPHQL_HEADERS,
  GRAPHQL_URL,
  PRODUCTS_LIMIT,
  PRODUCTS_MAX_OFFSET,
  REQUEST_PARAMS,
  THINK_TIME_SECONDS,
  randomInt,
} from "../config.js";
import { recordResponse } from "../metric.js";
import { buildOptions } from "../scenarios.js";

const TAGS = { technology: "graphql", scenario: "products" };

export const options = buildOptions("graphql_products");

export default function () {
  const offset = randomInt(0, PRODUCTS_MAX_OFFSET);
  const payload = JSON.stringify({
    query: `
      query Products($limit: Int!, $offset: Int!) {
        products(limit: $limit, offset: $offset) {
          name
          price
        }
      }
    `,
    variables: { limit: PRODUCTS_LIMIT, offset },
  });

  const response = http.post(GRAPHQL_URL, payload, {
    ...REQUEST_PARAMS,
    headers: GRAPHQL_HEADERS,
    tags: TAGS,
  });

  recordResponse(response, TAGS);

  check(response, {
    "status is 200": (res) => res && res.status === 200,
  });

  if (response.status === 200 && response.body) {
    const data = response.json();

    check(response, {
      "graphql has no errors": () => !data.errors,

      "products are returned": () =>
        Array.isArray(data.data.products) &&
        data.data.products.length > 0,
    });
  }

  sleep(THINK_TIME_SECONDS);
}
