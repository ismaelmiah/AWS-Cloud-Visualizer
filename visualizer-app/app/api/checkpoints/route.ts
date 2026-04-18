import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { mergeCheckpointIntoPrivateMetadata, parseCheckpointProgress } from "@/lib/checkpoint-metadata";

function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

/** Returns the signed-in user's checkpoint progress (from privateMetadata). */
export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return jsonError("Unauthorized", 401);
  }

  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  const pm = user.privateMetadata as Record<string, unknown> | undefined;

  return NextResponse.json({
    checkpointProgress: parseCheckpointProgress(pm).checkpointProgress,
  });
}

type PatchBody = {
  trackId?: unknown;
  checkpointId?: unknown;
  completed?: unknown;
  quizBestScore?: unknown;
};

/** Merges a single checkpoint update into Clerk privateMetadata. */
export async function PATCH(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return jsonError("Unauthorized", 401);
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

  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  const existingPrivate = user.privateMetadata as Record<string, unknown> | undefined;

  const merged = mergeCheckpointIntoPrivateMetadata(existingPrivate, {
    trackId,
    checkpointId,
    completed,
    quizBestScore,
  });

  if (merged.error || !merged.privateMetadata) {
    return jsonError(merged.error ?? "Merge failed", 400);
  }

  await client.users.updateUser(userId, { privateMetadata: merged.privateMetadata });

  const updated = await client.users.getUser(userId);
  const pm = updated.privateMetadata as Record<string, unknown> | undefined;

  return NextResponse.json({
    ok: true,
    checkpointProgress: parseCheckpointProgress(pm).checkpointProgress,
  });
}
