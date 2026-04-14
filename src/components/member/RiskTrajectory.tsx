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
  currentLabel,
  modelName,
  riskLabel,
}: {
  history: { year: string; value: number }[];
  projection: { year: string; value: number }[];
  currentLabel: string;
  modelName: string;
  riskLabel: string;
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

  const option = {
    grid: { top: 16, right: 12, bottom: 28, left: 36 },
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
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { lineStyle: { color: C.lineSoft, type: "dashed" as const } },
      axisLabel: {
        color: C.inkFaint,
        fontSize: 10,
        fontFamily: SYSTEM_FONT,
        formatter: "{value}%",
      },
    },
    series: [
      {
        name: "Measured",
        type: "line" as const,
        data: historySeries,
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
              fontSize: 30,
              fontWeight: 600,
              color: C.terracotta,
              letterSpacing: "-0.022em",
              lineHeight: 1,
              fontFamily: '"SF Mono", ui-monospace, monospace',
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
      <div style={{ height: 170, marginTop: 10 }}>
        <ReactECharts
          option={option}
          style={{ height: "100%", width: "100%" }}
          opts={{ renderer: "svg" }}
        />
      </div>
      <div
        style={{
          fontSize: 10,
          color: C.inkFaint,
          marginTop: 4,
          textAlign: "center",
          letterSpacing: "0.02em",
        }}
      >
        Solid: measured. Dashed: projected by the model.
      </div>
    </motion.section>
  );
}
