import express from "express";

import { getChangedFiles } from "./diffAnalyzer.js";
import { detectImpactedFlows } from "./flowMapper.js";

const app = express();

app.get("/", (_, res) => {
  res.send("bobGoblin awake 👹");
});

app.get("/analyze", async (_, res) => {
  const changedFiles = await getChangedFiles();

  const impactedFlows =
    detectImpactedFlows(changedFiles);

  res.json({
    changedFiles,
    impactedFlows
  });
});

app.listen(4000, () => {
  console.log("Server running on 4000");
});