---
type: meta
status: active
created: 2026-07-15
updated: 2026-07-15
tags: [outreach, writing, harness, email]
---

# Outreach Drafting Harness

Use this before drafting, approving, or sending cold outreach in Dylan's name.

The goal is not to conceal the use of artificial intelligence. That is fair game. The goal is to send a real question in Dylan's voice that is useful for the recipient to answer. The most damaging machine tell is usually the message architecture, not an individual word.

## The Failure Pattern

Reject this recognizable automated-sales structure:

```text
Saw [specific company fact].
I have been researching [topic] after building [compressed credential].
Have you looked at [broad issue], and if so, what did [group] care about most?
```

It fails even when every fact is correct because each sentence occupies a standard sales-outreach slot:

1. scraped personalization
2. credibility proof
3. generic survey question

The recipient experiences a populated template, not one person asking them something.

## First-Touch Rules

- Ask one question. Save the second question for the reply.
- A personalized fact must directly create or change the question. If it is only proof that research was done, cut it.
- Make the first question answerable in one sentence.
- Use at most one short credential clause, and only when it helps earn the answer.
- Put the real question early. Framing exists only to make the question easier to answer.
- Do not vary surface wording merely to make a batch look less templated. Segment by genuinely different seats, facts, and questions.
- Match the channel. Human email can still use capitalization and complete sentences. Do not force professional email into lowercase text-message language.

## Architecture Lint

Run these tests before showing Dylan a draft or moving a batch into Gmail:

1. **Noun-swap test:** Remove the names, company, and deployment. If the same email could go to the whole list after swapping those nouns, it fails.
2. **Causal-personalization test:** Ask why the opening fact leads to this exact question. If there is no direct answer, cut or replace the fact.
3. **Questionnaire test:** If the first touch contains a branch such as "have you done X, and if so, what happened?", split it. Ask whether they did X first.
4. **Credential test:** If the biography sentence packs topic, prior company, volume, and authority into one line, reduce it to one relevant clause or remove it.
5. **Answer-effort test:** The recipient should be able to answer the first touch from memory in one sentence.
6. **Voice test:** Read for the shape of automated outreach, not only stock artificial-intelligence vocabulary.
7. **Edit-authority test:** Dylan's edit is authoritative. Explain any grammatical or strategic objection before changing his wording, and use the smallest possible fix.

## Better Sequence

First touch:

```text
Jon,

Did Hot Aisle use debt for the MI300X build at Switch? I built Spice Finance and am now researching GPU credit.

Dylan
```

After a yes:

```text
What did the lender focus on?
```

The specific fact now determines the question. The credential is one clause. The deeper research question is earned by engagement instead of bundled into the cold email.

## Batch Gate

- For a new first-touch structure, send a canary group of five to ten recipients before releasing the full batch unless Dylan explicitly chooses an immediate full send.
- Judge the canary on substantive replies, confusion, adversarial placeholder responses, and silence. Opens alone do not validate the copy.
- A recipient rejecting the copy is evidence about the outreach format, not evidence against the underlying market thesis.
- Do not overfit to one unusual recipient. Record the signal, inspect the rest of the wave, and update the next batch when the structural critique holds independently.

## If Someone Calls Out Automation

- Do not litigate whether the message was written by a person or a model.
- One light acknowledgment is enough, followed by one return to the substantive question.
- It is fine to say that artificial-intelligence use does not matter if it was directed to provide the requested substance.
- If the recipient dodges the substantive question again, stop. Do not chase the thread.

## Final Gate

Do not approve the send until all are true:

- one first-touch question
- personalized fact causally connected to that question
- no compressed credibility block
- answerable in one sentence
- survives the noun-swap test
- matches the channel's register
- Dylan's wording preserved unless a change was explained
- canary plan defined for a new batch structure
