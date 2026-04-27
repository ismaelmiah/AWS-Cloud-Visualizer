import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import {
  applyAndSaveCheckpoint,
  getCheckpointProgressClerkId,
} from "@/lib/checkpoint-repository";
import { isSupabaseConfigured } from "@/lib/supabase/service";

function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

/** Returns the signed-in user's checkpoint progress (Supabase, with optional one-time Clerk migration). */
export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return jsonError("Unauthorized", 401);
  }

  try {
    const root = await getCheckpointProgressClerkId(userId);
    return NextResponse.json({
      checkpointProgress: root.checkpointProgress,
    });
  } catch (e) {
    return jsonError(e instanceof Error ? e.message : "Load failed", 500);
  }
}

type PatchBody = {
  trackId?: unknown;
  checkpointId?: unknown;
  completed?: unknown;
  quizBestScore?: unknown;
};

/** Merges a single checkpoint update into Supabase. */
export async function PATCH(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return jsonError("Unauthorized", 401);
  }

  if (!isSupabaseConfigured()) {
    return jsonError(
      "Progress storage is not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.",
      503
    );
  }

  let body: PatchBody;
  try {
    body = (await request.json()) as PatchBody;
  } catch {
    return jsonError("Invalid JSON body", 400);
  }

  const trackId = typeof body.trackId === "string" ? body.trackId : "";
  const checkpointId = typeof body.checkpointId === "string" ? body.checkpointId : "";
  const completed = typeof body.completed === "boolean" ? body.completed : undefined;
  const quizBestScore = typeof body.quizBestScore === "number" ? body.quizBestScore : undefined;

  if (!trackId || !checkpointId) {
    return jsonError("trackId and checkpointId are required", 400);
  }

  if (body.completed !== undefined && typeof body.completed !== "boolean") {
    return jsonError("completed must be a boolean when provided", 400);
  }

  if (body.quizBestScore !== undefined && typeof body.quizBestScore !== "number") {
    return jsonError("quizBestScore must be a number when provided", 400);
  }

  try {
    const next = await applyAndSaveCheckpoint(userId, {
      trackId,
      checkpointId,
      completed,
      quizBestScore,
    });
    return NextResponse.json({
      ok: true,
      checkpointProgress: next.checkpointProgress,
    });
  } catch (e) {
    return jsonError(e instanceof Error ? e.message : "Update failed", 400);
  }
}
