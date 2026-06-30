#!/usr/bin/env bash
set -euo pipefail

repo_root="$(git rev-parse --show-toplevel)"
cd "$repo_root"

message="${*:-notes: update vault}"

ignored_path() {
  local path="$1"
  case "$path" in
    .obsidian/*|public/*|.quartz/*|node_modules/*) return 0 ;;
  esac
  return 1
}

collect_paths() {
  local include_latest="$1"
  paths=()

  while IFS= read -r -d '' entry; do
    status="${entry:0:2}"
    path="${entry:3}"

    if [[ "$status" == R* || "$status" == C* ]]; then
      IFS= read -r -d '' renamed_path || true
      path="$renamed_path"
    fi

    if ignored_path "$path"; then
      continue
    fi

    if [[ "$include_latest" != "true" && "$path" == "latest.md" ]]; then
      continue
    fi

    paths+=("$path")
  done < <(git status --porcelain -z --untracked-files=normal)
}

stage_collected_paths() {
  if ((${#paths[@]} > 0)); then
    git add --all -- "${paths[@]}"
  fi

  git restore --staged -- .obsidian public .quartz node_modules 2>/dev/null || true
}

echo "Staging note/source changes..."
collect_paths false
stage_collected_paths
if git diff --cached --quiet; then
  echo "No note/source changes staged."
else
  git status --short
  git commit -m "$message"
fi

echo "Generating latest updates page..."
npm run latest

echo "Running Quartz build..."
npm run build

echo "Staging generated updates page..."
collect_paths true
stage_collected_paths
if git diff --cached --quiet; then
  echo "No generated updates changes staged."
else
  git status --short
  git commit -m "site: refresh latest updates"
fi

echo "Pushing to origin/main..."
git push origin HEAD:main

echo "Done. GitHub Pages will rebuild via Actions."
