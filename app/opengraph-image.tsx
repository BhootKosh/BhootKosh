import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "BhootKosh — Indian Folklore Archive";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Discord / Slack / Twitter embed card — neo-brutal flat graphic.
 * Generated at the edge so text is always crisp and shareable.
 */
export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#f2e6d0",
          position: "relative",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* outer hard frame */}
        <div
          style={{
            position: "absolute",
            inset: 28,
            border: "8px solid #0a0a0a",
            boxShadow: "16px 16px 0 #0a0a0a",
            background: "#e85d04",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: 48,
          }}
        >
          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <div
              style={{
                background: "#f4c430",
                border: "5px solid #0a0a0a",
                boxShadow: "6px 6px 0 #0a0a0a",
                color: "#0a0a0a",
                fontSize: 22,
                fontWeight: 800,
                letterSpacing: 2,
                padding: "10px 18px",
                textTransform: "uppercase",
              }}
            >
              Archive
            </div>
            <div
              style={{
                background: "#5eead4",
                border: "5px solid #0a0a0a",
                boxShadow: "6px 6px 0 #0a0a0a",
                color: "#0a0a0a",
                fontSize: 22,
                fontWeight: 800,
                letterSpacing: 2,
                padding: "10px 18px",
                textTransform: "uppercase",
              }}
            >
              Indian Folklore
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div
              style={{
                fontSize: 108,
                fontWeight: 900,
                color: "#0a0a0a",
                lineHeight: 0.9,
                letterSpacing: -4,
                textTransform: "uppercase",
              }}
            >
              Bhoot
            </div>
            <div
              style={{
                display: "flex",
                alignSelf: "flex-start",
                background: "#0a0a0a",
                color: "#f4c430",
                fontSize: 108,
                fontWeight: 900,
                lineHeight: 0.95,
                letterSpacing: -4,
                textTransform: "uppercase",
                padding: "4px 20px 12px",
                boxShadow: "10px 10px 0 #f4c430",
              }}
            >
              Kosh
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
            }}
          >
            <div
              style={{
                background: "#fffdf8",
                border: "5px solid #0a0a0a",
                boxShadow: "8px 8px 0 #0a0a0a",
                color: "#0a0a0a",
                fontSize: 28,
                fontWeight: 700,
                maxWidth: 720,
                padding: "16px 20px",
                lineHeight: 1.25,
              }}
            >
              Illustrated archive of Indian ghosts, spirits, demons & haunted
              places
            </div>
            <div
              style={{
                width: 96,
                height: 96,
                background: "#f4c430",
                border: "6px solid #0a0a0a",
                boxShadow: "8px 8px 0 #0a0a0a",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 52,
                fontWeight: 900,
                color: "#0a0a0a",
              }}
            >
              ◈
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
