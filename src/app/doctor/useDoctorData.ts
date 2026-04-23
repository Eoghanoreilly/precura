"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  fetchAllAnnotations,
  fetchAllChatSessions,
  fetchAllPanels,
  fetchAllProfiles,
  postDoctorAnnotation,
} from "@/lib/data/doctor";
import type {
  Annotation,
  ChatSession,
  PanelWithBiomarkers,
  Profile,
} from "@/lib/data/types";
import { rollupPatient, sortPatients, type PatientRollup } from "./home/sortPatients";
import { buildMorningSummary, type MorningSummaryData } from "./home/buildMorningSummary";

export interface UseDoctorData {
  doctor: Profile | null;
  loading: boolean;
  error: string | null;

  patients: PatientRollup[];
  morningSummary: MorningSummaryData;

  activePatientId: string | null;
  activePatient: PatientRollup | null;
  selectPatient: (id: string | null) => void;

  writeNote: (args: { panelId: string; body: string }) => Promise<void>;
  isPosting: boolean;
  clearError: () => void;
  refresh: () => Promise<void>;
}

export function useDoctorData(): UseDoctorData {
  const [doctor, setDoctor] = useState<Profile | null>(null);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [panels, setPanels] = useState<PanelWithBiomarkers[]>([]);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activePatientId, setActivePatientId] = useState<string | null>(null);
  const [isPosting, setIsPosting] = useState(false);
  const loadCtrlRef = useRef<AbortController | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [allProfiles, allPanels, allAnnotations, allChat] = await Promise.all([
        fetchAllProfiles(),
        fetchAllPanels(),
        fetchAllAnnotations(),
        fetchAllChatSessions(),
      ]);
      setProfiles(allProfiles);
      setPanels(allPanels);
      setAnnotations(allAnnotations);
      setChatSessions(allChat);

      // Derive `doctor` from the current session's email via the profiles set.
      // We assume the active doctor profile has role === 'doctor' or 'both'.
      // RLS already ensures we only see allowlisted rows, so this is safe.
      const supabaseClientModule = await import("@/lib/supabase/client");
      const client = supabaseClientModule.createClient();
      const { data: userData } = await client.auth.getUser();
      const email = userData.user?.email?.toLowerCase();
      const found = allProfiles.find((p) => p.email.toLowerCase() === email);
      setDoctor(found ?? null);
    } catch (err) {
      setError((err as Error).message || "Failed to load roster");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    return () => {
      loadCtrlRef.current?.abort();
    };
  }, [load]);

  const patients = useMemo<PatientRollup[]>(() => {
    if (!doctor) return [];
    const rollups = profiles
      .filter((p) => p.id !== doctor.id)
      .map((p) => rollupPatient(p, panels, annotations, chatSessions, doctor.id));
    return sortPatients(rollups);
  }, [profiles, panels, annotations, chatSessions, doctor]);

  const morningSummary = useMemo(
    () => buildMorningSummary(patients),
    [patients],
  );

  const activePatient = useMemo(
    () => patients.find((p) => p.profile.id === activePatientId) ?? null,
    [patients, activePatientId],
  );

  const selectPatient = useCallback((id: string | null) => {
    setActivePatientId(id);
  }, []);

  const clearError = useCallback(() => setError(null), []);

  const writeNote = useCallback(
    async ({ panelId, body }: { panelId: string; body: string }) => {
      if (!doctor) {
        setError("No doctor session.");
        return;
      }
      const trimmed = body.trim();
      if (!trimmed) return;
      setIsPosting(true);
      setError(null);
      try {
        const saved = await postDoctorAnnotation({
          doctorId: doctor.id,
          panelId,
          body: trimmed,
        });
        setAnnotations((prev) => [saved, ...prev]);
      } catch (err) {
        setError((err as Error).message || "Failed to post note");
      } finally {
        setIsPosting(false);
      }
    },
    [doctor],
  );

  return {
    doctor,
    loading,
    error,
    patients,
    morningSummary,
    activePatientId,
    activePatient,
    selectPatient,
    writeNote,
    isPosting,
    clearError,
    refresh: load,
  };
}
