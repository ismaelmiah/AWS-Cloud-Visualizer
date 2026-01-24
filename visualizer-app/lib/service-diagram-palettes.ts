/** Short labels for free-form architecture chips (diagram canvas) per exam topic. */

const DEFAULT_LABELS = ["Users", "Edge", "App tier", "Data tier", "Management"];

const LABELS: Record<string, string[]> = {
  iam: ["IAM user", "IAM role", "IAM policy", "MFA", "Resource ARN"],
  ec2: ["AMI", "EC2 instance", "Security group", "EBS volume", "Placement group"],
  "elb-asg": ["Internet", "ALB / NLB", "Target group", "Auto Scaling group", "Health checks"],
  "rds-aurora-elasticache": ["Primary DB", "Read replica", "Aurora cluster", "ElastiCache", "Subnet group"],
  route53: ["Hosted zone", "Record set", "Routing policy", "Health check", "Resolver"],
  s3: ["Bucket", "Object", "Versioning", "Lifecycle rule", "Bucket policy"],
  "cloudfront-global-accelerator": ["Origin", "CloudFront", "Edge location", "Global Accelerator", "Route 53"],
  "messaging-streaming": ["Producer", "SQS queue", "SNS topic", "Kinesis stream", "Consumer"],
  "containers-eks": ["Task / Pod", "Service", "Cluster", "Image registry", "Load balancer"],
  databases: ["OLTP workload", "OLAP workload", "DynamoDB", "RDS", "DMS"],
  "data-analytics": ["Data lake (S3)", "Catalog", "Query engine", "ETL job", "Dashboard"],
  "machine-learning": ["Training data", "Feature store", "Training job", "Model registry", "Endpoint"],
  "observability-governance": ["Metric", "Log", "Trace", "Audit trail", "Config rule"],
  "security-edge": ["KMS key", "Parameter Store", "Shield", "WAF ACL", "TLS"],
  vpc: ["VPC", "Subnet", "Route table", "IGW / NAT", "VPC endpoint"],
  "dr-migrations": ["Source env", "Replication", "AWS landing zone", "Cutover", "DNS flip"],
};

export function getDiagramLabelsForService(serviceId: string): string[] {
  return LABELS[serviceId] ?? DEFAULT_LABELS;
}
