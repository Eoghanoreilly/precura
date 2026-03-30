"use client";

import ReactECharts from "echarts-for-react";

const MOCK_SCORES = [
  { date: "Oct 25", score: 6 },
  { date: "Dec 25", score: 7 },
  { date: "Jan 26", score: 8 },
  { date: "Mar 26", score: 10 },
];

const MOCK_GLUCOSE = [
  { date: "Sep 25", value: 5.2 },
  { date: "Dec 25", value: 5.5 },
  { date: "Mar 26", value: 5.8 },
];

const BELL_DATA: [number, number][] = [];
for (let x = 0; x <= 26; x += 0.5) {
  BELL_DATA.push([x, Math.exp(-0.5 * Math.pow((x - 8) / 4, 2))]);
}

export default function ChartsPage() {
  return (
    <div style={{ background: "#f8f9fa", minHeight: "100dvh", padding: "20px 16px 60px" }}>
      <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8, color: "#1a1a2e" }}>Chart Gallery</h1>
      <p style={{ fontSize: 13, color: "#8b8da3", marginBottom: 24 }}>50 chart variations. Pick the ones you like.</p>

      <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 500, margin: "0 auto" }}>

        {/* ============================================ */}
        {/* TREND LINE CHARTS (1-10) */}
        {/* ============================================ */}

        <Label n={1} title="Trend - Purple gradient fill, glow line, large dots" />
        <Card>
          <ReactECharts opts={{ renderer: "svg" }} style={{ height: 200 }} option={{
            grid: { top: 20, right: 16, bottom: 28, left: 40 },
            xAxis: { type: "category", data: MOCK_SCORES.map(d => d.date), axisLabel: { fontSize: 10, color: "#999" }, axisLine: { show: false }, axisTick: { show: false } },
            yAxis: { type: "value", min: 0, max: 26, splitLine: { lineStyle: { color: "#f0f0f0" } }, axisLabel: { fontSize: 10, color: "#999" }, axisLine: { show: false }, axisTick: { show: false } },
            series: [{ type: "line", smooth: 0.4, data: MOCK_SCORES.map(d => d.score), symbol: "circle", symbolSize: 10, itemStyle: { color: "#7c4dff", borderColor: "#fff", borderWidth: 3 }, lineStyle: { width: 3, color: "#7c4dff", shadowColor: "rgba(124,77,255,0.4)", shadowBlur: 12 }, areaStyle: { color: { type: "linear", x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: "rgba(124,77,255,0.3)" }, { offset: 1, color: "rgba(124,77,255,0)" }] } } }],
            tooltip: { trigger: "axis", backgroundColor: "#fff", borderColor: "#eee", borderRadius: 10, padding: [8, 12], textStyle: { fontSize: 12 } },
          }} />
        </Card>

        <Label n={2} title="Trend - Blue smooth, no dots, strong gradient" />
        <Card>
          <ReactECharts opts={{ renderer: "svg" }} style={{ height: 200 }} option={{
            grid: { top: 16, right: 12, bottom: 28, left: 40 },
            xAxis: { type: "category", data: MOCK_SCORES.map(d => d.date), axisLabel: { fontSize: 10, color: "#999" }, axisLine: { show: false }, axisTick: { show: false } },
            yAxis: { type: "value", min: 0, max: 26, splitLine: { lineStyle: { color: "#f5f5f5", type: "dashed" } }, axisLabel: { fontSize: 10, color: "#999" }, axisLine: { show: false }, axisTick: { show: false } },
            series: [{ type: "line", smooth: true, data: MOCK_SCORES.map(d => d.score), symbol: "none", lineStyle: { width: 3, color: "#42a5f5" }, areaStyle: { color: { type: "linear", x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: "rgba(66,165,245,0.35)" }, { offset: 0.7, color: "rgba(66,165,245,0.05)" }, { offset: 1, color: "transparent" }] } } }],
            tooltip: { trigger: "axis" },
          }} />
        </Card>

        <Label n={3} title="Trend - Teal with zone background bands" />
        <Card>
          <ReactECharts opts={{ renderer: "svg" }} style={{ height: 200 }} option={{
            grid: { top: 16, right: 12, bottom: 28, left: 40 },
            xAxis: { type: "category", data: MOCK_SCORES.map(d => d.date), axisLabel: { fontSize: 10, color: "#999" }, axisLine: { show: false }, axisTick: { show: false } },
            yAxis: { type: "value", min: 0, max: 26, splitLine: { show: false }, axisLabel: { fontSize: 10, color: "#999" }, axisLine: { show: false }, axisTick: { show: false } },
            series: [
              { type: "line", smooth: 0.3, data: MOCK_SCORES.map(d => d.score), symbol: "circle", symbolSize: 8, itemStyle: { color: "#26a69a", borderColor: "#fff", borderWidth: 2 }, lineStyle: { width: 2.5, color: "#26a69a" }, areaStyle: { color: { type: "linear", x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: "rgba(38,166,154,0.2)" }, { offset: 1, color: "transparent" }] } }, markArea: { silent: true, data: [[{ yAxis: 0, itemStyle: { color: "rgba(76,175,80,0.06)" } }, { yAxis: 7 }], [{ yAxis: 7, itemStyle: { color: "rgba(38,166,154,0.06)" } }, { yAxis: 12 }], [{ yAxis: 12, itemStyle: { color: "rgba(255,152,0,0.06)" } }, { yAxis: 15 }], [{ yAxis: 15, itemStyle: { color: "rgba(239,83,80,0.06)" } }, { yAxis: 26 }]] } },
            ],
            tooltip: { trigger: "axis" },
          }} />
        </Card>

        <Label n={4} title="Trend - Dark purple, thick line, diamond dots" />
        <Card>
          <ReactECharts opts={{ renderer: "svg" }} style={{ height: 200 }} option={{
            grid: { top: 20, right: 16, bottom: 28, left: 40 },
            xAxis: { type: "category", data: MOCK_SCORES.map(d => d.date), axisLabel: { fontSize: 10, color: "#999" }, axisLine: { show: false }, axisTick: { show: false } },
            yAxis: { type: "value", min: 0, max: 26, splitLine: { lineStyle: { color: "#f0f0f0" } }, axisLabel: { fontSize: 10, color: "#999" }, axisLine: { show: false }, axisTick: { show: false } },
            series: [{ type: "line", smooth: 0.5, data: MOCK_SCORES.map(d => d.score), symbol: "diamond", symbolSize: 12, itemStyle: { color: "#5e35b1", borderColor: "#fff", borderWidth: 2 }, lineStyle: { width: 3.5, color: "#5e35b1" }, areaStyle: { color: { type: "linear", x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: "rgba(94,53,177,0.25)" }, { offset: 1, color: "transparent" }] } } }],
            tooltip: { trigger: "axis" },
          }} />
        </Card>

        <Label n={5} title="Trend - Warm orange gradient, round dots" />
        <Card>
          <ReactECharts opts={{ renderer: "svg" }} style={{ height: 200 }} option={{
            grid: { top: 16, right: 12, bottom: 28, left: 40 },
            xAxis: { type: "category", data: MOCK_SCORES.map(d => d.date), axisLabel: { fontSize: 10, color: "#999" }, axisLine: { show: false }, axisTick: { show: false } },
            yAxis: { type: "value", min: 0, max: 26, splitLine: { lineStyle: { color: "#f5f5f5" } }, axisLabel: { fontSize: 10, color: "#999" }, axisLine: { show: false }, axisTick: { show: false } },
            series: [{ type: "line", smooth: 0.4, data: MOCK_SCORES.map(d => d.score), symbol: "circle", symbolSize: 9, itemStyle: { color: "#ff7043", borderColor: "#fff", borderWidth: 2.5 }, lineStyle: { width: 3, color: { type: "linear", x: 0, y: 0, x2: 1, y2: 0, colorStops: [{ offset: 0, color: "#ff9800" }, { offset: 1, color: "#ff5722" }] } }, areaStyle: { color: { type: "linear", x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: "rgba(255,112,67,0.3)" }, { offset: 1, color: "transparent" }] } } }],
            tooltip: { trigger: "axis" },
          }} />
        </Card>

        <Label n={6} title="Trend - Minimal, thin line, no fill, small dots" />
        <Card>
          <ReactECharts opts={{ renderer: "svg" }} style={{ height: 180 }} option={{
            grid: { top: 12, right: 12, bottom: 28, left: 40 },
            xAxis: { type: "category", data: MOCK_SCORES.map(d => d.date), axisLabel: { fontSize: 10, color: "#bbb" }, axisLine: { show: false }, axisTick: { show: false } },
            yAxis: { type: "value", min: 0, max: 26, splitLine: { lineStyle: { color: "#f8f8f8" } }, axisLabel: { fontSize: 10, color: "#bbb" }, axisLine: { show: false }, axisTick: { show: false } },
            series: [{ type: "line", smooth: false, data: MOCK_SCORES.map(d => d.score), symbol: "circle", symbolSize: 5, itemStyle: { color: "#555" }, lineStyle: { width: 1.5, color: "#555" } }],
            tooltip: { trigger: "axis" },
          }} />
        </Card>

        <Label n={7} title="Trend - Step line, green, filled" />
        <Card>
          <ReactECharts opts={{ renderer: "svg" }} style={{ height: 200 }} option={{
            grid: { top: 16, right: 12, bottom: 28, left: 40 },
            xAxis: { type: "category", data: MOCK_SCORES.map(d => d.date), axisLabel: { fontSize: 10, color: "#999" }, axisLine: { show: false }, axisTick: { show: false } },
            yAxis: { type: "value", min: 0, max: 26, splitLine: { lineStyle: { color: "#f0f0f0" } }, axisLabel: { fontSize: 10, color: "#999" }, axisLine: { show: false }, axisTick: { show: false } },
            series: [{ type: "line", step: "middle", data: MOCK_SCORES.map(d => d.score), symbol: "circle", symbolSize: 8, itemStyle: { color: "#4caf50", borderColor: "#fff", borderWidth: 2 }, lineStyle: { width: 2.5, color: "#4caf50" }, areaStyle: { color: { type: "linear", x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: "rgba(76,175,80,0.2)" }, { offset: 1, color: "transparent" }] } } }],
            tooltip: { trigger: "axis" },
          }} />
        </Card>

        <Label n={8} title="Trend - Bar chart style, gradient bars" />
        <Card>
          <ReactECharts opts={{ renderer: "svg" }} style={{ height: 200 }} option={{
            grid: { top: 16, right: 12, bottom: 28, left: 40 },
            xAxis: { type: "category", data: MOCK_SCORES.map(d => d.date), axisLabel: { fontSize: 10, color: "#999" }, axisLine: { show: false }, axisTick: { show: false } },
            yAxis: { type: "value", min: 0, max: 26, splitLine: { lineStyle: { color: "#f5f5f5" } }, axisLabel: { fontSize: 10, color: "#999" }, axisLine: { show: false }, axisTick: { show: false } },
            series: [{ type: "bar", data: MOCK_SCORES.map(d => d.score), barWidth: 24, itemStyle: { borderRadius: [6, 6, 0, 0], color: { type: "linear", x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: "#7c4dff" }, { offset: 1, color: "#b388ff" }] } }, emphasis: { itemStyle: { color: { type: "linear", x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: "#651fff" }, { offset: 1, color: "#7c4dff" }] } } } }],
            tooltip: { trigger: "axis" },
          }} />
        </Card>

        <Label n={9} title="Trend - Dual line (score + glucose on same chart)" />
        <Card>
          <ReactECharts opts={{ renderer: "svg" }} style={{ height: 220 }} option={{
            grid: { top: 24, right: 50, bottom: 28, left: 40 },
            legend: { data: ["Risk Score", "Glucose"], top: 0, textStyle: { fontSize: 11, color: "#666" } },
            xAxis: { type: "category", data: ["Oct 25", "Dec 25", "Jan 26", "Mar 26"], axisLabel: { fontSize: 10, color: "#999" }, axisLine: { show: false }, axisTick: { show: false } },
            yAxis: [
              { type: "value", min: 0, max: 26, name: "Score", nameTextStyle: { fontSize: 9, color: "#999" }, splitLine: { lineStyle: { color: "#f5f5f5" } }, axisLabel: { fontSize: 10, color: "#999" }, axisLine: { show: false }, axisTick: { show: false } },
              { type: "value", min: 4, max: 7, name: "mmol/L", nameTextStyle: { fontSize: 9, color: "#999" }, splitLine: { show: false }, axisLabel: { fontSize: 10, color: "#999" }, axisLine: { show: false }, axisTick: { show: false } },
            ],
            series: [
              { name: "Risk Score", type: "line", smooth: 0.4, data: [6, 7, 8, 10], symbol: "circle", symbolSize: 7, itemStyle: { color: "#7c4dff", borderColor: "#fff", borderWidth: 2 }, lineStyle: { width: 2.5, color: "#7c4dff" }, areaStyle: { color: { type: "linear", x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: "rgba(124,77,255,0.15)" }, { offset: 1, color: "transparent" }] } } },
              { name: "Glucose", type: "line", yAxisIndex: 1, smooth: 0.4, data: [5.1, 5.2, 5.5, 5.8], symbol: "circle", symbolSize: 7, itemStyle: { color: "#ff9800", borderColor: "#fff", borderWidth: 2 }, lineStyle: { width: 2.5, color: "#ff9800" }, areaStyle: { color: { type: "linear", x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: "rgba(255,152,0,0.12)" }, { offset: 1, color: "transparent" }] } } },
            ],
            tooltip: { trigger: "axis" },
          }} />
        </Card>

        <Label n={10} title="Trend - Candlestick style (range per period)" />
        <Card>
          <ReactECharts opts={{ renderer: "svg" }} style={{ height: 200 }} option={{
            grid: { top: 16, right: 12, bottom: 28, left: 40 },
            xAxis: { type: "category", data: ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"], axisLabel: { fontSize: 10, color: "#999" }, axisLine: { show: false }, axisTick: { show: false } },
            yAxis: { type: "value", min: 0, max: 26, splitLine: { lineStyle: { color: "#f5f5f5" } }, axisLabel: { fontSize: 10, color: "#999" }, axisLine: { show: false }, axisTick: { show: false } },
            series: [
              { type: "bar", data: [6, 7, 7, 8, 9, 10], stack: "a", barWidth: 16, itemStyle: { color: "transparent" } },
              { type: "bar", data: [2, 1, 2, 2, 1, 2], stack: "a", barWidth: 16, itemStyle: { borderRadius: 4, color: { type: "linear", x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: "#7c4dff" }, { offset: 1, color: "#b388ff" }] } } },
            ],
            tooltip: { trigger: "axis" },
          }} />
        </Card>

        {/* ============================================ */}
        {/* BELL CURVE / DISTRIBUTION (11-20) */}
        {/* ============================================ */}

        <Label n={11} title="Bell curve - Purple gradient, labeled markers" />
        <Card>
          <ReactECharts opts={{ renderer: "svg" }} style={{ height: 160 }} option={{
            grid: { top: 30, right: 16, bottom: 20, left: 16 },
            xAxis: { type: "value", min: 0, max: 26, axisLabel: { fontSize: 9, color: "#bbb" }, axisLine: { show: false }, axisTick: { show: false }, splitLine: { show: false } },
            yAxis: { type: "value", show: false },
            series: [{ type: "line", smooth: 0.6, symbol: "none", data: BELL_DATA, lineStyle: { width: 2.5, color: "#7c4dff" }, areaStyle: { color: { type: "linear", x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: "rgba(124,77,255,0.35)" }, { offset: 0.6, color: "rgba(124,77,255,0.08)" }, { offset: 1, color: "transparent" }] } },
              markLine: { silent: true, symbol: "none", data: [{ xAxis: 8, lineStyle: { color: "#bbb", type: "dashed", width: 1.5 }, label: { formatter: "Avg", position: "insideEndTop", fontSize: 10, color: "#999" } }, { xAxis: 11, lineStyle: { color: "#ff9800", width: 2 }, label: { formatter: "You", position: "insideEndTop", fontSize: 10, fontWeight: 700, color: "#ff9800" } }] },
              markPoint: { symbol: "circle", symbolSize: 14, data: [{ coord: [11, Math.exp(-0.5 * Math.pow((11-8)/4, 2))], itemStyle: { color: "#ff9800", borderColor: "#fff", borderWidth: 3, shadowColor: "rgba(255,152,0,0.4)", shadowBlur: 8 } }] },
            }],
          }} />
        </Card>

        <Label n={12} title="Bell curve - Teal, filled, with population density feel" />
        <Card>
          <ReactECharts opts={{ renderer: "svg" }} style={{ height: 160 }} option={{
            grid: { top: 24, right: 16, bottom: 20, left: 16 },
            xAxis: { type: "value", min: 0, max: 26, show: false },
            yAxis: { type: "value", show: false },
            series: [{ type: "line", smooth: 0.6, symbol: "none", data: BELL_DATA, lineStyle: { width: 0 }, areaStyle: { color: { type: "linear", x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: "rgba(38,166,154,0.5)" }, { offset: 1, color: "rgba(38,166,154,0.05)" }] } },
              markLine: { silent: true, symbol: "none", data: [{ xAxis: 8, lineStyle: { color: "#26a69a", type: "dashed" }, label: { formatter: "Average", position: "insideEndTop", fontSize: 10, color: "#26a69a" } }, { xAxis: 11, lineStyle: { color: "#e65100", width: 2 }, label: { formatter: "You", position: "insideEndTop", fontSize: 10, fontWeight: 700, color: "#e65100" } }] },
              markPoint: { symbol: "circle", symbolSize: 12, data: [{ coord: [11, Math.exp(-0.5 * Math.pow((11-8)/4, 2))], itemStyle: { color: "#e65100", borderColor: "#fff", borderWidth: 2 } }] },
            }],
          }} />
        </Card>

        <Label n={13} title="Bell curve - Split color (green left, red right)" />
        <Card>
          <ReactECharts opts={{ renderer: "svg" }} style={{ height: 160 }} option={{
            grid: { top: 24, right: 16, bottom: 20, left: 16 },
            xAxis: { type: "value", min: 0, max: 26, show: false },
            yAxis: { type: "value", show: false },
            visualMap: { show: false, dimension: 0, pieces: [{ lt: 12, color: "#4caf50" }, { gte: 12, color: "#ff9800" }] },
            series: [{ type: "line", smooth: 0.6, symbol: "none", data: BELL_DATA, lineStyle: { width: 2 }, areaStyle: { opacity: 0.15 },
              markPoint: { symbol: "circle", symbolSize: 14, data: [{ coord: [11, Math.exp(-0.5 * Math.pow((11-8)/4, 2))], itemStyle: { color: "#ff9800", borderColor: "#fff", borderWidth: 3 }, label: { show: true, formatter: "You", position: "top", fontSize: 10, fontWeight: 700, color: "#ff9800" } }] },
            }],
          }} />
        </Card>

        <Label n={14} title="Bell curve - Gradient zones (green to red)" />
        <Card>
          <ReactECharts opts={{ renderer: "svg" }} style={{ height: 160 }} option={{
            grid: { top: 24, right: 16, bottom: 20, left: 16 },
            xAxis: { type: "value", min: 0, max: 26, show: false },
            yAxis: { type: "value", show: false },
            series: [{ type: "line", smooth: 0.6, symbol: "none", data: BELL_DATA, lineStyle: { width: 2, color: { type: "linear", x: 0, y: 0, x2: 1, y2: 0, colorStops: [{ offset: 0, color: "#4caf50" }, { offset: 0.4, color: "#26a69a" }, { offset: 0.55, color: "#ff9800" }, { offset: 0.8, color: "#ef5350" }, { offset: 1, color: "#c62828" }] } }, areaStyle: { color: { type: "linear", x: 0, y: 0, x2: 1, y2: 0, colorStops: [{ offset: 0, color: "rgba(76,175,80,0.2)" }, { offset: 0.4, color: "rgba(38,166,154,0.15)" }, { offset: 0.55, color: "rgba(255,152,0,0.15)" }, { offset: 0.8, color: "rgba(239,83,80,0.15)" }, { offset: 1, color: "rgba(198,40,40,0.1)" }] } },
              markPoint: { symbol: "circle", symbolSize: 14, data: [{ coord: [11, Math.exp(-0.5 * Math.pow((11-8)/4, 2))], itemStyle: { color: "#ff9800", borderColor: "#fff", borderWidth: 3, shadowColor: "rgba(0,0,0,0.2)", shadowBlur: 6 }, label: { show: true, formatter: "You", position: "top", fontSize: 10, fontWeight: 700, color: "#ff9800", distance: 8 } }] },
            }],
          }} />
        </Card>

        <Label n={15} title="Bell curve - Scatter dots forming distribution" />
        <Card>
          <ReactECharts opts={{ renderer: "svg" }} style={{ height: 160 }} option={{
            grid: { top: 16, right: 16, bottom: 20, left: 16 },
            xAxis: { type: "value", min: 0, max: 26, axisLabel: { fontSize: 9, color: "#ccc" }, axisLine: { show: false }, axisTick: { show: false }, splitLine: { show: false } },
            yAxis: { type: "value", show: false },
            series: [
              { type: "scatter", symbolSize: 4, data: Array.from({ length: 200 }, () => { const x = 8 + 4 * (Math.random() + Math.random() + Math.random() - 1.5) / 1.5; return [Math.max(0, Math.min(26, x)), Math.random() * 0.3]; }), itemStyle: { color: "rgba(92,107,192,0.3)" } },
              { type: "scatter", symbolSize: 16, data: [[11, 0.15]], itemStyle: { color: "#ff9800", borderColor: "#fff", borderWidth: 3, shadowColor: "rgba(255,152,0,0.4)", shadowBlur: 10 }, label: { show: true, formatter: "You", position: "top", fontSize: 11, fontWeight: 700, color: "#ff9800" } },
              { type: "scatter", symbolSize: 10, data: [[8, 0.15]], itemStyle: { color: "#5c6bc0", borderColor: "#fff", borderWidth: 2 }, label: { show: true, formatter: "Avg", position: "top", fontSize: 10, color: "#5c6bc0" } },
            ],
          }} />
        </Card>

        {/* ============================================ */}
        {/* GAUGE CHARTS (16-25) */}
        {/* ============================================ */}

        <Label n={16} title="Gauge - Semicircle, gradient arc, score in center" />
        <Card>
          <ReactECharts opts={{ renderer: "svg" }} style={{ height: 200 }} option={{
            series: [{ type: "gauge", startAngle: 200, endAngle: -20, min: 0, max: 26, pointer: { show: true, length: "55%", width: 4, itemStyle: { color: "#ff9800" } }, axisLine: { lineStyle: { width: 16, color: [[7/26, "#4caf50"], [12/26, "#26a69a"], [15/26, "#ff9800"], [21/26, "#ef5350"], [1, "#c62828"]] } }, axisTick: { show: false }, splitLine: { show: false }, axisLabel: { show: false }, detail: { fontSize: 28, fontWeight: 700, color: "#1a1a2e", offsetCenter: [0, "30%"], formatter: "{value}" }, title: { show: true, offsetCenter: [0, "55%"], fontSize: 12, color: "#8b8da3" }, data: [{ value: 11, name: "Slightly elevated" }] }],
          }} />
        </Card>

        <Label n={17} title="Gauge - Ring style, thick colored arc" />
        <Card>
          <ReactECharts opts={{ renderer: "svg" }} style={{ height: 200 }} option={{
            series: [{ type: "gauge", startAngle: 225, endAngle: -45, min: 0, max: 26, pointer: { show: false }, progress: { show: true, width: 20, roundCap: true, itemStyle: { color: "#ff9800" } }, axisLine: { lineStyle: { width: 20, color: [[1, "#f0f0f0"]] }, roundCap: true }, axisTick: { show: false }, splitLine: { show: false }, axisLabel: { show: false }, detail: { fontSize: 24, fontWeight: 700, color: "#1a1a2e", offsetCenter: [0, "5%"], formatter: "11/26" }, title: { show: true, offsetCenter: [0, "30%"], fontSize: 11, color: "#ff9800", fontWeight: 600 }, data: [{ value: 11, name: "Slightly elevated" }] }],
          }} />
        </Card>

        <Label n={18} title="Gauge - Multi-zone ring, no pointer" />
        <Card>
          <ReactECharts opts={{ renderer: "svg" }} style={{ height: 200 }} option={{
            series: [{ type: "gauge", startAngle: 225, endAngle: -45, min: 0, max: 26, pointer: { show: false }, progress: { show: true, width: 14, roundCap: true, itemStyle: { color: { type: "linear", x: 0, y: 1, x2: 1, y2: 0, colorStops: [{ offset: 0, color: "#4caf50" }, { offset: 0.5, color: "#ff9800" }, { offset: 1, color: "#ef5350" }] } } }, axisLine: { lineStyle: { width: 14, color: [[1, "#eee"]] }, roundCap: true }, axisTick: { show: false }, splitLine: { show: false }, axisLabel: { show: false }, detail: { fontSize: 22, fontWeight: 700, color: "#1a1a2e", offsetCenter: [0, 0], formatter: "11" }, title: { offsetCenter: [0, "28%"], fontSize: 11, color: "#8b8da3" }, data: [{ value: 11, name: "out of 26" }] }],
          }} />
        </Card>

        <Label n={19} title="Gauge - Thin arc with gradient, clean" />
        <Card>
          <ReactECharts opts={{ renderer: "svg" }} style={{ height: 180 }} option={{
            series: [{ type: "gauge", startAngle: 200, endAngle: -20, min: 0, max: 26, pointer: { length: "50%", width: 3, itemStyle: { color: "#5e35b1" } }, axisLine: { lineStyle: { width: 8, color: [[7/26, "#e8f5e9"], [12/26, "#e0f2f1"], [15/26, "#fff8e1"], [21/26, "#ffebee"], [1, "#ffcdd2"]] } }, axisTick: { show: false }, splitLine: { show: false }, axisLabel: { show: false }, detail: { fontSize: 20, fontWeight: 700, color: "#1a1a2e", offsetCenter: [0, "35%"], formatter: "11/26" }, data: [{ value: 11 }] }],
          }} />
        </Card>

        <Label n={20} title="Gauge - Full circle donut" />
        <Card>
          <ReactECharts opts={{ renderer: "svg" }} style={{ height: 200 }} option={{
            series: [{ type: "gauge", startAngle: 90, endAngle: -270, min: 0, max: 26, pointer: { show: false }, progress: { show: true, width: 12, roundCap: true, itemStyle: { color: "#ff9800" } }, axisLine: { lineStyle: { width: 12, color: [[1, "#f5f5f5"]] }, roundCap: true }, axisTick: { show: false }, splitLine: { show: false }, axisLabel: { show: false }, detail: { fontSize: 20, fontWeight: 700, color: "#1a1a2e", offsetCenter: [0, "-5%"], formatter: "42%" }, title: { offsetCenter: [0, "20%"], fontSize: 10, color: "#8b8da3" }, data: [{ value: 11, name: "Slightly elevated" }] }],
          }} />
        </Card>

        {/* ============================================ */}
        {/* RANGE BARS / BULLET CHARTS (21-30) */}
        {/* ============================================ */}

        <Label n={21} title="Range bar - Gradient background, amber marker" />
        <Card><div style={{ padding: "12px 0" }}>
          <div style={{ position: "relative", height: 16, borderRadius: 8, background: "linear-gradient(90deg, #e8f5e9, #e0f2f1 30%, #e0f2f1 70%, #fff8e1 85%, #ffebee)", overflow: "visible" }}>
            <div style={{ position: "absolute", left: "72%", top: "50%", transform: "translate(-50%,-50%)", width: 20, height: 20, borderRadius: "50%", background: "#ff9800", border: "3px solid #fff", boxShadow: "0 2px 8px rgba(255,152,0,0.4)" }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: 10, color: "#999" }}><span>3.9</span><span style={{ color: "#ff9800", fontWeight: 600 }}>5.8</span><span>6.0</span></div>
        </div></Card>

        <Label n={22} title="Range bar - Green zone highlighted, triangle marker" />
        <Card><div style={{ padding: "12px 0" }}>
          <div style={{ position: "relative", height: 12, borderRadius: 6, background: "#f5f5f5" }}>
            <div style={{ position: "absolute", left: "30%", width: "40%", height: "100%", borderRadius: 6, background: "rgba(76,175,80,0.15)", border: "1px solid rgba(76,175,80,0.3)" }} />
            <div style={{ position: "absolute", left: "55%", top: -7, transform: "translateX(-50%)" }}><div style={{ width: 0, height: 0, borderLeft: "6px solid transparent", borderRight: "6px solid transparent", borderTop: "8px solid #4caf50" }} /></div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6, fontSize: 10, color: "#999" }}><span>20</span><span style={{ color: "#4caf50", fontWeight: 600 }}>38</span><span>42</span></div>
        </div></Card>

        <Label n={23} title="Range bar - Thick, ECharts bar-based" />
        <Card>
          <ReactECharts opts={{ renderer: "svg" }} style={{ height: 50 }} option={{
            grid: { top: 8, right: 16, bottom: 8, left: 16 },
            xAxis: { type: "value", min: 0, max: 60, show: false },
            yAxis: { type: "category", data: [""], show: false },
            series: [
              { type: "bar", data: [60], barWidth: 14, itemStyle: { color: "#f5f5f5", borderRadius: 7 }, z: 1 },
              { type: "bar", data: [{ value: 42, itemStyle: { color: "rgba(76,175,80,0.2)", borderRadius: 7 } }], barWidth: 14, barGap: "-100%", z: 2 },
              { type: "bar", data: [{ value: 38, itemStyle: { color: "#4caf50", borderRadius: 7 } }], barWidth: 14, barGap: "-100%", z: 3 },
            ],
          }} />
        </Card>

        <Label n={24} title="Range bar - Horizontal gauge style" />
        <Card>
          <ReactECharts opts={{ renderer: "svg" }} style={{ height: 60 }} option={{
            series: [{ type: "gauge", startAngle: 180, endAngle: 0, min: 20, max: 50, center: ["50%", "80%"], radius: "120%", pointer: { length: "50%", width: 4, itemStyle: { color: "#4caf50" } }, axisLine: { lineStyle: { width: 10, color: [[0.44, "#fff8e1"], [0.88, "#e8f5e9"], [1, "#fff8e1"]] } }, axisTick: { show: false }, splitLine: { show: false }, axisLabel: { show: false }, detail: { show: false }, data: [{ value: 38 }] }],
          }} />
        </Card>

        <Label n={25} title="Range bar - Pill style, filled to value" />
        <Card><div style={{ padding: "12px 0" }}>
          <div style={{ position: "relative", height: 24, borderRadius: 12, background: "#f0f0f0", overflow: "hidden" }}>
            <div style={{ height: "100%", width: "63%", borderRadius: 12, background: "linear-gradient(90deg, #4caf50, #66bb6a)" }} />
            <span style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", fontSize: 11, fontWeight: 700, color: "#1a1a2e" }}>38 mmol/mol</span>
          </div>
        </div></Card>

        <Label n={26} title="Range bar - Color zones with value dot" />
        <Card><div style={{ padding: "12px 0" }}>
          <div style={{ display: "flex", height: 14, borderRadius: 7, overflow: "hidden", position: "relative" }}>
            <div style={{ width: "25%", background: "#ffebee" }} />
            <div style={{ width: "50%", background: "#e8f5e9" }} />
            <div style={{ width: "25%", background: "#ffebee" }} />
            <div style={{ position: "absolute", left: "55%", top: "50%", transform: "translate(-50%,-50%)", width: 18, height: 18, borderRadius: "50%", background: "#4caf50", border: "3px solid #fff", boxShadow: "0 1px 4px rgba(0,0,0,0.2)" }} />
          </div>
        </div></Card>

        {/* ============================================ */}
        {/* SPARKLINES (27-32) */}
        {/* ============================================ */}

        <Label n={27} title="Sparkline - Amber uptrend, gradient fill, dots" />
        <Card>
          <ReactECharts opts={{ renderer: "svg" }} style={{ height: 50 }} option={{
            grid: { top: 4, right: 4, bottom: 4, left: 4 },
            xAxis: { type: "category", show: false, data: ["Sep", "Dec", "Mar"] },
            yAxis: { type: "value", show: false, min: 4.9, max: 6.1 },
            series: [{ type: "line", smooth: 0.4, data: [5.2, 5.5, 5.8], symbol: "circle", symbolSize: 7, itemStyle: { color: "#ff9800", borderColor: "#fff", borderWidth: 2 }, lineStyle: { width: 2.5, color: "#ff9800", shadowColor: "rgba(255,152,0,0.3)", shadowBlur: 6 }, areaStyle: { color: { type: "linear", x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: "rgba(255,152,0,0.3)" }, { offset: 1, color: "transparent" }] } } }],
          }} />
        </Card>

        <Label n={28} title="Sparkline - Green downtrend (good), thin" />
        <Card>
          <ReactECharts opts={{ renderer: "svg" }} style={{ height: 50 }} option={{
            grid: { top: 4, right: 4, bottom: 4, left: 4 },
            xAxis: { type: "category", show: false, data: ["Sep", "Dec", "Mar"] },
            yAxis: { type: "value", show: false, min: 4.5, max: 6.5 },
            series: [{ type: "line", smooth: 0.3, data: [6.0, 5.6, 5.2], symbol: "circle", symbolSize: 5, itemStyle: { color: "#4caf50" }, lineStyle: { width: 2, color: "#4caf50" }, areaStyle: { color: { type: "linear", x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: "rgba(76,175,80,0.2)" }, { offset: 1, color: "transparent" }] } } }],
          }} />
        </Card>

        <Label n={29} title="Sparkline - Bar micro chart" />
        <Card>
          <ReactECharts opts={{ renderer: "svg" }} style={{ height: 50 }} option={{
            grid: { top: 4, right: 4, bottom: 4, left: 4 },
            xAxis: { type: "category", show: false, data: ["Sep", "Dec", "Mar"] },
            yAxis: { type: "value", show: false, min: 4.5, max: 6.5 },
            series: [{ type: "bar", data: [{ value: 5.2, itemStyle: { color: "#4caf50" } }, { value: 5.5, itemStyle: { color: "#ff9800" } }, { value: 5.8, itemStyle: { color: "#ff9800" } }], barWidth: 20, itemStyle: { borderRadius: [4, 4, 0, 0] } }],
          }} />
        </Card>

        {/* ============================================ */}
        {/* RISK ZONE BARS (30-38) */}
        {/* ============================================ */}

        <Label n={30} title="Zone bar - Colored segments, white dot marker" />
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

        <Label n={31} title="Zone bar - Active zone highlighted, others dimmed" />
        <Card><div style={{ padding: "8px 0" }}>
          <div style={{ display: "flex", height: 24, borderRadius: 12, overflow: "hidden", gap: 2 }}>
            {[{ w: "27%", c: "#4caf50", active: false }, { w: "19%", c: "#26a69a", active: true }, { w: "12%", c: "#ff9800", active: false }, { w: "23%", c: "#ef5350", active: false }, { w: "19%", c: "#c62828", active: false }].map((z, i) => (
              <div key={i} style={{ width: z.w, background: z.c, opacity: z.active ? 1 : 0.2, borderRadius: i === 0 ? "12px 0 0 12px" : i === 4 ? "0 12px 12px 0" : 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {z.active && <span style={{ fontSize: 10, fontWeight: 700, color: "#fff" }}>You</span>}
              </div>
            ))}
          </div>
        </div></Card>

        <Label n={32} title="Zone bar - Gradient continuous, pin marker" />
        <Card><div style={{ padding: "8px 0" }}>
          <div style={{ position: "relative", height: 16, borderRadius: 8, background: "linear-gradient(90deg, #4caf50 0%, #26a69a 27%, #ff9800 46%, #ef5350 69%, #c62828 100%)" }}>
            <div style={{ position: "absolute", left: "42%", top: -4, transform: "translateX(-50%)" }}>
              <div style={{ width: 3, height: 24, background: "#fff", borderRadius: 2, boxShadow: "0 1px 4px rgba(0,0,0,0.3)" }} />
            </div>
          </div>
        </div></Card>

        <Label n={33} title="Zone bar - Rounded pills with gap" />
        <Card><div style={{ padding: "8px 0" }}>
          <div style={{ display: "flex", gap: 3, height: 20 }}>
            {[{ w: "27%", c: "#4caf50", o: 0.25 }, { w: "19%", c: "#26a69a", o: 1 }, { w: "12%", c: "#ff9800", o: 0.25 }, { w: "23%", c: "#ef5350", o: 0.25 }, { w: "19%", c: "#c62828", o: 0.25 }].map((z, i) => (
              <div key={i} style={{ width: z.w, background: z.c, opacity: z.o, borderRadius: 10 }} />
            ))}
          </div>
        </div></Card>

        <Label n={34} title="Zone bar - ECharts stacked bar" />
        <Card>
          <ReactECharts opts={{ renderer: "svg" }} style={{ height: 50 }} option={{
            grid: { top: 8, right: 0, bottom: 8, left: 0 },
            xAxis: { type: "value", max: 26, show: false },
            yAxis: { type: "category", data: [""], show: false },
            series: [
              { type: "bar", stack: "zone", data: [7], barWidth: 18, itemStyle: { color: "#4caf50", borderRadius: [9, 0, 0, 9] } },
              { type: "bar", stack: "zone", data: [5], barWidth: 18, itemStyle: { color: "#26a69a" } },
              { type: "bar", stack: "zone", data: [3], barWidth: 18, itemStyle: { color: "#ff9800" } },
              { type: "bar", stack: "zone", data: [6], barWidth: 18, itemStyle: { color: "#ef5350" } },
              { type: "bar", stack: "zone", data: [5], barWidth: 18, itemStyle: { color: "#c62828", borderRadius: [0, 9, 9, 0] } },
            ],
          }} />
        </Card>

        {/* ============================================ */}
        {/* RADIAL / DONUT (35-40) */}
        {/* ============================================ */}

        <Label n={35} title="Donut - Score percentage with colored arc" />
        <Card>
          <ReactECharts opts={{ renderer: "svg" }} style={{ height: 180 }} option={{
            series: [{ type: "pie", radius: ["65%", "80%"], startAngle: 90, data: [{ value: 42, itemStyle: { color: "#ff9800", borderRadius: 6 } }, { value: 58, itemStyle: { color: "#f5f5f5", borderRadius: 6 } }], label: { show: true, position: "center", fontSize: 24, fontWeight: 700, color: "#1a1a2e", formatter: "42%" }, emphasis: { disabled: true }, silent: true }],
          }} />
        </Card>

        <Label n={36} title="Donut - Multi-metric (score + blood + activity)" />
        <Card>
          <ReactECharts opts={{ renderer: "svg" }} style={{ height: 200 }} option={{
            series: [
              { type: "pie", radius: ["70%", "82%"], startAngle: 90, data: [{ value: 42, itemStyle: { color: "#7c4dff" } }, { value: 58, itemStyle: { color: "#ede7f6" } }], label: { show: false }, silent: true },
              { type: "pie", radius: ["55%", "67%"], startAngle: 90, data: [{ value: 71, itemStyle: { color: "#26a69a" } }, { value: 29, itemStyle: { color: "#e0f2f1" } }], label: { show: false }, silent: true },
              { type: "pie", radius: ["40%", "52%"], startAngle: 90, data: [{ value: 30, itemStyle: { color: "#ff9800" } }, { value: 70, itemStyle: { color: "#fff8e1" } }], label: { show: false }, silent: true },
            ],
          }} />
          <div style={{ textAlign: "center", marginTop: -8, display: "flex", justifyContent: "center", gap: 16, fontSize: 10, color: "#666" }}>
            <span><span style={{ color: "#7c4dff" }}>*</span> Risk</span>
            <span><span style={{ color: "#26a69a" }}>*</span> Blood</span>
            <span><span style={{ color: "#ff9800" }}>*</span> Activity</span>
          </div>
        </Card>

        <Label n={37} title="Radial bar - Horizontal progress bars" />
        <Card><div style={{ display: "flex", flexDirection: "column", gap: 10, padding: "8px 0" }}>
          {[{ label: "Diabetes Risk", pct: 42, color: "#ff9800" }, { label: "Blood Tests", pct: 71, color: "#26a69a" }, { label: "Activity", pct: 30, color: "#7c4dff" }].map(b => (
            <div key={b.label}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 4 }}><span style={{ color: "#555" }}>{b.label}</span><span style={{ fontWeight: 600, color: b.color }}>{b.pct}%</span></div>
              <div style={{ height: 8, borderRadius: 4, background: "#f0f0f0" }}><div style={{ height: "100%", borderRadius: 4, width: `${b.pct}%`, background: b.color, transition: "width 0.5s" }} /></div>
            </div>
          ))}
        </div></Card>

        {/* ============================================ */}
        {/* HEATMAP / CALENDAR (38-42) */}
        {/* ============================================ */}

        <Label n={38} title="Heatmap - Weekly activity grid (GitHub style)" />
        <Card>
          <ReactECharts opts={{ renderer: "svg" }} style={{ height: 100 }} option={{
            grid: { top: 4, right: 4, bottom: 4, left: 30 },
            xAxis: { type: "category", data: ["W1", "W2", "W3", "W4", "W5", "W6", "W7", "W8"], axisLine: { show: false }, axisTick: { show: false }, axisLabel: { fontSize: 9, color: "#bbb" } },
            yAxis: { type: "category", data: ["Mon", "Wed", "Fri"], axisLine: { show: false }, axisTick: { show: false }, axisLabel: { fontSize: 9, color: "#bbb" } },
            visualMap: { show: false, min: 0, max: 60, inRange: { color: ["#f5f5f5", "#c8e6c9", "#66bb6a", "#2e7d32"] } },
            series: [{ type: "heatmap", data: [[0,0,30],[0,1,0],[0,2,45],[1,0,20],[1,1,35],[1,2,0],[2,0,50],[2,1,40],[2,2,60],[3,0,0],[3,1,25],[3,2,30],[4,0,45],[4,1,50],[4,2,35],[5,0,20],[5,1,0],[5,2,40],[6,0,55],[6,1,45],[6,2,30],[7,0,40],[7,1,35],[7,2,50]], itemStyle: { borderRadius: 3, borderWidth: 2, borderColor: "#fff" } }],
          }} />
        </Card>

        <Label n={39} title="Radar - Health dimensions" />
        <Card>
          <ReactECharts opts={{ renderer: "svg" }} style={{ height: 220 }} option={{
            radar: { indicator: [{ name: "Diet", max: 10 }, { name: "Activity", max: 10 }, { name: "Sleep", max: 10 }, { name: "Blood Sugar", max: 10 }, { name: "Weight", max: 10 }, { name: "Stress", max: 10 }], shape: "circle", axisLine: { lineStyle: { color: "#e0e0e0" } }, splitLine: { lineStyle: { color: "#f0f0f0" } }, splitArea: { show: false }, name: { fontSize: 11, color: "#666" } },
            series: [{ type: "radar", data: [{ value: [7, 4, 8, 6, 5, 7], areaStyle: { color: "rgba(124,77,255,0.15)" }, lineStyle: { color: "#7c4dff", width: 2 }, itemStyle: { color: "#7c4dff", borderColor: "#fff", borderWidth: 2 }, symbol: "circle", symbolSize: 7 }] }],
          }} />
        </Card>

        {/* ============================================ */}
        {/* COMPARISON / BEFORE-AFTER (40-45) */}
        {/* ============================================ */}

        <Label n={40} title="Before/after - Horizontal bars comparing two periods" />
        <Card>
          <ReactECharts opts={{ renderer: "svg" }} style={{ height: 180 }} option={{
            grid: { top: 24, right: 16, bottom: 8, left: 80 },
            legend: { data: ["Dec 2025", "Mar 2026"], top: 0, textStyle: { fontSize: 10, color: "#666" } },
            xAxis: { type: "value", show: false },
            yAxis: { type: "category", data: ["Glucose", "HbA1c", "Cholesterol", "BMI"], axisLine: { show: false }, axisTick: { show: false }, axisLabel: { fontSize: 11, color: "#555" } },
            series: [
              { name: "Dec 2025", type: "bar", data: [5.5, 39, 5.3, 28], barWidth: 10, itemStyle: { color: "#b0bec5", borderRadius: 5 } },
              { name: "Mar 2026", type: "bar", data: [5.8, 38, 5.1, 27.6], barWidth: 10, itemStyle: { color: "#7c4dff", borderRadius: 5 } },
            ],
          }} />
        </Card>

        <Label n={41} title="Bullet chart - Value vs target vs range" />
        <Card>
          <ReactECharts opts={{ renderer: "svg" }} style={{ height: 80 }} option={{
            grid: { top: 20, right: 16, bottom: 20, left: 80 },
            xAxis: { type: "value", max: 10, axisLabel: { fontSize: 9, color: "#bbb" }, splitLine: { lineStyle: { color: "#f5f5f5" } }, axisLine: { show: false }, axisTick: { show: false } },
            yAxis: { type: "category", data: ["HbA1c"], axisLine: { show: false }, axisTick: { show: false }, axisLabel: { fontSize: 11, color: "#555" } },
            series: [
              { type: "bar", data: [10], barWidth: 30, itemStyle: { color: "#f5f5f5", borderRadius: 6 }, z: 1 },
              { type: "bar", data: [6], barWidth: 30, barGap: "-100%", itemStyle: { color: "rgba(76,175,80,0.15)", borderRadius: 6 }, z: 2 },
              { type: "bar", data: [3.8], barWidth: 14, barGap: "-100%", itemStyle: { color: "#4caf50", borderRadius: 6 }, z: 3 },
            ],
          }} />
        </Card>

        {/* ============================================ */}
        {/* WATERFALL / FUNNEL (42-46) */}
        {/* ============================================ */}

        <Label n={42} title="Waterfall - Factor contribution to score" />
        <Card>
          <ReactECharts opts={{ renderer: "svg" }} style={{ height: 200 }} option={{
            grid: { top: 16, right: 12, bottom: 28, left: 12 },
            xAxis: { type: "category", data: ["Age", "BMI", "Waist", "Activity", "Diet", "BP Meds", "Glucose", "Family", "Total"], axisLabel: { fontSize: 9, color: "#999", rotate: 30 }, axisLine: { show: false }, axisTick: { show: false } },
            yAxis: { type: "value", splitLine: { lineStyle: { color: "#f5f5f5" } }, axisLabel: { fontSize: 10, color: "#999" }, axisLine: { show: false }, axisTick: { show: false } },
            series: [
              { type: "bar", stack: "w", data: [0, 0, 0, 0, 0, 0, 0, 0, 0], itemStyle: { color: "transparent" } },
              { type: "bar", stack: "w", data: [{ value: 0, itemStyle: { color: "#e0e0e0" } }, { value: 1, itemStyle: { color: "#ff9800" } }, { value: 3, itemStyle: { color: "#ef5350" } }, { value: 2, itemStyle: { color: "#ff9800" } }, { value: 0, itemStyle: { color: "#e0e0e0" } }, { value: 0, itemStyle: { color: "#e0e0e0" } }, { value: 0, itemStyle: { color: "#e0e0e0" } }, { value: 5, itemStyle: { color: "#ef5350" } }, { value: 11, itemStyle: { color: "#7c4dff", borderRadius: [4,4,0,0] } }], barWidth: 20, itemStyle: { borderRadius: [4, 4, 0, 0] } },
            ],
          }} />
        </Card>

        <Label n={43} title="Pie - Factor breakdown" />
        <Card>
          <ReactECharts opts={{ renderer: "svg" }} style={{ height: 200 }} option={{
            series: [{ type: "pie", radius: ["40%", "70%"], avoidLabelOverlap: true, itemStyle: { borderRadius: 6, borderColor: "#fff", borderWidth: 2 }, label: { fontSize: 10, color: "#555" }, data: [{ value: 5, name: "Family", itemStyle: { color: "#ef5350" } }, { value: 3, name: "Waist", itemStyle: { color: "#ff9800" } }, { value: 2, name: "Activity", itemStyle: { color: "#ff9800" } }, { value: 1, name: "BMI", itemStyle: { color: "#ffc107" } }] }],
          }} />
        </Card>

        <Label n={44} title="Treemap - Factor importance" />
        <Card>
          <ReactECharts opts={{ renderer: "svg" }} style={{ height: 160 }} option={{
            series: [{ type: "treemap", data: [{ name: "Family\nHistory", value: 5, itemStyle: { color: "#ef5350", borderRadius: 6 } }, { name: "Waist", value: 3, itemStyle: { color: "#ff9800", borderRadius: 6 } }, { name: "Activity", value: 2, itemStyle: { color: "#ffc107", borderRadius: 6 } }, { name: "BMI", value: 1, itemStyle: { color: "#66bb6a", borderRadius: 6 } }], breadcrumb: { show: false }, label: { fontSize: 11, fontWeight: 600, color: "#fff" }, roam: false, nodeClick: false }],
          }} />
        </Card>

        {/* ============================================ */}
        {/* CREATIVE / UNIQUE (45-50) */}
        {/* ============================================ */}

        <Label n={45} title="Parallel coordinates - Multi-biomarker overview" />
        <Card>
          <ReactECharts opts={{ renderer: "svg" }} style={{ height: 200 }} option={{
            parallelAxis: [
              { dim: 0, name: "HbA1c", min: 20, max: 50, nameTextStyle: { fontSize: 10, color: "#666" } },
              { dim: 1, name: "Glucose", min: 3, max: 8, nameTextStyle: { fontSize: 10, color: "#666" } },
              { dim: 2, name: "Chol.", min: 3, max: 7, nameTextStyle: { fontSize: 10, color: "#666" } },
              { dim: 3, name: "HDL", min: 0.5, max: 3, nameTextStyle: { fontSize: 10, color: "#666" } },
              { dim: 4, name: "LDL", min: 0, max: 5, nameTextStyle: { fontSize: 10, color: "#666" } },
            ],
            parallel: { left: 40, right: 40, top: 20, bottom: 20 },
            series: [
              { type: "parallel", lineStyle: { width: 2.5, color: "#7c4dff", opacity: 0.8 }, data: [[38, 5.8, 5.1, 1.6, 2.9]] },
              { type: "parallel", lineStyle: { width: 1.5, color: "#b0bec5", opacity: 0.4 }, data: [[35, 5.0, 4.8, 1.8, 2.5]] },
            ],
          }} />
          <div style={{ textAlign: "center", fontSize: 10, color: "#999" }}>Purple = You, Gray = Average</div>
        </Card>

        <Label n={46} title="Sankey - Risk factor flow to outcome" />
        <Card>
          <ReactECharts opts={{ renderer: "svg" }} style={{ height: 200 }} option={{
            series: [{ type: "sankey", layout: "none", emphasis: { focus: "adjacency" }, nodeWidth: 16, nodeGap: 12, label: { fontSize: 10, color: "#555" }, lineStyle: { color: "gradient", curveness: 0.5 }, data: [{ name: "Family History", itemStyle: { color: "#ef5350" } }, { name: "Waist", itemStyle: { color: "#ff9800" } }, { name: "Activity", itemStyle: { color: "#ffc107" } }, { name: "BMI", itemStyle: { color: "#66bb6a" } }, { name: "Moderate Risk", itemStyle: { color: "#ff9800" } }], links: [{ source: "Family History", target: "Moderate Risk", value: 5 }, { source: "Waist", target: "Moderate Risk", value: 3 }, { source: "Activity", target: "Moderate Risk", value: 2 }, { source: "BMI", target: "Moderate Risk", value: 1 }] }],
          }} />
        </Card>

        <Label n={47} title="Liquid fill - Score as liquid percentage" />
        <Card>
          <ReactECharts opts={{ renderer: "canvas" }} style={{ height: 200 }} option={{
            series: [{ type: "gauge", startAngle: 90, endAngle: -270, min: 0, max: 26, pointer: { show: false }, progress: { show: true, width: 18, roundCap: true, itemStyle: { color: { type: "linear", x: 0, y: 0, x2: 1, y2: 0, colorStops: [{ offset: 0, color: "#4caf50" }, { offset: 0.5, color: "#ff9800" }, { offset: 1, color: "#ef5350" }] } } }, axisLine: { lineStyle: { width: 18, color: [[1, "#f5f5f5"]] }, roundCap: true }, axisTick: { show: false }, splitLine: { show: false }, axisLabel: { show: false }, detail: { fontSize: 28, fontWeight: 700, offsetCenter: [0, "-5%"], color: "#1a1a2e", formatter: "{value}" }, title: { offsetCenter: [0, "22%"], fontSize: 11, color: "#8b8da3" }, data: [{ value: 11, name: "out of 26" }] }],
          }} />
        </Card>

        <Label n={48} title="Timeline - Score progression with icons" />
        <Card>
          <ReactECharts opts={{ renderer: "svg" }} style={{ height: 180 }} option={{
            grid: { top: 20, right: 20, bottom: 24, left: 20 },
            xAxis: { type: "category", data: ["Oct 25", "Dec 25", "Jan 26", "Mar 26"], axisLabel: { fontSize: 10, color: "#999" }, axisLine: { lineStyle: { color: "#e0e0e0" } }, axisTick: { show: false } },
            yAxis: { type: "value", min: 0, max: 26, show: false },
            series: [
              { type: "line", smooth: 0.3, data: [6, 7, 8, 10], lineStyle: { width: 3, color: { type: "linear", x: 0, y: 0, x2: 1, y2: 0, colorStops: [{ offset: 0, color: "#4caf50" }, { offset: 1, color: "#ff9800" }] } }, areaStyle: { color: { type: "linear", x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: "rgba(124,77,255,0.15)" }, { offset: 1, color: "transparent" }] } }, symbol: "circle", symbolSize: 12, itemStyle: { color: "#fff", borderColor: "#7c4dff", borderWidth: 3 } },
            ],
            tooltip: { trigger: "axis" },
          }} />
        </Card>

        <Label n={49} title="Box plot - Score distribution by age group" />
        <Card>
          <ReactECharts opts={{ renderer: "svg" }} style={{ height: 200 }} option={{
            grid: { top: 16, right: 16, bottom: 28, left: 40 },
            xAxis: { type: "category", data: ["25-34", "35-44", "45-54", "55-64", "65+"], axisLabel: { fontSize: 10, color: "#999" }, axisLine: { show: false }, axisTick: { show: false } },
            yAxis: { type: "value", min: 0, max: 26, splitLine: { lineStyle: { color: "#f5f5f5" } }, axisLabel: { fontSize: 10, color: "#999" }, axisLine: { show: false }, axisTick: { show: false } },
            series: [
              { type: "boxplot", data: [[2, 4, 6, 9, 12], [3, 5, 8, 11, 15], [4, 7, 10, 14, 18], [6, 9, 12, 16, 20], [8, 11, 15, 19, 23]], itemStyle: { color: "#ede7f6", borderColor: "#7c4dff", borderWidth: 1.5 } },
              { type: "scatter", data: [[1, 11]], symbolSize: 12, itemStyle: { color: "#ff9800", borderColor: "#fff", borderWidth: 2 }, label: { show: true, formatter: "You", position: "right", fontSize: 10, fontWeight: 700, color: "#ff9800" } },
            ],
          }} />
        </Card>

        <Label n={50} title="Sunburst - Health factor hierarchy" />
        <Card>
          <ReactECharts opts={{ renderer: "svg" }} style={{ height: 240 }} option={{
            series: [{ type: "sunburst", radius: ["15%", "90%"], sort: undefined, emphasis: { focus: "ancestor" }, label: { fontSize: 9, color: "#555" }, itemStyle: { borderRadius: 4, borderWidth: 2, borderColor: "#fff" }, data: [
              { name: "Modifiable", itemStyle: { color: "#e8f5e9" }, children: [
                { name: "Activity", value: 2, itemStyle: { color: "#ff9800" } },
                { name: "BMI", value: 1, itemStyle: { color: "#66bb6a" } },
                { name: "Waist", value: 3, itemStyle: { color: "#ff9800" } },
                { name: "Diet", value: 0, itemStyle: { color: "#4caf50" } },
              ]},
              { name: "Fixed", itemStyle: { color: "#fafafa" }, children: [
                { name: "Family", value: 5, itemStyle: { color: "#ef5350" } },
                { name: "Age", value: 0, itemStyle: { color: "#e0e0e0" } },
                { name: "Glucose Hx", value: 0, itemStyle: { color: "#e0e0e0" } },
                { name: "BP Meds", value: 0, itemStyle: { color: "#e0e0e0" } },
              ]},
            ] }],
          }} />
        </Card>

      </div>
    </div>
  );
}

function Label({ n, title }: { n: number; title: string }) {
  return (
    <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginTop: n > 1 ? 8 : 0 }}>
      <span style={{ fontSize: 16, fontWeight: 700, color: "#7c4dff", fontVariantNumeric: "tabular-nums", minWidth: 28 }}>{n}.</span>
      <span style={{ fontSize: 13, fontWeight: 600, color: "#1a1a2e" }}>{title}</span>
    </div>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ background: "#fff", borderRadius: 16, padding: "12px 16px", border: "1px solid #e6e8ed", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
      {children}
    </div>
  );
}
