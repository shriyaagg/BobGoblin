export function analyzeFailures(output: string) {

  if (output.includes("timeout")) {
    return {
      risk: "HIGH",
      summary:
        "Possible UI freeze or API delay detected."
    };
  }

  if (output.includes("locator")) {
    return {
      risk: "MEDIUM",
      summary:
        "UI element may be inaccessible or changed."
    };
  }

  if (output.includes("500")) {
    return {
      risk: "HIGH",
      summary:
        "Backend API failure detected."
    };
  }

  if (
    output.includes("failed")
  ) {
    return {
      risk: "MEDIUM",
      summary:
        "Regression issues detected in checkout flow."
    };
  }

  return {
    risk: "LOW",
    summary:
      "All regression tests passed successfully."
  };
}