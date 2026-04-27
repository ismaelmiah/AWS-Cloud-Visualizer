import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import {
  deleteDesign,
  listDesignsForUser,
  patchDesign,
  upsertDesign,
} from "@/lib/architecture-design-repository";
import type { ArchitectureFlowDocumentV1 } from "@/lib/architecture-flow-document";
import { isSupabaseConfigured } from "@/lib/supabase/service";

function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

function notConfiguredResponse() {
  if (!isSupabaseConfigured()) {
    return jsonError(
      "Design storage is not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY, then run the SQL migration in supabase/migrations.",
      503
    );
  }
  return null;
}

export async function GET() {
  const nc = notConfiguredResponse();
  if (nc) return nc;

  const { userId } = await auth();
  if (!userId) {
    return jsonError("Unauthorized", 401);
  }
  try {
    const designs = await listDesignsForUser(userId);
    return NextResponse.json({ designs });
  } catch (e) {
    return jsonError(e instanceof Error ? e.message : "Load failed", 500);
  }
}

type PostBody = {
  id?: unknown;
  title?: unknown;
  flow?: unknown;
};

type PatchBody = {
  id?: unknown;
  title?: unknown;
  touchOpened?: unknown;
};

type DeleteBody = {
  id?: unknown;
};

export async function POST(request: Request) {
  const nc = notConfiguredResponse();
  if (nc) return nc;

  const { userId } = await auth();
  if (!userId) {
    return jsonError("Unauthorized", 401);
  }

  let body: PostBody;
  try {
    body = (await request.json()) as PostBody;
  } catch {
    return jsonError("Invalid JSON body", 400);
  }

  const id = typeof body.id === "string" ? body.id : "";
  const title = typeof body.title === "string" ? body.title : "";
  const flow = body.flow as ArchitectureFlowDocumentV1 | undefined;
  if (!id || !title) {
    return jsonError("id and title are required", 400);
  }
  if (flow === undefined || flow === null) {
    return jsonError("flow is required", 400);
  }

  try {
    const designs = await upsertDesign(userId, id, title, flow);
    return NextResponse.json({ ok: true, designs });
  } catch (e) {
    return jsonError(e instanceof Error ? e.message : "Save failed", 400);
  }
}

export async function PATCH(request: Request) {
  const nc = notConfiguredResponse();
  if (nc) return nc;

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

  const id = typeof body.id === "string" ? body.id : "";
  if (!id) {
    return jsonError("id is required", 400);
  }

  const hasTitle = body.title !== undefined;
  const touchOpened = body.touchOpened === true;
  if (hasTitle) {
    if (typeof body.title !== "string") {
      return jsonError("title must be a string", 400);
    }
  } else if (!touchOpened) {
    return jsonError("title or touchOpened required", 400);
  }

  try {
    const designs = await patchDesign(userId, id, {
      ...(hasTitle ? { title: body.title as string } : {}),
      ...(touchOpened ? { touchOpened: true } : {}),
    });
    return NextResponse.json({ ok: true, designs });
  } catch (e) {
    return jsonError(e instanceof Error ? e.message : "Update failed", 400);
  }
}

export async function DELETE(request: Request) {
  const nc = notConfiguredResponse();
  if (nc) return nc;

  const { userId } = await auth();
  if (!userId) {
    return jsonError("Unauthorized", 401);
  }

  let body: DeleteBody;
  try {
    body = (await request.json()) as DeleteBody;
  } catch {
    return jsonError("Invalid JSON body", 400);
  }

  const id = typeof body.id === "string" ? body.id : "";
  if (!id) {
    return jsonError("id is required", 400);
  }

  try {
    const designs = await deleteDesign(userId, id);
    return NextResponse.json({ ok: true, designs });
  } catch (e) {
    return jsonError(e instanceof Error ? e.message : "Delete failed", 400);
  }
}
