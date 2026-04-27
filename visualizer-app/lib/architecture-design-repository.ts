import {
  MAX_SAVED_DESIGNS,
  toDesignsSorted,
  type ArchitectureDesignWithFlow,
  validateDesignId,
  validateTitle,
} from "./architecture-metadata";
import type { ArchitectureFlowDocumentV1 } from "./architecture-flow-document";
import { parseArchitectureFlowDocument } from "./architecture-flow-document";
import { getSupabaseService, isSupabaseConfigured } from "./supabase/service";

type DbRow = {
  id: string;
  clerk_user_id: string;
  title: string;
  flow_data: unknown;
  last_opened_at: string | null;
  created_at: string;
  updated_at: string;
};

function rowToDesign(r: DbRow): ArchitectureDesignWithFlow {
  const flow = parseArchitectureFlowDocument(r.flow_data);
  return {
    id: r.id,
    title: r.title,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
    ...(r.last_opened_at ? { lastOpenedAt: r.last_opened_at } : {}),
    flow,
  };
}

export async function listDesignsForUser(userId: string): Promise<ArchitectureDesignWithFlow[]> {
  if (!isSupabaseConfigured()) {
    return [];
  }
  const supabase = getSupabaseService();
  const { data, error } = await supabase
    .from("architecture_designs")
    .select("*")
    .eq("clerk_user_id", userId)
    .order("updated_at", { ascending: false });
  if (error) {
    throw new Error(error.message);
  }
  const rows = (data as DbRow[]) ?? [];
  return toDesignsSorted(rows.map(rowToDesign));
}

export async function countDesignsForUser(userId: string): Promise<number> {
  const supabase = getSupabaseService();
  const { count, error } = await supabase
    .from("architecture_designs")
    .select("id", { count: "exact", head: true })
    .eq("clerk_user_id", userId);
  if (error) {
    throw new Error(error.message);
  }
  return count ?? 0;
}

export async function upsertDesign(
  userId: string,
  id: string,
  title: string,
  flow: ArchitectureFlowDocumentV1
): Promise<ArchitectureDesignWithFlow[]> {
  const idErr = validateDesignId(id);
  if (idErr) {
    throw new Error(idErr);
  }
  const tErr = validateTitle(title);
  if (tErr) {
    throw new Error(tErr);
  }
  const flowValid = parseArchitectureFlowDocument(flow);
  const n = await countDesignsForUser(userId);
  const supabase = getSupabaseService();
  const { data: existing } = await supabase
    .from("architecture_designs")
    .select("id")
    .eq("clerk_user_id", userId)
    .eq("id", id)
    .maybeSingle();
  if (!existing && n >= MAX_SAVED_DESIGNS) {
    throw new Error(`At most ${MAX_SAVED_DESIGNS} saved designs. Delete one to add another.`);
  }
  const now = new Date().toISOString();
  if (existing) {
    const { error: upErr } = await supabase
      .from("architecture_designs")
      .update({
        title: title.trim(),
        flow_data: flowValid,
        updated_at: now,
      })
      .eq("clerk_user_id", userId)
      .eq("id", id);
    if (upErr) {
      throw new Error(upErr.message);
    }
  } else {
    const { error: insErr } = await supabase.from("architecture_designs").insert({
      id,
      clerk_user_id: userId,
      title: title.trim(),
      flow_data: flowValid,
      created_at: now,
      updated_at: now,
    });
    if (insErr) {
      throw new Error(insErr.message);
    }
  }
  return listDesignsForUser(userId);
}

export async function patchDesign(
  userId: string,
  id: string,
  opts: { title?: string; touchOpened?: boolean }
): Promise<ArchitectureDesignWithFlow[]> {
  const idErr = validateDesignId(id);
  if (idErr) {
    throw new Error(idErr);
  }
  const supabase = getSupabaseService();
  const { data: row, error: fetchErr } = await supabase
    .from("architecture_designs")
    .select("id, title, created_at, updated_at, last_opened_at, flow_data")
    .eq("clerk_user_id", userId)
    .eq("id", id)
    .maybeSingle();
  if (fetchErr) {
    throw new Error(fetchErr.message);
  }
  if (!row) {
    throw new Error("Design not found");
  }
  const now = new Date().toISOString();
  const nextTitle =
    opts.title !== undefined
      ? (() => {
          const e = validateTitle(opts.title);
          if (e) throw new Error(e);
          return opts.title.trim();
        })()
      : (row as { title: string }).title;
  const { error: upErr } = await supabase
    .from("architecture_designs")
    .update({
      title: nextTitle,
      updated_at: now,
      ...(opts.touchOpened ? { last_opened_at: now } : {}),
    })
    .eq("clerk_user_id", userId)
    .eq("id", id);
  if (upErr) {
    throw new Error(upErr.message);
  }
  return listDesignsForUser(userId);
}

export async function deleteDesign(
  userId: string,
  id: string
): Promise<ArchitectureDesignWithFlow[]> {
  const idErr = validateDesignId(id);
  if (idErr) {
    throw new Error(idErr);
  }
  const supabase = getSupabaseService();
  const { error } = await supabase
    .from("architecture_designs")
    .delete()
    .eq("clerk_user_id", userId)
    .eq("id", id);
  if (error) {
    throw new Error(error.message);
  }
  return listDesignsForUser(userId);
}
