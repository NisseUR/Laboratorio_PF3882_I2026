import http from "k6/http";
import { check, sleep } from "k6";

import {
  GRAPHQL_HEADERS,
  GRAPHQL_URL,
  ORDER_ID_MAX,
  ORDER_ID_MIN,
  REQUEST_PARAMS,
  THINK_TIME_SECONDS,
  randomInt,
} from "../config.js";
import { recordResponse } from "../metric.js";
import { buildOptions } from "../scenarios.js";

const TAGS = { technology: "graphql", scenario: "order" };

export const options = buildOptions("graphql_order");

export default function () {
  const orderId = randomInt(ORDER_ID_MIN, ORDER_ID_MAX);
  const payload = JSON.stringify({
    query: `
      query Order($id: Int!) {
        order(id: $id) {
          id
          orderDate
          total
          customer {
            id
            name
            email
          }
          items {
            id
            quantity
            unitPrice
            product {
              id
              name
              price
            }
          }
        }
      }
    `,
    variables: { id: orderId },
  });

  const response = http.post(GRAPHQL_URL, payload, {
    ...REQUEST_PARAMS,
    headers: GRAPHQL_HEADERS,
    tags: TAGS,
  });

  recordResponse(response, TAGS);

  check(response, {
    "status is 200": (res) => res.status === 200,
    "graphql has no errors": (res) => !res.json("errors"),
    "order has items": (res) => {
      const items = res.json("data.order.items");
      return Array.isArray(items) && items.length > 0;
    },
  });

  sleep(THINK_TIME_SECONDS);
}
