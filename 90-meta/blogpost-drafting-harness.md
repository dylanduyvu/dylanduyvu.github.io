---
type: meta
status: active
created: 2026-07-05
updated: 2026-07-20
tags: [writing, blogpost, harness, style]
---

# Blogpost Drafting Harness

> Vault copy. Original lives at `/Users/dylanvu/Documents/Codex/2026-05-31/files-mentioned-by-the-user-pasted/outputs/blogpost_drafting_harness.md` (unmodified). This copy was augmented 2026-07-05 with section 16 (the simple-declarative voice register extracted from American Compute's blog) and new codification-loop entries from drafting "The Ununderwritten Half of GPU Credit."

Use this when turning notes, customer logs, research, or rough arguments into a publishable essay.

The goal is not to make the post sound more polished. The goal is to make it feel earned: specific, honest about evidence, useful to the reader, and written from actual contact with the material.

## 1. Start With The Evidence, Not The Frame

Before drafting, make a claim ledger:

- direct observations: things people actually said or did
- supported synthesis: patterns that repeat across sources
- inference: what you think follows from the pattern
- speculation: bets, hunches, or product wedges to test

Do not let the clean frame arrive before the evidence. If the frame is good, it should survive being forced back through the raw examples.

## 2. Find The Live Crux

Write the post around the live question the reader should care about.

Good crux shape:

- not "here is a topic"
- not "here is everything I learned"
- yes "when does X become useful?"
- yes "why does the obvious product fail?"
- yes "what should builders/readers now do differently?"

## 3. Lead With A Concrete Scene

Open with the example that compresses the whole post.

Requirements:

- specific tool, market, person/role, date/contract, numbers, and link when possible
- the example should contain the thesis in miniature
- the model/person/tool should not be a strawman
- the interesting part should be a real mismatch, not a generic failure

For customer-discovery essays, the best lead is usually the moment where a smart user says some version of: "yes, but that is not the thing I actually need."

(See section 16 for the tradeoff when writing in the simple-declarative register: abstract-first opening, scene demoted to section one.)

## 4. Use One Central Shorthand, Max

Coined terms are allowed, but only if they earn their keep.

Rules:

- keep at most one central coined shorthand
- introduce it as your shorthand, not established jargon
- do not stack secondary branded handles
- do not write "it has a name" unless the term is actually established
- if the phrase came from us, say "I'll call it..." or use plain language
- if the title carries the main handle, the body can keep the coined noun lighter; avoid mechanically restating the title as the thesis

## 5. Mark Evidence Strength In The Prose

Do not flatten every persona or source cluster into equal evidence. Do not flatten source channels either. If a claim is supported both by a company's public writing and by a direct founder/user conversation, keep both visible when the extra channel materially strengthens the evidence.

Use evidence-gradient language:

- "showed up most often"
- "fewer but clean"
- "one strong case"
- "more analogy than market segment"
- "my inference"
- "a bet rather than a finding"

If a section is based on two conversations, say so.

## 6. Separate Direct Observation From Inference

Use headings or phrasing that makes the epistemics obvious:

- "What I directly observed"
- "What I infer from that spread"
- "Where the thesis weakens"
- "One speculative claim, flagged as such"

Do not announce a caveat as "honest" if the prose can simply state the boundary condition. Credibility comes from the caveat doing useful work, not from labeling itself as fair.

## 7. Evidence-Fit Gate

Before using an example as evidence, ask:

> What exact claim does this evidence support?

A fact can be true and still be the wrong evidence for the paragraph around it.

Classify each candidate example:

- core evidence for this section's claim
- adjacent evidence that belongs in a different section
- boundary/counterexample
- low-signal context
- interesting but not useful here

Rules:

- Do not include examples just because they appeared in the corpus.
- Do not use low-signal boundary cases as core evidence.
- Do not use an adjacent product/company/persona as evidence for the wrong user group.
- If the source belongs to another layer, move it there.
- If you cannot state the claim it supports in one sentence, cut it.

## 8. Specificity Without Doxing

After the draft is coherent, do a full-document specificity sweep.

Replace vague placeholders with concrete details where supportable. Do not dox interviewed people. Companies, products, public markets, and public docs are fine and should be named and linked. Individual interviewees stay role-based unless Dylan explicitly says they can be named.

When someone should stay private, make that explicit ("an anonymous community trader"), not vague ("one trader").

## 9. Add Links Where They Reduce Ambiguity

Links should make claims inspectable, not turn the post into a link farm.

Prioritize links for public tools/products, public markets, public handles or project pages, public docs/reports, public benchmark/eval projects. Avoid linking every noun if it hurts readability.

## 10. Use Metrics As Provenance, Not Fake Statistics

Include outreach scale lightly when it helps the reader calibrate the evidence.

Good: "roughly a hundred cold outreach threads over a couple weeks, a couple dozen real back-and-forths"

Risky: exact CRM row counts. Exact numbers can make anecdotal evidence sound more scientific than it is. Use exact counts only when the count itself matters.

Always include the caveat if conclusions come from outreach: "This came from outreach, not a survey."

## 11. Keep The Voice Like Field Notes, Not A Framework Deck

The reader should feel the argument was discovered, not pre-packaged.

Prefer: concrete examples, "what I heard," "what I infer," short mechanism explanations, specific product consequences.

Avoid: too many named frameworks, branded layer-speak, unexplained product/UI nouns, over-symmetrical sections, slide-deck taxonomy energy, defensive caveats before the reader needs them.

If a sentence sounds like it is preempting an objection the reader has not had yet, soften it or move it later.

### Normal English Is A Hard Gate

Write for a smart reader who has no finance background and has never seen the vault. The draft fails if that reader cannot explain each paragraph back after one reading.

This gate applies **before** any prose is shown to Dylan or written into a draft. It is not merely a final editing check. Do not use Dylan's reaction as the first test of whether the language is understandable.

- Prefer the ordinary action to the industry label. Write "cash set aside for future loan payments" before `debt-service reserve`, "the share of the hardware cost the lender pays" before `advance rate`, and "a customer promises to pay for capacity for several years" before `offtake`.
- If a technical term is necessary, define it in normal English the first time it appears. Do not make the reader wait for a later paragraph or glossary.
- Never use jargon to carry a logical step. The prose must say who pays whom, what could go wrong, and what changes as a result.
- Keep one idea per sentence and one job per paragraph. Split a sentence when understanding it requires holding several new concepts at once.
- Familiarity is not clarity. Run the final pass as someone who does not know the research, the companies, or the argument already.
- A replacement fails if it swaps one specialist label for another. Describe what happens before trying to name it.

## 12. Media Rule

Use media only when it teaches a distinction faster than prose. Zero graphics is often fine. Never add decorative media. If generating a graphic: crisp and editable, real example from the piece, visually inspect for overflow and overlap.

## 13. Structure Pattern

Good default structure:

1. concrete lead
2. thesis in one sentence
3. source/provenance context
4. first mechanism section from the lead example
5. define the central shorthand, if needed
6. closest user-facing failure mode
7. builder/infrastructure consequence
8. trust/proof details embedded where they affect action or product design
9. organization/consulting artifact version
10. internal failure case, if it clarifies ownership/action loops
11. smallest clarifying analogy, if useful
12. limits and counterweights
13. practical checklist / consequence
14. final compression of the core question

The final compression should leave the reader with a reusable product test, question, or decision rule, not merely a summary.

Use the nearest economic peer for analogies. An asset-finance argument about GPUs should start with aircraft, leased equipment, data centers, or power projects before reaching for houses or consumer products. If the analogy only proves an obvious category difference, cut it. The comparison should expose a financing mechanism the reader may not have noticed.

Order sections by the argument's escalation, not by the neatness of the taxonomy. If a section moves, rewrite the seams around it. Keep the intro roadmap and dek aligned with the actual order and scope after any move. Watch the middle of the essay hardest: if one section carries evidence, taxonomy, proof, and inference all at once, split or cut before adding. Analogy sections do one job and leave.

Outline order is necessary but insufficient. Before approving structure, write the thesis as one sentence and reduce it to a short causal chain. Every section must prove one link in that chain while preserving the same governing question in the reader's working memory. Run this as a naive reader with no vault or research context. If the connections feel obvious only because the author already knows the corpus, the flow is not working. Do not rate narrative flow from headings alone.

Connective tissue is not transition prose. Use the shortest phrase that names why the next sentence follows: `but`, `so`, `because`, `for example`, `instead`, or `still`. If the reader must supply that relationship, the seam is unfinished.

Every local edit triggers a seam check and a global check. First reread the changed sentence with the paragraph before and after it. Then scan the full article for stale transitions, repeated claims, changed scope, broken definitions, and later sentences that relied on the old wording. A locally improved sentence is not finished until the whole article still reads as one completed argument.

## 14. Pre-Publish Lint

Evidence:

- Is every strong claim tied to a source, example, or clearly labeled inference?
- Does each evidence bullet support the exact claim of the section it appears in?
- Are interviewed people anonymized or permission-safe?
- Are frequency claims calibrated by target group?
- Are negative/low-signal cases represented enough to avoid fake universality?
- Are short/ambiguous replies over-interpreted?

Specificity:

- Search for vague placeholders: `one`, `some`, `someone`, `a tool`, `a market`, `a builder`, `thing`, `stuff`
- Replace with product/company names, links, dates, or explicit role-based anonymization.

Normal English:

- Circle every domain term. Replace it with the underlying action unless the term is necessary, then define it immediately.
- For every paragraph, ask: who is doing what, why does it matter, and could a smart non-specialist paraphrase this after one reading?
- Treat a failed paraphrase as a failed draft. Rewrite the paragraph before continuing the lint.

Authenticity:

- Remove invented terms that pretend to be established. Keep only the central shorthand if genuinely useful.

Overclaiming:

- Search for the pattern CLASS, not a wordlist: absolutes attached to any group noun ("no industry", "no lender", "none exists", "every market", "the whole market", "only form of"), plus unscoped superlatives ("the first", "the only"). The literal strings `everyone`, `always`, `clearly`, `proved`, `nobody`, `no one` are members of the class, not the class. Every hit gets scoped to what the evidence supports, attributed, or cut. (Upgraded 2026-07-11: "No industry watches its borrowers" sailed through a wordlist search that would have caught "nobody watches.")

Belonging:

- Run the evidence-fit gate on CONCLUSIONS, not just evidence. For every paragraph, ask what question THE POST raised that it answers. If the justification for a sentence lives in the research corpus rather than on the page, the sentence either gets the bridge that raises its question or gets cut. Findings that are load-bearing for product decisions but answer no reader question belong in the vault, not the post.
- Once per lint, read the full draft as the naive reader: no corpus context, no memory of why anything was researched. Author-authored favorite findings are the highest-risk imports, because every prior pass checked them for correctness and none for necessity.

Voice:

- Remove methodology padding, early defensive caveats, duplicated epistemic labels, unearned contrasts, and repeated "not X; it was Y" sentence shapes.
- Remove narrator-certainty headings such as "X says it plainly," "Y gives it away," "the real story," or "here is the tension." They announce the interpretation instead of naming the evidence. Use a plain claim such as "Nebius still borrowed against the contract."
- Colon audit: count colons in the body. More than roughly one per 250 words is a flag, but the real tell is TEMPLATE UNIFORMITY: the "short claim: elaborating list" construction repeated throughout reads as machine-generated even when each instance is individually fine. Keep colons that do irreplaceable work (a definition, a spec list after a quoted term, the lead-in to a closing question); convert the rest to periods, commas, or restructures. Period-plus-fragment ("So lender B starts from zero. Heavy cash down, fast repayment.") usually lands harder than the colon version in the simple-declarative register anyway. (Added 2026-07-11 from "The Track Record That Can't Travel": 13 colons in 1,150 words, nearly all the same construction, caught by Dylan's ear, not the lint.)
- Make counterweights concrete: name the conditions where the thesis weakens or the simple version is enough.
- When an observation sparks a product hunch, label it as a hypothesis to explore.

Facts:

- Check dates, counts, names, tool names, and links. Verify quoted claims against primary sources, not converging secondary coverage (see codification loop: convergence is not confirmation).
- Check link hygiene: strip tracking params, prefer reader-facing landing pages.

## 15. Continuing Codification Loop

As Dylan edits the draft, treat repeated critique as harness updates: identify the underlying rule, patch the draft, update the harness, save a memory pointer if the lesson should survive future sessions.

### Edit-turn redundancy gate

Run this gate whenever an edit adds, removes, or materially rewrites a sentence. Typo-only and punctuation-only changes are exempt.

1. **Name the job.** State in a short phrase what the edited paragraph uniquely contributes to the article.
2. **Read the section.** Read from the header before the edit through the next header. Do not inspect only the changed sentence or a search-result window.
3. **Compare paragraph jobs.** Summarize the edited paragraph and its neighboring paragraphs in five to ten words each. Compare the edited paragraph against the opening abstract and any later section assigned the same argumentative job.
4. **Run the removal test.** Ask what unique evidence, mechanism, concession, transition, or decision the reader would lose if the paragraph disappeared. If the answer is `nothing`, delete or merge it.
5. **Search second.** Search the full draft for distinctive phrases and the underlying claim class. Search results supplement the paragraph-level read; they do not replace it.
6. **Match the review scope to the edit.** A single sentence edit requires the section-level read above. A changed claim, evidence boundary, section structure, or accumulated readability checkpoint requires a full article read plus a consistency check against the active prep.
7. **Report the scope honestly.** Say `section-level read` when only the affected section was read. Say `global pass` only after reading the complete reader-visible article. Never infer a global pass from `rg`, a diff, or selected excerpts.

The gate fails when the edited paragraph has no unique job, repeats a conclusion already stated more clearly, previews an argument that a later section already owns, or restates the previous sentence without adding evidence or causality.

Accumulated lessons (selected; see original file for the full forecasting-essay list):

- specificity passes are full-document, not local patches
- keep interviewed people role-based; name/link companies, products, and public docs
- true-but-misplaced examples move to the section whose claim they support, or get cut
- order by argument escalation; patch transition seams after moving sections
- end by naming the reusable test/question the reader should carry forward
- vary sentence rhythm so the draft does not feel templated

New entries from "The Ununderwritten Half of GPU Credit" (2026-07-05):

- "nobody has built X" claims -> before publishing, systematically search for adjacent players (companies, not just writing). Name what exists and define the gap against it. A named market map with a precise hole reads better-informed than a clean "nothing exists," and it is falsifiable in your favor instead of against you.
- press convergence is not confirmation -> six outlets describing the same mechanics can all be downstream of one report. Verify the primary source before citing mechanics; name single-source reporting explicitly ("reporting that originated with The Information") and pair reported mechanics with a confirmed precedent where one exists.
- pressure-test before publish -> for a thesis post, run a symmetric deep-research pass on the load-bearing claims (strongest support AND strongest disconfirmation per claim) before the edit-for-style pass. Re-source secondary-sourced numbers to primaries; cut numbers that fail to corroborate rather than keeping them attributed.
- frequency claims in young asset classes -> "X is how most deals die" overreaches when the sample is small and the class is young. Write "the failures documented so far have been X" and make the structural claim (instrumented vs uninstrumented risk) the load-bearer so the thesis survives either base rate.
- one-source-of-truth leaning -> if most numbers route through one supplier-side source, a sharp reader will notice. Cite the primaries that source itself relied on (Sightline, LBNL) instead of the aggregator.
- frontmatter anonymization -> on public posts, keep `people: []` and restrict `sources:` to public-artifact notes so the published page does not footer-link anonymized quotes to named person hubs.
- preempting who-pays conflicts -> when the post proposes an operator-pays audit model, the conflict-of-interest objection is one the target reader WILL have; a one-sentence historical answer (classification societies, SOC 2 governance) is earned, not defensive.
- no em dashes -> Dylan's standing preference across emails, bullets, and published prose. Use commas, colons, parentheses, and periods.
- colon density and colon-template uniformity -> punctuation habits repeat as templates, and repeated templates read as machine-generated regardless of the individual sentence quality. Audit for any construction (colon-then-list, paired fragments, identical paragraph closers) appearing more than a handful of times; break the pattern by converting instances to varied syntax, keeping only the ones doing irreplaceable work. Full rule in section 14 Voice. (2026-07-11)

New entries from "The Track Record That Can't Travel" (2026-07-08 to 2026-07-11):

- podcast captures need an air-date check at capture time -> "I just listened to it" is not "it just aired." Every dated intention in a podcast ("our next problem is X") is stale by the gap between air date and capture date.
- auto-generated transcripts are capture-grade, not quote-grade -> they produced a date error and a garbled name in one capture. Verify quote wording and names against audio or an official transcript before publication.
- interval arithmetic is a fact -> verifying both endpoint dates against primaries and then subtracting in your head produced two wrong week-counts in one post. Date math gets checked like names and numbers.
- the register drifts back -> a flatten pass runs once, then new paragraphs added afterward arrive unaudited. Any paragraph added after the register pass gets the register check individually, or the final lint re-runs the register scan across the whole document.
- holder filings beat issuer summaries -> a fund's SEC portfolio filing reporting the exact rate of a loan it held is stronger evidence than the issuer's proxy summary or any press figure, and it is publicly linkable. For private-credit terms, search fund NPORT filings before settling for secondary numbers.
- conclusions need the evidence-fit gate too -> a finding can be true, load-bearing in the vault, and still not belong in the post, because the post never raised the question it answers. Imported conclusions rebut objections the reader has not had (rule 11) and carry corpus-context the reader lacks. The author cannot detect this by rereading, because the author cannot unknow the context; the belonging lint and the naive-reader pass exist for exactly this, and the ownership pass remains the terminal gate. (2026-07-11, the continuous-surveillance paragraph.)

New entry from "The Missing Step Between Recording and Prediction" (2026-07-27):

- an unrun experiment has no result -> if setup or data assembly prevents the evaluation from starting, say `the test never ran` or `the claim remains untested`. Do not write `the work did not show X`, because that phrasing reads like a negative experimental finding. Then run the section 13 seam and global checks for every later sentence that describes the experiment, its evidence, or its outcome.
- human verification is not manual assembly -> if the target workflow already includes a person approving, correcting, or rejecting proposed labels, do not criticize the system because those proposals are not automatically trustworthy. Separate raw capture, automated assembly, and human verification. A recorder has not completed the workflow merely because its database contains enough evidence, but an assembler that turns that evidence into proposed records may satisfy the automation requirement even when every label is reviewed. Only missing evidence or unperformed assembly remains a gap.

New entry from "How Computer Use Crosses the Chasm" (2026-08-14):

- the simple-declarative register drifts asyndetic -> one idea per sentence plus short sentences produces strings of declaratives with no stated relationship, and the draft reads terse (Dylan: "we need connector words throughout"). Section 13's connective-tissue rule applies at the sentence level, not only at section seams: every adjacent sentence pair either has an obvious relationship or carries the shortest connector that names it (but, so, still, and, also, instead, because, for example). Run this as its own pass after the register pass, because the register pass creates the problem. Density guard (same day, Dylan: "too many in a row"): never open two consecutive sentences with connectors; fold the second relation into the sentence with a comma ("X needs work, but Y is sound") instead of stacking sentence-initial But/Still/So.
- drafting from working files imports jargon -> a draft translated from internal notes inherits their shorthand (seam, live loop, packets, arms, composer, projection, grains), and the writer cannot see it because the terms are defined in the writer's head. The naive-reader pass must therefore run at draft time, immediately after the draft exists, not at pre-publish; otherwise the author becomes the naive reader and catches the failures one by one (Dylan, 2026-08-15: "it's weird that i'm catching so many of these ambiguous lines"). The pass checks: every term defined at or before first use, no forward references to later-defined results, no internal codenames, every number's unit and test stated, every analogy resolved within two sentences.

## 16. Voice Register Option: Simple Declarative (The American Compute Register)

Extracted 2026-07-05 from American Compute's blog (Bernie Margulies / AC Research), the reference for simple, straightforward, easy-to-digest technical-finance writing. Use this register when the audience includes smart readers without domain background and the goal is that anyone can follow every section.

Sentence level:

- Short declarative sentences. One idea per sentence. Subject, verb, object.
- Rarely more than two clauses. If a sentence needs a semicolon, it is usually two sentences.
- Present tense, active voice.
- Strip rhetorical flourish. No "read that again," no dramatic fragments for effect. State the fact, then state the next fact.
- Occasional plain teaching beats are allowed: "The second one is the dangerous one. Here is why."
- Light second person where it makes a mechanism land: "the provider that just failed you."

Terms:

- Define every term inline the moment it first appears, in apposition or parentheses: "offtake agreements, contracts where a customer commits to buying capacity in advance." Never assume the reader knows the jargon; never stop the essay for a glossary.
- Concrete numbers everywhere, rounded when rounding serves readability.

Structure:

- Headers are plain claims or questions: "The biggest risk is timeline," "What can go wrong."
- Short paragraphs, one to three sentences.
- Convert dense prose runs into bulleted or numbered lists, especially for processes and enumerations.
- Open with a compressed abstract of the whole argument (2-4 sentences), not a slow build.

Tradeoff with section 3: the scene-first lead and the abstract-first open conflict. In this register, open with the abstract and demote the concrete scene to the first section with a header like "The clause that gives it away." The scene still does its compression work; it just is not the cold open.

What this register drops from the essayistic default: metaphor chains, "trapped capital and legal language"-style compound imagery, ironic asides, and any sentence whose main job is sounding smart. If a phrase would make a reader pause to admire it, replace it with the fact.

What survives from the harness in this register: evidence gradients, provenance statements, hypothesis labels, and the closing reusable test. They are stated in the same short declarative sentences as everything else.

## 17. Revision History Is Part Of The Article

For research essays, the Git history should show how the argument changed. A single final commit proves only that a finished file exists. Meaningful intermediate commits show when evidence narrowed the thesis, where counterexamples changed the structure, and which claims were corrected before publication.

Commit and push at these checkpoints:

1. Claim ledger and causal outline are stable enough to draft from.
2. The first complete draft exists, even if the prose is rough.
3. A material change alters the thesis, evidence boundary, section order, or conclusion.
4. A pressure test adds counterevidence, removes an unsupported claim, or changes confidence.
5. The normal-English and full-read pass produces a publishable draft.
6. Publication metadata, associated research, disclosure, and final links are ready.

Rules:

- Each commit should describe the intellectual change, not merely say `update article`.
- Push each checkpoint immediately so the remote file history is the durable record.
- Before publishing a material article checkpoint, run the section 15 edit-turn redundancy gate on every paragraph changed since the previous checkpoint.
- A material pass is not complete until the checkpoint is committed and pushed. Before reporting the pass complete, a shell-capable agent must publish it automatically and must not wait for Dylan to ask.
- New evidence or counterevidence, a changed claim or confidence level, a structural rewrite, and a completed global/full-read review are material publish triggers.
- Do not create a commit for every typo. Batch small wording and punctuation fixes into the nearest coherent revision.
- Do not amend, squash, force-push, or rewrite article history after it has been pushed. If a claim was wrong, preserve it and add a correction commit.
- Add a file-specific `Revision history` link near the top of the article once the article is externally shared.
- Remember that every pushed draft is public. Keep private or permission-sensitive material outside the public vault rather than relying on later deletion.
