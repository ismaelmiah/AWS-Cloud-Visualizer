export type McqOption = { id: string; text: string };

export type McqQuestion = {
  id: string;
  prompt: string;
  options: McqOption[];
  correctOptionId: string;
};

const Q = (
  id: string,
  prompt: string,
  correct: string,
  wrong: [string, string, string]
): McqQuestion => ({
  id,
  prompt,
  correctOptionId: "a",
  options: [
    { id: "a", text: correct },
    { id: "b", text: wrong[0] },
    { id: "c", text: wrong[1] },
    { id: "d", text: wrong[2] },
  ],
});

/** Placeholder MCQs — enough to exercise scoring + checkpoint PATCH. */
const QUIZZES: Record<string, McqQuestion[]> = {
  iam: [
    Q(
      "iam-1",
      "What is the recommended way for an application running on EC2 to access AWS APIs?",
      "Attach an IAM role to the instance and use temporary credentials from the instance metadata",
      [
        "Embed long-lived access keys in the application code",
        "Share the root account password with the operations team",
        "Disable MFA on the IAM user used by the application",
      ]
    ),
    Q(
      "iam-2",
      "Which statement about IAM policies is most accurate?",
      "Policies are JSON documents that define permissions and can be attached to users, groups, or roles",
      [
        "Policies can only be attached to individual IAM users",
        "IAM policies are always managed by AWS and cannot be customized",
        "A deny in one policy can be overridden by an allow in another policy for the same action",
      ]
    ),
  ],
  ec2: [
    Q(
      "ec2-1",
      "Which purchase option gives the deepest discount for steady-state workloads with flexible timing?",
      "Spot Instances",
      [
        "On-Demand Instances",
        "Dedicated Hosts",
        "Capacity Reservations only (no instances)",
      ]
    ),
    Q(
      "ec2-2",
      "What does an EC2 security group primarily control?",
      "Stateful traffic rules at the instance elastic network interface level",
      [
        "Object-level permissions in S3",
        "DNS routing weights in Route 53",
        "Subnet route table propagation to on-premises",
      ]
    ),
  ],
  "elb-asg": [
    Q(
      "elb-1",
      "When using an Application Load Balancer, at which layer does it primarily route traffic?",
      "Layer 7 (HTTP/HTTPS)",
      ["Layer 4 TCP/UDP only", "Layer 3 IP only", "Email (SMTP) only"]
    ),
    Q(
      "elb-2",
      "What does an Auto Scaling group use to decide when to replace unhealthy instances?",
      "Health checks (ELB and/or EC2 status checks, depending on configuration)",
      [
        "Only the instance CPU average over 24 hours",
        "Manual approval from an SNS topic",
        "S3 object replication lag",
      ]
    ),
  ],
  "rds-aurora-elasticache": [
    Q(
      "rds-1",
      "What is a key benefit of Amazon Aurora compared to a single-AZ RDS deployment for many workloads?",
      "Storage auto-scaling and fast failover with Aurora replicas in the same region",
      [
        "Aurora removes the need for any VPC",
        "Aurora only supports document databases",
        "Aurora cannot span multiple Availability Zones",
      ]
    ),
    Q(
      "rds-2",
      "When is ElastiCache most appropriate?",
      "Offload read-heavy or session workloads from a primary database to an in-memory store",
      [
        "Replace a relational schema with cold archival tape storage",
        "Host static website content at the edge",
        "Store multi-GB video files as primary system of record",
      ]
    ),
  ],
  route53: [
    Q(
      "r53-1",
      "Route 53 is primarily used for which concern?",
      "DNS routing and health-checked failover",
      ["Block storage for EC2", "Container image scanning", "VPC flow log analysis"]
    ),
    Q(
      "r53-2",
      "Which routing policy sends all traffic to one resource unless it fails a health check?",
      "Failover routing",
      [
        "Simple routing with weighted aliases only",
        "Geolocation routing without health checks",
        "Multivalue answer without health checks",
      ]
    ),
  ],
  s3: [
    Q(
      "s3-1",
      "What is a best practice for restricting access to sensitive objects in S3?",
      "Use least-privilege IAM and bucket policies; avoid public ACLs unless truly required",
      [
        "Make the bucket public-read for easier debugging",
        "Store access keys in the bucket metadata",
        "Disable versioning on all buckets containing regulated data",
      ]
    ),
    Q(
      "s3-2",
      "S3 Standard-IA is most appropriate when:",
      "Objects are accessed infrequently but need millisecond access when requested",
      [
        "Objects are never read after write",
        "You require sub-millisecond latency for every request globally",
        "You only store database transaction logs under 1 KB each",
      ]
    ),
  ],
  "cloudfront-global-accelerator": [
    Q(
      "cf-1",
      "CloudFront primarily improves which user-facing property?",
      "Latency and throughput for cached or edge-terminated content",
      [
        "Primary relational database write throughput inside a single AZ",
        "IAM policy evaluation speed in the AWS console only",
        "EBS volume IOPS for a single attached instance",
      ]
    ),
    Q(
      "cf-2",
      "AWS Global Accelerator improves routing by:",
      "Advertising static Anycast IPs and routing over the AWS global network to healthy endpoints",
      [
        "Replacing DNS entirely in all hybrid architectures",
        "Caching SQL query results at the edge",
        "Encrypting objects at rest in S3 automatically",
      ]
    ),
  ],
  "messaging-streaming": [
    Q(
      "msg-1",
      "SQS is best described as:",
      "A managed message queue that decouples producers and consumers",
      ["A relational database engine", "A DNS service", "A block storage volume"]
    ),
    Q(
      "msg-2",
      "Amazon Kinesis Data Streams is commonly used for:",
      "Ingesting and processing streaming data at scale with shards",
      [
        "Batch COBOL compilation on mainframes",
        "Static website hosting without HTTP",
        "Long-term tape archival only",
      ]
    ),
  ],
  "containers-eks": [
    Q(
      "ctr-1",
      "Amazon ECS tasks run on:",
      "ECS container instances or Fargate compute, as defined by the capacity provider",
      [
        "Bare-metal Outposts only, with no networking",
        "CloudFront edge locations exclusively",
        "RDS instances as the primary scheduler",
      ]
    ),
    Q(
      "ctr-2",
      "Amazon EKS is:",
      "A managed Kubernetes control plane integrated with AWS networking and IAM",
      [
        "A serverless SQL query engine",
        "A managed email sending service",
        "A hardware security module appliance",
      ]
    ),
  ],
  databases: [
    Q(
      "db-1",
      "When choosing between RDS and DynamoDB, a key axis is:",
      "Relational model + complex joins vs. key-value/document access patterns at massive scale",
      [
        "Both only support graph queries",
        "DynamoDB cannot be used from Lambda",
        "RDS cannot be deployed in a VPC",
      ]
    ),
    Q(
      "db-2",
      "Amazon Redshift is best categorized as:",
      "A data warehouse for analytics workloads (OLAP-style)",
      ["A primary OLTP store for high-frequency row updates", "A message queue", "A DNS firewall"]
    ),
  ],
  "data-analytics": [
    Q(
      "da-1",
      "In a typical data lake pattern on AWS, raw and curated datasets often land in:",
      "Amazon S3, with metadata in a catalog such as AWS Glue Data Catalog",
      [
        "EC2 instance ephemeral storage only",
        "CloudFront edge caches as system of record",
        "Route 53 hosted zones",
      ]
    ),
    Q(
      "da-2",
      "AWS Glue is commonly used for:",
      "Serverless ETL and data cataloging integrated with the data lake",
      [
        "Provisioning hardware VPN devices",
        "Managing Kubernetes pod scheduling only",
        "Authoring IAM policies exclusively",
      ]
    ),
  ],
  "machine-learning": [
    Q(
      "ml-1",
      "Amazon SageMaker is primarily:",
      "A managed platform for building, training, and deploying ML models",
      ["A DNS service", "A relational database", "A block storage tier for EC2"]
    ),
    Q(
      "ml-2",
      "For many exam scenarios, choosing SageMaker vs. DIY on EC2 often comes down to:",
      "Managed pipelines, notebooks, and deployment vs. full operational ownership",
      [
        "SageMaker cannot access data in S3",
        "EC2 cannot run GPU instances",
        "Both require identical networking to IoT Core",
      ]
    ),
  ],
  "observability-governance": [
    Q(
      "obs-1",
      "AWS CloudTrail is primarily used to:",
      "Record API activity and deliver an audit trail for governance and security",
      [
        "Collect EC2 memory metrics every second",
        "Cache HTTP responses at the edge",
        "Replace VPC flow logs in all cases",
      ]
    ),
    Q(
      "obs-2",
      "AWS Config helps teams:",
      "Assess resource configuration compliance over time and react to changes",
      [
        "Accelerate TLS handshakes globally",
        "Automatically patch OS packages on EC2 without SSM",
        "Replace CloudWatch Logs for application stdout",
      ]
    ),
  ],
  "security-edge": [
    Q(
      "sec-1",
      "AWS KMS is used to:",
      "Create and control encryption keys used by AWS services and your applications",
      [
        "Replace IAM for authentication",
        "Host static websites",
        "Route traffic between subnets without a router",
      ]
    ),
    Q(
      "sec-2",
      "AWS WAF is placed in front of:",
      "Application Load Balancer, API Gateway, CloudFront, or AppSync to filter web requests",
      [
        "RDS read replicas only",
        "EBS volumes directly",
        "S3 Glacier vault locks exclusively",
      ]
    ),
  ],
  vpc: [
    Q(
      "vpc-1",
      "A private subnet is typically characterized by:",
      "No direct route to an Internet Gateway; outbound internet via NAT Gateway/Instance or none",
      [
        "Mandatory public IP on every instance",
        "No route tables allowed",
        "Cannot contain RDS instances",
      ]
    ),
    Q(
      "vpc-2",
      "VPC peering allows:",
      "Private IP routing between two VPCs (with non-overlapping CIDR considerations)",
      [
        "Automatic transitive routing across three or more peered VPCs by default",
        "Merging two VPCs into one shared default security group",
        "Public internet access without an IGW",
      ]
    ),
  ],
  "dr-migrations": [
    Q(
      "dr-1",
      "The AWS Well-Architected Reliability pillar encourages defining:",
      "Recovery objectives (RTO/RPO) and failure modes before choosing DR patterns",
      [
        "Only cost budgets with no availability targets",
        "Single-AZ architectures for all production data",
        "Disabling backups to reduce storage noise",
      ]
    ),
    Q(
      "dr-2",
      "AWS Application Migration Service (MGN) is commonly used to:",
      "Lift-and-shift rehost of physical/virtual servers to EC2 with block-level replication",
      [
        "Replace all databases with DynamoDB automatically",
        "Migrate DNS only without workloads",
        "Encrypt S3 buckets using client-side keys only",
      ]
    ),
  ],
};

export function getMcqsForService(serviceId: string): McqQuestion[] {
  return QUIZZES[serviceId] ?? [
    Q("gen-1", "Which AWS pillar emphasizes least privilege and detective controls?", "Security", [
      "Ignoring encryption at rest",
      "Disabling logging to save costs in production",
      "Using a single shared IAM user for all teams",
    ]),
  ];
}
