const LOAD_LEVELS = {
  low: { vus: 10, duration: "30s" },
  medium: { vus: 50, duration: "30s" },
  high: { vus: 100, duration: "30s" },
  very_high: { vus: 250, duration: "30s" },
};

function selectedLoadLevel() {
  const level = __ENV.LOAD_LEVEL || "low";
  return LOAD_LEVELS[level] || LOAD_LEVELS.low;
}

export function buildOptions(scenarioName) {
  const load = selectedLoadLevel();
  const vus = Number(__ENV.VUS || load.vus);
  const duration = __ENV.DURATION || load.duration;

  return {
    scenarios: {
      [scenarioName]: {
        executor: "constant-vus",
        vus,
        duration,
        gracefulStop: "10s",
      },
    },
    thresholds: {
      http_req_failed: ["rate<0.01"],
      http_req_duration: ["p(95)<2000"],
      operation_success: ["rate>0.99"],
    },
    summaryTrendStats: ["avg", "min", "med", "max", "p(90)", "p(95)", "p(99)"],
  };
}
