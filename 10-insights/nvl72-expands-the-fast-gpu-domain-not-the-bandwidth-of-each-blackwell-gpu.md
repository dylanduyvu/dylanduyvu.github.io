---
type: insight
status: active
created: 2026-08-21
updated: 2026-08-21
domains: [inference, model-serving, gpu-interconnects, ai-infrastructure]
people: []
orgs: [nvidia]
tags: [nvlink, nvswitch, blackwell, nvl72, gpu-bandwidth, model-parallelism]
---

# NVL72 expands the fast GPU domain, not the bandwidth of each Blackwell GPU

## Claim

An eight-GPU B200 system and a GB200 NVL72 can each provide up to 1.8 TB/s of bidirectional fifth-generation NVLink bandwidth per GPU. The NVL72 does not give one GPU 130 TB/s. It expands the fast NVLink domain from eight GPUs to 72 GPUs. Its 130 TB/s figure is aggregate bandwidth across the rack.

## Why It Matters

This distinction changes the minimum-hardware question for inference. An NVL72 can keep a model that uses more than eight GPUs inside one fast communication domain. But it does not automatically make a model faster or more profitable when the model already fits and communicates efficiently inside eight GPUs.

## Evidence

- NVIDIA lists eight B200 GPUs and 14.4 TB/s of aggregate NVLink bandwidth for DGX B200.
- NVIDIA lists 72 Blackwell GPUs, 1.8 TB/s per GPU, and 130 TB/s of aggregate bandwidth for GB200 NVL72.
- NVIDIA states that communication outside the NVL72 domain crosses a much slower InfiniBand or Ethernet boundary.

See [[nvidia-blackwell-eight-gpu-and-nvl72-bandwidth-check-2026-08-21|the official NVIDIA documentation check]].

## Implications

- Model fit is not proof of competitive serving. An eight-GPU node must still pass measured latency, throughput, cost, and reliability tests.
- A 72-GPU domain matters most when one service instance needs more than eight GPUs or when wider model parallelism produces a better measured result.
- Mixture-of-experts models can benefit from a larger fast domain because tokens and expert outputs can move between GPUs. The size of the benefit is model- and software-specific.
- Rate limits control concurrency and queueing. They do not reduce the GPU-to-GPU communication required by one sharded request.
- The correct comparison is an achieved price and performance curve for the same model and workload, not 14.4 TB/s versus 130 TB/s by itself.

## Counterpoints / Uncertainty

NVLink and NVSwitch specifications are maximum hardware figures. Actual results depend on topology, communication patterns, collective operations, serving software, quantization, cache use, batch size, prompt length, output length, and concurrency. NVIDIA's model-performance claims are vendor benchmarks and do not replace an independent serving test.

## Links

- [[first-five-inference-customers-plan|First Five Inference Customers Plan]]
- [[inference|Inference]]

## Updates

- 2026-08-21: Created from an official NVIDIA documentation check after a private technical discussion confused per-GPU bandwidth with aggregate rack bandwidth.
