import { clerkClient } from "@clerk/nextjs/server";
import {
  applyCheckpointUpdate,
  emptyCheckpointProgress,
  parseCheckpointProgress,
  type CheckpointProgressRoot,
  type MergeCheckpointInput,
} from "./checkpoint-metadata";
import { getSupabaseService, isSupabaseConfigured } from "./supabase/service";

function hasCheckpointData(root: CheckpointProgressRoot): boolean {
  return Object.keys(root.checkpointProgress.v1.tracks).length > 0;
}

/**
 * Return checkpoint progress, migrating from Clerk `privateMetadata` on first read when a Supabase
 * row is missing. Optionally strips legacy `checkpointProgress` (and `architectureLab`) from Clerk
 * after a successful Supabase backfill.
 */
export async function getCheckpointProgressClerkId(userId: string): Promise<CheckpointProgressRoot> {
  if (!isSupabaseConfigured()) {
    const user = await (await clerkClient()).users.getUser(userId);
    return parseCheckpointProgress(user.privateMetadata as Record<string, unknown> | undefined);
  }

  const supabase = getSupabaseService();
  const { data, error } = await supabase
    .from("user_checkpoint_progress")
    .select("checkpoint_data, updated_at")
    .eq("clerk_user_id", userId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (data?.checkpoint_data) {
    return parseCheckpointProgress(data.checkpoint_data as Record<string, unknown>);
  }

  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  const fromClerk = parseCheckpointProgress(user.privateMetadata as Record<string, unknown> | undefined);

  if (hasCheckpointData(fromClerk)) {
    const { error: upErr } = await supabase.from("user_checkpoint_progress").upsert(
      {
        clerk_user_id: userId,
        checkpoint_data: fromClerk,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "clerk_user_id" }
    );
    if (upErr) {
      return fromClerk;
    }
    await clearClerkCheckpointAfterMigration(userId);
  }

  return fromClerk;
}

/** Removes only `checkpointProgress` from Clerk after a successful backfill; leaves other keys (e.g. legacy architecture index) until you move those separately. */
async function clearClerkCheckpointAfterMigration(userId: string) {
  try {
    const c = await clerkClient();
    const u = await c.users.getUser(userId);
    const pm = (u.privateMetadata as Record<string, unknown> | null) ?? {};
    if (!("checkpointProgress" in pm)) {
      return;
    }
    const next = { ...pm };
    delete next.checkpointProgress;
    await c.users.updateUser(userId, { privateMetadata: next });
  } catch {
    /* best-effort */
  }
}

export async function saveCheckpointProgressClerkId(
  userId: string,
  next: CheckpointProgressRoot
): Promise<CheckpointProgressRoot> {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase is not configured");
  }
  const supabase = getSupabaseService();
  const { error } = await supabase.from("user_checkpoint_progress").upsert(
    {
      clerk_user_id: userId,
      checkpoint_data: next,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "clerk_user_id" }
  );
  if (error) {
    throw new Error(error.message);
  }
  return next;
}

export async function applyAndSaveCheckpoint(
  userId: string,
  input: MergeCheckpointInput
): Promise<CheckpointProgressRoot> {
  const current = await getCheckpointProgressClerkId(userId);
  const { next, error: mergeErr } = applyCheckpointUpdate(current, input);
  if (mergeErr) {
    throw new Error(mergeErr);
  }
  return await saveCheckpointProgressClerkId(userId, next);
}
