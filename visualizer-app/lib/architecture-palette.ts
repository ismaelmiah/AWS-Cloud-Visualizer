/**
 * Core CLF/SAA-style service chips for the architecture lab.
 * `iconFile` is served from `/public/aws/icons` (or `/aws-icons/...` in the app).
 */

export type ArchitecturePaletteEntry = {
  id: string;
  label: string;
  /** file under public/aws-icons */
  iconFile: string;
};

export const ARCHITECTURE_PALETTE: ArchitecturePaletteEntry[] = [
  { id: "iam", label: "IAM", iconFile: "iam.svg" },
  { id: "vpc", label: "VPC", iconFile: "vpc.svg" },
  { id: "ec2", label: "EC2", iconFile: "ec2.svg" },
  { id: "lambda", label: "Lambda", iconFile: "lambda.svg" },
  { id: "s3", label: "S3", iconFile: "s3.svg" },
  { id: "rds", label: "RDS", iconFile: "rds.svg" },
  { id: "dynamodb", label: "DynamoDB", iconFile: "dynamodb.svg" },
  { id: "cloudfront", label: "CloudFront", iconFile: "cloudfront.svg" },
  { id: "route53", label: "Route 53", iconFile: "route53.svg" },
  { id: "sqs", label: "SQS", iconFile: "sqs.svg" },
  { id: "sns", label: "SNS", iconFile: "sns.svg" },
  { id: "kms", label: "KMS", iconFile: "kms.svg" },
];

const byId: Record<string, ArchitecturePaletteEntry> = Object.fromEntries(
  ARCHITECTURE_PALETTE.map((e) => [e.id, e])
);

export function getPaletteEntry(paletteId: string): ArchitecturePaletteEntry | undefined {
  return byId[paletteId];
}
