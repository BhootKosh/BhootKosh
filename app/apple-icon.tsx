import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 180, height: 180 };
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
          background: "#f2e6d0",
        }}
      >
        <div
          style={{
            width: 148,
            height: 148,
            background: "#e85d04",
            border: "8px solid #0a0a0a",
            boxShadow: "10px 10px 0 #0a0a0a",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* big sheet ghost */}
          <div
            style={{
              width: 88,
              height: 100,
              background: "#fffdf8",
              border: "6px solid #0a0a0a",
              borderTopLeftRadius: 48,
              borderTopRightRadius: 48,
              borderBottomLeftRadius: 12,
              borderBottomRightRadius: 12,
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "center",
              gap: 16,
              paddingTop: 28,
            }}
          >
            <div
              style={{
                width: 14,
                height: 18,
                background: "#0a0a0a",
                borderRadius: 999,
                display: "flex",
              }}
            />
            <div
              style={{
                width: 14,
                height: 18,
                background: "#0a0a0a",
                borderRadius: 999,
                display: "flex",
              }}
            />
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
