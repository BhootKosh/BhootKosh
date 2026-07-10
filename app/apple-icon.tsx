import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** Apple touch icon */
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
          <div
            style={{
              width: 72,
              height: 72,
              background: "#f4c430",
              border: "6px solid #0a0a0a",
              transform: "rotate(45deg)",
              display: "flex",
            }}
          />
        </div>
      </div>
    ),
    { ...size }
  );
}
