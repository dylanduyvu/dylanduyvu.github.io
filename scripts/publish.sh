#!/usr/bin/env bash
set -euo pipefail

repo_root="$(git rev-parse --show-toplevel)"
cd "$repo_root"

message="${*:-notes: update vault}"

echo "Running Quartz build..."
npm run build

echo "Staging publishable changes..."
paths=()
while IFS= read -r -d '' entry; do
  status="${entry:0:2}"
  path="${entry:3}"

  if [[ "$status" == R* || "$status" == C* ]]; then
    IFS= read -r -d '' renamed_path || true
    path="$renamed_path"
  fi

  case "$path" in
    .obsidian/*|public/*|.quartz/*|node_modules/*) continue ;;
  esac

  paths+=("$path")
done < <(git status --porcelain -z --untracked-files=normal)

if ((${#paths[@]} > 0)); then
  git add --all -- "${paths[@]}"
fi

git restore --staged -- .obsidian public .quartz node_modules 2>/dev/null || true

if git diff --cached --quiet; then
  echo "No publishable changes staged."
else
  git status --short
  git commit -m "$message"
fi

echo "Pushing to origin/main..."
git push origin HEAD:main

echo "Done. GitHub Pages will rebuild via Actions."
