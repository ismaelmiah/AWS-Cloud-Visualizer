import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { IamConceptGraph } from "@/components/preparation/iam-concept-graph";
import { ServiceDiagramCanvas } from "@/components/preparation/service-diagram-canvas";
import { ServiceMcqQuiz } from "@/components/preparation/service-mcq-quiz";
import { getExam, programTierMeta } from "@/lib/exams-curriculum";
import { getMcqsForService } from "@/lib/saa-quizzes";

type Props = {
  params: Promise<{ examId: string; serviceId: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { examId, serviceId } = await params;
  const exam = getExam(examId);
  const service = exam?.services.find((s) => s.serviceId === serviceId);
  if (!exam || !service) return { title: "Topic not found" };
  return {
    title: `${service.label} — ${exam.title}`,
    description: `${service.hint} · ${exam.tagline}`,
  };
}

export default async function PreparationServiceDetailPage({ params }: Props) {
  const { examId, serviceId } = await params;
  const exam = getExam(examId);
  if (!exam || !exam.active) notFound();
  const service = exam.services.find((s) => s.serviceId === serviceId);
  if (!service) notFound();

  const tier = programTierMeta[exam.certificationTier];
  const questions = getMcqsForService(serviceId);

  return (
    <div>
      <Link
        href={`/preparation/${examId}`}
        className="text-sm font-medium text-orange-400/90 transition hover:text-orange-300"
      >
        ← Back to {exam.title}
      </Link>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span
          className={`rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${tier.badgeClass}`}
        >
          {tier.label}
        </span>
        <span className="text-xs text-zinc-500">{exam.id}</span>
      </div>

      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start">
        <Image
          src={`/aws-icons/${service.iconFile}`}
          alt=""
          width={56}
          height={56}
          className="h-14 w-14 shrink-0 object-contain"
          aria-hidden
        />
        <div>
          <h1 className="font-sans text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            {service.label}
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-zinc-400 sm:text-base">{service.hint}</p>
        </div>
      </div>

      <div className="mt-10 flex flex-col gap-10">
        {serviceId === "iam" ? (
          <IamConceptGraph key={`${examId}-${serviceId}-iam-viz`} />
        ) : (
          <ServiceDiagramCanvas key={`${examId}-${serviceId}-diagram`} examId={examId} serviceId={serviceId} />
        )}
        <ServiceMcqQuiz key={`${examId}-${serviceId}-quiz`} examId={examId} serviceId={serviceId} questions={questions} />
      </div>
    </div>
  );
}
