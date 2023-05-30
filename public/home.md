# MyScale Vector Database Benchmark

Welcome to the [MyScale](https://myscale.com) Vector Database Benchmark website. Our aim is to offer a thorough, unbiased, and reproducible comparison of various vector database services. As a managed vector database provider, we value transparency and trust for our users, which is why we've created these benchmarks to be impartial and replicable.

In this benchmark, we will assess several performance aspects, such as:

- Vector search throughput and latency at different precisions,
- Upload and index building speed,
- Cost efficiency.

To show our dedication to transparency and reproducibility, we are providing the complete source code for the benchmark tests. This enables anyone to independently confirm our findings and even conduct the tests using their own hardware. The benchmark framework can be found on our [GitHub repository](https://github.com/myscale/vector-db-benchmark), and the source code for this website is available on [this repository](https://github.com/myscale/benchmark). We encourage users to review the code, perform the tests themselves, and share their results with the community.

As the importance of vector databases grows in the field of AI applications, we are pleased to present our findings to you. We believe that by exploring this benchmark, you will obtain the essential information needed to make an informed choice about your vector database requirements.

## Datasets

Datasets that we used:

| Dataset name             | Description                                                                                                          | Number of vectors | Number of queries | Dimension | Distance | Filters                             | Payload columns | Download link                                                                                     |
|--------------------------|----------------------------------------------------------------------------------------------------------------------|-------------------|-------------------|-----------|----------|-------------------------------------|-----------------|---------------------------------------------------------------------------------------------------|
| laion-768-5m-ip          | Generated from [LAION 2B images](https://huggingface.co/datasets/laion/laion2b-multi-vit-h-14-embeddings/tree/main). | 5,000,000         | 10,000            | 768       | IP       | N/A                                 | 0               | [Link](https://myscale-datasets.s3.ap-southeast-1.amazonaws.com/laion-5m-test-ip.hdf5)            |

## Setup

The table below displays the cloud services we have evaluated, along with their specifications and monthly hosting costs.

| Service | Pod Type | Monthly Cost ($) | Remark |
| ------------- | ------------- | -------- | --- |
| MyScale | Standard Pod | 120 | Beta offers a free trial, and larger pods will be available soon. |
| Pinecone | s1.x1 | 80 | Storage optimized |
| Pinecone | 5 x p2.x1 | 600 | Performance optimized with horizontal scaling |
| Qdrant | 4C 32G | 273 | HNSW |
| Weaviate | SLA Tier: Standard | 690 | For the laion-768-5m-ip dataset with monthly queries based on a consistent 5 queries per second. |
| Zilliz | Capacity-optimized 1 CU | 186 | - |
| Zilliz | Performance-optimized 4 CU | 746 | - |

We operate the client (`c4.xlarge`) in the same region as the cloud service to minimize networking influence. The designated regions for each cloud service are as follows:

| Service  | Server Region | Client Region |
|----------|---------------|---------------|
| MyScale  | AWS us-east-1 | AWS us-east-1 |
| Pinecone | AWS us-east-1 | AWS us-east-1 |
| Qdrant   | AWS us-east-1 | AWS us-east-1 |
| Weaviate | GCP US East   | AWS us-east-1 |
| Zilliz   | AWS us-east-2 | AWS us-east-2 |
