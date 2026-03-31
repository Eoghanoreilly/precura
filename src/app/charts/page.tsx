"use client";

import { useEffect, useRef, useState } from "react";
import ReactECharts from "echarts-for-react";
import "echarts-gl";

const BELL_DATA: [number, number][] = [];
for (let x = 0; x <= 26; x += 0.5) {
  BELL_DATA.push([x, Math.exp(-0.5 * Math.pow((x - 8) / 4, 2))]);
}

export default function ChartsPage() {
  return (
    <div style={{ background: "#f8f9fa", minHeight: "100dvh", padding: "20px 16px 60px" }}>
      <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4, color: "#1a1a2e" }}>Chart Gallery v2</h1>
      <p style={{ fontSize: 12, color: "#8b8da3", marginBottom: 20 }}>Your 3 picks + 30 new genuinely different charts. Touch/drag to interact.</p>

      <div style={{ display: "flex", flexDirection: "column", gap: 14, maxWidth: 500, margin: "0 auto" }}>

        {/* ============================================ */}
        {/* YOUR PICKS */}
        {/* ============================================ */}
        <SectionTitle text="YOUR PICKS" />

        <Label n={1} title="Bell curve - Gradient zones green to red (YOUR PICK #14) + avg line" />
        <Card>
          <ReactECharts opts={{ renderer: "svg" }} style={{ height: 170 }} option={{
            grid: { top: 28, right: 16, bottom: 20, left: 16 },
            xAxis: { type: "value", min: 0, max: 26, show: false },
            yAxis: { type: "value", show: false },
            series: [{ type: "line", smooth: 0.6, symbol: "none", data: BELL_DATA, lineStyle: { width: 2.5, color: { type: "linear", x: 0, y: 0, x2: 1, y2: 0, colorStops: [{ offset: 0, color: "#4caf50" }, { offset: 0.4, color: "#26a69a" }, { offset: 0.55, color: "#ff9800" }, { offset: 0.8, color: "#ef5350" }, { offset: 1, color: "#c62828" }] } }, areaStyle: { color: { type: "linear", x: 0, y: 0, x2: 1, y2: 0, colorStops: [{ offset: 0, color: "rgba(76,175,80,0.2)" }, { offset: 0.4, color: "rgba(38,166,154,0.15)" }, { offset: 0.55, color: "rgba(255,152,0,0.15)" }, { offset: 0.8, color: "rgba(239,83,80,0.15)" }, { offset: 1, color: "rgba(198,40,40,0.1)" }] } },
              markLine: { silent: true, symbol: "none", data: [{ xAxis: 8, lineStyle: { color: "#9e9e9e", type: "dashed", width: 1.5 }, label: { formatter: "Avg (age 35-45)", position: "insideEndTop", fontSize: 10, color: "#9e9e9e", distance: 4 } }] },
              markPoint: { symbol: "circle", symbolSize: 16, animation: true, animationEasing: "elasticOut", data: [{ coord: [11, Math.exp(-0.5 * Math.pow((11-8)/4, 2))], itemStyle: { color: "#ff9800", borderColor: "#fff", borderWidth: 3, shadowColor: "rgba(0,0,0,0.2)", shadowBlur: 8 }, label: { show: true, formatter: "You", position: "top", fontSize: 11, fontWeight: 700, color: "#ff9800", distance: 10 } }] },
            }],
            animation: true, animationDuration: 1200, animationEasing: "cubicOut",
          }} />
        </Card>

        <Label n={2} title="Range bar - Green zone, triangle marker (YOUR PICK #22)" />
        <Card><div style={{ padding: "12px 0" }}>
          <div style={{ position: "relative", height: 12, borderRadius: 6, background: "#f5f5f5" }}>
            <div style={{ position: "absolute", left: "30%", width: "40%", height: "100%", borderRadius: 6, background: "rgba(76,175,80,0.15)", border: "1px solid rgba(76,175,80,0.3)" }} />
            <div style={{ position: "absolute", left: "55%", top: -7, transform: "translateX(-50%)" }}><div style={{ width: 0, height: 0, borderLeft: "6px solid transparent", borderRight: "6px solid transparent", borderTop: "8px solid #4caf50" }} /></div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: 10, color: "#999" }}><span>20</span><span style={{ color: "#4caf50", fontWeight: 600 }}>38</span><span>42</span></div>
        </div></Card>

        <Label n={3} title="Zone bar - Colored segments, white dot (YOUR PICK #30)" />
        <Card><div style={{ padding: "8px 0" }}>
          <div style={{ display: "flex", height: 20, borderRadius: 10, overflow: "hidden", position: "relative" }}>
            <div style={{ width: "27%", background: "#4caf50" }} />
            <div style={{ width: "19%", background: "#26a69a" }} />
            <div style={{ width: "12%", background: "#ff9800" }} />
            <div style={{ width: "23%", background: "#ef5350" }} />
            <div style={{ width: "19%", background: "#c62828" }} />
            <div style={{ position: "absolute", left: "42%", top: "50%", transform: "translate(-50%,-50%)", width: 16, height: 16, borderRadius: "50%", background: "#fff", border: "3px solid #ff9800", boxShadow: "0 2px 6px rgba(0,0,0,0.2)" }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: 9, color: "#999" }}>
            <span>Low</span><span>Slight</span><span>Mod</span><span>High</span><span>V.High</span>
          </div>
        </div></Card>

        {/* ============================================ */}
        {/* TREND LINES - GENUINELY DIFFERENT */}
        {/* ============================================ */}
        <SectionTitle text="TREND LINES - DIFFERENT APPROACHES" />

        <Label n={4} title="Trend - Animated drawing line (watch it draw)" />
        <Card>
          <AnimatedLine />
        </Card>

        <Label n={5} title="Trend - Zone background bands with gradient line" />
        <Card>
          <ReactECharts opts={{ renderer: "svg" }} style={{ height: 200 }} option={{
            grid: { top: 16, right: 12, bottom: 28, left: 40 },
            xAxis: { type: "category", data: ["Oct 25", "Dec 25", "Jan 26", "Mar 26"], axisLabel: { fontSize: 10, color: "#999" }, axisLine: { show: false }, axisTick: { show: false } },
            yAxis: { type: "value", min: 0, max: 26, splitLine: { show: false }, axisLabel: { fontSize: 10, color: "#999" }, axisLine: { show: false }, axisTick: { show: false } },
            series: [{ type: "line", smooth: 0.3, data: [6, 7, 8, 10], symbol: "circle", symbolSize: 10, itemStyle: { color: "#fff", borderWidth: 3, borderColor: "#7c4dff" }, lineStyle: { width: 3, color: { type: "linear", x: 0, y: 0, x2: 1, y2: 0, colorStops: [{ offset: 0, color: "#4caf50" }, { offset: 1, color: "#ff9800" }] } },
              markArea: { silent: true, data: [[{ yAxis: 0, itemStyle: { color: "rgba(76,175,80,0.06)" } }, { yAxis: 7 }], [{ yAxis: 7, itemStyle: { color: "rgba(38,166,154,0.06)" } }, { yAxis: 12 }], [{ yAxis: 12, itemStyle: { color: "rgba(255,152,0,0.08)" } }, { yAxis: 15 }], [{ yAxis: 15, itemStyle: { color: "rgba(239,83,80,0.06)" } }, { yAxis: 26 }]] },
            }],
            tooltip: { trigger: "axis" },
            animation: true, animationDuration: 1500,
          }} />
        </Card>

        <Label n={6} title="Trend - Thick line with data labels on points" />
        <Card>
          <ReactECharts opts={{ renderer: "svg" }} style={{ height: 200 }} option={{
            grid: { top: 30, right: 20, bottom: 28, left: 40 },
            xAxis: { type: "category", data: ["Oct 25", "Dec 25", "Jan 26", "Mar 26"], axisLabel: { fontSize: 10, color: "#999" }, axisLine: { show: false }, axisTick: { show: false } },
            yAxis: { type: "value", min: 0, max: 26, splitLine: { lineStyle: { color: "#f5f5f5" } }, axisLabel: { fontSize: 10, color: "#999" }, axisLine: { show: false }, axisTick: { show: false } },
            series: [{ type: "line", smooth: 0.4, data: [6, 7, 8, 10], symbol: "circle", symbolSize: 14, itemStyle: { color: "#7c4dff", borderColor: "#fff", borderWidth: 3, shadowColor: "rgba(124,77,255,0.3)", shadowBlur: 8 }, lineStyle: { width: 4, color: "#7c4dff", shadowColor: "rgba(124,77,255,0.2)", shadowBlur: 10 }, areaStyle: { color: { type: "linear", x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: "rgba(124,77,255,0.2)" }, { offset: 1, color: "transparent" }] } }, label: { show: true, fontSize: 11, fontWeight: 700, color: "#7c4dff", position: "top", distance: 8 } }],
            tooltip: { trigger: "axis" },
          }} />
        </Card>

        <Label n={7} title="Trend - Confidence band (range area + line)" />
        <Card>
          <ReactECharts opts={{ renderer: "svg" }} style={{ height: 200 }} option={{
            grid: { top: 16, right: 16, bottom: 28, left: 40 },
            xAxis: { type: "category", data: ["Oct 25", "Dec 25", "Jan 26", "Mar 26", "Jun 26", "Sep 26"], axisLabel: { fontSize: 10, color: "#999" }, axisLine: { show: false }, axisTick: { show: false } },
            yAxis: { type: "value", min: 0, max: 26, splitLine: { lineStyle: { color: "#f5f5f5" } }, axisLabel: { fontSize: 10, color: "#999" }, axisLine: { show: false }, axisTick: { show: false } },
            series: [
              { type: "line", data: [4, 5, 6, 8, 10, 12], lineStyle: { opacity: 0 }, areaStyle: { color: "rgba(124,77,255,0.08)" }, stack: "band", symbol: "none" },
              { type: "line", data: [8, 9, 10, 12, 14, 16], lineStyle: { opacity: 0 }, areaStyle: { color: "rgba(124,77,255,0.08)" }, stack: "band", symbol: "none" },
              { type: "line", smooth: 0.3, data: [6, 7, 8, 10, null, null], symbol: "circle", symbolSize: 8, itemStyle: { color: "#7c4dff", borderColor: "#fff", borderWidth: 2 }, lineStyle: { width: 3, color: "#7c4dff" } },
              { type: "line", smooth: 0.3, data: [null, null, null, 10, 12, 14], symbol: "circle", symbolSize: 6, itemStyle: { color: "#7c4dff", borderColor: "#fff", borderWidth: 2 }, lineStyle: { width: 2, color: "#7c4dff", type: "dashed" } },
            ],
            tooltip: { trigger: "axis" },
          }} />
          <div style={{ textAlign: "center", fontSize: 10, color: "#999", marginTop: 4 }}>Solid = actual, Dashed = projected, Band = confidence range</div>
        </Card>

        <Label n={8} title="Trend - Gradient heatmap line (color shows intensity)" />
        <Card>
          <ReactECharts opts={{ renderer: "canvas" }} style={{ height: 200 }} option={{
            grid: { top: 16, right: 12, bottom: 28, left: 40 },
            xAxis: { type: "category", data: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], axisLabel: { fontSize: 9, color: "#999" }, axisLine: { show: false }, axisTick: { show: false } },
            yAxis: { type: "value", min: 0, max: 26, splitLine: { lineStyle: { color: "#f5f5f5" } }, axisLabel: { fontSize: 10, color: "#999" }, axisLine: { show: false }, axisTick: { show: false } },
            visualMap: { show: false, min: 0, max: 20, dimension: 1, inRange: { color: ["#4caf50", "#26a69a", "#ff9800", "#ef5350"] } },
            series: [{ type: "line", smooth: 0.4, data: [5, 6, 7, 8, 9, 11, 12, 13, 11, 10, 9, 8], symbol: "circle", symbolSize: 8, lineStyle: { width: 4 } }],
            tooltip: { trigger: "axis" },
          }} />
        </Card>

        {/* ============================================ */}
        {/* GAUGES - DIFFERENT STYLES */}
        {/* ============================================ */}
        <SectionTitle text="GAUGES - DIFFERENT STYLES" />

        <Label n={9} title="Gauge - Animated speedometer with needle" />
        <Card>
          <ReactECharts opts={{ renderer: "canvas" }} style={{ height: 220 }} option={{
            series: [{ type: "gauge", min: 0, max: 26, startAngle: 200, endAngle: -20, splitNumber: 5,
              axisLine: { lineStyle: { width: 20, color: [[7/26, "#4caf50"], [12/26, "#26a69a"], [15/26, "#ff9800"], [21/26, "#ef5350"], [1, "#c62828"]] } },
              pointer: { icon: "path://M12.8,0.7l12,40.1H0.7L12.8,0.7z", length: "55%", width: 8, offsetCenter: [0, "-10%"], itemStyle: { color: "auto" } },
              axisTick: { length: 8, lineStyle: { color: "auto", width: 1 } },
              splitLine: { length: 14, lineStyle: { color: "auto", width: 2 } },
              axisLabel: { color: "#999", fontSize: 10, distance: -30 },
              detail: { valueAnimation: true, fontSize: 28, fontWeight: 700, color: "#1a1a2e", offsetCenter: [0, "40%"], formatter: "{value}" },
              title: { offsetCenter: [0, "60%"], fontSize: 12, color: "#8b8da3" },
              data: [{ value: 11, name: "FINDRISC" }],
            }],
            animationDuration: 2000, animationEasing: "bounceOut",
          }} />
        </Card>

        <Label n={10} title="Gauge - Triple ring (risk + blood + activity)" />
        <Card>
          <ReactECharts opts={{ renderer: "canvas" }} style={{ height: 220 }} option={{
            series: [
              { type: "gauge", startAngle: 90, endAngle: -270, min: 0, max: 100, pointer: { show: false }, progress: { show: true, width: 12, roundCap: true, clip: false, itemStyle: { color: "#7c4dff" } }, axisLine: { lineStyle: { width: 12, color: [[1, "rgba(124,77,255,0.1)"]] }, roundCap: true }, axisTick: { show: false }, splitLine: { show: false }, axisLabel: { show: false }, detail: { show: false }, data: [{ value: 42, name: "Risk" }], radius: "90%", center: ["50%", "50%"] },
              { type: "gauge", startAngle: 90, endAngle: -270, min: 0, max: 100, pointer: { show: false }, progress: { show: true, width: 12, roundCap: true, clip: false, itemStyle: { color: "#26a69a" } }, axisLine: { lineStyle: { width: 12, color: [[1, "rgba(38,166,154,0.1)"]] }, roundCap: true }, axisTick: { show: false }, splitLine: { show: false }, axisLabel: { show: false }, detail: { show: false }, data: [{ value: 71, name: "Blood" }], radius: "72%", center: ["50%", "50%"] },
              { type: "gauge", startAngle: 90, endAngle: -270, min: 0, max: 100, pointer: { show: false }, progress: { show: true, width: 12, roundCap: true, clip: false, itemStyle: { color: "#ff9800" } }, axisLine: { lineStyle: { width: 12, color: [[1, "rgba(255,152,0,0.1)"]] }, roundCap: true }, axisTick: { show: false }, splitLine: { show: false }, axisLabel: { show: false }, detail: { show: false }, data: [{ value: 30, name: "Activity" }], radius: "54%", center: ["50%", "50%"] },
            ],
            animationDuration: 1500,
          }} />
          <div style={{ display: "flex", justifyContent: "center", gap: 16, marginTop: -4, fontSize: 10, fontWeight: 600 }}>
            <span style={{ color: "#7c4dff" }}>Risk 42%</span>
            <span style={{ color: "#26a69a" }}>Blood 71%</span>
            <span style={{ color: "#ff9800" }}>Activity 30%</span>
          </div>
        </Card>

        <Label n={11} title="Gauge - Half gauge with gradient arc" />
        <Card>
          <ReactECharts opts={{ renderer: "canvas" }} style={{ height: 180 }} option={{
            series: [{ type: "gauge", startAngle: 180, endAngle: 0, min: 0, max: 26, center: ["50%", "70%"],
              axisLine: { lineStyle: { width: 24, color: [[7/26, { type: "linear", x: 0, y: 0, x2: 1, y2: 0, colorStops: [{ offset: 0, color: "#66bb6a" }, { offset: 1, color: "#26a69a" }] }], [15/26, { type: "linear", x: 0, y: 0, x2: 1, y2: 0, colorStops: [{ offset: 0, color: "#26a69a" }, { offset: 1, color: "#ffa726" }] }], [1, { type: "linear", x: 0, y: 0, x2: 1, y2: 0, colorStops: [{ offset: 0, color: "#ffa726" }, { offset: 1, color: "#ef5350" }] }]] } },
              pointer: { length: "50%", width: 5, itemStyle: { color: "#555" } },
              axisTick: { show: false }, splitLine: { show: false }, axisLabel: { show: false },
              detail: { fontSize: 22, fontWeight: 700, color: "#1a1a2e", offsetCenter: [0, "20%"], formatter: "11/26" },
              data: [{ value: 11 }],
            }],
            animationDuration: 1800, animationEasing: "elasticOut",
          }} />
        </Card>

        {/* ============================================ */}
        {/* RADAR / MULTI-AXIS */}
        {/* ============================================ */}
        <SectionTitle text="RADAR / MULTI-DIMENSIONAL" />

        <Label n={12} title="Radar - Health profile with filled area" />
        <Card>
          <ReactECharts opts={{ renderer: "svg" }} style={{ height: 240 }} option={{
            radar: { indicator: [{ name: "Blood Sugar", max: 10 }, { name: "Cholesterol", max: 10 }, { name: "Weight", max: 10 }, { name: "Activity", max: 10 }, { name: "Diet", max: 10 }, { name: "Family Risk", max: 10 }], shape: "circle", radius: "68%", axisLine: { lineStyle: { color: "rgba(0,0,0,0.08)" } }, splitLine: { lineStyle: { color: "rgba(0,0,0,0.05)" } }, splitArea: { areaStyle: { color: ["rgba(124,77,255,0.02)", "rgba(124,77,255,0.04)"] } }, name: { fontSize: 10, color: "#666" } },
            series: [{ type: "radar", data: [
              { value: [7, 6, 5, 3, 7, 2], name: "You", areaStyle: { color: "rgba(124,77,255,0.2)" }, lineStyle: { color: "#7c4dff", width: 2 }, itemStyle: { color: "#7c4dff", borderColor: "#fff", borderWidth: 2 }, symbol: "circle", symbolSize: 8 },
              { value: [8, 7, 7, 7, 7, 5], name: "Avg", areaStyle: { color: "rgba(0,0,0,0)" }, lineStyle: { color: "#ccc", width: 1, type: "dashed" }, itemStyle: { color: "#ccc" }, symbol: "circle", symbolSize: 4 },
            ] }],
            legend: { bottom: 0, textStyle: { fontSize: 10, color: "#666" } },
          }} />
        </Card>

        <Label n={13} title="Radar - Rounded polygon with neon glow" />
        <Card style={{ background: "#1a1a2e" }}>
          <ReactECharts opts={{ renderer: "canvas" }} style={{ height: 240 }} option={{
            radar: { indicator: [{ name: "Sugar", max: 10 }, { name: "Lipids", max: 10 }, { name: "BMI", max: 10 }, { name: "Activity", max: 10 }, { name: "Diet", max: 10 }, { name: "Genetics", max: 10 }], shape: "circle", radius: "65%", axisLine: { lineStyle: { color: "rgba(255,255,255,0.08)" } }, splitLine: { lineStyle: { color: "rgba(255,255,255,0.06)" } }, splitArea: { show: false }, name: { color: "rgba(255,255,255,0.5)", fontSize: 10 } },
            series: [{ type: "radar", data: [{ value: [7, 6, 5, 3, 7, 2], areaStyle: { color: "rgba(124,77,255,0.3)" }, lineStyle: { color: "#b388ff", width: 2, shadowColor: "#b388ff", shadowBlur: 12 }, itemStyle: { color: "#b388ff", borderColor: "#1a1a2e", borderWidth: 2, shadowColor: "#b388ff", shadowBlur: 8 }, symbol: "circle", symbolSize: 8 }] }],
          }} />
        </Card>

        {/* ============================================ */}
        {/* WATERFALL / FACTOR BREAKDOWN */}
        {/* ============================================ */}
        <SectionTitle text="FACTOR BREAKDOWN" />

        <Label n={14} title="Horizontal bars - Factor contribution, sorted" />
        <Card>
          <ReactECharts opts={{ renderer: "svg" }} style={{ height: 180 }} option={{
            grid: { top: 8, right: 40, bottom: 8, left: 90 },
            xAxis: { type: "value", max: 5, show: false },
            yAxis: { type: "category", data: ["Diet", "BMI", "Activity", "Waist", "Family Hx"], axisLine: { show: false }, axisTick: { show: false }, axisLabel: { fontSize: 11, color: "#555" }, inverse: true },
            series: [{ type: "bar", data: [
              { value: 0, itemStyle: { color: "#e0e0e0" } },
              { value: 1, itemStyle: { color: { type: "linear", x: 0, y: 0, x2: 1, y2: 0, colorStops: [{ offset: 0, color: "#ffc107" }, { offset: 1, color: "#ffca28" }] }, borderRadius: [0, 6, 6, 0] } },
              { value: 2, itemStyle: { color: { type: "linear", x: 0, y: 0, x2: 1, y2: 0, colorStops: [{ offset: 0, color: "#ff9800" }, { offset: 1, color: "#ffa726" }] }, borderRadius: [0, 6, 6, 0] } },
              { value: 3, itemStyle: { color: { type: "linear", x: 0, y: 0, x2: 1, y2: 0, colorStops: [{ offset: 0, color: "#ff7043" }, { offset: 1, color: "#ff8a65" }] }, borderRadius: [0, 6, 6, 0] } },
              { value: 5, itemStyle: { color: { type: "linear", x: 0, y: 0, x2: 1, y2: 0, colorStops: [{ offset: 0, color: "#ef5350" }, { offset: 1, color: "#e57373" }] }, borderRadius: [0, 6, 6, 0] } },
            ], barWidth: 16, label: { show: true, position: "right", fontSize: 11, fontWeight: 700, color: "#555", formatter: "+{c}" } }],
            animation: true, animationDuration: 1000, animationDelay: (idx: number) => idx * 150,
          }} />
        </Card>

        <Label n={15} title="Stacked factor bar - total score composition" />
        <Card>
          <ReactECharts opts={{ renderer: "svg" }} style={{ height: 60 }} option={{
            grid: { top: 8, right: 16, bottom: 8, left: 16 },
            xAxis: { type: "value", max: 26, show: false },
            yAxis: { type: "category", data: [""], show: false },
            series: [
              { type: "bar", stack: "s", data: [5], barWidth: 24, itemStyle: { color: "#ef5350", borderRadius: [12, 0, 0, 12] }, label: { show: true, formatter: "Family", fontSize: 9, color: "#fff" } },
              { type: "bar", stack: "s", data: [3], barWidth: 24, itemStyle: { color: "#ff9800" }, label: { show: true, formatter: "Waist", fontSize: 9, color: "#fff" } },
              { type: "bar", stack: "s", data: [2], barWidth: 24, itemStyle: { color: "#ffc107" }, label: { show: true, formatter: "Act.", fontSize: 9, color: "#fff" } },
              { type: "bar", stack: "s", data: [1], barWidth: 24, itemStyle: { color: "#66bb6a" }, label: { show: true, formatter: "BMI", fontSize: 9, color: "#fff" } },
              { type: "bar", stack: "s", data: [15], barWidth: 24, itemStyle: { color: "#f5f5f5", borderRadius: [0, 12, 12, 0] }, label: { show: false } },
            ],
          }} />
          <div style={{ textAlign: "center", fontSize: 11, fontWeight: 600, color: "#555", marginTop: 4 }}>Score: 11 out of 26</div>
        </Card>

        <Label n={16} title="Treemap - Factor importance by area" />
        <Card>
          <ReactECharts opts={{ renderer: "svg" }} style={{ height: 160 }} option={{
            series: [{ type: "treemap", data: [{ name: "Family\nHistory", value: 5, itemStyle: { color: { type: "linear", x: 0, y: 0, x2: 1, y2: 1, colorStops: [{ offset: 0, color: "#ef5350" }, { offset: 1, color: "#e57373" }] }, borderRadius: 8 } }, { name: "Waist", value: 3, itemStyle: { color: { type: "linear", x: 0, y: 0, x2: 1, y2: 1, colorStops: [{ offset: 0, color: "#ff9800" }, { offset: 1, color: "#ffa726" }] }, borderRadius: 8 } }, { name: "Activity", value: 2, itemStyle: { color: { type: "linear", x: 0, y: 0, x2: 1, y2: 1, colorStops: [{ offset: 0, color: "#ffc107" }, { offset: 1, color: "#ffd54f" }] }, borderRadius: 8 } }, { name: "BMI", value: 1, itemStyle: { color: { type: "linear", x: 0, y: 0, x2: 1, y2: 1, colorStops: [{ offset: 0, color: "#66bb6a" }, { offset: 1, color: "#81c784" }] }, borderRadius: 8 } }], breadcrumb: { show: false }, label: { fontSize: 12, fontWeight: 600, color: "#fff" }, roam: false, nodeClick: false }],
          }} />
        </Card>

        {/* ============================================ */}
        {/* COMPARISON / BEFORE-AFTER */}
        {/* ============================================ */}
        <SectionTitle text="COMPARISON / BEFORE-AFTER" />

        <Label n={17} title="Before/after - Overlapping bars, two time periods" />
        <Card>
          <ReactECharts opts={{ renderer: "svg" }} style={{ height: 200 }} option={{
            grid: { top: 30, right: 16, bottom: 8, left: 100 },
            legend: { data: ["Dec 2025", "Mar 2026"], top: 0, textStyle: { fontSize: 10, color: "#666" } },
            xAxis: { type: "value", show: false },
            yAxis: { type: "category", data: ["Blood Sugar", "HbA1c", "Cholesterol", "BMI"], axisLine: { show: false }, axisTick: { show: false }, axisLabel: { fontSize: 11, color: "#555" } },
            series: [
              { name: "Dec 2025", type: "bar", data: [5.5, 39, 5.3, 28], barWidth: 10, barGap: "20%", itemStyle: { color: "#e0e0e0", borderRadius: 5 } },
              { name: "Mar 2026", type: "bar", data: [5.8, 38, 5.1, 27.6], barWidth: 10, itemStyle: { color: { type: "linear", x: 0, y: 0, x2: 1, y2: 0, colorStops: [{ offset: 0, color: "#7c4dff" }, { offset: 1, color: "#b388ff" }] }, borderRadius: 5 } },
            ],
            animation: true, animationDuration: 1000,
          }} />
        </Card>

        <Label n={18} title="Parallel coordinates - All biomarkers at once" />
        <Card>
          <ReactECharts opts={{ renderer: "svg" }} style={{ height: 200 }} option={{
            parallelAxis: [
              { dim: 0, name: "HbA1c", min: 20, max: 50, nameTextStyle: { fontSize: 9, color: "#666" }, nameLocation: "start" },
              { dim: 1, name: "Glucose", min: 3, max: 8, nameTextStyle: { fontSize: 9, color: "#666" }, nameLocation: "start" },
              { dim: 2, name: "Chol.", min: 3, max: 7, nameTextStyle: { fontSize: 9, color: "#666" }, nameLocation: "start" },
              { dim: 3, name: "HDL", min: 0.5, max: 3, nameTextStyle: { fontSize: 9, color: "#666" }, nameLocation: "start" },
              { dim: 4, name: "LDL", min: 0, max: 5, nameTextStyle: { fontSize: 9, color: "#666" }, nameLocation: "start" },
            ],
            parallel: { left: 40, right: 40, top: 30, bottom: 16 },
            series: [
              { type: "parallel", lineStyle: { width: 3, color: "#7c4dff", opacity: 0.8 }, data: [[38, 5.8, 5.1, 1.6, 2.9]], smooth: true },
              { type: "parallel", lineStyle: { width: 2, color: "#e0e0e0", opacity: 0.6 }, data: [[35, 5.0, 4.8, 1.8, 2.5]], smooth: true },
            ],
          }} />
          <div style={{ textAlign: "center", fontSize: 10, color: "#999" }}><span style={{ color: "#7c4dff", fontWeight: 600 }}>You</span> vs <span style={{ color: "#bbb" }}>Average</span></div>
        </Card>

        {/* ============================================ */}
        {/* CREATIVE / ADVANCED */}
        {/* ============================================ */}
        <SectionTitle text="CREATIVE / ADVANCED" />

        <Label n={19} title="Heatmap - Weekly activity calendar" />
        <Card>
          <ReactECharts opts={{ renderer: "canvas" }} style={{ height: 120 }} option={{
            grid: { top: 20, right: 8, bottom: 8, left: 40 },
            xAxis: { type: "category", data: Array.from({ length: 12 }, (_, i) => `W${i+1}`), axisLine: { show: false }, axisTick: { show: false }, axisLabel: { fontSize: 8, color: "#bbb" }, position: "top" },
            yAxis: { type: "category", data: ["Mon", "Wed", "Fri", "Sun"], axisLine: { show: false }, axisTick: { show: false }, axisLabel: { fontSize: 9, color: "#bbb" } },
            visualMap: { show: false, min: 0, max: 60, inRange: { color: ["#f5f5f5", "#c8e6c9", "#66bb6a", "#2e7d32"] } },
            series: [{ type: "heatmap", data: Array.from({ length: 48 }, (_, i) => [i % 12, Math.floor(i / 12), Math.floor(Math.random() * 60)]), itemStyle: { borderRadius: 4, borderWidth: 2, borderColor: "#fff" } }],
          }} />
        </Card>

        <Label n={20} title="Sunburst - Health factor hierarchy" />
        <Card>
          <ReactECharts opts={{ renderer: "svg" }} style={{ height: 250 }} option={{
            series: [{ type: "sunburst", radius: ["15%", "85%"], sort: undefined, emphasis: { focus: "ancestor" }, label: { fontSize: 10, color: "#555", rotate: "tangential" }, itemStyle: { borderRadius: 6, borderWidth: 2, borderColor: "#fff" }, levels: [{}, { r0: "15%", r: "45%", itemStyle: { borderWidth: 2 }, label: { fontSize: 11, fontWeight: 600 } }, { r0: "45%", r: "85%", label: { fontSize: 9 } }],
              data: [
                { name: "Changeable", itemStyle: { color: "#e8f5e9" }, children: [
                  { name: "Activity", value: 2, itemStyle: { color: "#ff9800" } },
                  { name: "BMI", value: 1, itemStyle: { color: "#66bb6a" } },
                  { name: "Waist", value: 3, itemStyle: { color: "#ff9800" } },
                  { name: "Diet", value: 1, itemStyle: { color: "#66bb6a" } },
                ]},
                { name: "Fixed", itemStyle: { color: "#fafafa" }, children: [
                  { name: "Family", value: 5, itemStyle: { color: "#ef5350" } },
                  { name: "Age", value: 0, itemStyle: { color: "#e0e0e0" } },
                  { name: "Glucose", value: 0, itemStyle: { color: "#e0e0e0" } },
                  { name: "BP Meds", value: 0, itemStyle: { color: "#e0e0e0" } },
                ]},
              ],
            }],
          }} />
        </Card>

        <Label n={21} title="Sankey - Risk factor flow to outcome" />
        <Card>
          <ReactECharts opts={{ renderer: "svg" }} style={{ height: 220 }} option={{
            series: [{ type: "sankey", layout: "none", emphasis: { focus: "adjacency" }, nodeWidth: 20, nodeGap: 12, label: { fontSize: 10, color: "#555" }, lineStyle: { color: "gradient", curveness: 0.5, opacity: 0.4 },
              data: [{ name: "Family Hx", itemStyle: { color: "#ef5350", borderRadius: 4 } }, { name: "Waist", itemStyle: { color: "#ff9800", borderRadius: 4 } }, { name: "Activity", itemStyle: { color: "#ffc107", borderRadius: 4 } }, { name: "BMI", itemStyle: { color: "#66bb6a", borderRadius: 4 } }, { name: "Moderate\nRisk", itemStyle: { color: "#ff9800", borderRadius: 4 } }],
              links: [{ source: "Family Hx", target: "Moderate\nRisk", value: 5 }, { source: "Waist", target: "Moderate\nRisk", value: 3 }, { source: "Activity", target: "Moderate\nRisk", value: 2 }, { source: "BMI", target: "Moderate\nRisk", value: 1 }],
            }],
          }} />
        </Card>

        <Label n={22} title="Box plot - Your score vs age group distribution" />
        <Card>
          <ReactECharts opts={{ renderer: "svg" }} style={{ height: 200 }} option={{
            grid: { top: 16, right: 16, bottom: 28, left: 40 },
            xAxis: { type: "category", data: ["25-34", "35-44", "45-54", "55-64", "65+"], axisLabel: { fontSize: 10, color: "#999" }, axisLine: { show: false }, axisTick: { show: false } },
            yAxis: { type: "value", min: 0, max: 26, splitLine: { lineStyle: { color: "#f5f5f5" } }, axisLabel: { fontSize: 10, color: "#999" }, axisLine: { show: false }, axisTick: { show: false } },
            series: [
              { type: "boxplot", data: [[2, 4, 6, 9, 12], [3, 5, 8, 11, 15], [4, 7, 10, 14, 18], [6, 9, 12, 16, 20], [8, 11, 15, 19, 23]], itemStyle: { color: "rgba(124,77,255,0.1)", borderColor: "#7c4dff", borderWidth: 1.5 } },
              { type: "scatter", data: [[1, 11]], symbolSize: 16, itemStyle: { color: "#ff9800", borderColor: "#fff", borderWidth: 3, shadowColor: "rgba(255,152,0,0.4)", shadowBlur: 8 }, label: { show: true, formatter: "You", position: "right", fontSize: 11, fontWeight: 700, color: "#ff9800", distance: 6 } },
            ],
          }} />
        </Card>

        {/* ============================================ */}
        {/* SPARKLINES / MINI CHARTS */}
        {/* ============================================ */}
        <SectionTitle text="SPARKLINES / INLINE MINI" />

        <Label n={23} title="Sparkline - Gradient amber with endpoint dot" />
        <Card>
          <ReactECharts opts={{ renderer: "svg" }} style={{ height: 50 }} option={{
            grid: { top: 6, right: 6, bottom: 6, left: 6 },
            xAxis: { type: "category", show: false, data: ["Sep", "Dec", "Mar"] },
            yAxis: { type: "value", show: false, min: 4.9, max: 6.1 },
            series: [{ type: "line", smooth: 0.4, data: [5.2, 5.5, 5.8], symbol: (value: number, params: { dataIndex: number }) => params.dataIndex === 2 ? "circle" : "none", symbolSize: 10, itemStyle: { color: "#ff9800", borderColor: "#fff", borderWidth: 2 }, lineStyle: { width: 2.5, color: { type: "linear", x: 0, y: 0, x2: 1, y2: 0, colorStops: [{ offset: 0, color: "rgba(255,152,0,0.4)" }, { offset: 1, color: "#ff9800" }] } }, areaStyle: { color: { type: "linear", x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: "rgba(255,152,0,0.2)" }, { offset: 1, color: "transparent" }] } } }],
          }} />
        </Card>

        <Label n={24} title="Sparkline - Green improving trend" />
        <Card>
          <ReactECharts opts={{ renderer: "svg" }} style={{ height: 50 }} option={{
            grid: { top: 6, right: 6, bottom: 6, left: 6 },
            xAxis: { type: "category", show: false, data: ["Sep", "Dec", "Mar"] },
            yAxis: { type: "value", show: false, min: 4.5, max: 6.5 },
            series: [{ type: "line", smooth: 0.3, data: [6.0, 5.6, 5.2], symbol: (value: number, params: { dataIndex: number }) => params.dataIndex === 2 ? "circle" : "none", symbolSize: 10, itemStyle: { color: "#4caf50", borderColor: "#fff", borderWidth: 2 }, lineStyle: { width: 2.5, color: { type: "linear", x: 0, y: 0, x2: 1, y2: 0, colorStops: [{ offset: 0, color: "rgba(76,175,80,0.4)" }, { offset: 1, color: "#4caf50" }] } }, areaStyle: { color: { type: "linear", x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: "rgba(76,175,80,0.15)" }, { offset: 1, color: "transparent" }] } } }],
          }} />
        </Card>

        {/* ============================================ */}
        {/* 3D CHARTS */}
        {/* ============================================ */}
        <SectionTitle text="3D CHARTS (touch to rotate)" />

        <Label n={25} title="3D Bar - Score over time (touch to rotate)" />
        <Card>
          <ReactECharts opts={{ renderer: "canvas" }} style={{ height: 280 }} option={{
            grid3D: { boxWidth: 100, boxDepth: 60, boxHeight: 60, viewControl: { autoRotate: true, autoRotateSpeed: 5 }, light: { main: { intensity: 1.2, shadow: true }, ambient: { intensity: 0.3 } } },
            xAxis3D: { type: "category", data: ["Oct", "Dec", "Jan", "Mar"], axisLabel: { fontSize: 9, color: "#999" } },
            yAxis3D: { type: "category", data: ["Score"], axisLabel: { show: false } },
            zAxis3D: { type: "value", max: 26, axisLabel: { fontSize: 9, color: "#999" } },
            series: [{ type: "bar3D", data: [[0, 0, 6], [1, 0, 7], [2, 0, 8], [3, 0, 10]], shading: "lambert", itemStyle: { color: (params: { dataIndex: number }) => ["#4caf50", "#26a69a", "#ff9800", "#ff9800"][params.dataIndex] || "#7c4dff" }, barSize: 30 }],
          }} />
        </Card>

        <Label n={26} title="3D Scatter - Biomarker space (touch to rotate)" />
        <Card>
          <ReactECharts opts={{ renderer: "canvas" }} style={{ height: 280 }} option={{
            grid3D: { boxWidth: 80, boxDepth: 80, boxHeight: 80, viewControl: { autoRotate: true, autoRotateSpeed: 3, distance: 220 }, light: { main: { intensity: 1.2 }, ambient: { intensity: 0.3 } } },
            xAxis3D: { type: "value", name: "Glucose", nameTextStyle: { fontSize: 9, color: "#999" }, min: 4, max: 7, axisLabel: { fontSize: 8 } },
            yAxis3D: { type: "value", name: "HbA1c", nameTextStyle: { fontSize: 9, color: "#999" }, min: 30, max: 50, axisLabel: { fontSize: 8 } },
            zAxis3D: { type: "value", name: "Chol", nameTextStyle: { fontSize: 9, color: "#999" }, min: 3, max: 7, axisLabel: { fontSize: 8 } },
            series: [
              { type: "scatter3D", data: Array.from({ length: 40 }, () => [4 + Math.random() * 3, 30 + Math.random() * 20, 3 + Math.random() * 4]), symbolSize: 6, itemStyle: { color: "rgba(92,107,192,0.3)" } },
              { type: "scatter3D", data: [[5.8, 38, 5.1]], symbolSize: 20, itemStyle: { color: "#ff9800", borderColor: "#fff", borderWidth: 2 } },
            ],
          }} />
          <div style={{ textAlign: "center", fontSize: 10, color: "#999" }}>Orange = You, Blue = Population sample</div>
        </Card>

        <Label n={27} title="3D Surface - Risk landscape (touch to rotate)" />
        <Card>
          <ReactECharts opts={{ renderer: "canvas" }} style={{ height: 280 }} option={{
            grid3D: { viewControl: { autoRotate: true, autoRotateSpeed: 4, distance: 200 }, light: { main: { intensity: 1.5, shadow: true }, ambient: { intensity: 0.2 } } },
            xAxis3D: { type: "value", name: "BMI", min: 18, max: 40 },
            yAxis3D: { type: "value", name: "Age", min: 20, max: 70 },
            zAxis3D: { type: "value", name: "Risk", min: 0, max: 1 },
            series: [{ type: "surface", data: (() => { const d: number[][] = []; for (let bmi = 18; bmi <= 40; bmi += 1) { for (let age = 20; age <= 70; age += 2) { const risk = 0.1 + (bmi - 18) * 0.02 + (age - 20) * 0.01 + (bmi > 30 ? 0.2 : 0) + (age > 50 ? 0.15 : 0); d.push([bmi, age, Math.min(risk, 1)]); } } return d; })(),
              shading: "color", colorMaterial: { detailTexture: "#fff" },
              itemStyle: { color: (params: { data: number[] }) => { const v = params.data[2]; if (v < 0.25) return "#4caf50"; if (v < 0.45) return "#26a69a"; if (v < 0.6) return "#ff9800"; return "#ef5350"; } },
            }],
          }} />
          <div style={{ textAlign: "center", fontSize: 10, color: "#999" }}>Risk surface by BMI and Age</div>
        </Card>

        {/* ============================================ */}
        {/* DARK MODE VARIANTS */}
        {/* ============================================ */}
        <SectionTitle text="DARK MODE VARIANTS" />

        <Label n={28} title="Dark - Trend with neon glow" />
        <Card style={{ background: "#1a1a2e" }}>
          <ReactECharts opts={{ renderer: "canvas" }} style={{ height: 200 }} option={{
            backgroundColor: "transparent",
            grid: { top: 16, right: 12, bottom: 28, left: 40 },
            xAxis: { type: "category", data: ["Oct", "Dec", "Jan", "Mar"], axisLabel: { fontSize: 10, color: "rgba(255,255,255,0.3)" }, axisLine: { show: false }, axisTick: { show: false } },
            yAxis: { type: "value", min: 0, max: 26, splitLine: { lineStyle: { color: "rgba(255,255,255,0.05)" } }, axisLabel: { fontSize: 10, color: "rgba(255,255,255,0.3)" }, axisLine: { show: false }, axisTick: { show: false } },
            series: [{ type: "line", smooth: 0.4, data: [6, 7, 8, 10], symbol: "circle", symbolSize: 10, itemStyle: { color: "#b388ff", borderColor: "#1a1a2e", borderWidth: 2, shadowColor: "#b388ff", shadowBlur: 12 }, lineStyle: { width: 3, color: "#b388ff", shadowColor: "#b388ff", shadowBlur: 16 }, areaStyle: { color: { type: "linear", x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: "rgba(179,136,255,0.3)" }, { offset: 1, color: "transparent" }] } } }],
            tooltip: { trigger: "axis", backgroundColor: "rgba(26,26,46,0.9)", borderColor: "rgba(179,136,255,0.3)", textStyle: { color: "#fff", fontSize: 12 } },
          }} />
        </Card>

        <Label n={29} title="Dark - Zone bar neon" />
        <Card style={{ background: "#1a1a2e", padding: "16px" }}>
          <div style={{ display: "flex", height: 20, borderRadius: 10, overflow: "hidden", position: "relative" }}>
            <div style={{ width: "27%", background: "#00e676", boxShadow: "inset 0 0 8px rgba(0,230,118,0.3)" }} />
            <div style={{ width: "19%", background: "#00bfa5", boxShadow: "inset 0 0 8px rgba(0,191,165,0.3)" }} />
            <div style={{ width: "12%", background: "#ff9100", boxShadow: "inset 0 0 8px rgba(255,145,0,0.3)" }} />
            <div style={{ width: "23%", background: "#ff5252", boxShadow: "inset 0 0 8px rgba(255,82,82,0.3)" }} />
            <div style={{ width: "19%", background: "#d50000", boxShadow: "inset 0 0 8px rgba(213,0,0,0.3)" }} />
            <div style={{ position: "absolute", left: "42%", top: "50%", transform: "translate(-50%,-50%)", width: 16, height: 16, borderRadius: "50%", background: "#fff", boxShadow: "0 0 12px rgba(255,255,255,0.6), 0 0 4px rgba(255,145,0,0.8)" }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontSize: 9, color: "rgba(255,255,255,0.4)" }}>
            <span>Low</span><span>Slight</span><span>Mod</span><span>High</span><span>V.High</span>
          </div>
        </Card>

        <Label n={30} title="Dark - Bell curve with glow" />
        <Card style={{ background: "#1a1a2e" }}>
          <ReactECharts opts={{ renderer: "canvas" }} style={{ height: 170 }} option={{
            backgroundColor: "transparent",
            grid: { top: 28, right: 16, bottom: 20, left: 16 },
            xAxis: { type: "value", min: 0, max: 26, show: false },
            yAxis: { type: "value", show: false },
            series: [{ type: "line", smooth: 0.6, symbol: "none", data: BELL_DATA, lineStyle: { width: 2.5, color: { type: "linear", x: 0, y: 0, x2: 1, y2: 0, colorStops: [{ offset: 0, color: "#00e676" }, { offset: 0.4, color: "#00bfa5" }, { offset: 0.55, color: "#ff9100" }, { offset: 0.8, color: "#ff5252" }, { offset: 1, color: "#d50000" }] }, shadowColor: "rgba(0,230,118,0.3)", shadowBlur: 8 }, areaStyle: { color: { type: "linear", x: 0, y: 0, x2: 1, y2: 0, colorStops: [{ offset: 0, color: "rgba(0,230,118,0.15)" }, { offset: 0.5, color: "rgba(255,145,0,0.1)" }, { offset: 1, color: "rgba(255,82,82,0.1)" }] } },
              markLine: { silent: true, symbol: "none", data: [{ xAxis: 8, lineStyle: { color: "rgba(255,255,255,0.2)", type: "dashed", width: 1 }, label: { formatter: "Avg", position: "insideEndTop", fontSize: 10, color: "rgba(255,255,255,0.4)" } }] },
              markPoint: { symbol: "circle", symbolSize: 16, data: [{ coord: [11, Math.exp(-0.5 * Math.pow((11-8)/4, 2))], itemStyle: { color: "#ff9100", borderColor: "#1a1a2e", borderWidth: 3, shadowColor: "#ff9100", shadowBlur: 14 }, label: { show: true, formatter: "You", position: "top", fontSize: 11, fontWeight: 700, color: "#ff9100", distance: 10 } }] },
            }],
          }} />
        </Card>

        <Label n={31} title="Dark - Radar health profile neon" />
        <Card style={{ background: "#1a1a2e" }}>
          <ReactECharts opts={{ renderer: "canvas" }} style={{ height: 240 }} option={{
            backgroundColor: "transparent",
            radar: { indicator: [{ name: "Sugar", max: 10 }, { name: "Lipids", max: 10 }, { name: "BMI", max: 10 }, { name: "Activity", max: 10 }, { name: "Diet", max: 10 }, { name: "Genetics", max: 10 }], shape: "circle", radius: "65%", axisLine: { lineStyle: { color: "rgba(255,255,255,0.06)" } }, splitLine: { lineStyle: { color: "rgba(255,255,255,0.04)" } }, splitArea: { show: false }, name: { color: "rgba(255,255,255,0.4)", fontSize: 10 } },
            series: [{ type: "radar", data: [
              { value: [7, 6, 5, 3, 7, 2], areaStyle: { color: "rgba(0,191,165,0.2)" }, lineStyle: { color: "#00bfa5", width: 2, shadowColor: "#00bfa5", shadowBlur: 10 }, itemStyle: { color: "#00bfa5", borderColor: "#1a1a2e", borderWidth: 2, shadowColor: "#00bfa5", shadowBlur: 6 }, symbol: "circle", symbolSize: 8 },
              { value: [8, 7, 7, 7, 7, 5], areaStyle: { opacity: 0 }, lineStyle: { color: "rgba(255,255,255,0.15)", width: 1, type: "dashed" }, itemStyle: { opacity: 0 }, symbol: "none" },
            ] }],
          }} />
        </Card>

        <Label n={32} title="Dark - Triple gauge rings neon" />
        <Card style={{ background: "#1a1a2e" }}>
          <ReactECharts opts={{ renderer: "canvas" }} style={{ height: 220 }} option={{
            backgroundColor: "transparent",
            series: [
              { type: "gauge", startAngle: 90, endAngle: -270, min: 0, max: 100, pointer: { show: false }, progress: { show: true, width: 10, roundCap: true, clip: false, itemStyle: { color: "#b388ff", shadowColor: "#b388ff", shadowBlur: 10 } }, axisLine: { lineStyle: { width: 10, color: [[1, "rgba(179,136,255,0.1)"]] }, roundCap: true }, axisTick: { show: false }, splitLine: { show: false }, axisLabel: { show: false }, detail: { show: false }, data: [{ value: 42 }], radius: "90%", center: ["50%", "50%"] },
              { type: "gauge", startAngle: 90, endAngle: -270, min: 0, max: 100, pointer: { show: false }, progress: { show: true, width: 10, roundCap: true, clip: false, itemStyle: { color: "#00e676", shadowColor: "#00e676", shadowBlur: 10 } }, axisLine: { lineStyle: { width: 10, color: [[1, "rgba(0,230,118,0.1)"]] }, roundCap: true }, axisTick: { show: false }, splitLine: { show: false }, axisLabel: { show: false }, detail: { show: false }, data: [{ value: 71 }], radius: "72%", center: ["50%", "50%"] },
              { type: "gauge", startAngle: 90, endAngle: -270, min: 0, max: 100, pointer: { show: false }, progress: { show: true, width: 10, roundCap: true, clip: false, itemStyle: { color: "#ff9100", shadowColor: "#ff9100", shadowBlur: 10 } }, axisLine: { lineStyle: { width: 10, color: [[1, "rgba(255,145,0,0.1)"]] }, roundCap: true }, axisTick: { show: false }, splitLine: { show: false }, axisLabel: { show: false }, detail: { show: false }, data: [{ value: 30 }], radius: "54%", center: ["50%", "50%"] },
            ],
            animationDuration: 2000,
          }} />
          <div style={{ display: "flex", justifyContent: "center", gap: 16, marginTop: -4, fontSize: 10, fontWeight: 600 }}>
            <span style={{ color: "#b388ff" }}>Risk 42%</span>
            <span style={{ color: "#00e676" }}>Blood 71%</span>
            <span style={{ color: "#ff9100" }}>Activity 30%</span>
          </div>
        </Card>

        <Label n={33} title="Dark - 3D bar chart" />
        <Card style={{ background: "#1a1a2e" }}>
          <ReactECharts opts={{ renderer: "canvas" }} style={{ height: 280 }} option={{
            backgroundColor: "transparent",
            grid3D: { boxWidth: 100, boxDepth: 60, boxHeight: 60, viewControl: { autoRotate: true, autoRotateSpeed: 5 }, light: { main: { intensity: 1.5, shadow: true, shadowQuality: "high" }, ambient: { intensity: 0.2 } }, environment: "#1a1a2e" },
            xAxis3D: { type: "category", data: ["Oct", "Dec", "Jan", "Mar"], axisLabel: { color: "rgba(255,255,255,0.3)", fontSize: 9 }, axisLine: { lineStyle: { color: "rgba(255,255,255,0.1)" } } },
            yAxis3D: { type: "category", data: ["Score"], axisLabel: { show: false }, axisLine: { lineStyle: { color: "rgba(255,255,255,0.1)" } } },
            zAxis3D: { type: "value", max: 26, axisLabel: { color: "rgba(255,255,255,0.3)", fontSize: 9 }, axisLine: { lineStyle: { color: "rgba(255,255,255,0.1)" } } },
            series: [{ type: "bar3D", data: [[0, 0, 6], [1, 0, 7], [2, 0, 8], [3, 0, 10]], shading: "lambert", itemStyle: { color: (params: { dataIndex: number }) => ["#00e676", "#00bfa5", "#ff9100", "#ff9100"][params.dataIndex] || "#b388ff" }, barSize: 30 }],
          }} />
        </Card>

      </div>
    </div>
  );
}

/* ---- Animated drawing line ---- */
function AnimatedLine() {
  const [data, setData] = useState<number[]>([]);
  const scores = [6, 7, 8, 10];
  const dates = ["Oct 25", "Dec 25", "Jan 26", "Mar 26"];

  useEffect(() => {
    scores.forEach((_, i) => {
      setTimeout(() => setData(scores.slice(0, i + 1)), i * 400 + 200);
    });
  }, []);

  return (
    <ReactECharts opts={{ renderer: "svg" }} style={{ height: 200 }} option={{
      grid: { top: 16, right: 12, bottom: 28, left: 40 },
      xAxis: { type: "category", data: dates, axisLabel: { fontSize: 10, color: "#999" }, axisLine: { show: false }, axisTick: { show: false } },
      yAxis: { type: "value", min: 0, max: 26, splitLine: { lineStyle: { color: "#f5f5f5" } }, axisLabel: { fontSize: 10, color: "#999" }, axisLine: { show: false }, axisTick: { show: false } },
      series: [{ type: "line", smooth: 0.3, data, symbol: "circle", symbolSize: 10, itemStyle: { color: "#7c4dff", borderColor: "#fff", borderWidth: 3 }, lineStyle: { width: 3, color: "#7c4dff" }, areaStyle: { color: { type: "linear", x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: "rgba(124,77,255,0.2)" }, { offset: 1, color: "transparent" }] } } }],
      animation: true, animationDuration: 600,
    }} />
  );
}

function Label({ n, title }: { n: number; title: string }) {
  return (
    <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginTop: 4 }}>
      <span style={{ fontSize: 16, fontWeight: 700, color: "#7c4dff", minWidth: 28 }}>{n}.</span>
      <span style={{ fontSize: 12, fontWeight: 600, color: "#1a1a2e" }}>{title}</span>
    </div>
  );
}

function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ background: "#fff", borderRadius: 16, padding: "12px 16px", border: "1px solid #e6e8ed", boxShadow: "0 1px 3px rgba(0,0,0,0.04)", ...style }}>
      {children}
    </div>
  );
}

function SectionTitle({ text }: { text: string }) {
  return (
    <div style={{ marginTop: 20, marginBottom: 4, paddingTop: 16, borderTop: "2px solid #e6e8ed" }}>
      <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", color: "#8b8da3" }}>{text}</span>
    </div>
  );
}
