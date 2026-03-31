"use client";

import { useState, useEffect } from "react";
import ReactECharts from "echarts-for-react";

export default function ChartsPage() {
  return (
    <div style={{ background: "#f8f9fa", minHeight: "100dvh", padding: "20px 16px 60px" }}>
      <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4, color: "#1a1a2e" }}>Remaining Decisions</h1>
      <p style={{ fontSize: 12, color: "#8b8da3", marginBottom: 24 }}>3 types left: gauges, sparklines, factor breakdowns</p>

      <div style={{ display: "flex", flexDirection: "column", gap: 14, maxWidth: 500, margin: "0 auto" }}>

        {/* ============================================ */}
        <SectionTitle text="GAUGES - For dashboard health overview" />
        <p style={{ fontSize: 11, color: "#999", marginTop: -8, marginBottom: 4 }}>The thing users see first. Answers "am I ok?" at a glance.</p>

        <Label n={1} title="Simple arc - score fills proportionally" />
        <Card>
          <div style={{ display: "flex", alignItems: "center", gap: 20, padding: "8px 0" }}>
            <ReactECharts opts={{ renderer: "svg" }} style={{ height: 120, width: 120, flexShrink: 0 }} option={{
              series: [{ type: "gauge", startAngle: 225, endAngle: -45, min: 0, max: 26, pointer: { show: false },
                progress: { show: true, width: 14, roundCap: true, itemStyle: { color: "#ff9800" } },
                axisLine: { lineStyle: { width: 14, color: [[1, "#f0f0f0"]] }, roundCap: true },
                axisTick: { show: false }, splitLine: { show: false }, axisLabel: { show: false },
                detail: { fontSize: 20, fontWeight: 700, color: "#1a1a2e", offsetCenter: [0, 0], formatter: "11" },
                title: { offsetCenter: [0, "30%"], fontSize: 10, color: "#8b8da3" },
                data: [{ value: 11, name: "out of 26" }],
              }],
              animationDuration: 1200,
            }} />
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#1a1a2e", marginBottom: 4 }}>Diabetes Risk</div>
              <div style={{ fontSize: 12, color: "#ff9800", fontWeight: 600 }}>Slightly elevated</div>
              <div style={{ fontSize: 11, color: "#999", marginTop: 2 }}>~4% 10-year risk</div>
            </div>
          </div>
        </Card>

        <Label n={2} title="Color-graded arc - green to red based on score position" />
        <Card>
          <div style={{ display: "flex", alignItems: "center", gap: 20, padding: "8px 0" }}>
            <ReactECharts opts={{ renderer: "svg" }} style={{ height: 120, width: 120, flexShrink: 0 }} option={{
              series: [{ type: "gauge", startAngle: 225, endAngle: -45, min: 0, max: 26, pointer: { show: false },
                progress: { show: true, width: 14, roundCap: true, itemStyle: { color: { type: "linear", x: 0, y: 1, x2: 1, y2: 0, colorStops: [{ offset: 0, color: "#4caf50" }, { offset: 0.5, color: "#ff9800" }, { offset: 1, color: "#ef5350" }] } } },
                axisLine: { lineStyle: { width: 14, color: [[1, "#f0f0f0"]] }, roundCap: true },
                axisTick: { show: false }, splitLine: { show: false }, axisLabel: { show: false },
                detail: { fontSize: 20, fontWeight: 700, color: "#1a1a2e", offsetCenter: [0, 0], formatter: "11" },
                title: { offsetCenter: [0, "30%"], fontSize: 10, color: "#8b8da3" },
                data: [{ value: 11, name: "out of 26" }],
              }],
              animationDuration: 1200,
            }} />
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#1a1a2e", marginBottom: 4 }}>Diabetes Risk</div>
              <div style={{ fontSize: 12, color: "#ff9800", fontWeight: 600 }}>Slightly elevated</div>
            </div>
          </div>
        </Card>

        <Label n={3} title="Segmented arc - zones visible on the ring itself" />
        <Card>
          <div style={{ display: "flex", alignItems: "center", gap: 20, padding: "8px 0" }}>
            <ReactECharts opts={{ renderer: "canvas" }} style={{ height: 120, width: 120, flexShrink: 0 }} option={{
              series: [{ type: "gauge", startAngle: 225, endAngle: -45, min: 0, max: 26,
                pointer: { length: "50%", width: 4, itemStyle: { color: "#555" } },
                axisLine: { lineStyle: { width: 14, color: [[7/26, "#4caf50"], [12/26, "#26a69a"], [15/26, "#ff9800"], [21/26, "#ef5350"], [1, "#c62828"]] } },
                axisTick: { show: false }, splitLine: { show: false }, axisLabel: { show: false },
                detail: { fontSize: 18, fontWeight: 700, color: "#1a1a2e", offsetCenter: [0, "35%"], formatter: "11" },
                data: [{ value: 11 }],
              }],
              animationDuration: 1500, animationEasing: "elasticOut",
            }} />
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#1a1a2e", marginBottom: 4 }}>Diabetes Risk</div>
              <div style={{ fontSize: 12, color: "#ff9800", fontWeight: 600 }}>Slightly elevated</div>
            </div>
          </div>
        </Card>

        <Label n={4} title="Half gauge - wider, more visual real estate" />
        <Card>
          <ReactECharts opts={{ renderer: "canvas" }} style={{ height: 140 }} option={{
            series: [{ type: "gauge", startAngle: 180, endAngle: 0, min: 0, max: 26, center: ["50%", "75%"],
              axisLine: { lineStyle: { width: 20, color: [[7/26, "#4caf50"], [12/26, "#26a69a"], [15/26, "#ff9800"], [21/26, "#ef5350"], [1, "#c62828"]] } },
              pointer: { length: "55%", width: 5, itemStyle: { color: "#1a1a2e" } },
              axisTick: { show: false }, splitLine: { show: false }, axisLabel: { show: false },
              detail: { fontSize: 22, fontWeight: 700, color: "#1a1a2e", offsetCenter: [0, "-15%"], formatter: "11/26" },
              title: { offsetCenter: [0, "10%"], fontSize: 11, color: "#ff9800", fontWeight: 600 },
              data: [{ value: 11, name: "Slightly elevated" }],
            }],
            animationDuration: 1500, animationEasing: "elasticOut",
          }} />
        </Card>

        <Label n={5} title="Text-centric - no chart, just clear status with color bar" />
        <Card>
          <div style={{ padding: "4px 0" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: "#1a1a2e" }}>Diabetes Risk</span>
              <span style={{ fontSize: 14, fontWeight: 700, color: "#ff9800" }}>Slightly elevated</span>
            </div>
            <div style={{ display: "flex", height: 8, borderRadius: 4, overflow: "hidden", gap: 2 }}>
              <div style={{ flex: 7, background: "#4caf50", borderRadius: "4px 0 0 4px" }} />
              <div style={{ flex: 5, background: "#26a69a" }} />
              <div style={{ flex: 3, background: "#ff9800" }} />
              <div style={{ flex: 6, background: "#ef5350" }} />
              <div style={{ flex: 5, background: "#c62828", borderRadius: "0 4px 4px 0" }} />
            </div>
            <div style={{ display: "flex", marginTop: 4 }}>
              <div style={{ flex: 7 }} />
              <div style={{ flex: 5, display: "flex", justifyContent: "center" }}>
                <div style={{ width: 0, height: 0, borderLeft: "5px solid transparent", borderRight: "5px solid transparent", borderBottom: "6px solid #1a1a2e" }} />
              </div>
              <div style={{ flex: 14 }} />
            </div>
            <div style={{ fontSize: 11, color: "#999", marginTop: 4 }}>~4% chance of developing Type 2 diabetes in 10 years</div>
          </div>
        </Card>

        <Label n={6} title="Percentage circle - Apple Watch fitness ring style" />
        <Card>
          <div style={{ display: "flex", alignItems: "center", gap: 20, padding: "8px 0" }}>
            <ReactECharts opts={{ renderer: "svg" }} style={{ height: 110, width: 110, flexShrink: 0 }} option={{
              series: [{ type: "gauge", startAngle: 90, endAngle: -270, min: 0, max: 100, pointer: { show: false },
                progress: { show: true, width: 10, roundCap: true, clip: false, itemStyle: { color: "#ff9800" } },
                axisLine: { lineStyle: { width: 10, color: [[1, "#f5f5f5"]] }, roundCap: true },
                axisTick: { show: false }, splitLine: { show: false }, axisLabel: { show: false },
                detail: { fontSize: 22, fontWeight: 700, color: "#1a1a2e", offsetCenter: [0, 0], formatter: "42%" },
                data: [{ value: 42 }],
              }],
              animationDuration: 1200,
            }} />
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#1a1a2e", marginBottom: 4 }}>Diabetes Risk</div>
              <div style={{ fontSize: 12, color: "#ff9800", fontWeight: 600 }}>Slightly elevated</div>
              <div style={{ fontSize: 11, color: "#999", marginTop: 2 }}>Score 11 of 26</div>
            </div>
          </div>
        </Card>

        <Label n={7} title="Multi-ring - all health areas at once (dashboard overview)" />
        <Card>
          <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "8px 0" }}>
            <ReactECharts opts={{ renderer: "svg" }} style={{ height: 130, width: 130, flexShrink: 0 }} option={{
              series: [
                { type: "gauge", startAngle: 90, endAngle: -270, min: 0, max: 100, pointer: { show: false }, progress: { show: true, width: 8, roundCap: true, clip: false, itemStyle: { color: "#ff9800" } }, axisLine: { lineStyle: { width: 8, color: [[1, "rgba(255,152,0,0.12)"]] }, roundCap: true }, axisTick: { show: false }, splitLine: { show: false }, axisLabel: { show: false }, detail: { show: false }, data: [{ value: 42 }], radius: "95%", center: ["50%", "50%"] },
                { type: "gauge", startAngle: 90, endAngle: -270, min: 0, max: 100, pointer: { show: false }, progress: { show: true, width: 8, roundCap: true, clip: false, itemStyle: { color: "#26a69a" } }, axisLine: { lineStyle: { width: 8, color: [[1, "rgba(38,166,154,0.12)"]] }, roundCap: true }, axisTick: { show: false }, splitLine: { show: false }, axisLabel: { show: false }, detail: { show: false }, data: [{ value: 71 }], radius: "75%", center: ["50%", "50%"] },
                { type: "gauge", startAngle: 90, endAngle: -270, min: 0, max: 100, pointer: { show: false }, progress: { show: true, width: 8, roundCap: true, clip: false, itemStyle: { color: "#e0e0e0" } }, axisLine: { lineStyle: { width: 8, color: [[1, "rgba(0,0,0,0.04)"]] }, roundCap: true }, axisTick: { show: false }, splitLine: { show: false }, axisLabel: { show: false }, detail: { show: false }, data: [{ value: 0 }], radius: "55%", center: ["50%", "50%"] },
              ],
              animationDuration: 1500,
            }} />
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}><div style={{ width: 8, height: 8, borderRadius: 4, background: "#ff9800" }} /><span style={{ fontSize: 12, color: "#1a1a2e" }}>Diabetes <span style={{ fontWeight: 600, color: "#ff9800" }}>42%</span></span></div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}><div style={{ width: 8, height: 8, borderRadius: 4, background: "#26a69a" }} /><span style={{ fontSize: 12, color: "#1a1a2e" }}>Blood tests <span style={{ fontWeight: 600, color: "#26a69a" }}>71%</span></span></div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}><div style={{ width: 8, height: 8, borderRadius: 4, background: "#e0e0e0" }} /><span style={{ fontSize: 12, color: "#999" }}>Heart - coming soon</span></div>
            </div>
          </div>
        </Card>

        {/* ============================================ */}
        <SectionTitle text="SPARKLINES - For inline mini trends" />
        <p style={{ fontSize: 11, color: "#999", marginTop: -8, marginBottom: 4 }}>Used next to blood values and on the dashboard. Tiny, clear, directional.</p>

        <Label n={8} title="Gradient line - endpoint dot only" />
        <Card>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: "#555", minWidth: 80 }}>f-Glucose</span>
            <div style={{ flex: 1, height: 36 }}>
              <ReactECharts opts={{ renderer: "svg" }} style={{ height: 36 }} option={{
                grid: { top: 4, right: 4, bottom: 4, left: 4 },
                xAxis: { type: "category", show: false, data: ["Sep", "Dec", "Mar"] },
                yAxis: { type: "value", show: false, min: 4.9, max: 6.1 },
                series: [{ type: "line", smooth: 0.3, data: [5.2, 5.5, 5.8], symbol: (v: number, p: { dataIndex: number }) => p.dataIndex === 2 ? "circle" : "none", symbolSize: 8, itemStyle: { color: "#ff9800", borderColor: "#fff", borderWidth: 2 }, lineStyle: { width: 2, color: { type: "linear", x: 0, y: 0, x2: 1, y2: 0, colorStops: [{ offset: 0, color: "rgba(255,152,0,0.3)" }, { offset: 1, color: "#ff9800" }] } }, areaStyle: { color: { type: "linear", x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: "rgba(255,152,0,0.12)" }, { offset: 1, color: "transparent" }] } } }],
              }} />
            </div>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#ff9800", minWidth: 50, textAlign: "right" }}>5.8</span>
          </div>
        </Card>

        <Label n={9} title="Simple line - no fill, clean" />
        <Card>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: "#555", minWidth: 80 }}>f-Glucose</span>
            <div style={{ flex: 1, height: 36 }}>
              <ReactECharts opts={{ renderer: "svg" }} style={{ height: 36 }} option={{
                grid: { top: 4, right: 4, bottom: 4, left: 4 },
                xAxis: { type: "category", show: false, data: ["Sep", "Dec", "Mar"] },
                yAxis: { type: "value", show: false, min: 4.9, max: 6.1 },
                series: [{ type: "line", smooth: 0.3, data: [5.2, 5.5, 5.8], symbol: "circle", symbolSize: 5, itemStyle: { color: "#ff9800" }, lineStyle: { width: 2, color: "#ff9800" } }],
              }} />
            </div>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#ff9800", minWidth: 50, textAlign: "right" }}>5.8</span>
          </div>
        </Card>

        <Label n={10} title="Bar sparkline - each period as a bar" />
        <Card>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: "#555", minWidth: 80 }}>f-Glucose</span>
            <div style={{ flex: 1, height: 36 }}>
              <ReactECharts opts={{ renderer: "svg" }} style={{ height: 36 }} option={{
                grid: { top: 4, right: 4, bottom: 4, left: 4 },
                xAxis: { type: "category", show: false, data: ["Sep", "Dec", "Mar"] },
                yAxis: { type: "value", show: false, min: 4.5, max: 6.2 },
                series: [{ type: "bar", data: [{ value: 5.2, itemStyle: { color: "#66bb6a", borderRadius: [3, 3, 0, 0] } }, { value: 5.5, itemStyle: { color: "#ffa726", borderRadius: [3, 3, 0, 0] } }, { value: 5.8, itemStyle: { color: "#ff9800", borderRadius: [3, 3, 0, 0] } }], barWidth: 16 }],
              }} />
            </div>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#ff9800", minWidth: 50, textAlign: "right" }}>5.8</span>
          </div>
        </Card>

        <Label n={11} title="Arrow indicator - no chart, just direction" />
        <Card>
          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "4px 0" }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: "#555", minWidth: 80 }}>f-Glucose</span>
            <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 11, color: "#999" }}>5.2</span>
              <div style={{ flex: 1, height: 1, background: "#e0e0e0", position: "relative" }}>
                <div style={{ position: "absolute", right: 0, top: -4, width: 0, height: 0, borderTop: "5px solid transparent", borderBottom: "5px solid transparent", borderLeft: "8px solid #ff9800" }} />
              </div>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#ff9800" }}>5.8</span>
            </div>
            <span style={{ fontSize: 10, color: "#ff9800", fontWeight: 600, background: "rgba(255,152,0,0.1)", padding: "2px 6px", borderRadius: 4 }}>+11%</span>
          </div>
        </Card>

        <Label n={12} title="Dot trail - shows progression as dots" />
        <Card>
          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "4px 0" }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: "#555", minWidth: 80 }}>f-Glucose</span>
            <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 8px" }}>
              {[5.2, 5.5, 5.8].map((v, i) => (
                <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
                  <div style={{ width: i === 2 ? 14 : 8, height: i === 2 ? 14 : 8, borderRadius: "50%", background: i === 2 ? "#ff9800" : i === 1 ? "rgba(255,152,0,0.4)" : "rgba(255,152,0,0.2)", border: i === 2 ? "2px solid #fff" : "none", boxShadow: i === 2 ? "0 1px 4px rgba(255,152,0,0.4)" : "none" }} />
                  <span style={{ fontSize: 10, fontWeight: i === 2 ? 700 : 400, color: i === 2 ? "#ff9800" : "#bbb" }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* ============================================ */}
        <SectionTitle text="FACTOR BREAKDOWNS - What's driving the score" />
        <p style={{ fontSize: 11, color: "#999", marginTop: -8, marginBottom: 4 }}>Shows which factors contribute and by how much. Needs to be clear which are changeable.</p>

        <Label n={13} title="Horizontal bars - sorted by impact, color-coded" />
        <Card>
          <ReactECharts opts={{ renderer: "svg" }} style={{ height: 170 }} option={{
            grid: { top: 4, right: 40, bottom: 4, left: 100 },
            xAxis: { type: "value", max: 5, show: false },
            yAxis: { type: "category", data: ["Diet", "BMI", "Activity", "Waist", "Family history"], axisLine: { show: false }, axisTick: { show: false }, axisLabel: { fontSize: 12, color: "#555" }, inverse: true },
            series: [{ type: "bar", data: [
              { value: 0, itemStyle: { color: "#e8f5e9", borderRadius: [0, 4, 4, 0] } },
              { value: 1, itemStyle: { color: { type: "linear", x: 0, y: 0, x2: 1, y2: 0, colorStops: [{ offset: 0, color: "#ffc107" }, { offset: 1, color: "#ffd54f" }] }, borderRadius: [0, 6, 6, 0] } },
              { value: 2, itemStyle: { color: { type: "linear", x: 0, y: 0, x2: 1, y2: 0, colorStops: [{ offset: 0, color: "#ff9800" }, { offset: 1, color: "#ffb74d" }] }, borderRadius: [0, 6, 6, 0] } },
              { value: 3, itemStyle: { color: { type: "linear", x: 0, y: 0, x2: 1, y2: 0, colorStops: [{ offset: 0, color: "#ff7043" }, { offset: 1, color: "#ff8a65" }] }, borderRadius: [0, 6, 6, 0] } },
              { value: 5, itemStyle: { color: { type: "linear", x: 0, y: 0, x2: 1, y2: 0, colorStops: [{ offset: 0, color: "#ef5350" }, { offset: 1, color: "#e57373" }] }, borderRadius: [0, 6, 6, 0] } },
            ], barWidth: 14, label: { show: true, position: "right", fontSize: 12, fontWeight: 700, color: "#555", formatter: (p: { value: number }) => p.value > 0 ? `+${p.value}` : "-" } }],
            animation: true, animationDuration: 800, animationDelay: (idx: number) => idx * 120,
          }} />
        </Card>

        <Label n={14} title="Horizontal bars - with changeable/fixed labels" />
        <Card>
          <div style={{ padding: "4px 0" }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: "#4caf50", marginBottom: 8 }}>Things you can change</div>
            {[{ name: "Activity", pts: 2, max: 2 }, { name: "BMI", pts: 1, max: 3 }, { name: "Waist", pts: 3, max: 4 }].map(f => (
              <div key={f.name} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <span style={{ fontSize: 12, color: "#555", minWidth: 70 }}>{f.name}</span>
                <div style={{ flex: 1, height: 8, borderRadius: 4, background: "#f0f0f0", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${(f.pts / f.max) * 100}%`, borderRadius: 4, background: f.pts >= f.max ? "#ef5350" : f.pts > 0 ? "#ff9800" : "#4caf50" }} />
                </div>
                <span style={{ fontSize: 11, fontWeight: 600, color: f.pts > 0 ? "#ff9800" : "#4caf50", minWidth: 30, textAlign: "right" }}>+{f.pts}</span>
              </div>
            ))}
            <div style={{ fontSize: 11, fontWeight: 600, color: "#999", marginTop: 12, marginBottom: 8 }}>Fixed</div>
            {[{ name: "Family Hx", pts: 5, max: 5 }, { name: "Age", pts: 0, max: 4 }].map(f => (
              <div key={f.name} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <span style={{ fontSize: 12, color: "#999", minWidth: 70 }}>{f.name}</span>
                <div style={{ flex: 1, height: 8, borderRadius: 4, background: "#f0f0f0", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${(f.pts / f.max) * 100}%`, borderRadius: 4, background: "#e0e0e0" }} />
                </div>
                <span style={{ fontSize: 11, fontWeight: 600, color: "#999", minWidth: 30, textAlign: "right" }}>+{f.pts}</span>
              </div>
            ))}
          </div>
        </Card>

        <Label n={15} title="Stacked composition bar - shows total" />
        <Card>
          <ReactECharts opts={{ renderer: "svg" }} style={{ height: 50 }} option={{
            grid: { top: 6, right: 16, bottom: 6, left: 16 },
            xAxis: { type: "value", max: 26, show: false },
            yAxis: { type: "category", data: [""], show: false },
            series: [
              { type: "bar", stack: "s", data: [5], barWidth: 20, itemStyle: { color: "#ef5350", borderRadius: [10, 0, 0, 10] }, label: { show: true, formatter: "Family", fontSize: 9, color: "#fff" } },
              { type: "bar", stack: "s", data: [3], barWidth: 20, itemStyle: { color: "#ff9800" }, label: { show: true, formatter: "Waist", fontSize: 9, color: "#fff" } },
              { type: "bar", stack: "s", data: [2], barWidth: 20, itemStyle: { color: "#ffc107" }, label: { show: true, formatter: "Activity", fontSize: 9, color: "#fff" } },
              { type: "bar", stack: "s", data: [1], barWidth: 20, itemStyle: { color: "#66bb6a" }, label: { show: true, formatter: "BMI", fontSize: 9, color: "#fff" } },
              { type: "bar", stack: "s", data: [15], barWidth: 20, itemStyle: { color: "#f5f5f5", borderRadius: [0, 10, 10, 0] }, label: { show: false } },
            ],
          }} />
          <div style={{ textAlign: "center", fontSize: 12, fontWeight: 600, color: "#555", marginTop: 2 }}>11 out of 26</div>
        </Card>

        <Label n={16} title="Pill segments - each factor is a pill" />
        <Card>
          <div style={{ padding: "4px 0" }}>
            {[
              { name: "Family history", pts: 5, color: "#ef5350", desc: "Parent or sibling with diabetes" },
              { name: "Waist circumference", pts: 3, color: "#ff9800", desc: "86 cm - above recommended for women" },
              { name: "Activity level", pts: 2, color: "#ffc107", desc: "Less than 30 min daily" },
              { name: "BMI", pts: 1, color: "#66bb6a", desc: "27.6 - slightly overweight" },
            ].map(f => (
              <div key={f.name} style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 10 }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: f.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#fff", flexShrink: 0 }}>+{f.pts}</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#1a1a2e" }}>{f.name}</div>
                  <div style={{ fontSize: 11, color: "#999" }}>{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Label n={17} title="Treemap - area proportional to impact" />
        <Card>
          <ReactECharts opts={{ renderer: "svg" }} style={{ height: 140 }} option={{
            series: [{ type: "treemap", data: [
              { name: "Family\nhistory +5", value: 5, itemStyle: { color: { type: "linear", x: 0, y: 0, x2: 1, y2: 1, colorStops: [{ offset: 0, color: "#ef5350" }, { offset: 1, color: "#e57373" }] }, borderRadius: 8 } },
              { name: "Waist +3", value: 3, itemStyle: { color: { type: "linear", x: 0, y: 0, x2: 1, y2: 1, colorStops: [{ offset: 0, color: "#ff9800" }, { offset: 1, color: "#ffb74d" }] }, borderRadius: 8 } },
              { name: "Activity +2", value: 2, itemStyle: { color: { type: "linear", x: 0, y: 0, x2: 1, y2: 1, colorStops: [{ offset: 0, color: "#ffc107" }, { offset: 1, color: "#ffd54f" }] }, borderRadius: 8 } },
              { name: "BMI +1", value: 1, itemStyle: { color: { type: "linear", x: 0, y: 0, x2: 1, y2: 1, colorStops: [{ offset: 0, color: "#66bb6a" }, { offset: 1, color: "#81c784" }] }, borderRadius: 8 } },
            ], breadcrumb: { show: false }, label: { fontSize: 11, fontWeight: 600, color: "#fff" }, roam: false, nodeClick: false }],
          }} />
        </Card>

        <Label n={18} title="Donut - factor proportions" />
        <Card>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <ReactECharts opts={{ renderer: "svg" }} style={{ height: 140, width: 140, flexShrink: 0 }} option={{
              series: [{ type: "pie", radius: ["50%", "75%"], avoidLabelOverlap: true, itemStyle: { borderRadius: 6, borderColor: "#fff", borderWidth: 2 }, label: { show: false },
                data: [{ value: 5, name: "Family", itemStyle: { color: "#ef5350" } }, { value: 3, name: "Waist", itemStyle: { color: "#ff9800" } }, { value: 2, name: "Activity", itemStyle: { color: "#ffc107" } }, { value: 1, name: "BMI", itemStyle: { color: "#66bb6a" } }],
                emphasis: { itemStyle: { shadowBlur: 10, shadowColor: "rgba(0,0,0,0.1)" } },
              }],
            }} />
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {[{ name: "Family history", pts: 5, color: "#ef5350" }, { name: "Waist", pts: 3, color: "#ff9800" }, { name: "Activity", pts: 2, color: "#ffc107" }, { name: "BMI", pts: 1, color: "#66bb6a" }].map(f => (
                <div key={f.name} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 8, height: 8, borderRadius: 4, background: f.color }} />
                  <span style={{ fontSize: 11, color: "#555" }}>{f.name}</span>
                  <span style={{ fontSize: 11, fontWeight: 600, color: f.color }}>+{f.pts}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

      </div>
    </div>
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
    <div style={{ marginTop: 24, marginBottom: 4, paddingTop: 16, borderTop: "2px solid #e6e8ed" }}>
      <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", color: "#8b8da3" }}>{text}</span>
    </div>
  );
}
