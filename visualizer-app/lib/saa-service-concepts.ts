/**
 * Concept graph copy for preparation topic pages — keep text short (visual-first).
 */

export type ConceptLegendTone = "sky" | "orange" | "amber" | "emerald" | "violet";

export type ConceptLegend = {
  title: string;
  body: string;
  tone: ConceptLegendTone;
  quizBlurb: string;
};

export type ConceptNode = {
  id: string;
  label: string;
  sub?: string;
};

export type ConceptDiagram = {
  ariaLabel: string;
  left: ConceptNode[];
  center: ConceptNode;
  right: ConceptNode[];
};

export type ServiceConceptSpec = {
  headline: string;
  intro: string;
  legends: [ConceptLegend, ConceptLegend, ConceptLegend, ConceptLegend];
  diagram: ConceptDiagram;
  footnote?: string;
};

const L = (
  title: string,
  body: string,
  tone: ConceptLegendTone,
  quizBlurb: string
): ConceptLegend => ({ title, body, tone, quizBlurb });

const spec = (s: ServiceConceptSpec) => s;

export const SERVICE_CONCEPTS: Record<string, ServiceConceptSpec> = {
  iam: spec({
    headline: "IAM",
    intro: "Who → policy → action on resource; explicit Deny wins.",
    legends: [
      L("Principals", "Users, groups, roles — attach policies or assume roles.", "sky", "Trace the principal for each API call."),
      L("Policies", "JSON: Effect, Action, Resource, optional Condition.", "orange", "Read statements; deny overrides allow."),
      L("Actions", "Service verbs (e.g. s3:GetObject) on ARNs.", "amber", "Trim actions + resources together."),
      L("Resources", "Buckets, instances, keys — often ARN-scoped.", "emerald", "Resource policies can grant cross-account access."),
    ],
    diagram: {
      ariaLabel: "IAM principals connect through a policy to actions on AWS resources.",
      left: [
        { id: "iam-u", label: "User / group", sub: "human" },
        { id: "iam-r", label: "Role", sub: "assumable" },
      ],
      center: { id: "iam-p", label: "Policy", sub: "allow · deny" },
      right: [
        { id: "iam-s3", label: "S3", sub: "ARN" },
        { id: "iam-api", label: "API call", sub: "action" },
      ],
    },
  }),
  kms: spec({
    headline: "KMS",
    intro: "Keys wrap data keys; IAM + key policies gate usage.",
    legends: [
      L("CMK vs AWS", "Customer managed vs AWS managed — ownership of rotation & policy.", "sky", "Who administers the key lifecycle?"),
      L("Encrypt / decrypt", "Services request GenerateDataKey / Decrypt via grants & IAM.", "orange", "Follow the ciphertext and who can unwrap."),
      L("Envelope", "Data key encrypts data; CMK protects data key.", "amber", "Performance vs. audit trail tradeoffs."),
      L("IAM", "kms:Decrypt must be allowed alongside resource policy.", "emerald", "Double authorization patterns on exams."),
    ],
    diagram: {
      ariaLabel: "Application uses KMS CMK to obtain data keys for encrypting application data.",
      left: [{ id: "kms-app", label: "App / service", sub: "caller" }],
      center: { id: "kms-key", label: "CMK", sub: "key policy" },
      right: [
        { id: "kms-dk", label: "Data key", sub: "envelope" },
        { id: "kms-data", label: "Data at rest", sub: "EBS / S3 / RDS" },
      ],
    },
  }),
  vpc: spec({
    headline: "VPC",
    intro: "Subnets + routes + stateful SGs + stateless NACLs.",
    legends: [
      L("CIDR", "Plan IP space; peerings and TGW need non-overlap.", "sky", "Addressing drives peering and endpoints."),
      L("Routing", "IGW, NAT, TGW, endpoints — next hop decides reachability.", "orange", "Private vs public subnet = route table story."),
      L("Security", "SG on ENI; NACL on subnet boundary.", "amber", "Where to filter east-west vs north-south."),
      L("Endpoints", "Keep AWS APIs off the public internet.", "emerald", "Cost vs exposure for S3/DynamoDB access."),
    ],
    diagram: {
      ariaLabel: "VPC holds subnets with route tables toward IGW, NAT, or VPC endpoints.",
      left: [{ id: "vpc-edge", label: "Internet / hybrid", sub: "IGW · VPN" }],
      center: { id: "vpc-core", label: "VPC", sub: "CIDR" },
      right: [
        { id: "vpc-pub", label: "Public subnet", sub: "ALB" },
        { id: "vpc-priv", label: "Private subnet", sub: "app · data" },
      ],
    },
  }),
  ec2: spec({
    headline: "EC2",
    intro: "Purchase model + AZ spread + health + capacity.",
    legends: [
      L("Buying", "Spot vs RI vs OD vs Savings Plans — predictability vs cost.", "sky", "Match interrupt tolerance to Spot."),
      L("ASG", "Desired capacity + health checks + scaling policies.", "orange", "Replace unhealthy instances across AZs."),
      L("LB", "ALB/NLB target groups front ASG instances.", "amber", "Layer 7 vs 4 routing."),
      L("EBS", "Root + data volumes; snapshots for DR.", "emerald", "IOPS/throughput per volume type."),
    ],
    diagram: {
      ariaLabel: "Launch template and AMI feed EC2 instances behind a load balancer with EBS.",
      left: [
        { id: "ec2-ami", label: "AMI", sub: "" },
        { id: "ec2-lt", label: "Launch template", sub: "" },
      ],
      center: { id: "ec2-i", label: "EC2 + ASG", sub: "AZs" },
      right: [
        { id: "ec2-alb", label: "ALB", sub: "" },
        { id: "ec2-vol", label: "EBS", sub: "" },
      ],
    },
  }),
  lambda: spec({
    headline: "Lambda",
    intro: "Event in → function → destination; scale per invocation.",
    legends: [
      L("Triggers", "S3, API GW, streams, EventBridge — decouple producers.", "sky", "Identify who invokes and retry semantics."),
      L("Concurrency", "Reserved vs burst; throttles show in metrics.", "orange", "Hot partitions and downstream limits."),
      L("VPC", "ENIs in subnets for private resource access.", "amber", "Cold start vs connectivity tradeoff."),
      L("DLQ", "Failed async invokes go to SQS/SNS for inspection.", "emerald", "At-least-once handling patterns."),
    ],
    diagram: {
      ariaLabel: "Event sources invoke a Lambda function that reaches downstream services.",
      left: [{ id: "ln-ev", label: "Event sources", sub: "S3 · API · EB" }],
      center: { id: "ln-fn", label: "Lambda", sub: "run" },
      right: [
        { id: "ln-dst", label: "Destinations", sub: "SQS / SNS" },
        { id: "ln-db", label: "Data plane", sub: "DDB / RDS" },
      ],
    },
  }),
  "ecs-fargate": spec({
    headline: "ECS & Fargate",
    intro: "Task definitions → placement → service discovery.",
    legends: [
      L("Image", "ECR pull; supply chain and IAM.", "sky", "Who can push/pull which repo?"),
      L("Fargate", "No EC2 fleet to patch; pay per task resources.", "orange", "Ops vs control plane tradeoff."),
      L("Networking", "Tasks get ENIs; SGs per service.", "amber", "Mesh / ingress controller patterns."),
      L("EKS note", "Portable K8s API vs ECS native.", "emerald", "When exam mentions control plane ownership."),
    ],
    diagram: {
      ariaLabel: "Container image in ECR runs as ECS tasks on Fargate behind a load balancer.",
      left: [{ id: "ecr-img", label: "ECR image", sub: "" }],
      center: { id: "ecs-run", label: "ECS / Fargate", sub: "tasks" },
      right: [
        { id: "ecs-svc", label: "Service", sub: "" },
        { id: "ecs-lb", label: "ALB", sub: "" },
      ],
    },
  }),
  s3: spec({
    headline: "S3",
    intro: "Storage class + policy surface + encryption defaults.",
    legends: [
      L("Classes", "Standard / IA / Glacier tiers — latency vs $.", "sky", "Lifecycle transitions."),
      L("Access", "Bucket policy + IAM + Block Public Access.", "orange", "Cross-account patterns."),
      L("Versioning", "Protect against overwrite; MFA delete optional.", "amber", "Ransomware resilience story."),
      L("Encryption", "SSE-S3 vs SSE-KMS vs client-side.", "emerald", "Key policy + IAM for KMS path."),
    ],
    diagram: {
      ariaLabel: "Clients reach S3 buckets holding encrypted objects with lifecycle rules.",
      left: [{ id: "s3-cli", label: "Clients", sub: "" }],
      center: { id: "s3-bkt", label: "Bucket", sub: "policy" },
      right: [
        { id: "s3-obj", label: "Objects", sub: "classes" },
        { id: "s3-kms", label: "KMS", sub: "optional" },
      ],
    },
  }),
  ebs: spec({
    headline: "EBS",
    intro: "Block volumes attach to one instance (usually); snapshots copy.",
    legends: [
      L("Volume types", "gp3/io/gp2 — IOPS & throughput knobs.", "sky", "Match workload to SLA."),
      L("Snapshots", "Incremental; copy for DR across Region.", "orange", "Fast snapshot restore patterns."),
      L("AZ", "Volume tied to AZ; attach in same AZ.", "amber", "Detach/attach vs data loss."),
      L("Encryption", "Default encryption with KMS per account/Region.", "emerald", "Snapshots inherit encryption context."),
    ],
    diagram: {
      ariaLabel: "EBS volume attaches to EC2 instance; snapshots go to S3 backend.",
      left: [{ id: "ebs-vol", label: "EBS volume", sub: "AZ" }],
      center: { id: "ebs-ec2", label: "EC2", sub: "attach" },
      right: [
        { id: "ebs-snap", label: "Snapshot", sub: "DR" },
        { id: "ebs-ami", label: "AMI", sub: "image" },
      ],
    },
  }),
  efs: spec({
    headline: "EFS",
    intro: "Regional NFS; mount targets per AZ; POSIX semantics.",
    legends: [
      L("Throughput", "Bursting vs provisioned modes.", "sky", "Large parallel vs steady streaming."),
      L("Mount targets", "ENIs in subnets for NFS clients.", "orange", "Security groups on NFS port."),
      L("vs EBS", "Many clients vs single attach.", "amber", "Shared Linux file access."),
      L("Tiering", "Lifecycle to IA storage class.", "emerald", "Cost for infrequently accessed files."),
    ],
    diagram: {
      ariaLabel: "Multiple EC2 instances mount the same EFS file system via mount targets.",
      left: [{ id: "efs-a", label: "EC2 A", sub: "" }],
      center: { id: "efs-fs", label: "EFS", sub: "NFS" },
      right: [
        { id: "efs-b", label: "EC2 B", sub: "" },
        { id: "efs-mt", label: "Mount targets", sub: "AZ" },
      ],
    },
  }),
  "rds-aurora": spec({
    headline: "RDS & Aurora",
    intro: "Multi-AZ failover + read scaling + backups.",
    legends: [
      L("Multi-AZ", "Synchronous standby for failover; not a read scale-out.", "sky", "Exam distinguishes from replicas."),
      L("Replicas", "Read traffic; Aurora fast promote.", "orange", "Lag and connection endpoints."),
      L("Backups", "Automated + retention; PITR window.", "amber", "Restore to new instance."),
      L("Subnet grp", "DB in private subnets only.", "emerald", "Network path to app tier."),
    ],
    diagram: {
      ariaLabel: "Application writes to RDS primary with optional read replicas for scale-out reads.",
      left: [{ id: "rds-app", label: "Application", sub: "" }],
      center: { id: "rds-pri", label: "Primary", sub: "writer" },
      right: [
        { id: "rds-rr", label: "Read replicas", sub: "" },
        { id: "rds-st", label: "Standby", sub: "Multi-AZ" },
      ],
    },
  }),
  dynamodb: spec({
    headline: "DynamoDB",
    intro: "Partition key design drives hot partitions and RCU/efficiency.",
    legends: [
      L("Access pattern", "Single-table design vs many tables.", "sky", "Query vs scan cost."),
      L("Capacity", "On-demand vs provisioned; auto scaling.", "orange", "Unpredictable traffic story."),
      L("Global tables", "Multi-region replication.", "amber", "Conflict resolution awareness."),
      L("Streams", "CDC to Lambda / ES.", "emerald", "Ordering per partition key."),
    ],
    diagram: {
      ariaLabel: "App performs key-based access to DynamoDB table with optional streams.",
      left: [{ id: "ddb-app", label: "App", sub: "" }],
      center: { id: "ddb-tbl", label: "Table", sub: "PK/SK" },
      right: [
        { id: "ddb-gsi", label: "GSI", sub: "" },
        { id: "ddb-str", label: "Stream", sub: "" },
      ],
    },
  }),
  route53: spec({
    headline: "Route 53",
    intro: "Policy + health checks steer traffic.",
    legends: [
      L("Policies", "Latency, geo, weighted, failover, multivalue.", "sky", "Pick policy for the scenario."),
      L("Health checks", "Failover depends on probe results.", "orange", "TTL vs failover speed."),
      L("Private zones", "VPC association for internal DNS.", "amber", "Split-horizon DNS."),
      L("Resolver", "Hybrid DNS forwarding.", "emerald", "On-prem to AWS name resolution."),
    ],
    diagram: {
      ariaLabel: "DNS clients query Route 53 which returns records pointing to healthy endpoints.",
      left: [{ id: "r53-cli", label: "Clients", sub: "" }],
      center: { id: "r53-hz", label: "Hosted zone", sub: "records" },
      right: [
        { id: "r53-alb", label: "Targets", sub: "ALB / CF" },
        { id: "r53-hc", label: "Health checks", sub: "" },
      ],
    },
  }),
  cloudfront: spec({
    headline: "CloudFront",
    intro: "Edge cache + behaviors + signed URLs + WAF at edge.",
    legends: [
      L("Behaviors", "Path patterns to origins; TTLs.", "sky", "Cache hit ratio tuning."),
      L("Origins", "ALB, S3, custom; OAC for S3.", "orange", "Hide origin from direct access."),
      L("TLS", "Certificate in us-east-1 for CF alternate domain.", "amber", "Classic exam trap."),
      L("WAF", "Attach to CF or ALB for L7 rules.", "emerald", "Edge vs origin protection."),
    ],
    diagram: {
      ariaLabel: "Users hit CloudFront distribution which fetches from origin in AWS Region.",
      left: [{ id: "cf-user", label: "Users", sub: "" }],
      center: { id: "cf-dist", label: "CloudFront", sub: "edge" },
      right: [
        { id: "cf-org", label: "Origin", sub: "ALB / S3" },
        { id: "cf-waf", label: "WAF", sub: "optional" },
      ],
    },
  }),
  sqs: spec({
    headline: "SQS",
    intro: "Buffer + decouple; visibility timeout is core.",
    legends: [
      L("Standard vs FIFO", "Throughput vs strict order + dedupe.", "sky", "Message group IDs for FIFO."),
      L("Visibility", "Consumer processing window before redelivery.", "orange", "Poison messages and DLQ."),
      L("Fan-out", "SNS to many SQS queues pattern.", "amber", "Event-driven scaling."),
      L("Long polling", "Reduce empty receives vs short poll.", "emerald", "Cost and latency tradeoff."),
    ],
    diagram: {
      ariaLabel: "Producer sends messages to SQS queue consumed by workers with optional DLQ.",
      left: [{ id: "sqs-p", label: "Producer", sub: "" }],
      center: { id: "sqs-q", label: "Queue", sub: "SQS" },
      right: [
        { id: "sqs-c", label: "Consumer", sub: "" },
        { id: "sqs-d", label: "DLQ", sub: "" },
      ],
    },
  }),
  cloudwatch: spec({
    headline: "CloudWatch",
    intro: "Metrics + logs + alarms → actions (ASG, SNS, Lambda).",
    legends: [
      L("Metrics", "Standard vs custom; namespaces.", "sky", "Resolution periods for alarms."),
      L("Alarms", "Threshold + OK/ALARM states.", "orange", "Drive scaling policies."),
      L("Logs", "Log groups/streams; subscription filters.", "amber", "Central logging account pattern."),
      L("Events", "EventBridge rules for reactive automation.", "emerald", "Replace periodic polling where possible."),
    ],
    diagram: {
      ariaLabel: "Resources emit metrics and logs to CloudWatch; alarms trigger actions.",
      left: [{ id: "cw-res", label: "Resources", sub: "EC2 · Lambda" }],
      center: { id: "cw-cw", label: "CloudWatch", sub: "metrics · logs" },
      right: [
        { id: "cw-al", label: "Alarms", sub: "" },
        { id: "cw-act", label: "Actions", sub: "ASG / SNS" },
      ],
    },
  }),
};

function padChips(chips: string[]): [string, string, string, string, string] {
  const merged = [...chips];
  const DEFAULT_CHIPS = ["Edge", "Control plane", "Data plane", "Governance", "Operations"];
  let i = 0;
  while (merged.length < 5) {
    merged.push(DEFAULT_CHIPS[i % DEFAULT_CHIPS.length]);
    i += 1;
  }
  return merged.slice(0, 5) as [string, string, string, string, string];
}

function genericSpec(_serviceId: string, title: string, chips: string[]): ServiceConceptSpec {
  const [a, b, c, d, e] = padChips(chips);
  return {
    headline: title,
    intro: `Map: ${chips.slice(0, 3).join(" · ")}.`,
    legends: [
      L(a, "Anchor concept for this topic.", "sky", `Explain ${a} in one sentence.`),
      L(b, "Typical neighbor service or constraint.", "orange", `How ${b} couples to the rest.`),
      L(c, "Cost, security, or ops angle.", "amber", `Tradeoff involving ${c}.`),
      L(d, "Observability or resilience tie-in.", "emerald", `Where ${d} closes the loop.`),
    ],
    diagram: {
      ariaLabel: `Concept map for ${title}.`,
      left: [
        { id: "l1", label: a },
        { id: "l2", label: b },
      ],
      center: { id: "mid", label: e, sub: "core" },
      right: [
        { id: "r1", label: c },
        { id: "r2", label: d },
      ],
    },
  };
}

export function getServiceConceptSpec(
  serviceId: string,
  fallbackTitle: string,
  chips: string[]
): ServiceConceptSpec | null {
  const hit = SERVICE_CONCEPTS[serviceId];
  if (hit) return hit;
  if (!chips.length) return null;
  return genericSpec(serviceId, fallbackTitle, chips);
}
