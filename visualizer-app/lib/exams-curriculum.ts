/**
 * Per-exam curriculum for preparation hub + service grid.
 * `id` matches checkpoint `trackId` in Clerk privateMetadata (see checkpoint-metadata).
 *
 * Program tiers (Foundational → Specialty) align with AWS certification levels;
 * per-service depth uses What / How / Why / Niche chips on the grid.
 */

export type CertificationProgramTier =
  | "foundational"
  | "associate"
  | "professional"
  | "specialty";

/** Depth shown on each service cell (maps to legend; Specialty exams skew toward `niche`). */
export type KnowledgeTier = "what" | "how" | "why" | "niche";

export type ExamServiceEntry = {
  serviceId: string;
  label: string;
  iconFile: string;
  hint: string;
  tier: KnowledgeTier;
};

export type ExamDefinition = {
  id: string;
  title: string;
  tagline: string;
  certificationTier: CertificationProgramTier;
  /** e.g. solutions-architect, developer, security */
  certFamily?: string;
  targetAudience: string;
  knowledgeProfile: string;
  /** One line; mirrors program tier “simple goal” table */
  simpleGoalSummary: string;
  /** When false, hub shows “Coming soon” (no service map link). */
  active: boolean;
  services: ExamServiceEntry[];
};

export const programTierOrder: Record<CertificationProgramTier, number> = {
  foundational: 0,
  associate: 1,
  professional: 2,
  specialty: 3,
};

export const programTierMeta: Record<
  CertificationProgramTier,
  { label: string; simpleGoal: string; badgeClass: string }
> = {
  foundational: {
    label: "Foundational",
    simpleGoal: "Understand the What",
    badgeClass: "border-sky-500/50 bg-sky-500/15 text-sky-200",
  },
  associate: {
    label: "Associate",
    simpleGoal: "Understand the How",
    badgeClass: "border-amber-500/50 bg-amber-500/15 text-amber-200",
  },
  professional: {
    label: "Professional",
    simpleGoal: "Understand the Why",
    badgeClass: "border-orange-500/50 bg-orange-500/15 text-orange-200",
  },
  specialty: {
    label: "Specialty",
    simpleGoal: "Understand the Niche",
    badgeClass: "border-violet-500/50 bg-violet-500/15 text-violet-200",
  },
};

const EXAMS: Record<string, ExamDefinition> = {
  "aws-cloud-practitioner": {
    id: "aws-cloud-practitioner",
    title: "AWS Certified Cloud Practitioner",
    tagline: "Business value, global infrastructure, and the shared responsibility model.",
    certificationTier: "foundational",
    certFamily: "cloud-practitioner",
    targetAudience: "Beginners, business stakeholders, or those new to the cloud.",
    knowledgeProfile:
      "High-level AWS ecosystem, billing, security basics, and core services—no deep hands-on coding.",
    simpleGoalSummary: "Understand the What",
    active: true,
    services: [
      { serviceId: "iam", label: "IAM", iconFile: "iam.svg", hint: "Identity", tier: "what" },
      { serviceId: "s3", label: "S3", iconFile: "s3.svg", hint: "Storage", tier: "what" },
      { serviceId: "ec2", label: "EC2", iconFile: "ec2.svg", hint: "Compute", tier: "what" },
      { serviceId: "vpc", label: "VPC", iconFile: "vpc.svg", hint: "Networking", tier: "what" },
      { serviceId: "lambda", label: "Lambda", iconFile: "lambda.svg", hint: "Serverless", tier: "what" },
      { serviceId: "rds", label: "RDS", iconFile: "rds.svg", hint: "SQL", tier: "what" },
      { serviceId: "dynamodb", label: "DynamoDB", iconFile: "dynamodb.svg", hint: "NoSQL", tier: "what" },
      { serviceId: "cloudfront", label: "CloudFront", iconFile: "cloudfront.svg", hint: "CDN", tier: "what" },
      { serviceId: "sns", label: "SNS", iconFile: "sns.svg", hint: "Messaging", tier: "what" },
      { serviceId: "sqs", label: "SQS", iconFile: "sqs.svg", hint: "Queues", tier: "what" },
      { serviceId: "route53", label: "Route 53", iconFile: "route53.svg", hint: "DNS", tier: "what" },
      { serviceId: "kms", label: "KMS", iconFile: "kms.svg", hint: "Encryption", tier: "what" },
    ],
  },
  // "aws-ai-practitioner": {
  //   id: "aws-ai-practitioner",
  //   title: "AWS Certified AI Practitioner",
  //   tagline: "Core AI/ML ideas and how services like Amazon Bedrock fit real workflows.",
  //   certificationTier: "foundational",
  //   certFamily: "ai-practitioner",
  //   targetAudience: "Beginners and cloud professionals new to applied AI on AWS.",
  //   knowledgeProfile: "Basic AI/ML vocabulary, responsible AI, and when to use managed AI services.",
  //   simpleGoalSummary: "Understand the What",
  //   active: true,
  //   services: [
  //     { serviceId: "s3", label: "S3", iconFile: "s3.svg", hint: "Data for models", tier: "what" },
  //     { serviceId: "lambda", label: "Lambda", iconFile: "lambda.svg", hint: "Inference glue", tier: "what" },
  //     { serviceId: "iam", label: "IAM", iconFile: "iam.svg", hint: "Access to models", tier: "what" },
  //     { serviceId: "kms", label: "KMS", iconFile: "kms.svg", hint: "Model & data keys", tier: "what" },
  //   ],
  // },
  "aws-solutions-architect-associate": {
    id: "aws-solutions-architect-associate",
    title: "AWS Certified Solutions Architect – Associate",
    tagline: "Cost-effective, resilient, scalable systems—Well-Architected thinking.",
    certificationTier: "associate",
    certFamily: "solutions-architect",
    targetAudience: "Professionals with ~1 year implementing solutions in AWS.",
    knowledgeProfile: "How services connect (e.g. EC2 to RDS through a VPC) and tradeoffs.",
    simpleGoalSummary: "Understand the How",
    active: true,
    services: [
      { serviceId: "vpc", label: "VPC", iconFile: "vpc.svg", hint: "Networking", tier: "how" },
      { serviceId: "ec2", label: "EC2", iconFile: "ec2.svg", hint: "Compute", tier: "how" },
      { serviceId: "lambda", label: "Lambda", iconFile: "lambda.svg", hint: "Serverless", tier: "how" },
      { serviceId: "s3", label: "S3", iconFile: "s3.svg", hint: "Storage", tier: "how" },
      { serviceId: "rds", label: "RDS", iconFile: "rds.svg", hint: "Databases", tier: "how" },
      { serviceId: "dynamodb", label: "DynamoDB", iconFile: "dynamodb.svg", hint: "NoSQL", tier: "how" },
      { serviceId: "cloudfront", label: "CloudFront", iconFile: "cloudfront.svg", hint: "Edge", tier: "why" },
      { serviceId: "iam", label: "IAM", iconFile: "iam.svg", hint: "AuthZ", tier: "why" },
      { serviceId: "kms", label: "KMS", iconFile: "kms.svg", hint: "Encryption", tier: "why" },
      { serviceId: "sns", label: "SNS", iconFile: "sns.svg", hint: "Events", tier: "what" },
      { serviceId: "sqs", label: "SQS", iconFile: "sqs.svg", hint: "Queues", tier: "what" },
      { serviceId: "route53", label: "Route 53", iconFile: "route53.svg", hint: "DNS", tier: "what" },
    ],
  },
  // "aws-developer-associate": {
  //   id: "aws-developer-associate",
  //   title: "AWS Certified Developer – Associate",
  //   tagline: "SDKs, APIs, Lambda, and CI/CD paths that ship software on AWS.",
  //   certificationTier: "associate",
  //   certFamily: "developer",
  //   targetAudience: "Developers with ~1 year building and maintaining AWS-backed applications.",
  //   knowledgeProfile: "Code against AWS APIs, serverless, deployment automation, and debugging.",
  //   simpleGoalSummary: "Understand the How",
  //   active: true,
  //   services: [
  //     { serviceId: "lambda", label: "Lambda", iconFile: "lambda.svg", hint: "Serverless code", tier: "how" },
  //     { serviceId: "iam", label: "IAM", iconFile: "iam.svg", hint: "Least privilege", tier: "how" },
  //     { serviceId: "dynamodb", label: "DynamoDB", iconFile: "dynamodb.svg", hint: "App data", tier: "how" },
  //     { serviceId: "s3", label: "S3", iconFile: "s3.svg", hint: "Artifacts & logs", tier: "how" },
  //     { serviceId: "sns", label: "SNS", iconFile: "sns.svg", hint: "Notifications", tier: "how" },
  //     { serviceId: "sqs", label: "SQS", iconFile: "sqs.svg", hint: "Async work", tier: "how" },
  //     { serviceId: "cloudfront", label: "CloudFront", iconFile: "cloudfront.svg", hint: "API & assets", tier: "what" },
  //     { serviceId: "vpc", label: "VPC", iconFile: "vpc.svg", hint: "Runtime network", tier: "how" },
  //     { serviceId: "kms", label: "KMS", iconFile: "kms.svg", hint: "Secrets & keys", tier: "why" },
  //   ],
  // },
  // "aws-cloudops-engineer-associate": {
  //   id: "aws-cloudops-engineer-associate",
  //   title: "AWS Certified SysOps Administrator – Associate",
  //   tagline: "Monitoring, automation, and keeping production stable—the most ops-forward Associate track.",
  //   certificationTier: "associate",
  //   certFamily: "cloudops",
  //   targetAudience: "SysOps and platform engineers with ~1 year operating AWS workloads.",
  //   knowledgeProfile: "Metrics, alarms, patching, scaling, and safe operational change.",
  //   simpleGoalSummary: "Understand the How",
  //   active: false,
  //   services: [
  //     { serviceId: "ec2", label: "EC2", iconFile: "ec2.svg", hint: "Instances", tier: "how" },
  //     { serviceId: "vpc", label: "VPC", iconFile: "vpc.svg", hint: "Network ops", tier: "how" },
  //     { serviceId: "sns", label: "SNS", iconFile: "sns.svg", hint: "Alerts", tier: "how" },
  //     { serviceId: "lambda", label: "Lambda", iconFile: "lambda.svg", hint: "Automation", tier: "how" },
  //   ],
  // },
  // "aws-data-engineer-associate": {
  //   id: "aws-data-engineer-associate",
  //   title: "AWS Certified Data Engineer – Associate",
  //   tagline: "Pipelines, lakes, and analytics—Glue, S3, Athena-style patterns (curriculum expanding).",
  //   certificationTier: "associate",
  //   certFamily: "data-engineer",
  //   targetAudience: "Data engineers building ingestion and transformation on AWS.",
  //   knowledgeProfile: "ETL/ELT, data lakes, cataloging, and query engines.",
  //   simpleGoalSummary: "Understand the How",
  //   active: false,
  //   services: [
  //     { serviceId: "s3", label: "S3", iconFile: "s3.svg", hint: "Data lake", tier: "how" },
  //     { serviceId: "lambda", label: "Lambda", iconFile: "lambda.svg", hint: "Transforms", tier: "how" },
  //     { serviceId: "dynamodb", label: "DynamoDB", iconFile: "dynamodb.svg", hint: "Operational store", tier: "what" },
  //   ],
  // },
  // "aws-ml-engineer-associate": {
  //   id: "aws-ml-engineer-associate",
  //   title: "AWS Certified Machine Learning Engineer – Associate",
  //   tagline: "ML pipelines and reliable model deployment on AWS (curriculum expanding).",
  //   certificationTier: "associate",
  //   certFamily: "ml-engineer",
  //   targetAudience: "Engineers shipping ML workloads with AWS building blocks.",
  //   knowledgeProfile: "Training vs inference, orchestration, and MLOps basics.",
  //   simpleGoalSummary: "Understand the How",
  //   active: false,
  //   services: [
  //     { serviceId: "s3", label: "S3", iconFile: "s3.svg", hint: "Datasets", tier: "how" },
  //     { serviceId: "lambda", label: "Lambda", iconFile: "lambda.svg", hint: "Inference hooks", tier: "how" },
  //     { serviceId: "iam", label: "IAM", iconFile: "iam.svg", hint: "Pipeline access", tier: "how" },
  //   ],
  // },
  // "aws-solutions-architect-professional": {
  //   id: "aws-solutions-architect-professional",
  //   title: "AWS Certified Solutions Architect – Professional",
  //   tagline: "Complex multi-account, multi-region designs and migration-scale scenarios.",
  //   certificationTier: "professional",
  //   certFamily: "solutions-architect",
  //   targetAudience: "Experts with 2+ years designing and operating large AWS systems.",
  //   knowledgeProfile: "Marathon scenarios: tradeoffs, resilience, cost, and governance across the estate.",
  //   simpleGoalSummary: "Understand the Why",
  //   active: false,
  //   services: [
  //     { serviceId: "vpc", label: "VPC", iconFile: "vpc.svg", hint: "Multi-tier design", tier: "why" },
  //     { serviceId: "iam", label: "IAM", iconFile: "iam.svg", hint: "Org-wide auth", tier: "why" },
  //     { serviceId: "kms", label: "KMS", iconFile: "kms.svg", hint: "Encryption strategy", tier: "why" },
  //     { serviceId: "cloudfront", label: "CloudFront", iconFile: "cloudfront.svg", hint: "Global edge", tier: "why" },
  //     { serviceId: "route53", label: "Route 53", iconFile: "route53.svg", hint: "Global DNS", tier: "how" },
  //     { serviceId: "s3", label: "S3", iconFile: "s3.svg", hint: "Data perimeter", tier: "why" },
  //   ],
  // },
  // "aws-devops-engineer-professional": {
  //   id: "aws-devops-engineer-professional",
  //   title: "AWS Certified DevOps Engineer – Professional",
  //   tagline: "Automation, governance, and continuous delivery at enterprise scale.",
  //   certificationTier: "professional",
  //   certFamily: "devops",
  //   targetAudience: "Senior engineers owning CI/CD and operational excellence across teams.",
  //   knowledgeProfile: "Pipelines, observability, policy-as-code, and safe high-velocity releases.",
  //   simpleGoalSummary: "Understand the Why",
  //   active: false,
  //   services: [
  //     { serviceId: "lambda", label: "Lambda", iconFile: "lambda.svg", hint: "Deploy automation", tier: "why" },
  //     { serviceId: "sns", label: "SNS", iconFile: "sns.svg", hint: "Ops events", tier: "how" },
  //     { serviceId: "sqs", label: "SQS", iconFile: "sqs.svg", hint: "Decouple pipelines", tier: "how" },
  //     { serviceId: "ec2", label: "EC2", iconFile: "ec2.svg", hint: "Fleet patterns", tier: "why" },
  //   ],
  // },
  // "aws-genai-developer-professional": {
  //   id: "aws-genai-developer-professional",
  //   title: "AWS Certified Generative AI Developer – Professional",
  //   tagline: "Production GenAI on Bedrock and SageMaker—RAG, evaluation, and safe rollout.",
  //   certificationTier: "professional",
  //   certFamily: "genai",
  //   targetAudience: "Builders shipping production GenAI apps and agents on AWS.",
  //   knowledgeProfile: "RAG architectures, model choice, guardrails, and cost/latency tradeoffs.",
  //   simpleGoalSummary: "Understand the Why",
  //   active: false,
  //   services: [
  //     { serviceId: "lambda", label: "Lambda", iconFile: "lambda.svg", hint: "Orchestration", tier: "why" },
  //     { serviceId: "s3", label: "S3", iconFile: "s3.svg", hint: "Corpora & artifacts", tier: "why" },
  //     { serviceId: "kms", label: "KMS", iconFile: "kms.svg", hint: "Data protection", tier: "why" },
  //     { serviceId: "iam", label: "IAM", iconFile: "iam.svg", hint: "Agent access", tier: "why" },
  //   ],
  // },
  // "aws-security-specialty": {
  //   id: "aws-security-specialty",
  //   title: "AWS Certified Security – Specialty",
  //   tagline: "Deep encryption, detective controls, and compliance patterns on AWS.",
  //   certificationTier: "specialty",
  //   certFamily: "security",
  //   targetAudience: "Security specialists with years in cloud IAM, data protection, and IR.",
  //   knowledgeProfile: "KMS, logging, incident response, and regulatory context (e.g. HIPAA/GDPR patterns).",
  //   simpleGoalSummary: "Understand the Niche",
  //   active: false,
  //   services: [
  //     { serviceId: "kms", label: "KMS", iconFile: "kms.svg", hint: "Keys & policies", tier: "niche" },
  //     { serviceId: "iam", label: "IAM", iconFile: "iam.svg", hint: "Permission boundaries", tier: "niche" },
  //     { serviceId: "vpc", label: "VPC", iconFile: "vpc.svg", hint: "Network segmentation", tier: "niche" },
  //     { serviceId: "cloudfront", label: "CloudFront", iconFile: "cloudfront.svg", hint: "Edge security", tier: "niche" },
  //     { serviceId: "s3", label: "S3", iconFile: "s3.svg", hint: "Object security", tier: "niche" },
  //   ],
  // },
  // "aws-advanced-networking-specialty": {
  //   id: "aws-advanced-networking-specialty",
  //   title: "AWS Certified Advanced Networking – Specialty",
  //   tagline: "Hybrid connectivity, BGP, and global VPC designs.",
  //   certificationTier: "specialty",
  //   certFamily: "advanced-networking",
  //   targetAudience: "Network engineers designing complex AWS and hybrid topologies.",
  //   knowledgeProfile: "Direct Connect, routing, multi-region DNS, and performance tuning.",
  //   simpleGoalSummary: "Understand the Niche",
  //   active: false,
  //   services: [
  //     { serviceId: "vpc", label: "VPC", iconFile: "vpc.svg", hint: "Advanced routing", tier: "niche" },
  //     { serviceId: "route53", label: "Route 53", iconFile: "route53.svg", hint: "DNS deep dives", tier: "niche" },
  //     { serviceId: "cloudfront", label: "CloudFront", iconFile: "cloudfront.svg", hint: "Edge networking", tier: "niche" },
  //     { serviceId: "ec2", label: "EC2", iconFile: "ec2.svg", hint: "ENI & placement", tier: "how" },
  //   ],
  // },
  // "aws-machine-learning-specialty": {
  //   id: "aws-machine-learning-specialty",
  //   title: "AWS Certified Machine Learning – Specialty",
  //   tagline: "Data science plus SageMaker training, deployment, and operations.",
  //   certificationTier: "specialty",
  //   certFamily: "machine-learning",
  //   targetAudience: "ML specialists owning models end-to-end on AWS.",
  //   knowledgeProfile: "Feature stores, training pipelines, inference endpoints, and monitoring.",
  //   simpleGoalSummary: "Understand the Niche",
  //   active: false,
  //   services: [
  //     { serviceId: "s3", label: "S3", iconFile: "s3.svg", hint: "Features & sets", tier: "niche" },
  //     { serviceId: "lambda", label: "Lambda", iconFile: "lambda.svg", hint: "Inference glue", tier: "niche" },
  //     { serviceId: "dynamodb", label: "DynamoDB", iconFile: "dynamodb.svg", hint: "Online features", tier: "niche" },
  //     { serviceId: "kms", label: "KMS", iconFile: "kms.svg", hint: "Model artifacts", tier: "why" },
  //   ],
  // },
};

export function listExams(): ExamDefinition[] {
  return Object.values(EXAMS).sort((a, b) => {
    const oa = programTierOrder[a.certificationTier];
    const ob = programTierOrder[b.certificationTier];
    if (oa !== ob) return oa - ob;
    return a.title.localeCompare(b.title);
  });
}

export function getExam(examId: string): ExamDefinition | null {
  return EXAMS[examId] ?? null;
}

export const tierSummary: Record<
  KnowledgeTier,
  { short: string; blurb: string; className: string }
> = {
  what: {
    short: "What",
    blurb: "Recognize the service and what it is for on the exam.",
    className: "border-sky-500/40 bg-sky-500/15 text-sky-200",
  },
  how: {
    short: "How",
    blurb: "How it connects to other services and typical configuration patterns.",
    className: "border-amber-500/40 bg-amber-500/15 text-amber-200",
  },
  why: {
    short: "Why",
    blurb: "Why choose it — tradeoffs, security, cost, and design rationale.",
    className: "border-orange-500/40 bg-orange-500/15 text-orange-200",
  },
  niche: {
    short: "Niche",
    blurb: "Deep, domain-specific detail expected on Specialty-level exams.",
    className: "border-violet-500/40 bg-violet-500/15 text-violet-200",
  },
};
