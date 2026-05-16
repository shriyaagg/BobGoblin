export function buildBobPrompt(
  changedFiles: string[],
  impactedFlows: string[]
) {

  return `
You are IBM Bob acting as an autonomous release QA engineer.

Changed files:
${changedFiles.map(f => `- ${f}`).join("\n")}

Impacted flows:
${impactedFlows.map(f => `- ${f}`).join("\n")}

Generate:

1. Playwright regression tests
2. Release validation strategy
3. Deployment risks
4. Rollback concerns
5. Testing priorities

Focus on:
- happy paths
- edge cases
- API failures
- loading states
- business-critical regressions

Return:
- executable TypeScript Playwright tests
- concise release strategy summary
`;

}