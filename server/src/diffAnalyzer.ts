import { simpleGit } from "simple-git";

const git = simpleGit();

export async function getChangedFiles() {
  const diff = await git.diff(["--name-only"]);

  return diff
    .split("\n")
    .filter(Boolean);
}