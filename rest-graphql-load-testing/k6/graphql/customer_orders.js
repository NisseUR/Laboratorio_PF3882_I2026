import http from "k6/http";
import { check, sleep } from "k6";

import {
  CUSTOMER_ID_MAX,
  CUSTOMER_ID_MIN,
  GRAPHQL_HEADERS,
  GRAPHQL_URL,
  REQUEST_PARAMS,
  THINK_TIME_SECONDS,
  randomInt,
} from "../config.js";
import { recordResponse } from "../metric.js";
import { buildOptions } from "../scenarios.js";

const TAGS = { technology: "graphql", scenario: "customer_orders" };

export const options = buildOptions("graphql_customer_orders");

export default function () {
  const customerId = randomInt(CUSTOMER_ID_MIN, CUSTOMER_ID_MAX);
  const payload = JSON.stringify({
    query: `
      query CustomerOrders($customerId: Int!) {
        customerOrders(customerId: $customerId) {
          id
          orderDate
          total
          customer {
            id
            name
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
    variables: { customerId },
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
    "customer orders is an array": (res) => Array.isArray(res.json("data.customerOrders")),
  });

  sleep(THINK_TIME_SECONDS);
}
