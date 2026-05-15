import flows from "../flows/flows.json" with { type: "json" };

const typedFlows = flows as Record<string, string[]>;

export function detectImpactedFlows(files: string[]) {
  const impacted: string[] = [];

  for (const [flow, relatedFiles] of Object.entries(typedFlows)) {
    const matched = relatedFiles.some(file =>
      files.some(changed => changed.includes(file))
    );

    if (matched) {
      impacted.push(flow);
    }
  }

  return impacted;
}