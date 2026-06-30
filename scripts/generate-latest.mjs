#!/usr/bin/env node
import { execFileSync } from "node:child_process"
import { existsSync, readFileSync, writeFileSync } from "node:fs"
import path from "node:path"

const repoRoot = execFileSync("git", ["rev-parse", "--show-toplevel"], {
  encoding: "utf8",
}).trim()

const now = process.env.LATEST_NOW ? new Date(process.env.LATEST_NOW) : new Date()
if (Number.isNaN(now.getTime())) {
  throw new Error(`Invalid LATEST_NOW: ${process.env.LATEST_NOW}`)
}

const dayMs = 24 * 60 * 60 * 1000
const oneDayAgo = new Date(now.getTime() - dayMs)
const sevenDaysAgo = new Date(now.getTime() - 7 * dayMs)
const thirtyDaysAgo = new Date(now.getTime() - 30 * dayMs)

const visiblePrefixes = [
  "00-inbox/",
  "10-insights/",
  "20-syntheses/",
  "30-projects/",
  "40-areas/",
  "50-sources/",
  "60-people/",
  "65-orgs/",
]

const ignoredPaths = new Set(["latest.md"])
const generatedSubjects = new Set(["site: refresh latest updates"])

function git(args) {
  return execFileSync("git", args, {
    cwd: repoRoot,
    encoding: "utf8",
    maxBuffer: 20 * 1024 * 1024,
  })
}

function getCommits() {
  const output = git([
    "log",
    "--since=31 days ago",
    "--date=iso-strict",
    "--name-only",
    "--pretty=format:%x1e%H%x1f%aI%x1f%s",
  ])

  return output
    .split("\x1e")
    .filter(Boolean)
    .map((block) => {
      const lines = block.trim().split("\n")
      const [hash, isoDate, subject] = lines[0].split("\x1f")
      const files = lines
        .slice(1)
        .map((line) => line.trim())
        .filter(Boolean)
      return {
        hash,
        date: new Date(isoDate),
        subject,
        files,
      }
    })
    .filter((commit) => !generatedSubjects.has(commit.subject))
    .map((commit) => {
      const noteFiles = commit.files.filter(isVisibleNotePath)
      return { ...commit, noteFiles }
    })
    .filter((commit) => commit.noteFiles.length > 0)
}

function isVisibleNotePath(file) {
  if (!file.endsWith(".md")) return false
  if (ignoredPaths.has(file)) return false
  return visiblePrefixes.some((prefix) => file.startsWith(prefix))
}

function fileTitle(file) {
  const fullPath = path.join(repoRoot, file)
  if (!existsSync(fullPath)) return titleFromSlug(path.basename(file, ".md"))

  const text = readFileSync(fullPath, "utf8")
  const h1 = text.match(/^#\s+(.+)$/m)
  if (h1) return stripMarkdown(h1[1]).trim()
  return titleFromSlug(path.basename(file, ".md"))
}

function titleFromSlug(slug) {
  return slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
}

function wikiLink(file) {
  const slug = path.basename(file, ".md")
  return `[[${slug}|${fileTitle(file)}]]`
}

function stripMarkdown(text) {
  return text
    .replace(/\[\[([^|\]]+)\|([^\]]+)\]\]/g, "$2")
    .replace(/\[\[([^\]]+)\]\]/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[`*_#>]/g, "")
}

function firstParagraphUnder(text, heading) {
  const escaped = heading.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  const re = new RegExp(`^## ${escaped}\\s*\\n([\\s\\S]*?)(?=\\n## |\\n# |$)`, "m")
  const match = text.match(re)
  if (!match) return ""

  const paragraph = match[1]
    .trim()
    .split(/\n\s*\n/)
    .find((chunk) => chunk.trim() && !chunk.trim().startsWith("-"))

  return paragraph ? truncateWords(stripMarkdown(paragraph.replace(/\n/g, " ")), 55) : ""
}

function truncateWords(text, maxWords) {
  const words = text.replace(/\s+/g, " ").trim().split(" ")
  if (words.length <= maxWords) return words.join(" ")
  return `${words.slice(0, maxWords).join(" ")}...`
}

function hubSignals(commits) {
  const files = new Set()
  for (const commit of commits) {
    for (const file of commit.noteFiles) {
      if (file.startsWith("30-projects/") || file.startsWith("40-areas/")) files.add(file)
    }
  }

  return [...files]
    .sort()
    .map((file) => {
      const fullPath = path.join(repoRoot, file)
      if (!existsSync(fullPath)) return null
      const text = readFileSync(fullPath, "utf8")
      const summary =
        firstParagraphUnder(text, "Current State") ||
        firstParagraphUnder(text, "Current Understanding")
      if (!summary) return null
      return { file, summary }
    })
    .filter(Boolean)
}

function subjectNarrative(subject) {
  const match = subject.match(/^([^:]+):\s*(.+)$/)
  if (!match) return subject
  const [, type, rest] = match
  const label = {
    project: "Project decision",
    insight: "Insight update",
    insights: "Insight update",
    source: "Source capture",
    hubs: "Hub update",
    harness: "Harness update",
    site: "Site update",
    links: "Link update",
  }[type]
  return label ? `${label}: ${rest}` : subject
}

function formatDate(date, includeTime = false) {
  const options = {
    timeZone: "America/New_York",
    year: "numeric",
    month: "short",
    day: "numeric",
  }
  if (includeTime) {
    options.hour = "numeric"
    options.minute = "2-digit"
    options.timeZoneName = "short"
  }
  return new Intl.DateTimeFormat("en-US", options).format(date)
}

function commitBlock(commit) {
  const noteLinks = commit.noteFiles.slice(0, 8).map((file) => `  - ${wikiLink(file)}`)
  const remaining = commit.noteFiles.length - noteLinks.length
  if (remaining > 0) noteLinks.push(`  - and ${remaining} more`)

  return [
    `### ${formatDate(commit.date, true)} - ${commit.subject}`,
    "",
    `${subjectNarrative(commit.subject)}.`,
    "",
    "Changed notes:",
    ...noteLinks,
  ].join("\n")
}

function commitList(commits, emptyText, limit = 12) {
  if (commits.length === 0) return emptyText
  const shown = commits.slice(0, limit)
  const hidden = commits.length - shown.length
  const footer =
    hidden > 0
      ? `\n\n_Showing the newest ${shown.length} of ${commits.length} updates in this window._`
      : ""
  return `${shown.map(commitBlock).join("\n\n")}${footer}`
}

function compactArchive(commits, emptyText, limit = 25) {
  if (commits.length === 0) return emptyText
  const shown = commits.slice(0, limit)
  const hidden = commits.length - shown.length
  const footer =
    hidden > 0
      ? `\n\n_Showing the newest ${shown.length} of ${commits.length} updates in this window._`
      : ""
  return `${shown
    .map((commit) => {
      const primary = commit.noteFiles[0] ? ` - ${wikiLink(commit.noteFiles[0])}` : ""
      return `- ${formatDate(commit.date)}: ${commit.subject}${primary}`
    })
    .join("\n")}${footer}`
}

function frontmatterDate(date) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date)
}

const commits = getCommits()
const past24 = commits.filter((commit) => commit.date >= oneDayAgo)
const past7 = commits.filter((commit) => commit.date >= sevenDaysAgo)
const past30 = commits.filter((commit) => commit.date >= thirtyDaysAgo)
const signals = hubSignals(past7)
const recentDecisions = past7
  .filter((commit) => /^(project|insight|insights|source|hubs):/.test(commit.subject))
  .slice(0, 6)

const stateShiftLines = []
if (past7.length === 0) {
  stateShiftLines.push("No note changes landed in the past 7 days.")
} else {
  stateShiftLines.push(
    `In the past 7 days, the public vault changed through ${past7.length} note commit${
      past7.length === 1 ? "" : "s"
    }. The most recent movement is:`
  )
  stateShiftLines.push("")
  stateShiftLines.push(
    ...recentDecisions.map((commit) => `- ${subjectNarrative(commit.subject)}.`)
  )
}

const signalLines =
  signals.length > 0
    ? signals.map((signal) => `- ${wikiLink(signal.file)}: ${signal.summary}`)
    : ["- No project or area hubs changed in the past 7 days."]

const content = `---
title: Latest Updates
tags: [updates]
updated: ${frontmatterDate(now)}
---

# Latest Updates

This page is generated automatically from git history and current hub notes. It updates during every publish and during the scheduled daily site build.

Generated: ${formatDate(now, true)}

## State Shift Summary

${stateShiftLines.join("\n")}

## Current Hub Signals

${signalLines.join("\n")}

## Past 24 Hours

${commitList(past24, "No public note changes in the past 24 hours.")}

## Past 7 Days

${compactArchive(past7, "No public note changes in the past 7 days.")}

## Past 30 Days

${compactArchive(past30, "No public note changes in the past 30 days.")}
`

writeFileSync(path.join(repoRoot, "latest.md"), content)
console.log(
  `Generated latest.md with ${past24.length} commits in 24h, ${past7.length} commits in 7d, ${past30.length} commits in 30d.`
)
