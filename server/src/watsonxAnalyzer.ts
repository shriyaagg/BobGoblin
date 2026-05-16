export function generateWatsonxSummary(
  risk: string,
  impactedFlows: string[],
  output: string
) {

  const hasCheckoutIssue =
    output.includes("product-item");

  if (hasCheckoutIssue) {

    return {
      recommendation: "BLOCK RELEASE",

      businessImpact:
        "Critical checkout interaction failures may prevent purchases.",

      executiveSummary:
        `
Checkout regression risks detected.

Playwright automation could not interact
with expected cart elements, indicating
possible UI contract mismatches.

Recommended action:
Resolve checkout interaction failures
before deployment.
        `
    };

  }

  if (risk === "LOW") {

    return {
      recommendation: "SAFE TO DEPLOY",

      businessImpact:
        "No critical regressions detected.",

      executiveSummary:
        `
Regression suite completed successfully.

No major release blockers detected
across impacted flows.
        `
    };

  }

  return {
    recommendation: "REVIEW REQUIRED",

    businessImpact:
      "Potential regression risks detected.",

    executiveSummary:
      `
Some regression signals were detected.

Manual validation is recommended
before deployment.
      `
  };

}