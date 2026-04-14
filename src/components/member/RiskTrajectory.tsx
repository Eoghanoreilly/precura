"use client";

import React from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { C, SYSTEM_FONT, DISPLAY_NUM } from "./tokens";

const ReactECharts = dynamic(() => import("echarts-for-react"), {
  ssr: false,
});

export function RiskTrajectory({
  history,
  projection,
  currentLabel,
  modelName,
  riskLabel,
  caption,
}: {
  history: { year: string; value: number }[];
  projection: { year: string; value: number }[];
  currentLabel: string;
  modelName: string;
  riskLabel: string;
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

  const option = {
    grid: { top: 16, right: 16, bottom: 28, left: 40 },
    xAxis: {
      type: "category" as const,
      data: xLabels,
      boundaryGap: false,
      axisLine: { lineStyle: { color: C.lineCard } },
      axisTick: { show: false },
      axisLabel: {
        color: C.inkFaint,
        fontSize: 10,
        fontFamily: SYSTEM_FONT,
        interval: 1,
      },
    },
    yAxis: {
      type: "value" as const,
      max: 30,
      min: 0,
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { show: false },
      axisLabel: {
        color: C.inkFaint,
        fontSize: 10,
        fontFamily: SYSTEM_FONT,
        formatter: "{value}%",
      },
    },
    series: [
      // Zone bands as a hidden line with markArea backgrounds
      {
        type: "line" as const,
        data: xLabels.map(() => null),
        silent: true,
        showSymbol: false,
        markArea: {
          silent: true,
          data: [
            [
              { yAxis: 0, itemStyle: { color: "rgba(78,142,92,0.10)" } },
              { yAxis: 15 },
            ],
            [
              { yAxis: 15, itemStyle: { color: "rgba(208,132,23,0.12)" } },
              { yAxis: 25 },
            ],
            [
              { yAxis: 25, itemStyle: { color: "rgba(196,71,42,0.14)" } },
              { yAxis: 30 },
            ],
          ],
        },
        markLine: {
          silent: true,
          symbol: "none",
          lineStyle: { color: C.sage, type: "dashed", width: 1, opacity: 0.5 },
          label: {
            show: true,
            position: "insideStartTop",
            formatter: "low risk",
            fontSize: 9,
            color: C.sageDeep,
            fontFamily: SYSTEM_FONT,
          },
          data: [{ yAxis: 15 }],
        },
      },
      {
        name: "Measured",
        type: "line" as const,
        data: emphasizedHistorySeries,
        smooth: true,
        symbol: "circle",
        symbolSize: 6,
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
              { offset: 0, color: "rgba(201,87,58,0.22)" },
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
        symbolSize: 5,
        lineStyle: {
          width: 2,
          color: C.terracotta,
          type: "dashed" as const,
          opacity: 0.6,
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
        margin: "4px 20px 18px",
        padding: "22px 22px 14px",
        background: C.paper,
        border: `1px solid ${C.lineCard}`,
        borderRadius: 22,
        boxShadow: C.shadowCard,
        fontFamily: SYSTEM_FONT,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: 4,
          gap: 12,
        }}
      >
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontSize: 10,
              fontWeight: 600,
              color: C.terracotta,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              marginBottom: 5,
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
              marginBottom: 2,
            }}
          >
            {modelName}
          </div>
          <div
            style={{
              fontSize: 12,
              color: C.inkMuted,
              letterSpacing: "-0.005em",
            }}
          >
            {riskLabel}
          </div>
        </div>
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <div
            style={{
              ...DISPLAY_NUM,
              fontSize: 32,
              color: C.terracotta,
              lineHeight: 1,
            }}
          >
            {currentLabel}
          </div>
          <div
            style={{
              fontSize: 10,
              color: C.inkFaint,
              marginTop: 3,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}
          >
            today
          </div>
        </div>
      </div>
      <div style={{ height: 190, marginTop: 10 }}>
        <ReactECharts
          option={option}
          style={{ height: "100%", width: "100%" }}
          opts={{ renderer: "svg" }}
        />
      </div>
      {caption && (
        <div
          style={{
            fontSize: 14,
            lineHeight: 1.5,
            color: C.inkSoft,
            marginTop: 10,
            fontStyle: "italic",
            fontFamily: 'Georgia, "Times New Roman", serif',
          }}
        >
          {caption}
        </div>
      )}
      <div
        style={{
          fontSize: 10,
          color: C.inkFaint,
          marginTop: caption ? 8 : 4,
          letterSpacing: "0.02em",
        }}
      >
        Solid line: measured. Dashed line: projected by the model. Bands:
        low risk (green), moderate (amber), high (red).
      </div>
    </motion.section>
  );
}
