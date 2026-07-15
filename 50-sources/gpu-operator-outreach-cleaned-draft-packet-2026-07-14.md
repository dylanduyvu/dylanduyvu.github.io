---
type: source
status: active
created: 2026-07-14
updated: 2026-07-15
source_date: 2026-07-14
source_type: outreach_plan
projects: []
domains: [gpu-finance, customer-discovery, credit-markets, operator-track-record]
people: []
orgs: []
attachments: []
tags: [outreach, operators, borrower-chair, draft-packet, email-verification]
---

# GPU operator outreach: cleaned list and Gmail draft packet

Source export: `/Users/dylanvu/Downloads/upload_csv_d92b1573.csv`

Purpose: reach the borrower/operator side of GPU financing. Pool A asks operators with financing experience what the capital provider actually underwrote about the operator. Pool B asks active operators whether they have explored debt or equipment financing and where the process got stuck.

## Clean result

- Raw export: 69 people across 53 company labels.
- Gmail queue: 38 messages, one contact per retained company.
- Route quality: 28 public or SMTP-confirmed direct routes; 10 catch-all or pattern-inferred routes retained because the target is unusually relevant.
- Duplicate check: no prior sent mail to any of the 38 selected addresses as of 2026-07-14.
- Send status: all 38 sent 2026-07-15 between 09:44 and 09:48 ET. Gmail reported zero send failures and zero drafts remaining immediately afterward. Delivery and bounce outcomes remain pending.

## Address corrections

The export's `verified` label was not a reliable mailbox bar. A second pass used public documents, official pages, current role checks, and SMTP/catch-all testing. Important corrections:

- Duos: use `doug.recker@duostech.com`, not `drecker@duostech.com`.
- Sesterce: use `youssef@sesterce.com`, not `youssef.elmanssouri@sesterce.com`. The corrected address also appears in a French corporate filing.
- Sharon AI: use `james@sharonai.com`, not `james.manning@sharonai.com`.
- Soluna: use `john@soluna.io`, not `john.belizaire@solunacomputing.com`.
- AceCloud: use `vinay@acecloud.ai`, not `vinay.chhabra@acecloud.ai`.
- Cirrascale: use `david.driggers@cirrascale.com`, not `ddriggers@cirrascale.com`.
- Civo: use `mark@civo.com`, not `mark.boost@civo.com`.
- EdgeUno: use `mehmet@edgeuno.com`, not `mehmet.akcin@edgeuno.com`. The corrected address is public in network-registry records.
- GreenNode: use `tung.vu@greennode.ai`, not `tung@greennode.ai`.
- Hikube/Hidora: use `matthieu@hidora.io`, not `matthieu.robin@hidora.io`.
- IonStream: use `jhinkle@ionstream.ai`, not `jeff.hinkle@ionstream.ai`.
- Parasail: use `mike.henry@parasail.io`, not `mike@parasail.io`.

SMTP confirmation is a useful routing signal, not proof that a human will read the message. Catch-all domains accept arbitrary local parts, so the ten inferred routes remain explicitly labeled below.

## Exclusions and holds

- Allbirds/NewBird: pre-operating corporate pivot, not an operator with a delivery record yet.
- BluSky: first site is still targeted for later in 2026.
- CUDO Compute: distributed/permissionless supply model, outside the owned-fleet operator definition.
- Corvex: only a generic investor-relations route was available.
- Dihuni and Qubrid: same founder and overlapping platform/supply relationship; neither is a clean additional owned-fleet borrower.
- EdgeMode: no direct route found.
- Firmus: real financing, but the $10 billion facility is far outside the small/mid-market thesis tier.
- Genesis Cloud: active operator, but all tested direct routes failed.
- Hyperscale Data: both guessed executive addresses failed, and the financing was corporate/convertible rather than a clean GPU facility.
- New Era Energy & Digital: data-center project developer rather than a GPU operator borrower.
- Prime Intellect: compute exchange rather than owned-fleet operator.
- RunPod: its CEO says the company owns negligible hardware and operates a software/partner network.
- SF Compute: marketplace model rather than a clean owned-fleet borrower.
- Siam AI: highly relevant financing, but no tested direct route survived verification.
- The invalid alternates from the export must not be reused.

## Send rules

1. One message per company. Do not add the alternate contacts from the raw export.
2. Keep every message plain text with no link or attachment.
3. Each message contains one substantive question.
4. Do not imply debt where the source only supports structured equity, project preparation, or a mixed financing round.
5. The ten `inferred, catch-all` routes should be watched separately from direct routes when measuring bounces and replies.
6. Stop the wave when 8-10 operator conversations are booked or the borrower-side answers become repetitive. SUBORDINATION NOTE 2026-07-15: this is the instrument's stop condition, not the experiment's goal. The canonical goal is the pre-registered Friday 2026-07-17 decision in [[solid-findings-audit-and-next-rung-2026-07-14|the audit note]]; this wave feeds that call first, and the 8-10 target governs only if Friday's call is CONTINUE.

## Gmail drafts

### 01. Brittany Kaiser, Alpha Compute

- Status: `ready, inferred, catch-all`
- To: `brittany@alphacompute.ai`
- Subject: `Alpha Compute's GPU facilities`
- Hook: Alpha used a $52.5M Vertical Data facility and later signed a binding term sheet for a $31.9M non-recourse GPU facility.

> Hi Brittany,
>
> Saw Alpha Compute finance its first cluster with Vertical Data and later sign the $31.9M non-recourse term sheet. I've been digging into GPU financing full time. Before this I built Spice Finance, which did $2bn+ of onchain loan origination.
>
> Did the first facility help with the second lender, or did they underwrite Alpha from scratch?
>
> Thanks,
> Dylan

### 02. Erik Guckel, Boost Run

- Status: `ready, inferred, catch-all`
- To: `erik.guckel@boostrun.com`
- Subject: `Boost Run financing`
- Hook: Boost Run announced $250M of vendor/equipment financing from Dell Technologies and Data Sales.

> Hi Erik,
>
> Saw the $250M GPU financing Boost Run put together with Dell and Data Sales. I've been digging into GPU financing full time. Before this I built Spice Finance, which did $2bn+ of onchain loan origination.
>
> What did they need to see from Boost Run beyond the customer contracts and GPUs?
>
> Thanks,
> Dylan

### 03. Kelly Greer, Crucible Capital

- Status: `ready, public, catch-all domain`
- To: `kelly@cruciblecap.xyz`
- Subject: `Crucible's USD.AI loan`
- Hook: Kelly was publicly attached to Crucible's $26.8M, 70% LTV USD.AI facility.

> Hi Kelly,
>
> Saw the 70% LTV USD.AI loan for Crucible's B300 deployment. I've been digging into GPU financing full time. Before this I built Spice Finance, which did $2bn+ of onchain loan origination.
>
> What did USD.AI need to get comfortable with about Crucible as the borrower, separate from the hardware and offtake?
>
> Thanks,
> Dylan

### 04. Doug Recker, Duos Technologies

- Status: `ready, SMTP-confirmed`
- To: `doug.recker@duostech.com`
- Subject: `Duos Edge AI financing`
- Hook: Doug was quoted in the $98.1M USD.AI financing announcement for 2,304 B300 GPUs.

> Hi Doug,
>
> Saw the $98.1M USD.AI facility for the Duos Edge AI deployment. I've been digging into GPU financing full time. Before this I built Spice Finance, which did $2bn+ of onchain loan origination.
>
> What did the lender need to get comfortable with about Duos as the operator, separate from the B300s and customer contracts?
>
> Thanks,
> Dylan

### 05. Cesar Maklary, Fluidstack

- Status: `ready, public, catch-all domain`
- COHORT LABEL: mega-tier exception. Fluidstack (100,000+ GPUs, multi-billion valuation) is far above the small/mid tier this packet targets; kept for its unique seat (Macquarie GPU-backed structure, tenant in multiple Google-backstopped deals). Score its answers separately from the small-tier cohort, same convention as the wave-two top-tier syndicate packet.
- To: `cesar@fluidstack.io`
- Subject: `Fluidstack / Macquarie`
- Hook: Fluidstack announced GPU-backed financing from Macquarie for European deployments.

> Hi Cesar,
>
> Saw the GPU-backed financing Fluidstack put together with Macquarie for the European fleet. I've been digging into GPU financing full time. Before this I built Spice Finance, which did $2bn+ of onchain loan origination.
>
> What did Macquarie diligence about Fluidstack beyond the GPUs and customer contracts?
>
> Thanks,
> Dylan

### 06. Alex Yeh, GMI Cloud

- Status: `ready, inferred, catch-all`
- To: `alex@gmicloud.ai`
- Subject: `GMI Cloud financing`
- Hook: GMI's $82M Series A included both equity and debt.

> Hi Alex,
>
> Saw GMI's $82M round included a debt piece alongside the equity. I've been digging into GPU financing full time. Before this I built Spice Finance, which did $2bn+ of onchain loan origination.
>
> On the debt piece, what did lenders push hardest on about GMI as the operator?
>
> Thanks,
> Dylan

### 07. Sunny Smith, Massed Compute

- Status: `ready, adjacent, inferred, catch-all`
- To: `sunny@massedcompute.com`
- Subject: `Massed / Digital Alpha`
- Hook: Digital Alpha's backing was structured as equity and revenue share, not represented here as debt.

> Hi Sunny,
>
> Saw the equity and revenue-share structure Massed put together with Digital Alpha. I've been digging into GPU financing full time. Before this I built Spice Finance, which did $2bn+ of onchain loan origination.
>
> Did equipment debt come up before you landed on that structure, or was the Digital Alpha structure always the better fit?
>
> Thanks,
> Dylan

### 08. Chris Starkey, NexGen Cloud

- Status: `ready, SMTP-confirmed`
- To: `chris.starkey@nexgencloud.com`
- Subject: `NexGen's USD.AI facility`
- Hook: NexGen closed a $34M USD.AI facility for B200/B300 deployment in Sweden.

> Hi Chris,
>
> Saw NexGen's $34M USD.AI facility for the Sweden deployment. I've been digging into GPU financing full time. Before this I built Spice Finance, which did $2bn+ of onchain loan origination.
>
> What did USD.AI diligence about NexGen beyond the customer contracts and GPUs?
>
> Thanks,
> Dylan

### 09. Francis Zhou, Quantum Solutions

- Status: `ready, SMTP-confirmed`
- To: `francis.zhou@quantum-s.co.jp`
- Subject: `Quantum / USD.AI`
- Hook: Francis led Quantum when it arranged up to $200M of GPU-backed USD.AI financing.

> Hi Francis,
>
> Saw the USD.AI facility Quantum put in place for its GPU expansion. I've been digging into GPU financing full time. Before this I built Spice Finance, which did $2bn+ of onchain loan origination.
>
> What did USD.AI need to see from Quantum as the operator beyond the GPU collateral?
>
> Thanks,
> Dylan

### 10. Scott Krosnowski, QumulusAI

- Status: `ready, inferred, catch-all`
- To: `s.krosnowski@qumulusai.com`
- Subject: `QumulusAI financing`
- Hook: ATW doubled its convertible-note commitment to QumulusAI from $45M to $90M.

> Hi Scott,
>
> Saw ATW double its commitment to QumulusAI from $45M to $90M. I've been digging into GPU financing full time. Before this I built Spice Finance, which did $2bn+ of onchain loan origination.
>
> When they came back with the second facility, what did they rely on from QumulusAI's performance under the first one?
>
> Thanks,
> Dylan

### 11. Youssef El Manssouri, Sesterce

- Status: `ready, adjacent, public and SMTP-confirmed`
- To: `youssef@sesterce.com`
- Subject: `Sesterce project financing`
- Hook: Sesterce announced plans for a EUR450M first buildout in Valence; no closed singular debt facility is claimed.

> Hi Youssef,
>
> Saw Sesterce's plans for the EUR450M Valence buildout. I've been digging into GPU financing full time. Before this I built Spice Finance, which did $2bn+ of onchain loan origination.
>
> As you work through financing it, what have prospective lenders cared about most?
>
> Thanks,
> Dylan

### 12. James Manning, Sharon AI

- Status: `ready, SMTP-confirmed`
- GRADING NOTE: a live short-seller report (Bleecker Street Research) accuses Sharon AI's CEO of self-dealing tied to his Mawson history. His answer to the operating-record question comes from a CEO publicly defending that exact record; capture verbatim, grade with that context, corroborate before promoting anything he says.
- To: `james@sharonai.com`
- Subject: `Sharon's USD.AI facility`
- Hook: USD.AI approved a facility of up to $500M for Sharon, subject to definitive documentation.

> Hi James,
>
> Saw the up-to-$500M USD.AI approval for Sharon's Australia and APAC expansion. I've been digging into GPU financing full time. Before this I built Spice Finance, which did $2bn+ of onchain loan origination.
>
> What did USD.AI need to see from Sharon before approving the facility?
>
> Thanks,
> Dylan

### 13. John Belizaire, Soluna

- Status: `ready, public-format and SMTP-confirmed`
- To: `john@soluna.io`
- Subject: `Soluna's repeat facilities`
- Hook: Soluna used a $12.5M 2024 facility and later announced a $100M Generate Capital facility.

> Hi John,
>
> Saw Soluna went from the 2024 GPU facility to the larger Generate Capital facility in 2025. I've been digging into GPU financing full time. Before this I built Spice Finance, which did $2bn+ of onchain loan origination.
>
> Did the first facility materially help on the Generate deal, or did Generate underwrite Soluna from scratch?
>
> Thanks,
> Dylan

### 14. Ruben Bryon, Verda

- Status: `ready, inferred, catch-all`
- To: `ruben.bryon@verda.com`
- Subject: `Verda financing`
- Hook: Nordea and Armada provided debt as part of Verda's $64M Series A.

> Hi Ruben,
>
> Saw Nordea and Armada's debt financing for Verda's expansion. I've been digging into GPU financing full time. Before this I built Spice Finance, which did $2bn+ of onchain loan origination.
>
> When lenders diligenced the debt piece, what, if anything, did they use from DataCrunch's operating history?
>
> Thanks,
> Dylan

### 15. Sam Tabar, WhiteFiber

- Status: `ready, public and SMTP-confirmed`
- To: `sam@whitefiber.com`
- Subject: `WhiteFiber's $100M facility`
- Hook: WhiteFiber announced a $100M delayed-draw term facility supporting Enovum growth.

> Hi Sam,
>
> Saw WhiteFiber's $100M delayed-draw facility for the Enovum expansion. I've been digging into GPU financing full time. Before this I built Spice Finance, which did $2bn+ of onchain loan origination.
>
> What did the capital providers need to see from Enovum's operating record before they were comfortable funding the expansion?
>
> Thanks,
> Dylan

### 16. Justin Ritchie, ARC Compute

- Status: `ready, public and SMTP-confirmed`
- To: `justin@arccompute.io`
- Subject: `ARC deployment financing`
- Hook: ARC operates GPU deployments on behalf of investor and customer owners, including Boson AI.

> Hi Justin,
>
> Saw ARC's named deployments for Boson and Nuway. I've been digging into GPU financing full time after building Spice Finance, which did $2bn+ of onchain loan origination.
>
> What do investor groups diligence about ARC before backing a deployment?
>
> Thanks,
> Dylan

### 17. Vinay Chhabra, AceCloud

- Status: `ready, SMTP-confirmed`
- To: `vinay@acecloud.ai`
- Subject: `AceCloud GPU financing`
- Hook: AceCloud operates H100/H200 capacity across India and the United States.

> Hi Vinay,
>
> Saw AceCloud is running H100 and H200 capacity across India and the US. I've been digging into GPU financing full time after building Spice Finance, which did $2bn+ of onchain loan origination.
>
> Have you looked at debt or equipment financing for new GPU deployments, and if so, what did lenders care about most?
>
> Thanks,
> Dylan

### 18. Jerry Tang, Atlas Cloud

- Status: `ready, inferred, catch-all`
- To: `jerry.tang@atlascloud.ai`
- Subject: `Atlas Cloud fleet financing`
- Hook: Atlas offers H100/H200 capacity and has publicly described the company as bootstrapped.

> Hi Jerry,
>
> Saw Atlas has scaled H100 and H200 capacity while staying bootstrapped. I've been digging into GPU financing full time after building Spice Finance, which did $2bn+ of onchain loan origination.
>
> Have you looked at debt or equipment financing for the fleet, or has bootstrapping it been deliberate?
>
> Thanks,
> Dylan

### 19. David Driggers, Cirrascale

- Status: `ready, SMTP-confirmed`
- To: `david.driggers@cirrascale.com`
- Subject: `Cirrascale fleet financing`
- Hook: Cirrascale is rolling out B200 capacity across a multi-vendor cloud fleet.

> Hi David,
>
> Saw Cirrascale's B200 rollout and the broader multi-vendor fleet. I've been digging into GPU financing full time after building Spice Finance, which did $2bn+ of onchain loan origination.
>
> Have you looked at debt or equipment financing for new deployments, and if so, what did lenders care about most?
>
> Thanks,
> Dylan

### 20. Mark Boost, Civo

- Status: `ready, SMTP-confirmed`
- To: `mark@civo.com`
- Subject: `Civo GPU financing`
- Hook: Civo expanded from H100-class capacity into B200 and B300 offerings.

> Hi Mark,
>
> Saw Civo has expanded from H100s into B200 and B300 capacity. I've been digging into GPU financing full time after building Spice Finance, which did $2bn+ of onchain loan origination.
>
> Have you looked at debt or equipment financing for that expansion, and if so, what did lenders care about most?
>
> Thanks,
> Dylan

### 21. Dmitry Trifonov, CloudRift

- Status: `ready, SMTP-confirmed`
- To: `dmitry@cloudrift.ai`
- Subject: `CloudRift fleet capex`
- Hook: CloudRift supplies the operating platform across partner datacenter operators, so the key qualification question is who owns the hardware capex.

> Hi Dmitry,
>
> Saw CloudRift is now powering GPU deployments across several sovereign datacenter partners. I've been digging into GPU financing full time after building Spice Finance, which did $2bn+ of onchain loan origination.
>
> Do you ever finance hardware yourselves, or is all of the fleet capex left to the datacenter partners?
>
> Thanks,
> Dylan

### 22. Wayne Lloyd, Consensus Core

- Status: `ready, public and SMTP-confirmed`
- To: `wayne@consensuscore.com`
- Subject: `Consensus Core financing`
- Hook: Consensus Core operates H100 capacity from Cologix's Montreal data center.

> Hi Wayne,
>
> Saw the H100 deployment Consensus Core brought online in Montreal. I've been digging into GPU financing full time after building Spice Finance, which did $2bn+ of onchain loan origination.
>
> Have you looked at debt or equipment financing for the fleet, and if so, what did lenders care about most?
>
> Thanks,
> Dylan

### 23. Anuj Bairathi, Cyfuture AI

- Status: `ready, public, catch-all domain`
- To: `anuj@cyfuture.com`
- Subject: `Cyfuture GPU financing`
- Hook: Cyfuture operates H100 clusters across its Indian data-center footprint.

> Hi Anuj,
>
> Saw Cyfuture's H100 clusters across the India data-center footprint. I've been digging into GPU financing full time after building Spice Finance, which did $2bn+ of onchain loan origination.
>
> Have you looked at debt or equipment financing for GPU expansion, and if so, what did lenders care about most?
>
> Thanks,
> Dylan

### 24. Nikola Borisov, DeepInfra

- Status: `ready, strong-pattern, catch-all`
- To: `nikola@deepinfra.com`
- Subject: `DeepInfra fleet financing`
- Hook: DeepInfra is scaling dedicated GPU clusters across multiple US data centers after its Series B.

> Hi Nikola,
>
> Saw DeepInfra is scaling dedicated clusters across eight US data centers after the Series B. I've been digging into GPU financing full time after building Spice Finance, which did $2bn+ of onchain loan origination.
>
> Have you looked at debt or equipment financing for the hardware, and if so, what did lenders care about most?
>
> Thanks,
> Dylan

### 25. Geoff Gordon, Denvr

- Status: `ready, SMTP-confirmed`
- To: `geoff@denvrdata.com`
- Subject: `Denvr financing`
- Hook: Denvr publicly engaged US Capital as adviser for a proposed $10.65M equity raise while operating a 1,024-H100 platform.

> Hi Geoff,
>
> Saw Denvr's 1,024-H100 build and that US Capital was brought in for the proposed $10.65M equity raise. I've been digging into GPU financing full time after building Spice Finance, which did $2bn+ of onchain loan origination.
>
> Did debt come up in that process, or was equity always the better fit?
>
> Thanks,
> Dylan

### 26. Mehmet Akcin, EdgeUno

- Status: `ready, public and SMTP-confirmed`
- To: `mehmet@edgeuno.com`
- Subject: `EdgeUno GPU financing`
- Hook: EdgeUno is adding bare-metal GPU capacity across its Latin American footprint.

> Hi Mehmet,
>
> Saw EdgeUno's bare-metal GPU rollout across the LatAm footprint. I've been digging into GPU financing full time after building Spice Finance, which did $2bn+ of onchain loan origination.
>
> Have you looked at debt or equipment financing for that capacity, and if so, what did lenders care about most?
>
> Thanks,
> Dylan

### 27. Tung Vu, GreenNode

- Status: `ready, public and SMTP-confirmed`
- To: `tung.vu@greennode.ai`
- Subject: `GreenNode GPU financing`
- Hook: GreenNode operates H100/H200 capacity across six APAC availability zones.

> Hi Tung,
>
> Saw GreenNode is operating H100 and H200 capacity across six APAC availability zones. I've been digging into GPU financing full time after building Spice Finance, which did $2bn+ of onchain loan origination.
>
> Have you looked at debt or equipment financing for new deployments, and if so, what did lenders care about most?
>
> Thanks,
> Dylan

### 28. Matthieu Robin, Hikube / Hidora

- Status: `ready, SMTP-confirmed`
- To: `matthieu@hidora.io`
- Subject: `Hikube GPU financing`
- Hook: Hikube operates GPU-as-a-service across three Swiss data centers.

> Hi Matthieu,
>
> Saw Hikube's GPU service across the three Swiss data centers. I've been digging into GPU financing full time after building Spice Finance, which did $2bn+ of onchain loan origination.
>
> Have you looked at debt or equipment financing for the GPU fleet, and if so, what did lenders care about most?
>
> Thanks,
> Dylan

### 29. Jon Stevens, Hot Aisle

- Status: `ready, SMTP-confirmed`
- To: `jon@hotaisle.xyz`
- Subject: `Hot Aisle fleet financing`
- Hook: Hot Aisle operates a 128-GPU MI300X cluster at Switch Pyramid.

> Hi Jon,
>
> Saw the 128-GPU MI300X cluster Hot Aisle brought online at Switch. I've been digging into GPU financing full time after building Spice Finance, which did $2bn+ of onchain loan origination.
>
> Have you looked at debt or equipment financing for the fleet, and if so, what did lenders care about most?
>
> Thanks,
> Dylan

### 30. Jeff Hinkle, IonStream

- Status: `ready, SMTP-confirmed`
- To: `jhinkle@ionstream.ai`
- Subject: `IonStream GPU financing`
- Hook: IonStream has live B300 pricing and a current Juniper infrastructure case study.

> Hi Jeff,
>
> Saw IonStream's B300 rollout and the Juniper infrastructure work. I've been digging into GPU financing full time after building Spice Finance, which did $2bn+ of onchain loan origination.
>
> Have you looked at debt or equipment financing for the GPU fleet, and if so, what did lenders care about most?
>
> Thanks,
> Dylan

### 31. Vishnu Subramanian, JarvisLabs

- Status: `ready, SMTP-confirmed`
- To: `vishnu@jarvislabs.ai`
- Subject: `Jarvis fleet financing`
- Hook: Jarvis says it has delivered more than 50M GPU-hours to 27,000+ developers.

> Hi Vishnu,
>
> Saw Jarvis has crossed 50M GPU-hours across more than 27,000 developers. I've been digging into GPU financing full time after building Spice Finance, which did $2bn+ of onchain loan origination.
>
> Has that operating record helped when financing new hardware, or have you mostly funded capacity another way?
>
> Thanks,
> Dylan

### 32. Guilherme Soubihe, Latitude.sh

- Status: `ready, SMTP-confirmed`
- To: `gui@latitude.sh`
- Subject: `Latitude GPU financing`
- Hook: Latitude operates thousands of servers across 20 markets and now offers dedicated metal GPU products.

> Hi Gui,
>
> Saw Latitude is running thousands of servers across 20 markets and now offers dedicated metal GPUs. I've been digging into GPU financing full time after building Spice Finance, which did $2bn+ of onchain loan origination.
>
> Have you looked at debt or equipment financing for the GPU expansion, and if so, what did lenders care about most?
>
> Thanks,
> Dylan

### 33. Narendra Sen, NeevCloud

- Status: `ready, inferred, catch-all`
- To: `narendra@neevcloud.com`
- Subject: `NeevCloud GPU financing`
- Hook: NeevCloud publicly announced an 8,000-GPU order from HPE.

> Hi Narendra,
>
> Saw NeevCloud's 8,000-GPU HPE order and the broader expansion plan. I've been digging into GPU financing full time after building Spice Finance, which did $2bn+ of onchain loan origination.
>
> If debt or vendor financing was part of that order, what did the provider push hardest on about NeevCloud?
>
> Thanks,
> Dylan

### 34. Todd Robinson, OpenMetal

- Status: `ready, inferred, catch-all`
- To: `todd.robinson@openmetal.io`
- Subject: `OpenMetal GPU financing`
- Hook: OpenMetal recently added H200 and RTX PRO 6000 private servers in Ashburn.

> Hi Todd,
>
> Saw OpenMetal added H200 and RTX PRO 6000 private servers in Ashburn. I've been digging into GPU financing full time after building Spice Finance, which did $2bn+ of onchain loan origination.
>
> Have you looked at debt or equipment financing for the GPU expansion, and if so, what did lenders care about most?
>
> Thanks,
> Dylan

### 35. Mike Henry, Parasail

- Status: `ready, SMTP-confirmed`
- To: `mike.henry@parasail.io`
- Subject: `Parasail cluster financing`
- Hook: Parasail combines partner capacity with clusters it hosts and operates itself.

> Hi Mike,
>
> Saw Parasail is both aggregating capacity and operating its own clusters across a broad datacenter footprint. I've been digging into GPU financing full time after building Spice Finance, which did $2bn+ of onchain loan origination.
>
> Have you looked at debt or equipment financing for the owned clusters, and if so, what did lenders care about most?
>
> Thanks,
> Dylan

### 36. Sabur Mian, STN

- Status: `ready, SMTP-confirmed`
- To: `sabur@stninc.com`
- Subject: `STN GPU financing`
- Hook: STN deployed a 2,304-B200 managed private cloud at CoreSite Chicago.

> Hi Sabur,
>
> Saw STN's 2,304-B200 deployment at CoreSite Chicago. I've been digging into GPU financing full time after building Spice Finance, which did $2bn+ of onchain loan origination.
>
> Have you looked at debt or equipment financing for that build, and if so, what did lenders care about most?
>
> Thanks,
> Dylan

### 37. Lorenzo Serratosa, Serenity Cloud / Substrate AI

- Status: `ready, SMTP-confirmed`
- To: `lorenzo.serratosa@substrate.ai`
- Subject: `Serenity Cloud financing`
- Hook: Serenity offers H100 through B300 capacity as a European sovereign cloud.

> Hi Lorenzo,
>
> Saw Serenity is now offering H100 through B300 capacity in Europe. I've been digging into GPU financing full time after building Spice Finance, which did $2bn+ of onchain loan origination.
>
> Have you looked at debt or equipment financing for the fleet, and if so, what did lenders care about most?
>
> Thanks,
> Dylan

### 38. Jacob Bostrom, greenai.cloud

- Status: `ready, inferred, catch-all`
- To: `jacob.bostrom@greenai.cloud`
- Subject: `greenai.cloud financing`
- Hook: greenai.cloud operates A100 through B200 capacity from a secure northern Sweden facility.

> Hi Jacob,
>
> Saw greenai.cloud is operating H100, H200, and B200 capacity from northern Sweden. I've been digging into GPU financing full time after building Spice Finance, which did $2bn+ of onchain loan origination.
>
> Have you looked at debt or equipment financing for the fleet, and if so, what did lenders care about most?
>
> Thanks,
> Dylan

## Measurement

Track direct and catch-all routes separately. For each message, record delivery, reply, booked conversation, operator has used debt, operator names a specific underwriting problem, and operator is willing to share a prior financing/deployment artifact. The point of this wave is not raw response volume. It is to find borrower-side evidence about whether operating history changes eligibility, equity, price, speed, or structure.
