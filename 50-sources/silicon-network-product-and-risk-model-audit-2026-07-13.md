---
type: source
status: captured
created: 2026-07-13
updated: 2026-07-13
source_date: 2026-07-13
source_type: web-research
projects: [gpu-residual-value-pricing]
domains: [gpu-finance, tokenization, compute-markets, operator-underwriting]
people: []
orgs: [silicon-network, farmgpu, pantheon-compute, runpod]
attachments: []
tags: [company-audit, gpu-tokenization, operator-risk, cashflow-verification]
---

# Silicon Network product and risk model audit

## Context

Audit of Silicon Network's live website, product documentation, terms, provider pages, and Cluster 00/01 materials on 2026-07-13. Trigger: after Dylan asked Silicon co-founder McDavid Stoddard how Silicon vets operators before presenting clusters to investors, McDavid read the question as asking who manages SLAs and day-to-day operations. The audit separates the actual product flow from assumptions embedded in the outreach.

Legal entity: Berkeley Compute Inc., branded as Silicon Network.

## Straight Read

Silicon is not a conventional physical-GPU marketplace and not quite a conventional ICO platform. Its documented model is a hybrid of:

1. **Capital formation:** sell a claim ticket, GPU NFT, or pooled token interest to finance GPU capacity.
2. **Asset and ownership rails:** associate tokens with specific physical GPUs/servers, record ownership, and support transfers.
3. **Servicing software:** ingest operational and earnings data, manage owner agreements, calculate balances, and facilitate USDC payouts.
4. **Secondary liquidity:** let owners trade GPU NFTs or pool tokens.
5. **Compute monetization:** operators rent the hardware through RunPod and other marketplaces or direct contracts.

The live homepage now adds a sixth posture: Silicon says it owns and operates dedicated NVIDIA clusters and sells multi-year compute contracts directly. Public materials do not explain whether these direct clusters are funded through the token pools, sit beside the tokenization product, or represent a pivot whose docs have not caught up.

## Actors

### Silicon Network

- Supplies tokenization, dashboards, legal/cashflow rails, marketplace infrastructure, and pool management.
- For the pool token, chooses assets initially and charges a protocol-management fee.
- Facilitates individual GPU-owner/provider relationships but its Terms say it is not a party to those agreements and does not conduct suitability reviews.

### Datacenter provider / operator

- Examples named publicly: FarmGPU and Pantheon Compute.
- Acquires or receives hardware, installs and maintains it, connects it to RunPod/Vast/Akash/etc., and manages uptime.
- Mints and pairs NFTs, calculates earnings, maintains payout liquidity, remits USDC, and communicates with owners.
- Creates the provider agreement owners must sign.

### Owner / capital provider

- Buys a claim ticket for future hardware, an NFT tied to a particular GPU/server, or an ERC-20 interest in a pool of GPU NFTs and USDC.
- Receives the associated compute cash flows and can sell the tokenized interest.
- Does not operate the hardware or manage compute customers.

### Compute marketplace / customer

- RunPod is the primary documented demand and metering source for Cluster 00/01.
- Other supported integrations include Vast, Akash, TensorDock, and Shadeform.
- Direct customer/offtake contracts are an intended and, on the new homepage, actively marketed channel.

## Two Capital-Formation Routes

### Route 1: specific GPU NFT

1. An operator can mint an unpaired NFT before the hardware arrives.
2. A buyer purchases the NFT/claim ticket, supplying capital for the planned GPU.
3. The operator procures and deploys the matching hardware.
4. The NFT is paired to a hardware identifier.
5. The operator rents the compute and pays earnings to the token owner.
6. The owner can later sell the NFT on the secondary market.

This is primary issuance used to finance a deployment, followed by servicing and secondary trading. "Buying a GPU" is legally/product-wise closer than it sounds, but economically the buyer is funding and owning a remotely operated asset rather than taking physical delivery.

### Route 2: pooled token

`$silGPUa` is documented as an ERC-20 fractional claim on a pool holding GPU-server NFTs and USDC. Silicon runs pre-deposit campaigns, uses the capital to acquire/deploy server clusters, and issues tokens at NAV. Cluster 01 targeted up to $2 million to deploy H100, H200, or RTX Pro 6000 Blackwell servers at FarmGPU.

The documented Cluster 01 gross-revenue waterfall was:

- 51.4% to the pool contract
- 20.0% to RunPod
- 13.2% to the datacenter operator
- 10.4% for taxes
- 5.0% to Silicon

GPU assets are marked at acquisition cost less straight-line depreciation, not independently observed resale value. The model assumes a negotiated end-of-life liquidation floor. Token holders can eventually sell on an AMM or redeem against pool liquidity subject to fees/taxes and liquidity constraints.

## Cluster 00 And Cluster 01

Cluster 00 was a $2.7 million, 33-server portfolio deployed through FarmGPU on RunPod Secure Cloud. Silicon says eight months of operating data informed the pool-token design and Cluster 01 asset selection. Cluster 01 then used pre-deposits to fund a new FarmGPU deployment.

This confirms the Blockchain Capital description at a high level: outside capital finances a GPU fleet, an operator runs it, compute rent accrues to token holders, and Silicon manages the token/pool/servicing layer. The correction is that Silicon does not merely run one public sale for a datacenter. It has individual-asset, pooled-asset, servicing, marketplace, and now direct-compute surfaces.

## Where The Data Comes From

The provider dashboard imports hardware, usage, operational status, and earnings from provider-controlled integrations with RunPod, Vast, Akash, TensorDock, or Shadeform. Manual CSV import is also supported. The operator is responsible for earnings calculations, payouts, API credentials, and sufficient USDC liquidity.

Therefore:

- Blockchain records can make token ownership and completed payouts auditable.
- Vendor API synchronization can make reported utilization and earnings more visible.
- Neither fact, by itself, independently proves that the operator deployed the promised system, reported all revenue correctly, met the customer contract, or remitted everything owed.

The onchain audit trail begins after offchain facts enter through operator/vendor systems. Silicon makes those facts legible and transferable; the public docs do not show an independent attestation layer that makes them true.

## Risk Allocation

The pool-token docs describe service agreements with a minimum 95% uptime commitment, provider insurance for replacement cost, replacement of failed equipment within 10 business days, and end-of-life physical redemption or liquidation. Providers hold equipment as bailees and are responsible for installation, operation, monitoring, and monetization.

But Silicon's Terms place substantial risk back on the owner:

- Silicon says it facilitates owner-provider interactions but is not a party to their agreements.
- Provider disputes, delays, and failures are between the owner and provider.
- Silicon performs no suitability review of an owner's transaction.
- Pre-deposits can remain unconverted indefinitely; hardware specifications can be substituted.
- NAV and depreciation methodologies may change, and secondary liquidity is not guaranteed.

Tokenization packages and transfers operator risk. It does not remove it.

## The Operator-Vetting Question Is Still Open

Silicon's FarmGPU and Pantheon pages say it maintains "strict standards" for network providers. FarmGPU is also validated under RunPod Secure Cloud standards. But Silicon publishes no provider underwriting standard, financial test, minimum track record, performance bond, verification method, or procedure for confirming that a provider can deploy and remit cash flows.

The missing public answer is not who runs the cluster; the docs clearly assign that to the operator. It is how Silicon gets comfortable placing pool or buyer capital behind that operator.

## Documentation Conflicts / Drift

- The current homepage says Silicon itself owns and operates clusters with a 99.9% SLA; the tokenization docs center third-party providers and describe a 95% minimum provider commitment.
- Terms say Silicon is not party to owner-provider agreements; pool-token docs describe standardized agreements among Silicon, owners, and providers. These may refer to different product routes, but the boundary is not explained.
- Silicon calls the history "verified" and "auditable," while the operational docs show data arriving through operator-configured marketplace APIs or CSV.
- Partner documentation still describes a `$SIL` burn/mint economy, while Silicon's January 2026 Terms say `$SIL` may launch in the future and current cash flows settle in USDC. Treat the partner description as stale.
- Product copy alternates among one NFT per GPU, one NFT per server, and "fractional ownership through NFTs"; the clean fractional instrument is actually the ERC-20 pool token.

## Outreach Implication

The precise follow-up to McDavid is:

> Not exactly. I'm asking from the capital side. For something like Cluster 01, FarmGPU deploys and operates the hardware while the pool funds it. Before Silicon deploys that capital, how do you get comfortable with FarmGPU as the operator?

This asks about Silicon's real risk-management role without assuming it operates every cluster, endorses every provider, or leaves all diligence to retail buyers.

## Sources

- [Live Silicon homepage](https://silicon.net/)
- [About Silicon](https://docs.silicon.net/)
- [Provider dashboard documentation](https://docs.silicon.net/provider-overview)
- [Owner dashboard documentation](https://docs.silicon.net/owner-overview)
- [Pool token overview](https://docs.silicon.net/pool-token-overview)
- [Provider NFT and pre-sale workflow](https://docs.silicon.net/provider-pages-dropdown/nfts)
- [Silicon Terms of Use](https://silicon.net/terms-of-service)
- [Cluster 00 performance review](https://silicon.net/blog/cluster-00-performance-review)
- [Cluster 01 pre-deposit announcement](https://silicon.net/blog/cluster01)
- [FarmGPU provider profile](https://silicon.net/providers/farmgpu)
- [Pantheon Compute provider profile](https://silicon.net/providers/pantheon-compute)

## Promoted

- [[gpu-tokenization-makes-ownership-auditable-not-operator-performance-true|GPU tokenization makes ownership auditable, not operator performance true]]
- [[silicon-network|Silicon Network]]

