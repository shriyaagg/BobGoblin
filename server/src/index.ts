import express from "express";
import cors from "cors";

import { buildBobPrompt } from "./bobPromptBuilder.js";
import { runTests } from "./testRunner.js";
import { analyzeFailures } from "./failureAnalyzer.js";
import { getChangedFiles } from "./diffAnalyzer.js";
import { detectImpactedFlows } from "./flowMapper.js";
import { generateWatsonxSummary } from "./watsonxAnalyzer.js";

const app = express();

app.use(cors());

let isRunning = false;

app.get("/", (_, res) => {
  res.send("bobGoblin awake 👹");
});

app.get("/analyze", async (_, res) => {

  try {

    const changedFiles =
      await getChangedFiles();

    const impactedFlows =
      detectImpactedFlows(changedFiles);

    const prompt =
      buildBobPrompt(
        changedFiles,
        impactedFlows
      );

    const riskLevel =
      impactedFlows.length > 0
        ? "HIGH"
        : "LOW";

    res.json({
      changedFiles,
      impactedFlows,
      prompt,
      riskLevel
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "analyze route crashed 👹"
    });

  }

});

app.get("/run-tests", async (_, res) => {

  if (isRunning) {

    return res.send(`
      <html>
        <body style="
          background:black;
          color:white;
          font-family:sans-serif;
          padding:40px;
        ">
          <h1>
            Tests already running 👹
          </h1>
        </body>
      </html>
    `);

  }

  isRunning = true;

  const resetTimer = setTimeout(() => {

    console.log("force resetting test lock");

    isRunning = false;

  }, 15000);

  try {

    console.log("starting tests");

    const output =
      await runTests();

    console.log("tests completed");

    const analysis =
      analyzeFailures(output);

    const impactedFlows =
      detectImpactedFlows(
        await getChangedFiles()
      );

    const watsonx =
      generateWatsonxSummary(
        analysis.risk,
        impactedFlows,
        output
      );

    clearTimeout(resetTimer);

    isRunning = false;

    res.send(`
      <html>

        <body style="
          background:#0f172a;
          color:white;
          font-family:sans-serif;
          padding:40px;
        ">

          <h1 style="
            font-size:48px;
          ">
            bobGoblin 👹
          </h1>

          <h2>
            Release Risk:
            ${analysis.risk}
          </h2>

          <h2>
            watsonx Recommendation:
            ${watsonx.recommendation}
          </h2>

          <pre style="
            margin-top:30px;
            background:black;
            padding:20px;
            border-radius:16px;
            overflow-x:auto;
          ">
${output}
          </pre>

        </body>

      </html>
    `);

  } catch (error) {

    clearTimeout(resetTimer);

    isRunning = false;

    console.error(error);

    res.status(500).send(`
      <html>
        <body style="
          background:black;
          color:red;
          font-family:sans-serif;
          padding:40px;
        ">
          <h1>
            run-tests crashed 👹
          </h1>

          <pre>
${String(error)}
          </pre>
        </body>
      </html>
    `);

  }

});

app.listen(4000, () => {
  console.log("Server running on 4000");
});