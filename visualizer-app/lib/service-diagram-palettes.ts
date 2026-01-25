/** Short labels for free-form architecture chips (diagram canvas) per exam topic. */

const DEFAULT_LABELS = ["Users", "Edge", "App tier", "Data tier", "Management"];

const LABELS: Record<string, string[]> = {
  // SAA-C03 + shared ids
  iam: ["Principal", "Policy", "Action", "Resource", "Condition"],
  kms: ["CMK", "Data key", "Grant", "IAM + key policy", "Rotation"],
  vpc: ["VPC", "Subnet", "Route table", "IGW / NAT", "VPC endpoint"],
  ec2: ["AMI", "Instance", "ASG", "ALB", "EBS"],
  lambda: ["Event source", "Function", "Concurrency", "DLQ", "Layers"],
  "ecs-fargate": ["Task def", "Cluster", "Service", "Fargate", "ALB"],
  s3: ["Bucket", "Object", "Policy", "Storage class", "Replication"],
  ebs: ["Volume", "Snapshot", "AZ", "IOPS", "AMI"],
  efs: ["Mount target", "NFS", "AZ", "Perf mode", "SG"],
  "rds-aurora": ["Primary", "Replica", "Multi-AZ", "Subnet grp", "Params"],
  dynamodb: ["PK/SK", "GSI", "Streams", "TTL", "Global tables"],
  route53: ["Hosted zone", "Record", "Health check", "Failover", "Resolver"],
  cloudfront: ["Distribution", "Behavior", "Origin", "OAC/OAI", "WAF"],
  sqs: ["Queue", "Visibility", "DLQ", "FIFO", "Consumer"],
  cloudwatch: ["Metric", "Alarm", "Logs", "Dashboard", "Events"],
  // Cloud Practitioner (legacy service ids)
  rds: ["Primary DB", "Read replica", "Subnet group", "Backup", "Multi-AZ"],
  sns: ["Topic", "Subscriber", "Fan-out", "Filter", "DLQ"],
};

export function getDiagramLabelsForService(serviceId: string): string[] {
  return LABELS[serviceId] ?? DEFAULT_LABELS;
}
