"use client";

import type { ReactNode } from "react";

/**
 * IAM mental model for the exam: Who → Policy (glue) → What on Which, optionally under Conditions.
 * Static SVG graph + legend; matches the “connected graph” teaching frame.
 */

function ArrowHead({ id }: { id: string }) {
  return (
    <defs>
      <marker id={id} markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
        <path d="M0,0 L8,4 L0,8 Z" className="fill-zinc-500" />
      </marker>
    </defs>
  );
}

function EdgeLabel({ x, y, children }: { x: number; y: number; children: ReactNode }) {
  return (
    <text
      x={x}
      y={y}
      textAnchor="middle"
      className="font-mono text-[9px] fill-amber-200/95 sm:text-[10px]"
    >
      {children}
    </text>
  );
}

export function IamConceptGraph() {
  return (
    <section className="rounded-2xl border border-white/10 bg-zinc-900/50 p-4 sm:p-5">
      <h2 className="font-sans text-lg font-semibold text-white">Visualizing IAM</h2>
      <p className="mt-2 max-w-3xl text-sm leading-relaxed text-zinc-400">
        The clearest mental model is a <span className="text-zinc-200">small graph</span>:{" "}
        <span className="font-medium text-sky-200">Who</span> is allowed to perform{" "}
        <span className="font-medium text-amber-200">What</span> actions on{" "}
        <span className="font-medium text-emerald-200">Which</span> resources, evaluated through{" "}
        <span className="font-medium text-orange-200">policies</span>—often with{" "}
        <span className="font-medium text-violet-200">conditions</span> tightening the path.
      </p>

      <ul className="mt-4 grid gap-2 text-xs text-zinc-500 sm:grid-cols-2 lg:grid-cols-4">
        <li className="rounded-lg border border-sky-500/25 bg-sky-500/10 px-3 py-2">
          <span className="font-semibold text-sky-200">Identities (Who?)</span> — users, groups, roles
          (each a principal you can attach policy to).
        </li>
        <li className="rounded-lg border border-orange-500/25 bg-orange-500/10 px-3 py-2">
          <span className="font-semibold text-orange-200">Policies (The glue)</span> — JSON documents
          that connect principals to allowed/denied API actions on ARNs.
        </li>
        <li className="rounded-lg border border-amber-500/25 bg-amber-500/10 px-3 py-2">
          <span className="font-semibold text-amber-200">Actions (What?)</span> — verbs such as{" "}
          <code className="text-amber-100/90">s3:GetObject</code>, carried on the edges the policy
          authorizes.
        </li>
        <li className="rounded-lg border border-emerald-500/25 bg-emerald-500/10 px-3 py-2">
          <span className="font-semibold text-emerald-200">Resources (Which thing?)</span> — real
          AWS objects identified by ARN (bucket, instance, DB).
        </li>
      </ul>

      <div className="mt-6 overflow-x-auto rounded-xl border border-white/10 bg-zinc-950/90 p-4">
        <svg
          viewBox="0 0 920 420"
          className="mx-auto h-auto w-full min-w-[640px] max-w-[920px]"
          role="img"
          aria-label="Diagram: IAM identities attach to a policy node that authorizes actions toward S3, EC2, and RDS resources, with an optional condition on the path."
        >
          <title>
            IAM as a graph: identities, policy junction, action-labeled edges, and resources
          </title>
          <ArrowHead id="arrow-zinc" />

          {/* Column guides (subtle) */}
          <text x="110" y="36" textAnchor="middle" className="text-xs font-semibold fill-zinc-500">
            Identities
          </text>
          <text x="460" y="36" textAnchor="middle" className="text-xs font-semibold fill-zinc-500">
            Policy (glue)
          </text>
          <text x="780" y="36" textAnchor="middle" className="text-xs font-semibold fill-zinc-500">
            Resources
          </text>

          {/* --- Identity nodes (left): distinct glyphs for user / group / role --- */}
          <g id="identity-user">
            <rect
              x="28"
              y="70"
              width="164"
              height="64"
              rx="12"
              className="fill-zinc-900 stroke-sky-400/50 stroke-2"
            />
            <circle cx="52" cy="102" r="14" className="fill-sky-500/25 stroke-sky-300/60 stroke" />
            <circle cx="52" cy="98" r="4" className="fill-sky-200" />
            <path d="M 44 108 Q 52 112 60 108" className="fill-none stroke-sky-200 stroke-[1.5]" />
            <text x="110" y="100" textAnchor="middle" className="text-sm font-semibold fill-sky-100">
              IAM user
            </text>
            <text x="110" y="120" textAnchor="middle" className="text-[10px] fill-zinc-500">
              long‑term human principal
            </text>
          </g>

          <g id="identity-group">
            <rect
              x="28"
              y="158"
              width="164"
              height="64"
              rx="12"
              className="fill-zinc-900 stroke-sky-400/50 stroke-2"
            />
            <g className="stroke-sky-200 fill-sky-200">
              <circle cx="44" cy="188" r="3.5" />
              <circle cx="52" cy="186" r="3.5" />
              <circle cx="60" cy="188" r="3.5" />
            </g>
            <path
              d="M 40 198 Q 52 204 64 198"
              className="fill-none stroke-sky-300/80 stroke-[1.5]"
            />
            <text x="110" y="188" textAnchor="middle" className="text-sm font-semibold fill-sky-100">
              IAM group
            </text>
            <text x="110" y="208" textAnchor="middle" className="text-[10px] fill-zinc-500">
              collection of users
            </text>
          </g>

          <g id="identity-role">
            <rect
              x="28"
              y="246"
              width="164"
              height="88"
              rx="12"
              className="fill-zinc-900 stroke-sky-400/50 stroke-2"
            />
            <path
              d="M 44 262 L 56 254 L 68 262 L 66 286 L 46 286 Z"
              className="fill-sky-500/20 stroke-sky-300/70 stroke-[1.5]"
            />
            <text x="110" y="278" textAnchor="middle" className="text-sm font-semibold fill-sky-100">
              IAM role
            </text>
            <text x="110" y="298" textAnchor="middle" className="text-[10px] fill-zinc-500">
              assumable principal
            </text>
            <text x="110" y="316" textAnchor="middle" className="text-[9px] fill-zinc-600">
              trust policy + permissions
            </text>
          </g>

          {/* --- Central policy node --- */}
          <g id="policy-glue">
            <rect
              x="340"
              y="140"
              width="240"
              height="140"
              rx="14"
              className="fill-zinc-900 stroke-orange-400/70 stroke-2"
            />
            <text x="460" y="178" textAnchor="middle" className="text-sm font-semibold fill-orange-100">
              Policy document
            </text>
            <text x="460" y="202" textAnchor="middle" className="text-[10px] fill-zinc-400">
              Effect · Action · Resource
            </text>
            <text x="460" y="228" textAnchor="middle" className="text-[10px] fill-zinc-500">
              (+ optional Condition keys)
            </text>
            <text x="460" y="256" textAnchor="middle" className="text-[9px] fill-orange-200/80">
              evaluation: explicit Deny wins
            </text>
          </g>

          {/* --- Resource nodes (right) with service icons via foreignObject is heavy; use image href) --- */}
          <g id="res-s3">
            <rect
              x="660"
              y="72"
              width="220"
              height="76"
              rx="12"
              className="fill-zinc-900 stroke-emerald-400/45 stroke-2"
            />
            <image href="/aws-icons/s3.svg" x="676" y="84" width="48" height="48" />
            <text x="740" y="108" textAnchor="start" className="text-sm font-semibold fill-emerald-100">
              S3 bucket
            </text>
            <text x="740" y="128" textAnchor="start" className="text-[10px] fill-zinc-500">
              ARN in Resource
            </text>
          </g>

          <g id="res-ec2">
            <rect
              x="660"
              y="168"
              width="220"
              height="76"
              rx="12"
              className="fill-zinc-900 stroke-emerald-400/45 stroke-2"
            />
            <image href="/aws-icons/ec2.svg" x="676" y="180" width="48" height="48" />
            <text x="740" y="204" textAnchor="start" className="text-sm font-semibold fill-emerald-100">
              EC2 instances
            </text>
            <text x="740" y="224" textAnchor="start" className="text-[10px] fill-zinc-500">
              ARN or wildcard
            </text>
          </g>

          <g id="res-rds">
            <rect
              x="660"
              y="264"
              width="220"
              height="76"
              rx="12"
              className="fill-zinc-900 stroke-emerald-400/45 stroke-2"
            />
            <image href="/aws-icons/rds.svg" x="676" y="276" width="48" height="48" />
            <text x="740" y="300" textAnchor="start" className="text-sm font-semibold fill-emerald-100">
              RDS database
            </text>
            <text x="740" y="320" textAnchor="start" className="text-[10px] fill-zinc-500">
              db ARN / cluster ARN
            </text>
          </g>

          {/* Edges: identities → policy */}
          <path
            d="M 192 102 C 260 102, 280 160, 340 190"
            fill="none"
            className="stroke-zinc-600 stroke-[1.5]"
            markerEnd="url(#arrow-zinc)"
          />
          <text x="252" y="92" textAnchor="middle" className="text-[10px] fill-zinc-500">
            inline / managed attach
          </text>

          <path
            d="M 192 190 C 270 190, 290 200, 340 205"
            fill="none"
            className="stroke-zinc-600 stroke-[1.5]"
            markerEnd="url(#arrow-zinc)"
          />

          <path
            d="M 192 290 C 250 290, 300 230, 340 215"
            fill="none"
            className="stroke-zinc-600 stroke-[1.5]"
            markerEnd="url(#arrow-zinc)"
          />
          <text x="248" y="308" textAnchor="middle" className="text-[10px] fill-zinc-500">
            role session policy (+)
          </text>

          {/* Edges: policy → resources (action labels) */}
          <path
            d="M 580 175 C 620 140, 640 120, 660 110"
            fill="none"
            className="stroke-amber-500/55 stroke-[1.75]"
            markerEnd="url(#arrow-zinc)"
          />
          <EdgeLabel x={628} y={128}>
            s3:GetObject
          </EdgeLabel>

          <path
            d="M 580 210 L 650 206"
            fill="none"
            className="stroke-amber-500/55 stroke-[1.75]"
            markerEnd="url(#arrow-zinc)"
          />
          <EdgeLabel x={612} y={198}>
            ec2:DescribeInstances
          </EdgeLabel>

          <path
            d="M 580 245 C 620 280, 640 300, 660 302"
            fill="none"
            className="stroke-amber-500/55 stroke-[1.75]"
            markerEnd="url(#arrow-zinc)"
          />
          <EdgeLabel x={628} y={288}>
            rds:DescribeDBInstances
          </EdgeLabel>

          {/* Resource policy path (S3) — dashed alternate */}
          <path
            d="M 770 148 C 800 40, 460 40, 400 120"
            fill="none"
            strokeDasharray="4 3"
            className="stroke-violet-400/40 stroke-[1.25]"
          />
          <text x="600" y="52" textAnchor="middle" className="text-[9px] fill-violet-300/90">
            resource policy on bucket (trusts who can access this ARN)
          </text>

          {/* Conditions callout */}
          <rect
            x="320"
            y="312"
            width="280"
            height="88"
            rx="10"
            className="fill-violet-950/40 stroke-violet-500/35 stroke"
          />
          <text x="460" y="342" textAnchor="middle" className="text-xs font-semibold fill-violet-200">
            Conditions (optional gate)
          </text>
          <text x="460" y="364" textAnchor="middle" className="text-[10px] fill-zinc-400">
            e.g. <tspan className="font-mono text-violet-200/90">IpAddress</tspan>,{" "}
            <tspan className="font-mono text-violet-200/90">StringEquals</tspan> on{" "}
            <tspan className="font-mono text-violet-200/90">aws:PrincipalOrgID</tspan>
          </text>
          <text x="460" y="386" textAnchor="middle" className="text-[9px] fill-zinc-600">
            narrows which requests match the statement
          </text>
        </svg>
      </div>

      <p className="mt-4 text-xs text-zinc-600">
        On the exam, trace a request: principal → which policies apply (identity, resource, SCPs in
        Organizations) → statement match → explicit deny overrides allow.
      </p>
    </section>
  );
}
