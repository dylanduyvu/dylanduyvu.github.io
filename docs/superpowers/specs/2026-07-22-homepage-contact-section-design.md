# Homepage Contact Section Design

## Goal

Add Dylan's personal and Precursor Labs contact links to the public notes homepage without changing the site's layout, styling, or behavior.

## Placement

Append a `## Contact` section to `index.md` after the existing `## Notes` section. This preserves the current homepage hierarchy while making the links available from the main page.

## Content

Use two compact Markdown list items so the links wrap naturally on narrow screens and add only `Contact` to the page table of contents.

```md
## Contact

- **Dylan:** [Email](mailto:dylanduyvu@gmail.com) · [Substack](https://substack.com/@dylanvu) · [X @dylanduyvu](https://x.com/dylanduyvu) · [X @bicep_pump](https://x.com/bicep_pump) · [Telegram](https://t.me/dylanduyvu)
- **Precursor Labs:** [Website](https://precursorlabs.org/) · [Substack](https://precursorlabs.substack.com/) · [X @precursorlabs](https://x.com/precursorlabs)
```

## Constraints

- Use the links exactly as Dylan supplied them.
- Use `mailto:` for the email address.
- Do not add CSS, components, icons, or JavaScript.
- Do not modify any other homepage content.

## Verification

- Confirm all eight destinations appear once in `index.md`.
- Run `git diff --check`.
- Confirm the diff changes only `index.md` during implementation.
- Commit and push the content update to `main`; GitHub Pages will rebuild asynchronously.
