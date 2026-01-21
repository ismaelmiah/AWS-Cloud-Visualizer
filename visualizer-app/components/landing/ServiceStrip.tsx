"use client";

import Image from "next/image";

const services = [
  { id: "iam", file: "iam.svg", label: "IAM", hint: "Identity", name: "AWS Identity and Access Management" },
  { id: "vpc", file: "vpc.svg", label: "VPC", hint: "Networking", name: "Amazon Virtual Private Cloud" },
  { id: "s3", file: "s3.svg", label: "S3", hint: "Storage", name: "Amazon Simple Storage Service" },
  { id: "ec2", file: "ec2.svg", label: "EC2", hint: "Compute", name: "Amazon Elastic Compute Cloud" },
  { id: "lambda", file: "lambda.svg", label: "Lambda", hint: "Serverless", name: "AWS Lambda" },
  { id: "rds", file: "rds.svg", label: "RDS", hint: "Databases", name: "Amazon Relational Database Service" },
  { id: "cloudfront", file: "cloudfront.svg", label: "CloudFront", hint: "CDN", name: "Amazon CloudFront" },
  { id: "sns", file: "sns.svg", label: "SNS", hint: "Messaging", name: "Amazon Simple Notification Service" },
  { id: "sqs", file: "sqs.svg", label: "SQS", hint: "Queues", name: "Amazon Simple Queue Service" },
  { id: "dynamodb", file: "dynamodb.svg", label: "DynamoDB", hint: "NoSQL", name: "Amazon DynamoDB" },
  { id: "route53", file: "route53.svg", label: "Route 53", hint: "DNS", name: "Amazon Route 53" },
  { id: "kms", file: "kms.svg", label: "KMS", hint: "Encryption", name: "AWS Key Management Service" },
] as const;

const ICON = 48;

function ServiceTile({
  file,
  label,
  hint,
  name,
}: {
  file: string;
  label: string;
  hint: string;
  name: string;
}) {
  const src = `/aws-icons/${file}`;

  return (
    <div
      className="flex shrink-0 items-center gap-3 rounded-2xl border border-white/10 bg-zinc-900/70 px-4 py-3 backdrop-blur-sm transition hover:border-orange-500/35 hover:bg-zinc-800/90"
      title={name}
    >
      <Image
        src={src}
        alt=""
        width={ICON}
        height={ICON}
        className="h-12 w-12 shrink-0 object-contain"
        aria-hidden
      />
      <div className="flex min-w-0 flex-col justify-center leading-tight">
        <span className="font-mono text-sm font-semibold tracking-wide text-orange-200/95">{label}</span>
        <span className="mt-0.5 text-xs text-zinc-500">{hint}</span>
      </div>
    </div>
  );
}

export function ServiceStrip() {
  const row = (
    <>
      {services.map((s) => (
        <ServiceTile key={s.id} file={s.file} label={s.label} hint={s.hint} name={s.name} />
      ))}
    </>
  );

  return (
    <section className="border-y border-white/5 bg-zinc-950 py-14 overflow-hidden">
      <div className="mx-auto max-w-6xl px-4 text-center sm:px-6 lg:px-8">
        <p className="text-sm font-medium uppercase tracking-widest text-zinc-500">
          Services you will recognize on the exam
        </p>
        <p className="sr-only">
          Marquee of AWS services with icons, short labels, and hints. Hover any tile for the full official
          service name.
        </p>
      </div>

      <div className="relative mt-8">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-zinc-950 to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-zinc-950 to-transparent" />

        <div className="flex gap-3 landing-marquee py-2 sm:gap-4">
          <div className="flex min-w-max gap-3 pr-3 sm:gap-4 sm:pr-4">{row}</div>
          <div className="flex min-w-max gap-3 pr-3 sm:gap-4 sm:pr-4" aria-hidden>
            {services.map((s) => (
              <ServiceTile key={`dup-${s.id}`} file={s.file} label={s.label} hint={s.hint} name={s.name} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
