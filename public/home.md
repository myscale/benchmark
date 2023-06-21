# MyScale Vector Database Benchmark

Welcome to the [MyScale](https://myscale.com) Vector Database Benchmark website. Our objective is to provide a comprehensive, objective, and reproducible comparison of various vector database services. As a managed vector database provider, we place a premium on our users' transparency and trust, which is why we've designed these benchmarks to be objective and replicable.

In this benchmark, we will evaluate several performance characteristics, including:

- Vector search throughput and latency at different precisions,
- Upload and index building speed,
- Cost efficiency.

To demonstrate our commitment to transparency and reproducibility, we are providing the complete source code for the benchmark tests. This makes it possible for anyone to independently confirm our findings and even conduct the tests using their own hardware. The benchmark framework can be found on our [GitHub repository](https://github.com/myscale/vector-db-benchmark), and the source code for this website is also available on [this repository](https://github.com/myscale/benchmark). We encourage users to review the code, run the tests themselves, and share their findings with the community.

As vector databases become increasingly important for  AI applications, we are excited to share our findings with you. We expect that you will be able to meet your vector database needs with the knowledge you gain from exploring this benchmark.

## Datasets

Datasets that we used:

| Dataset name | Description | Number of vectors | Number of queries | Dimension | Distance | Filters | Payload columns | Download link |
|--------------------------|----------------------------------------------------------------------------------------------------------------------|-------------------|-------------------|-----------|------------|-------------------------------------|-----------------|---------------------------------------------------------------------------------------------------|
| laion-768-5m-ip          | Generated from [LAION 2B images](https://huggingface.co/datasets/laion/laion2b-multi-vit-h-14-embeddings/tree/main). | 5,000,000         | 10,000            | 768       | IP       | N/A                                 | 0               | [Link](https://myscale-datasets.s3.ap-southeast-1.amazonaws.com/laion-5m-test-ip.hdf5)            |
| laion-768-5m-probability | Generated from [LAION 2B images](https://huggingface.co/datasets/laion/laion2b-multi-vit-h-14-embeddings/tree/main). | 5,000,000         | 10,000            | 768       | IP       | ratio 0.01                                 | [`probability: Float64`]             | [train](https://myscale-datasets.s3.ap-southeast-1.amazonaws.com/laion-768-5m-ip-probability.hdf5) [test](https://myscale-datasets.s3.ap-southeast-1.amazonaws.com/laion-768-5m-ip-probability-0.01.hdf5)           |
| laion-768-5m-probability | Generated from [LAION 2B images](https://huggingface.co/datasets/laion/laion2b-multi-vit-h-14-embeddings/tree/main). | 5,000,000         | 10,000            | 768       | IP       | ratio 0.1                                 | [`probability: Float64`]             | [train](https://myscale-datasets.s3.ap-southeast-1.amazonaws.com/laion-768-5m-ip-probability.hdf5) [test](https://myscale-datasets.s3.ap-southeast-1.amazonaws.com/laion-768-5m-ip-probability-0.1.hdf5)           |

Description of the filter ratio
- ratio 0.01 indicates that the query will be performed within the range of dataset_size * 0.01

## Setup

The table below compares the cloud services we have evaluated, along with their specifications and monthly hosting fees.

| Service | Pod Type | Monthly Cost ($) | Remark |
| ------------- | ------------- | -------- | --- |
| MyScale | Standard Pod | 120 | Beta offers a free trial, and larger pods will be available soon. |
| Pinecone | s1.x1 | 80 | Storage optimized |
| Pinecone | 5 x p2.x1 | 600 | Performance optimized with horizontal scaling |
| Pinecone | 1 x p2.x4 | 480 | Performance optimized with horizontal scaling |
| Qdrant | 4C 32G | 273 | HNSW |
| Weaviate | SLA Tier: Standard | 690 | For the laion-768-5m-ip dataset with monthly queries based on a consistent 5 queries per second. |
| Zilliz | Capacity-optimized 1 CU | 114 | The cost dropped from $186 to $114 on June 14th, 2023 |
| Zilliz | Performance-optimized 4 CU | 458 | The cost dropped from $746 to $458 on June 14th, 2023 |
| Zilliz | Cost-optimized 1 CU | 77 | Unfortunately, we are unable to test this pod until June 16th, 2023, as we encounter an "Insufficient Memory" error from the server when loading the laion-768-5m-ip dataset. |

We operate the client (`c4.xlarge`) in the same region as the cloud service to minimize networking interference. The designated regions for each cloud service are as follows:

| Service  | Server Region | Client Region |
|----------|---------------|---------------|
| MyScale  | AWS us-east-1 | AWS us-east-1 |
| Pinecone | AWS us-east-1 | AWS us-east-1 |
| Qdrant   | AWS us-east-1 | AWS us-east-1 |
| Weaviate | GCP US East   | AWS us-east-1 |
| Zilliz   | AWS us-east-2 | AWS us-east-2 |
