# MyScale Vector Database Benchmark 🚀

Welcome to the MyScale Vector Database Benchmark website. We present an exhaustive and replicable analysis of various vector database services. We, at [MyScale](https://myscale.com), firmly believe in transparency and fostering a trustful relationship with our users.

## Update 🔍

- March 8, 2024: Add results of ElasticSearch Cloud v8.12.2
  [#12](https://github.com/myscale/benchmark/pull/12)
- Jan 19, 2024: Add results of Weaviate v1.23.3 (huge performance improvement)
  [#11](https://github.com/myscale/benchmark/pull/11)
- Jan 15, 2024: Add results of OpenSearch v2.11
  [#8](https://github.com/myscale/benchmark/pull/8)
- Nov 6, 2023: Re-test pgvecto.rs according to Allen's [advice](https://twitter.com/zhoujinjing09/status/1717388692434911278)
  [#7](https://github.com/myscale/benchmark/pull/7)
- Oct 10, 2023: Add results for pgvector, pgvecto.rs, and OpenSearch
- Sep 6, 2023: Add results for cost-optimized pods of Zilliz
  [#3](https://github.com/myscale/benchmark/pull/3)
- June 22, 2023: Add benchmark for filtered vector search
  [#2](https://github.com/myscale/benchmark/pull/2)
- May 30, 2023: Release the first version

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

| Database | Pod Type | Monthly Cost ($) | Notes |
|---------|----------|------------------|-------|
| [MyScale](https://myscale.com/) | Standard Pod of Size x1 | 120 |  |
| [Pinecone](https://www.pinecone.io/) | s1.x1 | 80 | Optimized for storage. |
| [Pinecone](https://www.pinecone.io/) | 5 x p2.x1 | 600 | Performance-optimized via horizontal scaling. |
| [Qdrant](https://qdrant.tech/) | 4C 32G | 273 | Utilizes HNSW algorithm. |
| [Weaviate](https://weaviate.io/) | SLA Tier: Standard | 364.8 | Results updated on Jan 19, 2024. |
| [Zilliz](https://zilliz.com) | Capacity-optimized 1 CU | 114 | Price reduced from $186 to $114 as of June 14, 2023. |
| [Zilliz](https://zilliz.com) | Performance-optimized 4 CU | 458 | Price reduced from $746 to $458 as of June 14, 2023. |
| [Zilliz](https://zilliz.com) | Cost-optimized 1 CU | 77 | Added on Sep 6, 2023. |
| Postgres with [pgvector](https://github.com/pgvector/pgvector) | [db.r6g.xlarge](https://instances.vantage.sh/aws/rds/db.r6g.xlarge?region=us-east-1&os=PostgreSQL&cost_duration=monthly&reserved_term=Standard.partialUpfront) (4C 32GB) | 329 | Amazon RDS for PostgreSQL |
| Postgres [pgvecto.rs](https://github.com/tensorchord/pgvecto.rs) | [db.r6g.xlarge](https://instances.vantage.sh/aws/rds/db.r6g.xlarge?region=us-east-1&os=PostgreSQL&cost_duration=monthly&reserved_term=Standard.partialUpfront) (4C 32GB) | 329 | Amazon RDS for PostgreSQL |
| [AWS OpenSearch Service](https://aws.amazon.com/opensearch-service/) | [r6g.2xlarge.search](https://instances.vantage.sh/aws/opensearch/r6g.2xlarge.search?region=us-east-1&cost_duration=monthly&reserved_term=Standard.noUpfront) (8C 64GB) | 488 | Amazon OpenSearch Service domain |
| [Elastic Cloud](https://cloud.elastic.co/home) |  aws.es.datahot.r6gd (3.9vCPU 30GB) | 982.80 | Elastic Cloud (Enterprise subscription) |

To ensure a fair play, we operate the client (`c4.xlarge`) in the same region as the cloud service to keep networking interference to a minimum.

| Service | Server Region | Client Region |
|---------|---------------|---------------|
| MyScale | AWS us-east-1 | AWS us-east-1 |
| Pinecone | AWS us-east-1 | AWS us-east-1 |
| Qdrant | AWS us-east-1 | AWS us-east-1 |
| Weaviate | GCP US East | AWS us-east-1 |
| Zilliz | AWS us-east-2 | AWS us-east-2 |
| PGVector | AWS us-east-2 | AWS us-east-2 |
| PGVecto.rs | AWS us-east-2 | AWS us-east-2 |
| OpenSearch | AWS us-east-2 | AWS us-east-2 |
| Elastic Cloud | AWS us-east-2 | AWS us-east-2 |
