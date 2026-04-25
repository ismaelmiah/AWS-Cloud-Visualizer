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
    Q(
      "iam-3",
      "For cross-account S3 access, a common pattern is to combine:",
      "Bucket policy on the destination account and IAM permissions on the calling principal",
      [
        "Only a username/password shared between accounts",
        "Disabling all bucket policies in both accounts",
        "Making the object ACL public-read in both accounts for simplicity",
      ]
    ),
    Q(
      "iam-4",
      "A permissions boundary in IAM is used to:",
      "Set the maximum permissions an identity-based policy can grant to a user or role, even if other policies try to allow more",
      [
        "Remove the need for MFA",
        "Replace resource-based policies for S3",
        "Grant root-equivalent access to all services",
      ]
    ),
    Q(
      "iam-5",
      "In AWS Organizations, Service Control Policies (SCPs) primarily:",
      "Set guardrails (allow/deny) for what accounts/roles in the org can do, even if IAM allows it",
      [
        "Replace IAM in every account with a single user",
        "Encrypt all S3 objects automatically in every account",
        "Create VPC peering between unrelated AWS accounts by default",
      ]
    ),
    Q(
      "iam-6",
      "Federated users (SAML/ OIDC) typically become:",
      "Temporary role sessions in your account, not long-lived IAM users with passwords in AWS",
      [
        "Root users with no auditing",
        "Permanent access keys never rotated",
        "IAM users with console passwords you manage in IAM only",
      ]
    ),
    Q(
      "iam-7",
      "A resource-based policy on S3 (bucket policy) can:",
      "Grant or deny access to the bucket to principals from the same or another account (with trust conditions met)",
      [
        "Only list objects; it cannot allow GetObject",
        "Apply to IAM users in another account but never to roles",
        "Only be managed by the S3 object owner per object, never at bucket level",
      ]
    ),
    Q(
      "iam-8",
      "MFA delete on S3 versioning helps with:",
      "Requiring multi-factor auth to permanently delete object versions, reducing ransomware-style deletion",
      [
        "Encrypting all objects with SSE-S3",
        "Replacing the need for bucket policies",
        "Deleting buckets without emptying them first",
      ]
    ),
    Q(
      "iam-9",
      "The principle of least privilege means:",
      "Grant the minimum set of actions and resources required for a task, reviewed regularly",
      [
        "Use one admin role for every application in production",
        "Always attach the AdministratorAccess policy for fewer policy documents",
        "Share access keys in a private Git repository",
      ]
    ),
    Q(
      "iam-10",
      "An IAM instance profile is used to:",
      "Pass an IAM role to an EC2 instance so applications can get temporary credentials from instance metadata",
      [
        "Store SSH public keys in IAM only",
        "Assign Elastic IPs to instances automatically",
        "Replace the need for security groups",
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
    Q(
      "kms-3",
      "In envelope encryption, the CMK in KMS is typically used to:",
      "Protect data keys; data keys then encrypt the actual application data (often for performance and rotation)",
      [
        "Encrypt the entire petabyte object with one call to Encrypt on the CMK",
        "Store plaintext passwords in the console",
        "Replace TLS for all network traffic",
      ]
    ),
    Q(
      "kms-4",
      "A KMS grant is often used to:",
      "Let AWS services (or a principal) use a key under constraints without editing the key policy for every new use case",
      [
        "Delete all CMKs in the account in one request",
        "Make the key publicly readable for debugging",
        "Convert symmetric keys into public SSH host keys",
      ]
    ),
    Q(
      "kms-5",
      "Key rotation (where supported) for customer managed keys helps with:",
      "Reducing the impact of a long-lived key compromise and meeting rotation policy requirements",
      [
        "Eliminating the need for IAM at all",
        "Making the key public for CloudFront",
        "Storing the master key in application source code",
      ]
    ),
    Q(
      "kms-6",
      "KMS is integrated with S3 for:",
      "SSE-KMS, where S3 uses a key from KMS to protect object encryption keys and enforce key policies",
      [
        "Replacing S3 bucket names with key IDs",
        "Serving objects only over FTP",
        "Making buckets ignore bucket policies",
      ]
    ),
    Q(
      "kms-7",
      "Who must be allowed in BOTH IAM and the KMS key policy (for a CMK) for a user to use Decrypt in practice?",
      "Typically both: IAM on the user/role and the key policy (or a grant) that permits that principal on that key",
      [
        "Only the S3 bucket policy if the data is in S3",
        "Only the VPC route table for private subnets",
        "Neither—KMS has no key policies, only S3 has policies",
      ]
    ),
    Q(
      "kms-8",
      "The difference between an AWS managed key and a customer managed key is largely:",
      "Who administers the key policy/rotation and how you reference it in your compliance story",
      [
        "CMKs are always public keys only",
        "AWS managed keys are never used by AWS services; only by users",
        "Customer keys cannot be used with RDS or EBS",
      ]
    ),
    Q(
      "kms-9",
      "KMS and CloudTrail are related because:",
      "CloudTrail can log key usage; KMS is often essential for data-at-rest control evidence",
      [
        "CloudTrail runs inside KMS to encrypt the trail",
        "KMS replaces CloudTrail for all audit needs",
        "They cannot be used in the same account",
      ]
    ),
    Q(
      "kms-10",
      "A common exam pitfall: encrypting a snapshot copy to another Region often requires:",
      "A key valid in the destination Region, since KMS keys are regional resources",
      [
        "The same key ID from the source Region without any new key",
        "Disabling default encryption in the target Region",
        "Copying the CMK’s private key file via email",
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
    Q(
      "vpc-3",
      "A VPC peering connection allows:",
      "Private IP connectivity between two VPCs (transitive routing is not provided by peering by default between multiple peers)",
      [
        "Automatic transitive routing through a hub to every VPC in the world",
        "Merging two VPCs into a single default security group",
        "Replacing Direct Connect in all cases",
      ]
    ),
    Q(
      "vpc-4",
      "A NAT Gateway is commonly used to:",
      "Let instances in a private subnet initiate outbound internet access for patches without being directly reachable from the internet",
      [
        "Host a public website without an ALB",
        "Replace the need for Amazon S3 for object storage",
        "Provide inbound RDP to every private instance by default",
      ]
    ),
    Q(
      "vpc-5",
      "A VPC interface endpoint (powered by PrivateLink) is used to:",
      "Reach supported AWS service APIs (or your own) privately without traversing the public internet",
      [
        "Replace DNS entirely with static IPs only",
        "Mount EFS to clients outside AWS with no network path",
        "Publicly announce your VPC CIDR to the whole internet by default",
      ]
    ),
    Q(
      "vpc-6",
      "A VPN connection to a VPC typically terminates on:",
      "A virtual private gateway (or transit gateway) for site-to-site or client VPN topologies, not on each EC2 instance by default for the whole path",
      [
        "A single EC2 t2.micro without redundancy",
        "S3 directly",
        "CloudFront edge locations for database traffic",
      ]
    ),
    Q(
      "vpc-7",
      "Transit Gateway (TGW) is especially useful for:",
      "Hub-and-spoke connectivity across many VPCs and on-premises, reducing the number of peering meshes",
      [
        "Replacing IAM in every account",
        "Storing S3 object data",
        "Running Lambda functions in every subnet automatically",
      ]
    ),
    Q(
      "vpc-8",
      "A route table in a public subnet for internet-facing web servers often has:",
      "A default route to an Internet Gateway (0.0.0.0/0) for the destination block appropriate to your CIDR",
      [
        "No default route, even for public web servers",
        "A route to S3 for all HTTP without an IGW",
        "A route to DynamoDB for port 22 SSH only",
      ]
    ),
    Q(
      "vpc-9",
      "If two subnets must not communicate laterally, you often use:",
      "Separate security groups, NACLs, and routing—network segmentation is a defense-in-depth pattern",
      [
        "A single shared security group named default for all workloads",
        "Disabling flow logs in both subnets to avoid noise",
        "Putting all instances in the same /32 CIDR",
      ]
    ),
    Q(
      "vpc-10",
      "EBS and ENIs are in which scope relative to a VPC by default?",
      "EBS volumes are in an AZ; an ENI is in a subnet in an AZ and carries security groups in that VPC",
      [
        "EBS is global; ENIs are regional only, not in a subnet",
        "Both are only ever public resources",
        "ENIs are account-wide but not tied to a VPC",
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
    Q(
      "ec2-3",
      "Reserved Instances or Savings Plans are best matched to:",
      "Steady-state, predictable workloads where you can commit to usage in exchange for discount",
      [
        "One-off bursty jobs that run once per year only",
        "Replacing Spot Instances for the same low price with no term",
        "Guaranteeing an instance in every Region without any planning",
      ]
    ),
    Q(
      "ec2-4",
      "Instance store (ephemeral) storage is most unlike EBS in that:",
      "Data is tied to the host lifecycle; stop/terminate or hardware failure can cause data loss for that storage",
      [
        "It always survives instance stop automatically like EBS",
        "It is always encrypted with KMS and cannot be used for temp data",
        "It is accessible from multiple instances across Regions by default",
      ]
    ),
    Q(
      "ec2-5",
      "Instance metadata (IMDS) is commonly used to:",
      "Obtain the IAM role’s temporary security credentials and instance identity, among other data",
      [
        "Store petabytes of user uploads",
        "Replace Route 53 for DNS in the instance",
        "Disable the need for security groups",
      ]
    ),
    Q(
      "ec2-6",
      "Placement groups (cluster, spread, partition) impact:",
      "How instances are placed relative to each other (latency, fault isolation) within an AZ/Region per type",
      [
        "S3 object replication lag only",
        "Lambda concurrency limits in every Region",
        "Whether IAM can attach a role to the instance (they cannot)",
      ]
    ),
    Q(
      "ec2-7",
      "An Application Load Balancer (ALB) is suitable for:",
      "HTTP/HTTPS routing to targets using host/path-based rules and WebSocket in many designs",
      [
        "Raw TCP/UDP with static ports only, never HTTP",
        "Storing S3 object metadata",
        "Database replication between RDS instances by default",
      ]
    ),
    Q(
      "ec2-8",
      "Capacity Reservation can help when:",
      "You need capacity assurance in an AZ for a known capacity shape (often with a commitment tradeoff), separate from the instances you launch into it",
      [
        "You want the cheapest option with no long-term use",
        "You need global anycast IPs (that is a different product)",
        "You need to run Lambda without a VPC",
      ]
    ),
    Q(
      "ec2-9",
      "A Network Load Balancer (NLB) is often used for:",
      "TCP/UDP low-latency pass-through, preserving source IP, and static IP targets use cases at scale",
      [
        "L7 WAF as the only use case in front of the NLB (WAF is separate)",
        "Replacing S3 for object storage at the edge",
        "Synchronous SQL join acceleration between RDS and DynamoDB by default",
      ]
    ),
    Q(
      "ec2-10",
      "User data in EC2 is often used to:",
      "Run bootstrap scripts on first launch to install packages, register with config management, or pull secrets",
      [
        "Replace IAM instance profiles for API calls (it does not)",
        "Act as a backup for the entire EBS volume automatically",
        "Guarantee Multi-AZ writes for RDS without an RDS feature",
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
    Q(
      "lambda-3",
      "Reserved concurrency in Lambda:",
      "Reserves a portion of the account concurrency pool for a function, protecting it from other functions consuming the entire pool",
      [
        "Guarantees a fixed number of vCPUs in every AZ without configuration",
        "Replaces the need for Dead Letter Queues",
        "Makes a function run without any IAM role",
      ]
    ),
    Q(
      "lambda-4",
      "Lambda in a VPC is needed when the function must reach:",
      "Private resources (RDS, internal ALB) that are not publicly reachable",
      [
        "Only public S3 bucket names; Lambda never needs a VPC for S3 by default in many cases",
        "The public internet only—use VPC to block the internet by default in all cases (misleading as stated)",
        "Route 53 public hosted zones in another account with no peering (always works without VPC)",
      ]
    ),
    Q(
      "lambda-5",
      "Lambda destination configuration (on success/failure) can send records to:",
      "SNS, SQS, Lambda, and EventBridge—useful for reliable async handling beyond only DLQ in some cases",
      [
        "Only CloudWatch metrics with no event payload",
        "Only a single hardcoded S3 prefix per account",
        "Directly to an RDS writer endpoint without a proxy",
      ]
    ),
    Q(
      "lambda-6",
      "A Lambda function’s environment variables for secrets are often improved by:",
      "Loading secrets from SSM Parameter Store (SecureString) or Secrets Manager at init with least-privileged IAM, instead of hardcoding in env",
      [
        "Storing the secret in the function name",
        "Putting the secret in a public S3 object with public-read",
        "Disabling CloudTrail in the account so secrets are not auditable (bad practice)",
      ]
    ),
    Q(
      "lambda-7",
      "Synchronous invocations (e.g. some API patterns) differ from async in that:",
      "The caller often waits for the function response, and throttling/limits surface differently than async with retries/queues",
      [
        "Async invocations always require Step Functions in front",
        "Synchronous can never be used from API Gateway (false)",
        "There is no difference between them on AWS in any scenario",
      ]
    ),
    Q(
      "lambda-8",
      "A Lambda layer is used to:",
      "Package libraries or custom runtimes that multiple functions can share, reducing zip size and deployment duplication",
      [
        "Replace the need for a Lambda function entirely",
        "Store CloudWatch log groups permanently",
        "Act as a reverse proxy in front of CloudFront (not its purpose)",
      ]
    ),
    Q(
      "lambda-9",
      "X-Ray integration with Lambda helps with:",
      "Distributed tracing across services in a request path for performance debugging",
      [
        "Encrypting the entire VPC without TLS",
        "Guaranteeing exactly-once processing for SQS standard queues in all cases",
        "Running containers with ECS task definitions in place of the function (no)",
      ]
    ),
    Q(
      "lambda-10",
      "A Lambda function URL vs API Gateway in many designs differs mainly in:",
      "Function URLs provide a direct HTTPS entry with simpler setup; API Gateway offers richer API management when needed",
      [
        "Function URLs only work in GovCloud, nowhere else (false for general use)",
        "API Gateway can never call Lambda (false)",
        "They are identical products with the same throttling and auth features in every case",
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
    Q(
      "ecs-3",
      "Amazon EKS differs from Amazon ECS in that EKS is:",
      "A managed Kubernetes control plane; you (or EKS) still manage the worker data plane in common patterns, with EKS Fargate as an option for pod compute",
      [
        "A message queue for batch jobs in every use case (wrong service class)",
        "A DNS-only product with no compute (wrong)",
        "Identical to Elastic Beanstalk in every case (not true in general feature sets)",
      ]
    ),
    Q(
      "ecs-4",
      "A common reason to use ECR with ECS is:",
      "To store versioned images with IAM for pull, scan where enabled, and integrate with your CI/CD to ECS deployments",
      [
        "To host static websites without HTTP (wrong)",
        "To replace a VPC in networking (unrelated for ECR’s purpose)",
        "To cache DynamoDB read units at the edge (wrong)",
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
    Q(
      "s3-3",
      "S3 Cross-Region Replication (CRR) requires:",
      "Versioning on the source bucket (and appropriate IAM, roles, and destination configuration)",
      [
        "A public bucket ACL in both regions",
        "Disabling all KMS use for the bucket",
        "A requirement that both buckets share the same account root password (false)",
      ]
    ),
    Q(
      "s3-4",
      "S3 Object Lock in compliance mode helps with:",
      "WORM-style retention; objects cannot be deleted or overwritten until retention expires (governance has different override behavior)",
      [
        "Making objects publicly listable in all cases",
        "Guaranteeing sub-millisecond reads globally in every Region",
        "Replacing IAM policies with bucket owner enforced object ownership only, without any retention (mixed concepts)",
      ]
    ),
    Q(
      "s3-5",
      "S3 presigned URLs are commonly used to:",
      "Allow time-limited access to a specific object to users who do not have long-lived AWS credentials",
      [
        "Permanently share private content with the world without any expiry (bad practice; presigned is time-bounded by design in typical use)",
        "Encrypt data at rest without KMS (not their primary purpose)",
        "Act as a replacement for a relational database (no)",
      ]
    ),
    Q(
      "s3-6",
      "S3 Transfer Acceleration uses:",
      "Edge locations to optimize uploads over the public internet to the bucket’s Region, useful for long-distance client uploads (cost tradeoff vs standard)",
      [
        "Direct Connect in every home router by default",
        "A requirement that the bucket is private to CloudFront only (not universal)",
        "Automatic Multi-AZ EC2 for every upload (not what it is)",
      ]
    ),
    Q(
      "s3-7",
      "S3 event notifications can trigger destinations such as:",
      "SNS, SQS, and Lambda, subject to service limits and common fan-out design patterns with queues",
      [
        "Direct synchronous writes to a DynamoDB GSI (not a standard built-in S3 event destination in that exact form as the first-class destination)",
        "A Route 53 health check (not the intended destination)",
        "A VPC route table (no)",
      ]
    ),
    Q(
      "s3-8",
      "S3 requester pays is used when:",
      "You want the requester, not the bucket owner, to pay for data transfer and request costs in supported scenarios (with authentication)",
      [
        "The bucket is always public without authentication",
        "You want S3 to bill CloudFront instead of the viewer in all cases (different model)",
        "You are using Glacier only for hot objects (wrong tier concept)",
      ]
    ),
    Q(
      "s3-9",
      "S3 access points are useful for:",
      "Granular, scalable access to shared datasets with their own access policies, often for many teams/applications on large buckets",
      [
        "Replacing the need for any bucket policy in the same account (common exam trap—still need careful policy design overall)",
        "Encrypting the entire account’s IAM users at once (no)",
        "Storing S3 in an AZ-only mode without a Region (S3 is regional)",
      ]
    ),
    Q(
      "s3-10",
      "S3 Intelligent-Tiering is aimed at workloads with:",
      "Unknown or changing access patterns where you want to avoid manual moves between access tiers to optimize cost",
      [
        "Objects that are never read after write, where Glacier Deep Archive is always cheaper in every case without analysis",
        "Guaranteed single-digit millisecond reads globally to every user from every object without a CDN",
        "Replacing the need for bucket policies in private buckets (no relationship)",
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
    Q(
      "ebs-3",
      "An EBS snapshot of an attached volume is typically:",
      "Point-in-time, incremental, stored in the managed backend (not a single object in your S3 bucket by default) and can be used to create new volumes in an AZ/Region as supported",
      [
        "A direct live mirror that never uses incremental blocks (simplified wrong statement)",
        "A replacement for Multi-AZ RDS (wrong service as stated)",
        "Always stored as an unencrypted public object in S3 (opposite in secure default patterns)",
      ]
    ),
    Q(
      "ebs-4",
      "Fast snapshot restore and snapshot sharing across accounts in exam scenarios involve:",
      "Restoring a volume quickly from a snapshot, with careful encryption/KMS/permissions in cross-account patterns",
      [
        "Disabling EBS default encryption in every case (opposite in many secure baselines)",
        "Using CloudFront to cache the snapshot (wrong use case for snapshot mechanics)",
        "Storing the snapshot in DynamoDB (wrong)",
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
    Q(
      "efs-3",
      "EFS performance mode choice (e.g. general purpose vs max I/O) relates to:",
      "Aggregate throughput/IOPS needs for highly parallel file workloads in supported configurations",
      [
        "Whether you use a NAT Gateway in the same subnet (largely unrelated to EFS perf mode for this direct choice)",
        "Converting the file system to a relational database in place (no)",
        "Storing S3 object tags (wrong)",
      ]
    ),
    Q(
      "efs-4",
      "EFS with Lambda (supported integration patterns) is used when you need Lambda to:",
      "Access shared file content via mount targets/VPC with supported configurations for certain workloads, instead of S3 for file semantics",
      [
        "Replace every S3 use case for static websites (incomplete/misleading in general as stated as absolute)",
        "Run without any IAM role in any case (not true in secure design)",
        "Read CloudWatch log streams as files (use Logs API, not as NFS file reads generally)",
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
    Q(
      "rds-3",
      "Amazon Aurora replicates data to the storage layer differently than a single instance non-Aurora design in that:",
      "Aurora’s storage is designed for the cluster (shared storage with replicas), improving failover and read scaling in common patterns",
      [
        "Aurora cannot have read replicas in the same Region (false in typical patterns)",
        "Aurora stores only in instance store, like ephemeral disks (not as described)",
        "Aurora removes Multi-AZ because it is always single-AZ (false for Aurora/HA options)",
      ]
    ),
    Q(
      "rds-4",
      "RDS maintenance windows are used to:",
      "Apply version upgrades, OS patching, and some failover-related tasks during controlled periods",
      [
        "Delete all read replicas every week (not the purpose)",
        "Guarantee zero downtime in every case without Multi-AZ (unrealistic blanket claim)",
        "Replace automated backups (false)",
      ]
    ),
    Q(
      "rds-5",
      "When would you use RDS Proxy?",
      "To pool and share database connections, reduce connection storms to the DB, and help with IAM/Secrets integration patterns for Lambdas/scale-out apps",
      [
        "To replace a NAT Gateway for all VPC traffic (no)",
        "To make DynamoDB have SQL joins (no)",
        "To cache query results in CloudFront (no)",
      ]
    ),
    Q(
      "rds-6",
      "A read replica in the same Region is often used to:",
      "Scale out read-heavy query workloads, reporting, and sometimes promote to primary in DR scenarios (with caveats and procedures)",
      [
        "Replace the primary writer endpoint for all transactions without change (not typically the default for writes)",
        "Store cold archival objects like Glacier (wrong service)",
        "Provide cross-account DNS routing by itself (use Route 53 and networking patterns)",
      ]
    ),
    Q(
      "rds-7",
      "Automated backups in RDS are commonly used to:",
      "Support point-in-time recovery within the backup retention period for recovery objectives",
      [
        "Guarantee cross-account reads of data without any replication setup (not what backups alone are for)",
        "Replace the need for Multi-AZ (different concern)",
        "Store unlimited logs in CloudWatch Logs for free (no)",
      ]
    ),
    Q(
      "rds-8",
      "Security groups and subnet groups for RDS matter because:",
      "The database must be reachable from app tiers and protected from the internet, typically via private subnets and least-privileged SG rules",
      [
        "Subnets are irrelevant; RDS is always on the public internet (anti-pattern in many secure designs on exam)",
        "NACLs are never used in VPCs with RDS (false—defense in depth can include NACLs in some cases)",
        "The DB can never be in a VPC (false)",
      ]
    ),
    Q(
      "rds-9",
      "Database parameter groups in RDS are used to:",
      "Tune engine settings (e.g. memory and behavior flags) as supported by the engine, applied to instances in the group",
      [
        "Replace the need for encryption at rest (no)",
        "Automatically make every query use DynamoDB (no)",
        "Convert MySQL to DynamoDB in place (no)",
      ]
    ),
    Q(
      "rds-10",
      "Cross-Region read replicas are sometimes used to:",
      "Bring data closer to readers in another Region for latency or DR strategies (with async replication and consistency caveats for reads/writes across Regions)",
      [
        "Guarantee synchronous global writes in all engines by default in every case (not a blanket true statement for all cases)",
        "Replace the need for any encryption (false)",
        "Replace Route 53 (they solve different problems)",
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
    Q(
      "ddb-3",
      "A Global Secondary Index (GSI) in DynamoDB is used to:",
      "Query the table using a different partition key and optional sort key than the base table’s primary key",
      [
        "Run SQL join queries across unrelated relational schemas as if it were Aurora",
        "Store objects larger than 400 KB in the index only",
        "Replace the need for a primary key on the table (the base table must still be keyed)",
      ]
    ),
    Q(
      "ddb-4",
      "A Local Secondary Index (LSI) requires:",
      "The same partition key as the table and a different sort key, and the LSI is defined at table creation (cannot add an LSI later the way you can a GSI in common patterns)",
      [
        "A different partition key than the table (use a GSI for that case)",
        "A separate DynamoDB table in another Region to mirror automatically",
        "Disabling on-demand mode before creating any items (unrelated as stated)",
      ]
    ),
    Q(
      "ddb-5",
      "DynamoDB Streams are commonly used to:",
      "Propagate item-level changes to Lambda, or build aggregations, or feed search indexes with ordered change records per shard",
      [
        "Store cold backups in Glacier (wrong service for stream storage)",
        "Replace the need for IAM in Lambda consumers (no)",
        "Act as a durable queue replacement for SQS in every scenario (different tradeoffs)",
      ]
    ),
    Q(
      "ddb-6",
      "DAX is meant to:",
      "Accelerate read-heavy DynamoDB access patterns with an in-memory cache with microsecond read latency in supported scenarios",
      [
        "Replace DynamoDB and store relational star schemas in cache only (no—cache fronting DDB items)",
        "Act as a global anycast front door (that is a different class of product)",
        "Encrypt all Lambda environment variables (no)",
      ]
    ),
    Q(
      "ddb-7",
      "A hot partition in DynamoDB can occur when:",
      "A single partition key is overloaded with skewed access, limiting throughput to that key’s partition capacity",
      [
        "You use S3 for storage in the same account (unrelated as stated)",
        "You have too many unique partition keys in a well-distributed key space (opposite of hot partition in common definition)",
        "You use Multi-AZ on DynamoDB in the same way as RDS (different model)",
      ]
    ),
    Q(
      "ddb-8",
      "DynamoDB transactions (TransactWriteItems / TransactGetItems) are used to:",
      "Coordinate multiple item actions in one request with all-or-nothing behavior within an account/Region, subject to item collection limits and patterns",
      [
        "Guarantee cross-table ACID in every Region globally in all cases (overreach)",
        "Replace SQS (different purpose)",
        "Run SQL on CSV in S3 (use Athena, not DDB for that)",
      ]
    ),
    Q(
      "ddb-9",
      "DynamoDB TTL is used to:",
      "Expire items at a per-item time attribute for automatic cleanup, common for sessions, ephemeral records, and cost control",
      [
        "Immediately delete the table at midnight (no—item-level with attribute)",
        "Encrypt items at rest with a customer CMK (use SSE options instead)",
        "Convert items to S3 Object Lock (wrong)",
      ]
    ),
    Q(
      "ddb-10",
      "A single-table design in DynamoDB often helps with:",
      "Modeling access patterns in one table with different SK prefixes to reduce the number of round trips and support multiple entity types in one key space (advanced pattern on exams)",
      [
        "Guaranteeing all relational joins across 50 normalized tables in one request (opposite of typical DDB design)",
        "Storing 5 TB BLOBs per item (DDB has item size limits—use S3 for large objects in exam scenarios)",
        "Replacing VPC networking (unrelated)",
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
    Q(
      "r53-3",
      "A Route 53 private hosted zone is associated with:",
      "One or more VPCs in your account (and can be shared via supported patterns) for internal DNS names not on the public internet",
      [
        "Every S3 bucket name in the world automatically (no)",
        "All CloudFront distributions without any association (no explicit association model as stated simply for “all”)",
        "Direct Connect physical cable types only (wrong layer)",
      ]
    ),
    Q(
      "r53-4",
      "Weighted routing in Route 53 is often used to:",
      "Split traffic by percentage between healthy targets for blue/green or canary-style rollouts",
      [
        "Guarantee lowest latency for every user in all cases (that is closer to latency routing; weights are for ratio control)",
        "Replace TLS on ALB (unrelated)",
        "Store DNS records in DynamoDB directly (Route 53 has its own hosted zone record model)",
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
    Q(
      "cf-3",
      "CloudFront signed URLs / signed cookies are used to:",
      "Restrict who can access content (often private objects in S3) through CloudFront, even if the S3 object is not public",
      [
        "Guarantee every viewer uses HTTP without TLS (opposite in secure designs)",
        "Replace the need for any origin (CloudFront must still have an origin)",
        "Act as a database connection pooler (not its purpose)",
      ]
    ),
    Q(
      "cf-4",
      "Lambda@Edge is used to:",
      "Run small Node.js/Python functions at edge locations in response to viewer/request events for A/B, auth hooks, and header rewrites, within limits",
      [
        "Run arbitrary Docker containers in every City Hall worldwide without limits (unrealistic)",
        "Replace RDS in the data plane for OLTP in every use case (no)",
        "Store petabyte archives at the edge in place of S3 (no)",
      ]
    ),
    Q(
      "cf-5",
      "A CloudFront origin group is often used for:",
      "Failover between origins (e.g. primary/secondary) at the origin layer, combined with health checks as configured",
      [
        "Turning SQS into a FIFO queue automatically (unrelated)",
        "Encrypting S3 with KMS in the viewer’s browser (wrong layer)",
        "Disabling WAF in all distributions (unrelated and generally harmful)",
      ]
    ),
    Q(
      "cf-6",
      "CloudFront cache behavior settings control:",
      "What is cacheable, TTL, forwarded headers/cookies query strings, and can strongly affect origin load and cost",
      [
        "Whether RDS is Multi-AZ (unrelated to CF behaviors)",
        "The Lambda concurrency limit in the whole account (unrelated to CF for this feature)",
        "IAM password policies (unrelated service)",
      ]
    ),
    Q(
      "cf-7",
      "A common pattern: CloudFront in front of ALB to:",
      "Terminate clients at the edge, cache where possible, and reduce load on the origin, often with WAF at the edge",
      [
        "Run ALB in every edge location (ALB is regional; pattern is distribute traffic with CF, not re-home ALB itself as edge product)",
        "Store ALB access logs in DynamoDB by default (not implied)",
        "Replace the need for Route 53 for private DNS in every case (unrelated as stated)",
      ]
    ),
    Q(
      "cf-8",
      "If you need TLS on a custom domain with CloudFront, you typically need:",
      "An ACM certificate in us-east-1 (for public distributions with regional ACM constraints per classic exam guidance) when using the standard CloudFront+ACM model for alternate domain names",
      [
        "A certificate in every Region the viewer is located in, always issued by a third party only (simplified; exam nuance: ACM in us-east-1 for global CF alt domain in common patterns)",
        "No certificate at all if you use S3 as origin (still need viewer-side TLS in secure designs)",
        "A self-signed cert trusted by all browsers without configuration (unrealistic)",
      ]
    ),
    Q(
      "cf-9",
      "Field-level encryption with CloudFront and supported integrations is used to:",
      "Protect sensitive data fields in POST bodies at the edge in supported architectures (sensitive PII in forms patterns on exams)",
      [
        "Encrypt all S3 object bodies at the edge without KMS (muddled; field-level is about fields in some integration patterns, not a blanket statement alone)",
        "Replace the need for HTTPS (false)",
        "Convert CloudFront to a relational database (no)",
      ]
    ),
    Q(
      "cf-10",
      "A CloudFront price class (e.g. fewer edge locations) can:",
      "Reduce cost by limiting which PoPs are used, at the expense of potentially worse latency for some viewers",
      [
        "Guarantee lower latency in every country while also cheaper in every case (not usually both)",
        "Remove the need for an origin in S3/ALB (false)",
        "Make OAC with private S3 impossible (not true by itself)",
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
    Q(
      "sqs-3",
      "The SQS visibility timeout is:",
      "The period other consumers will not see the same message after a consumer starts processing it, until delete or timeout expiry",
      [
        "The maximum time a message can live in the queue in all cases (that is message retention, not the same as visibility as stated in every nuance—exam distinguishes)",
        "The time the message spends in a DLQ only (not the same)",
        "The Lambda timeout for all functions in the account (unrelated as stated)",
      ]
    ),
    Q(
      "sqs-4",
      "Long polling (WaitTimeSeconds) for SQS helps:",
      "Reduce empty receives and can lower cost/latency tradeoff vs fast short polling in high-throughput designs",
      [
        "Guarantee strict ordering in Standard queues (FIFO does ordering; long polling is not ordering)",
        "Write directly to an RDS read replica (wrong service integration as stated simply)",
        "Encrypt messages with CMKs without IAM (wrong)",
      ]
    ),
    Q(
      "sqs-5",
      "SQS FIFO high throughput mode (as enabled when supported) addresses:",
      "Raising the throughput ceiling for FIFO queues in supported configurations beyond classic FIFO per-queue limits, subject to service constraints",
      [
        "Converting a Standard queue to a FIFO without recreating a new queue in every scenario (simplified: migration patterns exist, but the answer option as absolute is often false)",
        "Guaranteeing global ordering across all AWS Regions with one queue (unrealistic in one SQS queue concept)",
        "Storing 5 TB per message in S3 inside SQS (SQS message size is limited; large payloads use extended client patterns/S3 etc.)",
      ]
    ),
    Q(
      "sqs-6",
      "When Lambda consumes from SQS, a common design concern is:",
      "Matching batch size, concurrency, and partial batch failure handling so poison messages can land in a DLQ after retries",
      [
        "SQS cannot be an event source for Lambda (false)",
        "Lambda must always process every message in one Region without a DLQ in any design (unrealistic for failures)",
        "SQS and FIFO cannot be used with Lambda in any case (false)",
      ]
    ),
    Q(
      "sqs-7",
      "SQS message retention is about:",
      "How long messages can remain in the queue if not deleted, before being discarded per retention hours configuration",
      [
        "How long a Lambda function may run in seconds (use Lambda timeout for that, not the same as retention definition)",
        "How long CloudWatch retains logs in all cases (Log retention is separate for CW Logs)",
        "S3 object lifecycle in Glacier (wrong service)",
      ]
    ),
    Q(
      "sqs-8",
      "A delay queue (message DelaySeconds) is used to:",
      "Defer delivery of new messages to consumers by a per-message or queue default period for scheduling patterns and ordering windows",
      [
        "Permanently delete the queue (no—delay is not deletion)",
        "Make FIFO behave like a Standard queue (no—different product behaviors)",
        "Encrypt all messages with a CMK in KMS without a key policy (wrong)",
      ]
    ),
    Q(
      "sqs-9",
      "SNS → multiple SQS subscribers is a pattern for:",
      "Fan-out; one event published to a topic, many queues and consumers process independently, often for domain separation and retries",
      [
        "One SQS message must always go to one consumer only, globally (fan-out is about multiple subscribers via SNS+SQS pattern)",
        "SNS stores messages for 7 years (SNS does not work like a long storage lake by default; often pair with S3/SQS retention patterns)",
        "SQS replaces SNS for mobile push in every use case (both exist for different use cases)",
      ]
    ),
    Q(
      "sqs-10",
      "For FIFO queues, message deduplication is relevant when producers might:",
      "Send duplicate messages and you want the queue to de-dupe within a deduplication window using content-based or explicit token patterns",
      [
        "Store petabyte objects in the queue body in one message (message size limit)",
        "Guarantee global write ordering across all AWS accounts in all cases (unrealistic scope as stated for one feature)",
        "Replace IAM policy evaluation in KMS (unrelated feature)",
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
    Q(
      "cw-3",
      "CloudWatch metric alarms on EC2 CPUUtilization are often paired with:",
      "Auto Scaling policies to add or remove instances in response to load, with cooldown and evaluation period settings",
      [
        "Automatically changing the instance type without any ASG (not the default pattern as stated simply for all cases)",
        "Deleting the instance when CPU is high (opposite of typical scale-out patterns)",
        "Routing all traffic to S3 when CPU is high (wrong pattern as stated generally)",
      ]
    ),
    Q(
      "cw-4",
      "CloudWatch Logs subscription filters can send matching log data to:",
      "Kinesis Data Firehose, Lambda, or other supported destinations for centralized logging and security analytics patterns",
      [
        "Replace CloudTrail for API auditing in all cases (different service and focus)",
        "Encrypt an S3 bucket policy (unrelated feature set for this answer as stated)",
        "Create a new VPC from log lines (no)",
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
