/** Shape returned by GET /api/checkpoints (subset used by the client). */

export type CheckpointRecordDto = {
  completed?: boolean;
  quizBestScore?: number;
  updatedAt?: string;
};

export type CheckpointProgressResponse = {
  checkpointProgress: {
    v1: {
      tracks: Record<string, { checkpoints: Record<string, CheckpointRecordDto> }>;
    };
  };
};

/**
 * Display % for a topic: best quiz score wins; otherwise 100% if marked completed.
 * Matches ServiceStrip / preparation grid behavior.
 */
export function topicProgressPercent(rec: CheckpointRecordDto | undefined): number {
  if (!rec) return 0;
  if (typeof rec.quizBestScore === "number" && Number.isFinite(rec.quizBestScore)) {
    return Math.round(Math.min(100, Math.max(0, rec.quizBestScore)));
  }
  if (rec.completed === true) return 100;
  return 0;
}
