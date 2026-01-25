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

/** MCQs keyed by `serviceId` for preparation topic pages + checkpoints. */
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
  kms: [
    Q(
      "kms-1",
      "What is the primary purpose of AWS KMS?",
      "Create and control encryption keys used by AWS services and your applications",
      [
        "Replace IAM for authentication to the AWS Management Console",
        "Host relational databases with encryption",
        "Provide a global CDN for encrypted objects",
      ]
    ),
    Q(
      "kms-2",
      "How does KMS typically relate to IAM for data encryption?",
      "IAM controls who may use which key operations; key policies also control key access",
      [
        "IAM is unrelated to KMS; only bucket policies apply",
        "KMS automatically grants all IAM users decrypt without policies",
        "KMS replaces the need for any IAM roles on EC2",
      ]
    ),
  ],
  vpc: [
    Q(
      "vpc-1",
      "A private subnet is typically characterized by:",
      "No direct route to an Internet Gateway; outbound internet via NAT or none",
      [
        "Every instance must have a public Elastic IP",
        "Security groups cannot be applied in private subnets",
        "Private subnets cannot contain RDS instances",
      ]
    ),
    Q(
      "vpc-2",
      "What is the main difference between security groups and network ACLs?",
      "Security groups are stateful and associated with ENIs; NACLs are stateless and subnet-level",
      [
        "Security groups apply only to S3 buckets",
        "NACLs are stateful; security groups are stateless",
        "Neither can filter traffic in a VPC",
      ]
    ),
  ],
  ec2: [
    Q(
      "ec2-1",
      "Which purchase option gives the deepest discount for interruptible workloads?",
      "Spot Instances",
      [
        "On-Demand Instances",
        "Dedicated Hosts without reservations",
        "Reserved Instances for 1 hour",
      ]
    ),
    Q(
      "ec2-2",
      "What does an Auto Scaling group use to replace unhealthy instances?",
      "Health checks (ELB and/or EC2 status checks, depending on configuration)",
      [
        "Only manual CLI approval",
        "S3 object last-modified timestamps",
        "Route 53 query volume alone",
      ]
    ),
  ],
  lambda: [
    Q(
      "lambda-1",
      "Lambda billing is primarily based on:",
      "Invocations and GB-seconds of compute (and request count), not idle provisioned servers",
      [
        "Always a fixed monthly fee per function regardless of use",
        "Only outbound data transfer to the internet",
        "EC2 instance hours backing each function",
      ]
    ),
    Q(
      "lambda-2",
      "A common exam pattern for Lambda is:",
      "Event sources (S3, API Gateway, streams) invoke functions without you managing servers",
      [
        "Lambda cannot be triggered by other AWS services",
        "Lambda requires a dedicated VPC for all workloads",
        "Lambda replaces Route 53 as a DNS service",
      ]
    ),
  ],
  "ecs-fargate": [
    Q(
      "ecs-1",
      "When is Fargate often preferred over EC2-backed ECS?",
      "When you want AWS to manage the underlying host patching/capacity for tasks",
      [
        "When you require direct SSH to every host for compliance",
        "When you must pin tasks to bare-metal only",
        "When you cannot use container images",
      ]
    ),
    Q(
      "ecs-2",
      "ECS tasks need IAM permissions to call AWS APIs. A typical pattern is:",
      "Attach a task IAM role (task role) referenced in the task definition",
      [
        "Store IAM user access keys in the container image",
        "Use the root account for all task API calls",
        "Disable IAM for tasks inside a VPC",
      ]
    ),
  ],
  s3: [
    Q(
      "s3-1",
      "S3 Standard-IA is most appropriate when:",
      "Objects are accessed infrequently but need millisecond access when requested",
      [
        "Objects are never read after write",
        "You need sub-millisecond latency globally for every object",
        "You only store secrets smaller than 1 KB",
      ]
    ),
    Q(
      "s3-2",
      "A best practice for restricting access to sensitive objects in S3 is:",
      "Least-privilege IAM and bucket policies; avoid public ACLs unless truly required",
      [
        "Make buckets public-read for easier debugging",
        "Store IAM access keys in object metadata",
        "Disable versioning on all regulated-data buckets",
      ]
    ),
  ],
  ebs: [
    Q(
      "ebs-1",
      "EBS snapshots are commonly used for:",
      "Point-in-time backups and copying volumes across AZs or Regions for DR",
      [
        "Replacing security groups on an ENI",
        "DNS failover configuration in Route 53",
        "Encrypting data in transit to CloudFront",
      ]
    ),
    Q(
      "ebs-2",
      "Choosing gp3 vs io2 often comes down to:",
      "Baseline IOPS/throughput needs and cost vs. provisioned performance",
      [
        "Whether the volume must be public on the internet",
        "Whether the instance runs Windows vs Linux only",
        "Whether the bucket uses versioning",
      ]
    ),
  ],
  efs: [
    Q(
      "efs-1",
      "EFS is best suited for:",
      "Shared POSIX file access from many Linux instances concurrently",
      [
        "A single-instance root volume replacement only",
        "Object storage for static websites",
        "Relational joins across petabytes",
      ]
    ),
    Q(
      "efs-2",
      "Compared to EBS, EFS is:",
      "A regional NFS-style file system; EBS is block storage attached to one instance (typically)",
      [
        "Always cheaper than S3 for archival",
        "Only available inside Lambda without a VPC",
        "Identical to instance store",
      ]
    ),
  ],
  "rds-aurora": [
    Q(
      "rds-1",
      "Multi-AZ RDS is primarily about:",
      "High availability and automated failover within a Region for the primary instance",
      [
        "Global read scaling without replicas",
        "Replacing backups entirely",
        "Public internet hosting for the database endpoint",
      ]
    ),
    Q(
      "rds-2",
      "Read replicas help by:",
      "Offloading read traffic from the primary and enabling scaling reads horizontally",
      [
        "Automatically making writes synchronous across all Regions",
        "Eliminating the need for backups",
        "Replacing the primary endpoint for writes",
      ]
    ),
  ],
  dynamodb: [
    Q(
      "ddb-1",
      "DynamoDB on-demand capacity mode is aimed at:",
      "Unpredictable traffic without managing provisioned RCU/WCU",
      [
        "Guaranteeing SQL joins across tables",
        "Replacing VPC route tables",
        "Storing immutable WORM archives only",
      ]
    ),
    Q(
      "ddb-2",
      "DynamoDB Global Tables are used for:",
      "Multi-region, active-active replication for low-latency local reads/writes",
      [
        "Migrating on-premises tape archives only",
        "Replacing CloudWatch metrics",
        "Serving only batch analytics in Redshift",
      ]
    ),
  ],
  route53: [
    Q(
      "r53-1",
      "Which routing policy sends traffic to one resource unless it fails health checks?",
      "Failover routing",
      [
        "Simple routing with mandatory geoproximity",
        "Latency routing without records",
        "Private hosted zones only without VPC association",
      ]
    ),
    Q(
      "r53-2",
      "Latency-based routing helps when:",
      "You want Route 53 to direct users to the Region with lowest latency from their location",
      [
        "You need immutable object storage",
        "You must store relational data with joins",
        "You want to disable DNS entirely",
      ]
    ),
  ],
  cloudfront: [
    Q(
      "cf-1",
      "CloudFront improves user experience mainly by:",
      "Caching or terminating content closer to users at edge locations",
      [
        "Running OLTP databases at the edge",
        "Replacing IAM policy evaluation",
        "Provisioning EC2 capacity in every AZ automatically",
      ]
    ),
    Q(
      "cf-2",
      "Securing an S3 origin with CloudFront often involves:",
      "OAC/OAI and removing direct public bucket access while allowing the distribution to fetch objects",
      [
        "Making the bucket public-read for all origins",
        "Disabling TLS between viewer and edge",
        "Using only NACLs on the S3 bucket",
      ]
    ),
  ],
  sqs: [
    Q(
      "sqs-1",
      "SQS Standard queues provide:",
      "High throughput with at-least-once delivery and best-effort ordering",
      [
        "Strict FIFO ordering for all messages globally",
        "SQL transactions across messages",
        "Block storage for EC2",
      ]
    ),
    Q(
      "sqs-2",
      "A dead-letter queue (DLQ) is used to:",
      "Capture messages that fail processing after retries for inspection and replay",
      [
        "Replace the primary database",
        "Accelerate CloudFront cache hits",
        "Store static website HTML only",
      ]
    ),
  ],
  cloudwatch: [
    Q(
      "cw-1",
      "CloudWatch alarms can trigger actions such as:",
      "Auto Scaling policies, SNS notifications, or Lambda invocations on threshold breach",
      [
        "IAM policy creation automatically",
        "Deleting all S3 buckets in the account",
        "Replacing Route 53 hosted zones",
      ]
    ),
    Q(
      "cw-2",
      "CloudWatch Logs is primarily for:",
      "Collecting and searching operational log data from applications and AWS services",
      [
        "Storing long-term backups cheaper than Glacier only",
        "Authoring IAM trust policies",
        "Provisioning ENI bandwidth",
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
