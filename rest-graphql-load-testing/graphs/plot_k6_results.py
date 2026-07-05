import json
import os
import matplotlib.pyplot as plt

# Carpeta donde están tus JSON
DATA_DIR = "../k6/reports"

def load_metrics(file_path):
    with open(file_path, "r") as f:
        data = json.load(f)

    metrics = data.get("metrics", {})

    return {
        "avg_latency": metrics.get("http_req_duration", {}).get("avg", 0),
        "p95_latency": metrics.get("http_req_duration", {}).get("p(95)", 0),
        "p99_latency": metrics.get("http_req_duration", {}).get("p(99)", 0),
        "reqs_per_sec": metrics.get("http_reqs", {}).get("rate", 0),
        "error_rate": metrics.get("http_req_failed", {}).get("value", 0),
        "data_received_mb": metrics.get("data_received", {}).get("count", 0) / (1024 * 1024),
    }


def categorize(files):
    results = {
        "rest": {},
        "graphql": {}
    }

    for file in files:
        path = os.path.join(DATA_DIR, file)
        if not file.endswith(".json"):
            continue

        metrics = load_metrics(path)

        if "graphql" in file:
            backend = "graphql"
        else:
            backend = "rest"

        # detectar carga (low, medium, high, very_high)
        if "low" in file:
            load = "low"
        elif "medium" in file:
            load = "medium"
        elif "high" in file:
            load = "high"
        else:
            load = "unknown"

        results[backend][load] = metrics

    return results


def plot_metric(results, metric, title, ylabel, filename):
    loads = ["low", "medium", "high"]

    plt.figure()

    for backend, label in [("rest", "REST"), ("graphql", "GraphQL")]:
        values = [
            results[backend].get(l, {}).get(metric, 0)
            for l in loads
        ]
        plt.plot(loads, values, marker="o", label=label)

    plt.title(title)
    plt.xlabel("Load Level")
    plt.ylabel(ylabel)
    plt.legend()
    plt.grid(True)

    plt.savefig(filename)
    plt.close()


def main():
    files = [f for f in os.listdir(DATA_DIR) if f.endswith(".json")]

    results = categorize(files)

    # 1. Latencia promedio
    plot_metric(
        results,
        "avg_latency",
        "Average Latency (REST vs GraphQL)",
        "ms",
        "avg_latency.png"
    )

    # 2. p95
    plot_metric(
        results,
        "p95_latency",
        "p95 Latency (REST vs GraphQL)",
        "ms",
        "p95_latency.png"
    )

    # 3. p99
    plot_metric(
        results,
        "p99_latency",
        "p99 Latency (REST vs GraphQL)",
        "ms",
        "p99_latency.png"
    )

    # 4. Requests/sec
    plot_metric(
        results,
        "reqs_per_sec",
        "Throughput (req/s)",
        "requests/sec",
        "throughput.png"
    )

    # 5. Data received (over-fetching)
    plot_metric(
        results,
        "data_received_mb",
        "Data Received (MB)",
        "MB",
        "data_received.png"
    )

    print("Gráficas generadas correctamente ✔")


if __name__ == "__main__":
    main()