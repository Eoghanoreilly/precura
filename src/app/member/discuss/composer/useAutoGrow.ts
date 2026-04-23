"use client";

import { useEffect, useRef } from "react";

/**
 * useAutoGrow - grows a textarea element between min and max line heights
 * based on its content. Returns a ref to attach to the textarea.
 */
export function useAutoGrow({
  minRows = 1,
  maxRows = 6,
  lineHeight = 24,
}: {
  minRows?: number;
  maxRows?: number;
  lineHeight?: number;
} = {}) {
  const ref = useRef<HTMLTextAreaElement>(null);

  const resize = () => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    const minHeight = minRows * lineHeight;
    const maxHeight = maxRows * lineHeight;
    const next = Math.min(Math.max(el.scrollHeight, minHeight), maxHeight);
    el.style.height = `${next}px`;
    el.style.overflowY = el.scrollHeight > maxHeight ? "auto" : "hidden";
  };

  useEffect(() => {
    resize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { ref, resize };
}
