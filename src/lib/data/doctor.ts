"use client";

import { createClient } from "@/lib/supabase/client";
import type {
  Annotation,
  ChatSession,
  PanelWithBiomarkers,
  Profile,
} from "./types";

// ============================================================================
// Doctor-scope data helpers.
//
// Supabase RLS grants doctors read across all allowlisted users, so the fetches
// here do not filter by doctor id - the doctor sees every row they are allowed
// to see. The patient rollup sort (src/app/doctor/home/sortPatients.ts) turns
// these into an urgency-sorted patient list.
// ============================================================================

export async function fetchAllProfiles(): Promise<Profile[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data ?? []) as Profile[];
}

export async function fetchAllPanels(): Promise<PanelWithBiomarkers[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("panels")
    .select("*, biomarkers(*)")
    .order("panel_date", { ascending: false });
  if (error) throw error;
  return (data ?? []) as PanelWithBiomarkers[];
}

export async function fetchAllAnnotations(): Promise<Annotation[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("annotations")
    .select("*, author:profiles(display_name, role)")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as Annotation[];
}

export async function fetchAllChatSessions(): Promise<ChatSession[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("chat_sessions")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as ChatSession[];
}

/**
 * Post an annotation attached to a specific panel, authored by the doctor.
 *
 * The schema's `target_type` enum is `'panel' | 'biomarker'` only, so doctor
 * notes in v1 always attach to a panel. General notes (not tied to a panel)
 * are deferred until the schema is extended.
 */
export async function postDoctorAnnotation(args: {
  doctorId: string;
  panelId: string;
  body: string;
}): Promise<Annotation> {
  const supabase = createClient();
  const insert = {
    author_id: args.doctorId,
    target_type: "panel" as const,
    target_id: args.panelId,
    body: args.body,
  };
  const { data, error } = await supabase
    .from("annotations")
    .insert(insert)
    .select("*, author:profiles(display_name, role)")
    .single();
  if (error) throw error;
  return data as Annotation;
}

/**
 * Fetch all chat messages for a session. Reused by the Chat tab on the patient
 * file view so the doctor can read the patient's conversation history with
 * Precura as context (read-only).
 */
export async function fetchChatMessagesForSession(
  sessionId: string,
): Promise<{ role: "user" | "assistant"; content: string; created_at: string }[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("chat_messages")
    .select("role, content, created_at")
    .eq("session_id", sessionId)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data ?? []) as {
    role: "user" | "assistant";
    content: string;
    created_at: string;
  }[];
}
