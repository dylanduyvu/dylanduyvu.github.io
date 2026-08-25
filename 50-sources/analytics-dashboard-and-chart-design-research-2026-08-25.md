---
type: source
status: complete
created: 2026-08-25
updated: 2026-08-25
domains: [inference, analytics, data-visualization, dashboard-design]
projects: [inference-model-opportunity-radar]
tags: [dashboard, charts, accessibility, model-demand, pareto-frontier]
---

# Analytics dashboard and chart design research

## Research Question

Which research and design rules should guide the model-demand analytics
dashboard?

## Method

On 2026-08-25, Exa search was used to find empirical research, official
accessibility standards, government data-publication guidance, and established
design-system guidance. The main pages and papers were then read directly.

The complete implementation reference is in the public
[model-demand-analytics repository](https://github.com/dylanduyvu/model-demand-analytics/blob/main/docs/references/analytics-dashboard-and-chart-design.md).
It includes a chart-selection matrix, layout rules, accessibility requirements,
model-demand page recommendations, and a review checklist.

## Strongest Findings

- **Empirical evidence:** Position on a common scale supports more accurate
  value comparison than length, angle, or area. This supports sorted bar and
  dot plots for important comparisons and limits the use of area encodings.
- **Design guidance:** Select a chart from the user question. Use lines for
  change over time, sorted bars for ranking, scatter plots for relationships,
  and tables for exact values.
- **Accessibility standard:** Text needs at least 4.5:1 contrast in normal use.
  Meaningful graphical objects need at least 3:1 contrast. Color cannot be the
  only signal. Complex charts need a text description or accessible data table.
- **Dashboard structure:** The model-demand tool is an exploration dashboard,
  not only a monitoring dashboard. Its first view should be clear, but search,
  sort, filtering, selection, and detail can continue below the first screen.
- **Evidence display:** Every chart should state the measure, unit, time window,
  data-through date, source, and important coverage limits. Missing, stale,
  estimated, and withheld values must stay distinct from zero.

## Model-Demand Application

The dashboard goal is to find small open models with strong observed demand.
A demand-versus-size scatter plot should therefore show the Pareto frontier: a
model is on the frontier when no other reviewed model is both smaller and more
in demand.

The current demand-per-BF16-GiB ratio is useful as a secondary sort. It is not a
complete opportunity score. A small model with little demand can have a high
ratio. The ratio also omits quantized serving size, throughput, provider supply,
reliability, price, and unit economics.

The recommended combination is:

1. a business-set minimum demand threshold;
2. the demand-versus-size Pareto frontier; and
3. the demand-to-size ratio as a secondary view.

Provider supply and quality should remain separate views until enough history
exists and the qualification rules are set.

## Evidence Limits

- Cleveland-McGill and Heer-Bostock give empirical graphical-perception
  evidence.
- W3C gives normative web-accessibility requirements.
- Government, vendor, and design-system sources give experienced practice.
  Most of those rules are not controlled experiments.
- The proposed model-demand page order, default top-model count, and Pareto
  presentation still need a user test.

## Sources

- [Cleveland and McGill, Graphical Perception, 1984](https://doi.org/10.1080/01621459.1984.10478080)
- [Heer and Bostock, Crowdsourcing Graphical Perception, 2010](https://dl.acm.org/doi/10.1145/1753326.1753357)
- [WCAG 2.2 text contrast](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)
- [WCAG 2.2 non-text contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast)
- [W3C complex-image guidance](https://www.w3.org/WAI/tutorials/images/complex/)
- [UK Government Analysis Function chart guidance](https://analysisfunction.civilservice.gov.uk/policy-store/data-visualisation-charts/)
- [ONS axes and gridlines](https://service-manual.ons.gov.uk/data-visualisation/guidance/axes-and-gridlines)
- [IBM Carbon dashboard guidance](https://carbondesignsystem.com/data-visualization/dashboards/)
- [Microsoft dashboard design tips](https://learn.microsoft.com/en-us/power-bi/create-reports/service-dashboards-design-tips)
- [Tableau visual best practices](https://help.tableau.com/current/blueprint/en-us/bp_visual_best_practices.htm)
- [Financial Times Visual Vocabulary](https://ft-interactive.github.io/visual-vocabulary/)

## Links

- [[demand-to-size-ratios-are-secondary-not-complete-opportunity-scores|Demand-to-size ratios are secondary, not complete opportunity scores]]
- [[inference-model-opportunity-radar|Inference Model Opportunity Radar]]
- [[inference|Inference]]
