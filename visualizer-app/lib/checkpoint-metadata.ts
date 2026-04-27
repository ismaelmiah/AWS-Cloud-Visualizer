/**
 * Checkpoint progress shape. Persisted in Supabase (`user_checkpoint_progress.checkpoint_data`).
 * Legacy: was also in Clerk `privateMetadata` (optional one-time read when migrating).
 */

export const CHECKPOINT_METADATA_VERSION = "v1" as const;

export type CheckpointRecord = {
  completed?: boolean;
  quizBestScore?: number;
  updatedAt: string;
};

export type TrackProgress = {
  checkpoints: Record<string, CheckpointRecord>;
};

export type CheckpointProgressV1 = {
  tracks: Record<string, TrackProgress>;
};

export type CheckpointProgressRoot = {
  checkpointProgress: {
    v1: CheckpointProgressV1;
  };
};

/** @deprecated — kept for reference; not used for Supabase persistence. */
export const MAX_CLERK_PRIVATE_METADATA_BYTES = 7500;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isCheckpointRecord(value: unknown): value is CheckpointRecord {
  if (!isRecord(value)) return false;
  if (typeof value.updatedAt !== "string") return false;
  if ("completed" in value && typeof value.completed !== "boolean") return false;
  if ("quizBestScore" in value && typeof value.quizBestScore !== "number") return false;
  return true;
}

/** Parses existing privateMetadata; returns normalized v1 progress or empty structure. */
export function parseCheckpointProgress(
  privateMetadata: Record<string, unknown> | null | undefined
): CheckpointProgressRoot {
  const raw = privateMetadata?.checkpointProgress;
  if (!isRecord(raw)) {
    return emptyCheckpointProgress();
  }
  const v1 = raw[CHECKPOINT_METADATA_VERSION];
  if (!isRecord(v1)) {
    return emptyCheckpointProgress();
  }
  const tracksRaw = v1.tracks;
  if (!isRecord(tracksRaw)) {
    return emptyCheckpointProgress();
  }

  const tracks: Record<string, TrackProgress> = {};
  for (const [trackId, trackVal] of Object.entries(tracksRaw)) {
    if (!isRecord(trackVal) || !isRecord(trackVal.checkpoints)) continue;
    const checkpoints: Record<string, CheckpointRecord> = {};
    for (const [cid, rec] of Object.entries(trackVal.checkpoints)) {
      if (isCheckpointRecord(rec) && typeof rec.updatedAt === "string") {
        checkpoints[cid] = {
          ...(typeof rec.completed === "boolean" ? { completed: rec.completed } : {}),
          ...(typeof rec.quizBestScore === "number" ? { quizBestScore: rec.quizBestScore } : {}),
          updatedAt: rec.updatedAt,
        };
      }
    }
    tracks[trackId] = { checkpoints };
  }

  return {
    checkpointProgress: {
      v1: { tracks },
    },
  };
}

export function emptyCheckpointProgress(): CheckpointProgressRoot {
  return {
    checkpointProgress: {
      v1: { tracks: {} },
    },
  };
}

export type MergeCheckpointInput = {
  trackId: string;
  checkpointId: string;
  completed?: boolean;
  quizBestScore?: number;
};

const ID_RE = /^[a-z0-9][a-z0-9-]{0,62}$/i;

export function validateCheckpointIds(trackId: string, checkpointId: string): string | null {
  if (!ID_RE.test(trackId)) return "Invalid trackId";
  if (!ID_RE.test(checkpointId)) return "Invalid checkpointId";
  return null;
}

/** Merges one checkpoint update into existing privateMetadata; returns full privateMetadata to persist. */
/** Applies a single checkpoint update; returns the next `CheckpointProgressRoot` for storage. */
export function applyCheckpointUpdate(
  current: CheckpointProgressRoot,
  input: MergeCheckpointInput
): { next: CheckpointProgressRoot; error?: string } {
  const idErr = validateCheckpointIds(input.trackId, input.checkpointId);
  if (idErr) return { next: current, error: idErr };

  if (input.quizBestScore !== undefined) {
    const s = input.quizBestScore;
    if (!Number.isFinite(s) || s < 0 || s > 100) {
      return { next: current, error: "quizBestScore must be between 0 and 100" };
    }
  }

  const { v1 } = current.checkpointProgress;
  const track = v1.tracks[input.trackId] ?? { checkpoints: {} };
  const prev = track.checkpoints[input.checkpointId];
  const now = new Date().toISOString();

  const nextRecord: CheckpointRecord = { updatedAt: now };
  if (typeof prev?.completed === "boolean" && input.completed === undefined) {
    nextRecord.completed = prev.completed;
  } else if (input.completed !== undefined) {
    nextRecord.completed = input.completed;
  } else if (typeof prev?.completed === "boolean") {
    nextRecord.completed = prev.completed;
  }

  if (prev?.quizBestScore !== undefined && input.quizBestScore === undefined) {
    nextRecord.quizBestScore = prev.quizBestScore;
  } else if (input.quizBestScore !== undefined) {
    const prevScore = prev?.quizBestScore;
    nextRecord.quizBestScore =
      typeof prevScore === "number" ? Math.max(prevScore, input.quizBestScore) : input.quizBestScore;
  } else if (typeof prev?.quizBestScore === "number") {
    nextRecord.quizBestScore = prev.quizBestScore;
  }

  const nextTracks = {
    ...v1.tracks,
    [input.trackId]: {
      checkpoints: {
        ...track.checkpoints,
        [input.checkpointId]: nextRecord,
      },
    },
  };

  return {
    next: {
      checkpointProgress: { v1: { tracks: nextTracks } },
    },
  };
}
