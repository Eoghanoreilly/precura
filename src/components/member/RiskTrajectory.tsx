"use client";

import React from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { C, SYSTEM_FONT } from "./tokens";

const ReactECharts = dynamic(() => import("echarts-for-react"), {
  ssr: false,
});

export function RiskTrajectory({
  history,
  projection,
  modelName,
  caption,
}: {
  history: { year: string; value: number }[];
  projection: { year: string; value: number }[];
  modelName: string;
  /** Plain-English sentence under the chart, e.g. italic-serif verdict. */
  caption?: string;
}) {
  const xLabels = [
    ...history.map((h) => h.year),
    ...projection.map((p) => p.year),
  ];

  // Build two series with null-padding so they sit on the same x-axis.
  const historySeries: (number | null)[] = [
    ...history.map((h) => h.value),
    ...projection.map(() => null),
  ];

  // Bridge series connects the last historical point into the projection.
  const projectionSeries: (number | null)[] = [
    ...history.slice(0, -1).map(() => null),
    history[history.length - 1].value,
    ...projection.slice(1).map((p) => p.value),
  ];

  // Emphasize the endpoint (today) with a larger symbol on the history series.
  const emphasizedHistorySeries = historySeries.map((v, i) =>
    i === history.length - 1 && v !== null
      ? {
          value: v,
          symbolSize: 11,
          itemStyle: {
            color: C.terracotta,
            borderColor: C.paper,
            borderWidth: 3,
          },
        }
      : v
  );

  // True sparkline: no axis labels, no grid, no percent y-axis. Only the
  // curve, the zone bands beneath it, and an emphasized endpoint that
  // marks "today". The caption below the chart carries the number verbally
  // so the chart isn't doing double-duty as a KPI display.
  const option = {
    grid: { top: 10, right: 12, bottom: 8, left: 12 },
    xAxis: {
      type: "category" as const,
      data: xLabels,
      boundaryGap: false,
      show: false,
    },
    yAxis: {
      type: "value" as const,
      max: 30,
      min: 0,
      show: false,
    },
    series: [
      // Zone bands via markArea - stronger opacity so they read
      {
        type: "line" as const,
        data: xLabels.map(() => null),
        silent: true,
        showSymbol: false,
        markArea: {
          silent: true,
          data: [
            [
              { yAxis: 0, itemStyle: { color: "rgba(78,142,92,0.18)" } },
              { yAxis: 15 },
            ],
            [
              { yAxis: 15, itemStyle: { color: "rgba(208,132,23,0.22)" } },
              { yAxis: 25 },
            ],
            [
              { yAxis: 25, itemStyle: { color: "rgba(196,71,42,0.22)" } },
              { yAxis: 30 },
            ],
          ],
        },
      },
      {
        name: "Measured",
        type: "line" as const,
        data: emphasizedHistorySeries,
        smooth: true,
        symbol: "circle",
        symbolSize: 0,
        lineStyle: { width: 3, color: C.terracotta },
        itemStyle: { color: C.terracotta },
        areaStyle: {
          color: {
            type: "linear" as const,
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: "rgba(201,87,58,0.32)" },
              { offset: 1, color: "rgba(201,87,58,0.02)" },
            ],
          },
        },
      },
      {
        name: "Projected",
        type: "line" as const,
        data: projectionSeries,
        smooth: true,
        symbol: "circle",
        symbolSize: 0,
        lineStyle: {
          width: 2,
          color: C.terracotta,
          type: "dashed" as const,
          opacity: 0.7,
        },
        itemStyle: { color: C.terracotta, opacity: 0.5 },
      },
    ],
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.5 }}
      style={{
        margin: "0 0 22px",
        padding: "22px 24px 18px",
        background: C.paper,
        border: `1px solid ${C.lineCard}`,
        borderRadius: 22,
        boxShadow: C.shadowCard,
        fontFamily: SYSTEM_FONT,
      }}
    >
      <div
        style={{
          fontSize: 10,
          fontWeight: 600,
          color: C.terracotta,
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          marginBottom: 6,
        }}
      >
        Your 10-year forecast
      </div>
      <div
        style={{
          fontSize: 17,
          fontWeight: 600,
          color: C.ink,
          letterSpacing: "-0.018em",
          lineHeight: 1.25,
          marginBottom: 14,
        }}
      >
        {modelName}
      </div>

      {caption && (
        <div
          style={{
            fontSize: "clamp(16px, 2vw, 19px)",
            lineHeight: 1.45,
            color: C.ink,
            fontStyle: "italic",
            fontFamily: 'Georgia, "Times New Roman", serif',
            marginBottom: 16,
            letterSpacing: "-0.01em",
          }}
        >
          {caption}
        </div>
      )}

      {/* Sparkline - no axes, no labels, just the curve + zone bands */}
      <div style={{ height: 120, marginTop: 4 }}>
        <ReactECharts
          option={option}
          style={{ height: "100%", width: "100%" }}
          opts={{ renderer: "svg" }}
        />
      </div>

      {/* Subtle legend */}
      <div
        style={{
          fontSize: 10,
          color: C.inkFaint,
          marginTop: 10,
          letterSpacing: "0.02em",
          fontStyle: "italic",
          fontFamily: 'Georgia, "Times New Roman", serif',
        }}
      >
        Solid: measured. Dashed: projected. Bands: low / moderate / high risk.
      </div>
    </motion.section>
  );
}
