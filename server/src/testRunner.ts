import { spawn } from "child_process";

export function runTests(): Promise<string> {

  return new Promise((resolve, reject) => {

    const child = spawn(
      "npx",
      [
        "playwright",
        "test",
        "tests/checkout.spec.ts",
        "--reporter=line",
        "--timeout=3000",
        "--workers=1"
      ],
      {
        cwd: "../",
        shell: true,
      }
    );

    let output = "";

    child.stdout.on("data", (data) => {
      output += data.toString();
    });

    child.stderr.on("data", (data) => {
      output += data.toString();
    });

    child.on("close", () => {
      resolve(output);
    });

    child.on("error", (err) => {
      reject(err);
    });

  });

}