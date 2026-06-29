---
type: source
status: captured
created: 2026-06-29
updated: 2026-06-29
source_date: 2026-06-29
source_type: call_transcript
projects: [gpu-compute-novation]
domains: [gpu-finance, ai-infrastructure, compute-contracts]
people: [harry-page]
orgs: [usd-ai]
attachments: []
tags: [gpu, lending, customer-discovery]
---

# USD.AI call with Harry Page

## Context

Dylan spoke with Harry Page and the USD.AI team on 2026-06-29 as customer discovery for a GPU compute contract novation / financing hypothesis. The call tested whether GPU borrowers or their customers are over-committed on long-term offtake contracts and need a way to offload or novate capacity.

## Raw Context

```text
Meeting Title: Dylan Vu and Harry Page
Date: Jun 29
Meeting participants: Dylan V, Kyle, Hani, Harry

Transcript:
 
Them: Hi Dylan.  
Me: Dylan. How's it going, man? Good.  
Them: Good. How are you?  
Me: I'm doing well. Are there others going to be on the call? Or just. Just us here?  
Them: I need to run you over, but we can get started. We like to just hear more about you, where you call in from. Note in the message say you're looking to. Finance and you got in touch by through Sam.  
Me: Yeah. Yeah.  
Them: Okay. Yeah, yeah. Just if you can give a brief overview.  
Me: How's it going, Harry? Yeah. Yeah. So, no, I mean, I appreciate the time. I know this is not like a call that you guys, you know, typically take. But I got in touch with Sam through. A guy in. In crypto. We used to work in crypto with, like, on a protocol called spice finance. So we did, like, nft backed lending type stuff. Actually in a industry, you know, kind of alongside Meta Street. Back in the day. Which you guys are probably familiar with. Right. But, yeah. So we, you know, we've been pivoting through a bunch of different ideas since then and started looking into, like, gpu financing type of stuff. And I essentially have, like, a hypothesis for. What I was thinking the industry or people in the space would have, like, a problem that potentially needed solution for. So I was kind of just hoping to, you know, talk to you guys, learn more about, you know, contract origination from, from what you guys see in your end. And then maybe, like, if you guys had, like, some anecdotes about, you know, the borrowers that you worked with or how they frame their, their contracts with their customers and stuff like that, I would love to, like, you know, pick your brain for, for that type of stuff as well.  
Them: Yeah, sure. Sounds interesting.  
Me: Okay, sweet. Yeah. So I just have. Yeah, I have a couple questions. If, like, maybe to start off. Like, you guys, you guys, when you guys lend to operators, they're typically neoclouds and, like, data centers. Right. And it's like. You know, when you're lending your mostly lending against, like, the operators in their gpus, I would say. And then I guess my question is, like, do you ever lend against, like, the. The customer's contracts, like, directly?  
Them: Yeah. So, yeah, we're doing GPU back lending, right? So. That's like our primary color already. So we're underwriting the hardware. You know, I think implicitly we are lending against the. Off-site contract and like the kind of credit of the off taker because ultimately. That. The GPU support are kind of collateral, but the contract itself supports our debt service. Right. So we are sort of writing that. And the, the credit specifically. So we obviously have like a preference for. Long term committee take a pay off take contracts. And you prefer those over. On demand rentals. Or contracts that are based on usage or short term sort of thing.  
Me: Yeah. Is there. Is there, like, after a world where you guys, like, would lend against just the contract without, like, the gpu collateral, or is that, like a. Is like, like a binding part of the. The deal for you guys? Or how do you, how do you see that?  
Them: Yeah, no. I think we'll always be. Fundamentally backed by the gpu, right? Because if there's a default.  
Me: Yeah.  
Them: And we need to recover value, yeah, you can resell a gpu. But if there's a default in the contract, then it's just like a contractual stream of cash flows that doesn't exist anymore. So there's not really. Like recovery. Yeah, it's a, it's a support, but it's not a, it's not like a recoverable asset in that way.  
Me: I see. Yeah. Do you think, like. When you guys, when you guys have, when you guys have done loans and the, you know, the borrower bills out the fleet and they take on customers, like, have you ever had a situation where, like, one of your borrowers customers wants to, like, offload capacity or, like, they're stuck with capacity that, like, they can't use. Yeah. Has that, has that, like, ever happened to you guys?  
Them: No, no, it hasn't. It's sort of. I think right now we're seeing people who mostly just. Don't have enough capac. Ity, so nobody's trying to get rid of it.  
Me: Is it like the. What's. What's, like, kind of the. What's. What's kind of like the usage that you've seen for. For those customers? Is it, like, typically just for, like, training, or is it for. You know, providing inference or how do you. What's. What's that been look like?  
Them: Yeah, I think. Our primary use case is, is like, it's, at least for most of the neo clouds is inference based. I think that's definitely where the Market's going in terms of. Just the, this opportunity set. A lot of the large training workloads are sort of. A hyperscale level. So really bank finance and that sort of thing. But. I think as we've grown, we are moving more into the. You know. Like specific training, like model training. Sort of environment. But I think. It's going to be the is, is currently and will continue to be the main driver of, of, of the demand for the underlying. Contracts.  
Me: See? Yeah. You guys. You guys work with both, like, larger borrowers and, like, smaller. Borrowers as well. Right. The, for the. For the smaller borrower side, like. What do you see? Like. Like, what do you see them using the. The gpus for? Versus, like, the. The bigger. Borrowers? Is there a difference in how they use their, like. The capacity that they build out from the loans that you guys give them?  
Them: What are they using the.  
Me: Yeah. For the smaller size borrowers.  
Them: The gpus4?  
Me: Yeah. You know, the ones that, like, you know.  
Them: Normally development of, you know, proprietary development or running proprietary models normally.  
Me: Loans again. Yeah.  
Them: Yeah.  
Me: I seriously. Have you ever seen, like. Like. Like contracts change hands between people?  
Them: Only in the sense of, like, people will, Will oftentimes rent through multiple on demand marketplaces. But not swapping, like, actual termed out contracts for, for one between optics.  
Me: I see. What? Why do you think that is?  
Them: Because people need, people still would need that capacity.  
Me: Capacities of folded band?  
Them: If you, people who are signing a contract don't, they're starting a contract and making, you're paying deposits and making multi-year commitments because they, they need the capacity for a long period. So we haven't seen anyone be over, have more capacity than they need, which is, I guess when they would swap out.  
Me: I see. Yeah, that makes sense.  
Them: Yeah, I think all of the longer term deals deals come with. A, you know, significant, generally a 16. 16 to 25% deposits. So that can be several million dollars. And if people are going to pay that money, they're gonna, I mean, they're gonna hold on to. The compute as long as they can, especially because there's uncertainty around. What the supply will look like in the future. So having that sort of reserve take a pay is really valuable.  
Me: Yeah, that makes sense. What do you, like, what are you seeing? Like, do you see there any bottlenecks in, like, the industry such that. It's, like, slowing down how you can deploy Capital?  
Them: Next. I mean, the bottlenecks are. Just. Getting, I mean, there's, there's a few bottles. Next one is. Accuracy, right? There's a lot of startups looking to get into this. That need cash. And so raising from external parties can be difficult. And all next, just in terms of supply, there's not enough gpus for what people want. So people are waiting a long time or paying a premium to skip the line. It's definitely a bottleneck on this, on the supply side.  
Me: I see. That. Like, what. What's your. What's your relationship with, like, with Barker's been? I see. I see that they're ensuring, like, 80 of the value of the gpus on the. On your, like, loan page.  
Them: Yeah. Yeah. We have a great, great relationship with. With barco. They've been, they've been great and kind of unlocking that for us, helping us scale. I think that, you know, yeah, they're basically. Providing a value warranty, and then that warranty is their exposure. That warranty is reinsured. So, you know, they're saying, okay, we'll say that this server is worth X amount of money. And if we, if there's a sale and they default then, and we have a loss, basically a loss given default, then we can. We get a. They pay all the difference. So it's like a first loss kind of thing, and we basically allowed us to effectively create a synthetic. Default swap on our, our loans, which has been very valuable.  
Me: Right? Did they. Do they just provide you with the valuation up front so you guys don't have to deal with, like, the. The pricing or anything of the. The assets at all.  
Them: Yeah. Yeah. So we lock in the pricing. For the whole term of the loan on, on day one.  
Me: I see. Okay. Makes sense. Yeah. This is. I mean, I I could definitely. Keep this short, but I was wondering, like, are there any problems that you guys are facing that you wish, like, somebody could kind of come in and Tackle?  
Them: I think the main thing that we're looking at at the moment is, is ensuring kind of relating to the contracts and showing the performance of the operator. Obviously, these things have service level agreements where there can be. Pretty intense, you know, when you're talking about 99.99 up time, you're talking about hours a year. That things can be offline before kind of top line revenue starts being credited. So. We debited, it's, it's, it's definitely. You know, so ensuring kind of exposure to performance and those SLAs is one of the, the areas we're looking at right now. But. Yeah, I think also the idea, I mean, because doing that would basically let us. Price more aggressively. We're no longer, it's just a risk. The top line revenues and de risk slightly.  
Me: I see. Yeah. Because you guys are current. You guys aren't currently considering, like, the quality of the. The borrower that you. You're looking at. You're just mostly looking at the contract and the gpus. Right.  
Them: Yeah. I mean, you know, we're looking at the, the credit of the. Mostly looking at, yeah, the. Experience of the operator, right, that helps us understand what they're doing. And then there's some look through at the credit as well.  
Me: See? Okay. Cool. All right. I think that's all I was looking for. I was, like, kind of hoping to. Talk. Like, my hypothesis kind of going in was that there could be or, like. There were borrowers or customers that were essentially signing deals, like, offtake deals where they would not be able to, like, commit to the full. Like, they're essentially over committed in terms of signing the deal, and they would want to potentially offload it, but it seems like, you know, from what you've seen, it's like, everybody's just, like, fulfilling the entirety of their deal. Right. So it's like, contract Novation is not necessarily needed in this market right now just because it's, like, such a huge boom. And demand is, like, completely saturated and supplies actually, like, what is constraining?  
Them: Yeah. Interesting. All right, well, was it good to connect? Yeah, definitely keep in touch if you, if you come across anything that. Seems interesting. But, yeah, happy to bounce ideas back and forth. But, yeah.  
Me: Yeah, for sure. All right. Yeah. Appreciate the. The time and appreciate the answer.  
Them: Yeah.  
Me: All right, have a good one.  
Them: All right. 
```

## Summary

USD.AI described its product as fundamentally GPU-backed lending. Contracts and offtaker credit matter because they support debt service, but the recoverable asset is the GPU collateral, not the contract itself. Harry said USD.AI has not seen customers offloading long-term capacity or swapping termed-out contracts; instead, customers generally need the capacity, have made meaningful deposits, and face supply uncertainty. When asked for an unsolved problem, USD.AI pointed to verifying operator performance against service-level agreements and uptime requirements, because better visibility could let lenders price more aggressively by reducing top-line revenue risk.

## Promoted Insights

- [[Bare compute contracts have no recovery value after default]]
- [[Committed GPU capacity is supply-constrained, not over-committed]]
- [[SLA and uptime verification is a sharper GPU lender pain than novation]]
- [[GPU value warranties can synthetically insure lender loss given default]]

## Open Questions

- Does the supply-constrained / no-offloading pattern hold for borrowers or customers outside USD.AI's underwriting footprint?
- Are there segments with weaker demand visibility, shorter deposits, or less committed offtake where novation still matters?
- What evidence do lenders currently accept to verify operator uptime, SLA performance, and revenue-credit exposure?
- Who pays for SLA verification: lender, borrower, insurer, marketplace, or offtaker?

## Links

- Projects: [[gpu-compute-novation]]
- Areas: [[gpu-finance]]
- People: [[harry-page]]
- Orgs: [[usd-ai]]
- Attachments:
