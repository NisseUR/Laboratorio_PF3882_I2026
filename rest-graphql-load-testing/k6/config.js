export const BASE_URL = __ENV.BASE_URL || "http://localhost:8000";
export const GRAPHQL_URL = `${BASE_URL}/graphql`;

export const HEADERS = {
  Accept: "application/json",
};

export const GRAPHQL_HEADERS = {
  ...HEADERS,
  "Content-Type": "application/json",
};

export const REQUEST_PARAMS = {
  timeout: __ENV.TIMEOUT || "30s",
};

export const THINK_TIME_SECONDS = Number(__ENV.THINK_TIME_SECONDS || "1");

export const PRODUCT_ID_MIN = Number(__ENV.PRODUCT_ID_MIN || "1");
export const PRODUCT_ID_MAX = Number(__ENV.PRODUCT_ID_MAX || "1000");
export const CUSTOMER_ID_MIN = Number(__ENV.CUSTOMER_ID_MIN || "1");
export const CUSTOMER_ID_MAX = Number(__ENV.CUSTOMER_ID_MAX || "100");
export const ORDER_ID_MIN = Number(__ENV.ORDER_ID_MIN || "1");
export const ORDER_ID_MAX = Number(__ENV.ORDER_ID_MAX || "500");

export const PRODUCTS_LIMIT = Number(__ENV.PRODUCTS_LIMIT || "20");
export const PRODUCTS_MAX_OFFSET = Number(__ENV.PRODUCTS_MAX_OFFSET || "980");

export function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
