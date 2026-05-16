import { exec } from "child_process";

export function runTests(): Promise<string> {

  return new Promise((resolve) => {

    exec(
      "npx playwright test tests/checkout.smoke.spec.ts",
      {
        cwd: "../",
      },
      (error, stdout, stderr) => {

        if (error) {
          resolve(stderr || stdout);
          return;
        }

        resolve(stdout);

      }
    );

  });

}