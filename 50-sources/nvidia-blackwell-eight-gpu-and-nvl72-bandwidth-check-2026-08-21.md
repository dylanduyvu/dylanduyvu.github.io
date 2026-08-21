---
type: source
status: captured
created: 2026-08-21
updated: 2026-08-21
source_date: 2026-08-21
source_type: official-documentation-check
domains: [inference, model-serving, gpu-interconnects, ai-infrastructure]
people: []
orgs: [nvidia]
tags: [nvlink, nvswitch, blackwell, nvl72, gpu-bandwidth, model-parallelism]
---

# NVIDIA: Blackwell eight-GPU and NVL72 bandwidth check

## Research Prompt

A private research discussion asked how an eight-GPU Blackwell NVLink system compares with an NVL72 rack. This note omits the participants and private channel details.

The specific questions were:

- Does an NVL72 give each GPU more bandwidth than an eight-GPU system?
- Is 130 TB/s the bandwidth available to one GPU?
- Does an NVL72 remove the communication penalty when a model uses more than eight GPUs?

## Direct Evidence

### Eight-GPU DGX B200

[NVIDIA's DGX B200 user guide](https://docs.nvidia.com/dgx/dgxb200-user-guide/introduction-to-dgxb200.html) specifies eight B200 GPUs and two fifth-generation NVLink switches. It lists 14.4 TB/s of aggregate NVLink bandwidth for the system.

Dividing 14.4 TB/s by eight GPUs gives 1.8 TB/s of bidirectional NVLink bandwidth per GPU.

### GB200 NVL72

[NVIDIA's GB200 NVL72 page](https://www.nvidia.com/en-us/data-center/gb200-nvl72/) specifies 72 Blackwell GPUs in one NVLink domain. It lists 130 TB/s of total NVLink bandwidth and 1.8 TB/s of GPU interconnect bandwidth.

[NVIDIA's rack-scheduling technical note](https://developer.nvidia.com/blog/achieving-peak-system-and-workload-efficiency-on-nvidia-gb200-nvl72-with-slurm-block-scheduling/) states the relationship directly: 1.8 TB/s of bidirectional throughput per GPU and 130 TB/s of aggregate bandwidth for the rack. It also states that traffic outside the NVLink domain crosses InfiniBand or Ethernet and has much lower bandwidth.

[NVIDIA's multi-node tuning guide](https://docs.nvidia.com/multi-node-nvlink-systems/multi-node-tuning-guide/overview.html) states that the main change is the size of the NVLink domain. Earlier systems connected up to eight GPUs in one domain. GB200 NVL72 connects up to 72 GPUs at 1.8 TB/s per GPU.

## Terminology Correction

- **Intra-node** means communication inside one compute node.
- **Inter-node** means communication between compute nodes.
- **Per-GPU bandwidth** is the total bandwidth that one GPU can send and receive through its NVLink interfaces.
- **Aggregate bandwidth** is the sum of the interface bandwidth across all GPUs. It is not bandwidth that one GPU can use by itself.

The 1.8 TB/s figure is not a separate 1.8 TB/s private channel from one GPU to each of the other 71 GPUs. One GPU's simultaneous transfers share that GPU's total interface bandwidth. NVSwitch provides the non-blocking fabric that lets all GPUs use the domain without an eight-GPU boundary.

## Supported Interpretation

An eight-GPU Blackwell system and an NVL72 can have the same fifth-generation NVLink bandwidth per GPU. The NVL72 advantage is that the fast domain includes 72 GPUs instead of eight. A model can therefore use more than eight GPUs without moving its main GPU-to-GPU traffic to the slower external cluster network.

This does not mean that one request becomes nine times faster. If a model and its communication fit within eight GPUs, an NVL72 does not automatically improve the latency of that request. The larger domain can help when the serving plan uses more than eight GPUs for tensor parallelism, expert parallelism, pipeline parallelism, a larger key-value cache, or higher concurrent demand.

Rate limits can control queueing and customer demand. They do not remove the communication needed for one request when the model is divided across several GPUs.

## Evidence Boundary

The hardware specifications define theoretical limits. They do not establish achieved model throughput, latency, cost per token, or profit. Those results depend on the model architecture, precision, parallelism method, serving engine, kernels, prompt and output lengths, cache use, batch size, concurrency, and software quality.

## Links

- [[nvl72-expands-the-fast-gpu-domain-not-the-bandwidth-of-each-blackwell-gpu|NVL72 expands the fast GPU domain, not the bandwidth of each Blackwell GPU]]
- [[first-five-inference-customers-plan|First Five Inference Customers Plan]]
- [[inference|Inference]]
