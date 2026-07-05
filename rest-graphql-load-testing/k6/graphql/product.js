import http from "k6/http";
import { check, sleep } from "k6";

import {
  GRAPHQL_HEADERS,
  GRAPHQL_URL,
  PRODUCT_ID_MAX,
  PRODUCT_ID_MIN,
  REQUEST_PARAMS,
  THINK_TIME_SECONDS,
  randomInt,
} from "../config.js";
import { recordResponse } from "../metric.js";
import { buildOptions } from "../scenarios.js";

const TAGS = { technology: "graphql", scenario: "product" };

export const options = buildOptions("graphql_product");

export default function () {
  const productId = randomInt(PRODUCT_ID_MIN, PRODUCT_ID_MAX);
  const payload = JSON.stringify({
    query: `
      query Product($id: Int!) {
        product(id: $id) {
          name
          price
        }
      }
    `,
    variables: { id: productId },
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

      "product has requested fields": () =>
        Boolean(data.data.product.name) &&
        data.data.product.price !== null &&
        data.data.product.price !== undefined,
    });
  }

  sleep(THINK_TIME_SECONDS);
}
