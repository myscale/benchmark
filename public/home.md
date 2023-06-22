# MyScale Vector Database Benchmark 🚀

Welcome to the MyScale Vector Database Benchmark website. We present an exhaustive and replicable analysis of various vector database services. We, at [MyScale](https://myscale.com), firmly believe in transparency and fostering a trustful relationship with our users.

## What to Expect 🧐

In this benchmark, we gauge the performance based on the following metrics:

- **Search Speed**: Vector search throughput and latency at varying precision levels.
- **Data Handling**: Upload pace and index building speed.
- **Cost Analysis**: Value for your buck.

## Our Promise of Transparency 🤝

We are providing access to the entire source code for these benchmark tests, allowing anyone to validate our findings or even carry out the tests on different hardware. Explore the benchmark framework on our [GitHub repository](https://github.com/myscale/vector-db-benchmark), and get the source code for this website on [this repository](https://github.com/myscale/benchmark). Be a part of this benchmark - review the code, run the tests, and let the community know!

## The Datasets 📊

We have employed the following datasets for an insightful analysis:

| Dataset Name | Description | Number of Vectors | Number of Queries | Dimension | Distance | Filters | Payload Columns | Download Link |
|--------------|-------------|-------------------|-------------------|-----------|----------|---------|-----------------|---------------|
| laion-768-5m-ip | Derived from [LAION 2B images](https://huggingface.co/datasets/laion/laion2b-multi-vit-h-14-embeddings/tree/main). | 5,000,000 | 10,000 | 768 | IP | N/A | 0 | [Link](https://myscale-datasets.s3.ap-southeast-1.amazonaws.com/laion-5m-test-ip.hdf5) |
| laion-768-5m-probability | Derived from [LAION 2B images](https://huggingface.co/datasets/laion/laion2b-multi-vit-h-14-embeddings/tree/main). | 5,000,000 | 10,000 | 768 | IP | Ratio 0.01 | `[probability (Float64)]` | [Vectors](https://myscale-datasets.s3.ap-southeast-1.amazonaws.com/laion-768-5m-ip-probability.hdf5) [Queries](https://myscale-datasets.s3.ap-southeast-1.amazonaws.com/laion-768-5m-ip-probability-0.01.hdf5) |
| laion-768-5m-probability | Derived from [LAION 2B images](https://huggingface.co/datasets/laion/laion2b-multi-vit-h-14-embeddings/tree/main). | 5,000,000 | 10,000 | 768 | IP | Ratio 0.1 | `[probability (Float64)]` | [Vectors](https://myscale-datasets.s3.ap-southeast-1.amazonaws.com/laion-768-5m-ip-probability.hdf5) [Queries](https://myscale-datasets.s3.ap-southeast-1.amazonaws.com/laion-768-5m-ip-probability-0.1.hdf5) |

**Note**: The `probability` column stores random floats from a uniform distribution `[0, 1]`. Ratio 0.01 implies that the query encompasses `dataset_size * 0.01` range.

## Contenders and Setup 🥊

Let’s peek into the specs and costs of the cloud services we’ve put to the test.

| Service | Pod Type | Monthly Cost ($) | Notes |
|---------|----------|------------------|-------|
| MyScale | Standard Pod | 120 | Beta users are eligible for a free trial. Larger pods coming soon. |
| Pinecone | s1.x1 | 80 | Optimized for storage. |
| Pinecone | 5 x p2.x1 | 600 | Performance-optimized via horizontal scaling. |
| Qdrant | 4C 32G | 273 | Utilizes HNSW algorithm. |
| Weaviate | SLA Tier: Standard | 690 | Pricing for the laion-768-5m-ip dataset, assuming a consistent 5 queries per second. |
| Zilliz | Capacity-optimized 1 CU | 114 | Price reduced from $186 to $114 as of June 14, 2023. |
| Zilliz | Performance-optimized 4 CU | 458 | Price reduced from $746 to $458 as of June 14, 2023. |
| Zilliz | Cost-optimized 1 CU | 77 | We could not test this pod until June 16, 2023, due to an "Insufficient Memory" error during data loading. |

To ensure a fair play, we operate the client (`c4.xlarge`) in the same region as the cloud service to keep networking interference to a minimum.

| Service | Server Region | Client Region |
|---------|---------------|---------------|
| MyScale | AWS us-east-1 | AWS us-east-1 |
| Pinecone | AWS us-east-1 | AWS us-east-1 |
| Qdrant | AWS us-east-1 | AWS us-east-1 |
| Weaviate | GCP US East | AWS us-east-1 |
| Zilliz | AWS us-east-2 | AWS us-east-2 |
