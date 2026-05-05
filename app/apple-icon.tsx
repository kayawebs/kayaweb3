import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};

export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#050816",
          borderRadius: 40,
          border: "6px solid #27272F",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 28,
            left: 28,
            width: 16,
            height: 16,
            borderRadius: 9999,
            background: "#22C55E",
          }}
        />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
            marginTop: 12,
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderTop: "10px solid transparent",
              borderBottom: "10px solid transparent",
              borderLeft: "18px solid #22C55E",
              transform: "scaleX(0.95)",
            }}
          />
          <div
            style={{
              width: 40,
              height: 10,
              borderRadius: 9999,
              background: "#F5F5F5",
            }}
          />
        </div>
      </div>
    ),
    size,
  );
}
