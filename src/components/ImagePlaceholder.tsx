"use client";

interface ImagePlaceholderProps {
  number: number;
  width?: string;
  height?: string;
  className?: string;
  gradient?: string;
}

const gradients = [
  "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
  "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
  "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
  "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
  "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)",
  "linear-gradient(135deg, #fccb90 0%, #d57eeb 100%)",
  "linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)",
  "linear-gradient(135deg, #f5576c 0%, #ff6f91 50%, #ff9671 100%)",
  "linear-gradient(135deg, #30cfd0 0%, #330867 100%)",
];

export default function ImagePlaceholder({
  number,
  width = "100%",
  height = "200px",
  className = "",
  gradient,
}: ImagePlaceholderProps) {
  const bg = gradient || gradients[(number - 1) % gradients.length];

  return (
    <div
      className={`flex items-center justify-center rounded-2xl ${className}`}
      style={{
        width,
        height,
        background: bg,
        minHeight: height,
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "24px",
          fontWeight: 700,
          color: "rgba(255,255,255,0.7)",
          background: "rgba(255,255,255,0.15)",
          borderRadius: "12px",
          padding: "8px 16px",
          backdropFilter: "blur(4px)",
        }}
      >
        {number}
      </span>
    </div>
  );
}
