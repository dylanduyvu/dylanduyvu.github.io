---
type: source
status: captured
created: 2026-06-29
updated: 2026-06-29
source_date: 2026-06-18
source_type: call_transcript
projects: [gpu-residual-value-pricing]
domains: [gpu-finance, ai-infrastructure, residual-value]
people: [thomas-galbraith]
orgs: [barkr]
attachments: []
tags: [gpu, lending, valuation, guarantees, customer-discovery]
---

# Barkr call with Thomas

## Context

Dylan spoke with Thomas from Barkr/Barker on 2026-06-18 while exploring whether GPU finance needs a Moody's / Kelley Blue Book-style pricing data player, and how Barkr's warranty / guarantee structure differs from American Compute's residual value insurance.

## Raw Context

```text
Meeting Title: GPU asset pricing and guarantee structure with Thomas
Date: Jun 18
Meeting participants: Dylan V

Transcript:
 
Me: Hello. Hello. How's it going, Thomas?  
Them: Hey. Good to meet you Dylan.  
Me: Nice to meet you. You're. Are you based in. In new york?  
Them: In Miami I lived in New York for a long time but now past five years has been in Miami.  
Me: I see. I was. I was not. I was out there or not in Miami, but I was in Tampa last week visiting a buddy. But the. The weather is definitely nice down there versus New York.  
Them: Are you in New York?  
Me: Yeah, I'm in. I'm in New York right now. Yeah.  
Them: You're not out on the streets celebrating?  
Me: Oh, no, it's a bit. It's a good. It's a bit gloomy out here. But, you know, we got. We got work to do. But I'm sure there'll be, like, a riot and a lot of stuff burned down in the streets today.  
Them: Yeah exactly exactly.  
Me: Yeah. How do you find being out in. In Miami? Like, I mean, I was talking to Bernie, and he. He's in. He's out in SF, but do you find, like, the business where. Where you land with Barker's is good networking in. In Miami.  
Them: Yeah I mean honestly for the most part our clients.  
Me: Or.  
Them: Are lenders and banks and like a lot of them in new york so I go there quite often. There's some in Miami there's more and more in Miami but I mean I have to kind of go everywhere anyway so it is what it is but Miami is growing like crazy and there's a lot of people moving here it's exciting.  
Me: Yeah. Yeah. I have. I have some buddies down there. But it definitely seems like a good time. Yeah, maybe. Yeah.  
Them: Yes what can I do to help?  
Me: Yeah. Yeah. Let me. Maybe I could give a bit of background. I I think. I guess, like, first things first to. To give some context. Just so that you're, like, not thrown off guard. But I like the current. The current state of our company right now is essentially we're a super early stage. It's. We're at the point where we're trying to explore, like, different problems. It's not like I have, like, a value prop or a product to pitch you or anything like that. I just wanted to more kind of maybe meet some people in, like, the GPU financing vertical. And then also, like, maybe ask some questions to see, like, you know, if you guys have any problems or any problems you think the. The industry would. You know, benefit from, you know, another person contributing to building something. It could be a pretty interesting for us to, you know, potentially tackle or even work together on would be pretty cool. But essentially, like, my background is we. We previously built a company in nft lending. So actually, like, the same. The same vertical. We were working in the same vertical as the usdai guys when they were Meta Street. I don't know if you're familiar with the, the stuff they worked on before, but I know you're working with them now. Right?  
Them: Yes yeah I don't really know what they did before but what they're doing now seems to be quite successful.  
Me: Okay. Yeah, yeah, yeah, for sure. Yeah. So we were kind of, like, working collaboratively slash competitively with them on some, some aspects. But, yeah, they, you know, they, they since obviously pivot into GPU financing type stuff, and we pivoted a bit around into, like, more, more software AI type stuff. But, you know, wanted to take a look at this. This vertical as well. So, yeah, essentially, like, you know, during, like, while working in nfts, like, you know, you could imagine, like, a big problem was, like, understanding, like, the value of these assets. And it, and, like, based on my just, like, high level overview and also talking to Bernie a bit, like, it seems like gpus have a, a similar problem where, you know, the, the value of the assets are kind of, like, opaque. Not like, not even from the secondary perspective, but it seems like nobody understands how to, like, or how much these cost from a primary perspective, because, like, Nvidia just, like, you know, does all these bespoke deals, I guess. Right. So, yeah, like, my, my rough hypothesis was that the industry could benefit from some kind of, like, you know, massive data sets, like a moody's kbb, like, kbb type player. And I looked into you guys. I looked into American compute, and it seems like. My understanding is, like, you guys. Are in some, probably you guys more than American compute are kind of, like, positioning yourselves as one of these types of companies. Although I know you guys do your warranty and American compute does their insurance. So I kind of wanted just to, you know, understand if. You know, long term, if this is kind of something that you guys were positioning towards, like, what you've seen, like, what, what, what was, like, the strategic, you know, decisions around either just, like, full porting, like a Kelly blue book type of business model or starting with a wedge and insurance or warranties. Like, I don't know, maybe just, like, if you could start out and explaining, like, You know, where, where you guys came from, like, what you do, that would be helpful.  
Them: Yeah so we we're primarily focused on hard assets that are used as loan collateral. And we're looking at all hard assets not just gpus so we we price luxury assets vehicles jets yachts cars like that kind of thing and the the problem that has been persistent in in asset backed lending is is that people much like gpus people don't know they can't trust the value of the asset. So we wanted to fix that we wanted to say like we basically this has been a known problem for a while we're like okay well we think we can we can solve that so we developed technology specifically multi model approach domain specific lms that are able to price assets with a high degree of accuracy. And we do that in a few different ways using public and private data that we have access to. And we do it across multiple different asset types so the problem that we're solving is really specific for sort of sort of hard assets and banks lenders insurance companies and so forth. And it's not we're less focused on providing like a Kelly blue book or. Rating agency approach we're more like how do we help. How do we help the broader like financial sector understand that there is a definitive hard asset price? And I think that goal it touches on some of the different things that you were mentioning, but it doesn't serve. It's not we're not trying to replace existing services. So like take cars for example. Kelly blue book's approach to pricing cars is kind of different to ours. We're, we're providing bespoke sort of custom pricing for client specific use case and generally if it's a lender, we're trying to tell them what we think that asset will at least sell for. Whereas Kelly blue book would be like, this is what that asset. Is worth. This is the fair market value of that asset.  
Me: Yeah.  
Them: So there's nuanced differences between the two and we're not trying to sort of encroach on any of those existing providers.  
Me: I see. Yeah. You're familiar with American compute, right? Like Bernie's company.  
Them: Yes.  
Me: Yeah. Aren't they the, like, their valuation is also like a minimum sales type of, like a floor type of valuation as well. Right?  
Them: Exactly. So they're a little different. The products are slightly different insofar. There's a lot of similarities, but the products are slightly different insofar as. Web pricing assets over the course of the loan. And then we provide a guarantee to back up that price. So if there's a default at any point, then the client knows what value we think that asset is worth. Generally speaking, if my understanding is correct, they're providing a residual value insurance, which means at the end of the loan they're effectively providing an insurance product that protects the value of the asset at the end of the loan. So there's there's nuanced differences between the two. But yes, they're also trying to provide some kind of stability to lenders in the space. We're actually trying to help them with the with developing and deploying their product because we also think that the more we can support and help other companies in the space and other insurance companies as well develop new products, then the better the entire ecosystem is going to be.  
Me: Yeah. Was there, like, what was your strategic decision process like when. You determined to, like. I guess. Like, sell the valuation. In and of itself? Or maybe I have that wrong. And you, you see that your business is more selling. Like, the warranty versus. Okay. Yeah. Do you think, like, the core value prop for you guys is, like, the, like, the insurance or the guarantee of the misprice, you know?  
Them: It's both. Yeah. It depends on the client. So some clients just want the valuation.  
Me: Yeah.  
Them: Which we're happy to provide them and then others, they want to go a layer deeper and they want the valuation with a guarantee. So for the most part, our GPU clients all want the guarantee. That's why they're using us because we have like pricing accuracy. And also a guarantee that backs it up. But it depends on the client.  
Me: Gotcha. Do you think the guarantee is like a bigger, a bigger part of your business? Or is it the, the valuation?  
Them: I mean, at the moment is the biggest part of our business. We've done almost half a billion in guarantees.  
Me: Yeah. Why do you guys think that, why do you think that you're, you guys are ahead of American compute, right? Like, what do you, why do you think. You guys are ahead of, of them versus the other way around? Because I know, like, Bernie was telling me, like, a big diff between you guys were. His product and structures that were structured as insurance. And so, like, you know, all of the regulatory compliance and, and, you know, all that stuff around it, where, whereas yours is structured as a guarantee, which my understanding is a bit more loose, but maybe a bit more Nimble or something like that.  
Them: Yes. I mean, it depends on it's easier to set up. It's easier to get going. It depends on the client's abilities of recognize the risk transfer. And it depends on the client. Some clients want insurance. Other clients don't want insurance. Banks often don't want insurance because a lot of them don't believe insurance actually pays. So there's a pretty high hurdle for like I've encountered this multiple times with banks where they say, well, is it backed by insurance? We, we don't like it because we don't like insurance. So there's pros and cons to both. Whereas other lenders of more than fine with insurance.  
Me: Yeah. Especially in these current market conditions. Right. Like, everybody's pretty euphoric about GPU prospects that, yeah, Bernie was saying the same thing where it's like he's having a hard time. It's like you're selling insurance into, like, a super frothy, like, super bullish Market. So it's like nobody, nobody cares about, about protecting downside.  
Them: Yeah, that's true. But that's not quite what I'm saying. What I'm saying is that banks universally just don't really like insurance because they don't think insurers pay claims.  
Me: Yeah.  
Them: Whereas if you're issuing a swap or if you're like a credit default swap, there's no chance that you won't get paid because the, the swap triggers an immediate payout that there's no, there's no get out of free get out of jail free clauses with a swap. But there are plenty with insurance.  
Me: See. Yeah. Gotcha. I see, I see. How do you, like, how do you structure your, like, your payments? Or. Yeah. How do you structure your. I don't know how to say, like, how your clients, like, pay you, because there must be. I mean, yeah, I mean, maybe I'll just let you.  
Them: Yeah, they pay platform access fee if they're just running valuations on the platform. And then if they want to purchase the guarantee, then that requires an additional layer of due diligence. And then we charge a percentage of the value of the asset.  
Me: I see. Okay. Gotcha. By the way, like, for, for the thing that drives your. Your valuation model. Is it, is it fair to say that it's mostly, like, proprietary data? Like, you know, I tried to do some scraping on available data on the web. Pretty smart.  
Them: It's like it's 50 50. Like we do, obviously we scrape similarly. We scrape like huge like whatever public data we can. But then we also get a lot of private data from our clients as well.  
Me: Yeah. I see. And it mostly, like your private data mostly comes from your clients, not, like, providers. Like, what is it? IT dads? And, like.  
Them: We are now starting to have partnerships with data providers. But for the most part, we get it directed from the clients.  
Me: See. I see. Are you, are you happy with, like, the quality of, of that data? Birdie was mentioning to me, like, the, like, some, some data sets that he purchased when he ended up, like, sifting through the data. It was, like, it was like, it was like listing data rather than, you know, actual.  
Them: Yeah, some of it's dirty, some of it's not like quite real. Some of it is listing or retail prices.  
Me: Yeah.  
Them: It's not sort of marketplace prices, that kind of thing. So you have to, you have to know what you're looking at.  
Me: Do you view, like, getting that data as a, as a bottleneck to your, to your business or product at all, or do you, do you think it's, like, sufficient?  
Them: It's not really a bottleneck at this point because we're able to price the assets as comfortably as we feel and then comfortably enough for Munich to back us. So it hasn't been an issue to date. But obviously we're always looking for as much data as possible because that's, that's going to help inform the product and inform the pricing.  
Me: I see. Like. How, how important is Munich read to. To, like, your, your sales process when it comes to, like,  
Them: I mean, it's pretty important because the major insurer who did their due diligence on us and then chose to partner with us to, to deliver the product. And if you're talking to Goldman, then, then they could give two shits about me, but they definitely pay attention to mute agree.  
Me: Yeah. What's the, what's the conversion rate? I mean, you know, you don't have to give me actual numbers, but I'm, I'm interested. Like, what's the conversion rate between the people that, like, sign up for your platform for the valuations, which that, that the platform is like, what is it, like permissionless valuations so they could just come on and then plug in numbers.  
Them: Because there's no liability to us. So they can.  
Me: And. Okay. Yeah. What, what's conversion of people who, like, end up coming onto your platform and, like, paying for the subscription. And then getting a guarantee? Is it, like, high? Conversion?  
Them: Well at the moment, we've only been selling the guarantee. We only recently started offering the platform access without the guarantee. And that was based on demand. People came to us and they kept asking, can we just get the valuation?  
Me: Yeah, that's actually pretty funny. Yeah. Bernie was telling me that, like, like. Like a lot of people were coming to him for valuations as well. But they weren't buying the insurance that he was offering. So it's like it needs to, like, you know, fix up the sales process in order to, to try to, you know, get the, the paid service up front or something like that. But he also said, like, yeah, but he also mentioned that, like, he suspects that.  
Them: Yeah, that's fine.  
Me: Like, people's, like, lender. I don't know what, what sense you have of, like, the, the lenders out there, but he was, he was expecting that most lenders are sophisticated, at least up to the point where they have, like, their own data set of resale values. So you, it was more so, like, a gut check when it comes to, like, valuations with, like, either you or American computer, something like that than it is, like, something that they have, like, really high willingness to pay for. You know what I mean? I don't know. Has that been your experience? Or.  
Them: Not really. We don't. I mean, The first thing people want to know with us is really the guarantee with the warranty, with the valuation. It's only more recently that non lenders have come to us like insurance companies or. Like asset managers, people who have some interest in, in the value alone and not in the guarantee. Almost all of our conversations start with people who are interested in the valuation with a guarantee.  
Me: I see. You guys, do you guys work with, like, operators or borrowers at all, or is, like, your main. I see?  
Them: Yeah, that was good to meet you. Let me know if there's anything else I can help you with. If there's anyone else that you that I know that you might want to meet and when you get an idea of like the direction that you guys are headed in, let me know.  
Me: Okay, perfect. Yeah. I appreciate your time, man.  
Them: Yeah, of course.  
Me: Thank you. Nice. Thank you.  
Them: Speak soon. Bye.  
Me: Bye.  
Them: Bye. 
```

## Summary

Barkr's framing is not a pure Kelley Blue Book / fair-market-value index. Thomas described Barkr as a hard-asset valuation and guarantee company for asset-backed lenders, banks, insurers, and financial institutions. For lender use cases, Barkr is trying to price what an asset will at least sell for, then optionally back that value with a guarantee. GPU customers mostly want valuation plus guarantee, and Thomas said Barkr has done almost half a billion dollars of guarantees. He contrasted this with residual value insurance, where insurance can be harder for banks to trust because of claim-payment uncertainty and exclusions. Barkr uses a mix of public and private data, with client-supplied private data important but not currently a bottleneck; Munich Re backing matters heavily in sales because it validates the product to serious financial counterparties.

## Promoted Insights

- [[lender-gpu-valuations-need-recovery-floor-not-fair-market-value|Lender GPU valuations need recovery floor, not fair market value]]
- [[gpu-clients-buy-guaranteed-valuations-more-than-standalone-marks|GPU clients buy guaranteed valuations more than standalone marks]]
- [[banks-may-prefer-guarantees-or-swaps-over-insurance-for-gpu-collateral-risk|Banks may prefer guarantees or swaps over insurance for GPU collateral risk]]
- [[gpu-residual-data-alone-is-not-the-bottleneck-for-guarantee-products|GPU residual data alone is not the bottleneck for guarantee products]]
- [[gpu-value-warranties-can-synthetically-insure-lender-loss-given-default|GPU value warranties can synthetically insure lender loss given default]]

## Open Questions

- What is the actual guarantee fee as a percentage of asset value, and how does it vary by tenor, asset, and borrower?
- What does Munich Re require to back Barkr's guarantee structure?
- How do Barkr guarantees trigger in default compared with American Compute residual value insurance?
- What exclusions, market-drop clauses, or claim limitations exist in the guarantee docs?
- Are valuation-only customers a meaningful standalone market, or mostly top-of-funnel for guaranteed products?

## Links

- Projects: [[gpu-residual-value-pricing|GPU Residual Value Pricing]]
- Areas: [[gpu-finance|GPU Finance]]
- People: [[thomas-galbraith|Thomas Galbraith]]
- Orgs: [[barkr|Barkr]]
