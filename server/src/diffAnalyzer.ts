import { simpleGit } from "simple-git";

const git = simpleGit("../");

const IGNORED_PATTERNS = [
  ".md",
  ".svg",
  ".ico",
  "package-lock.json",
  ".gitignore"
];

export async function getChangedFiles() {
  const status = await git.status();

  const files = [
    ...status.modified,
    ...status.created,
    ...status.not_added
  ];

  return files.filter(file => {
    return !IGNORED_PATTERNS.some(pattern =>
      file.includes(pattern)
    );
  });
}