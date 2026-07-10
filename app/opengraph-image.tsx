import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "BhootKosh — Indian Folklore Archive";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Discord / Slack / Twitter embed card — neo-brutal + clear ghost brand.
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
        <div
          style={{
            position: "absolute",
            inset: 28,
            border: "8px solid #0a0a0a",
            boxShadow: "16px 16px 0 #0a0a0a",
            background: "#e85d04",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            padding: 48,
            gap: 40,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 18,
              flex: 1,
            }}
          >
            <div style={{ display: "flex", gap: 14 }}>
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

            <div
              style={{
                fontSize: 96,
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
                fontSize: 96,
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

            <div
              style={{
                background: "#fffdf8",
                border: "5px solid #0a0a0a",
                boxShadow: "8px 8px 0 #0a0a0a",
                color: "#0a0a0a",
                fontSize: 26,
                fontWeight: 700,
                maxWidth: 640,
                padding: "14px 18px",
                lineHeight: 1.3,
              }}
            >
              Illustrated archive of Indian ghosts, spirits, demons & haunted
              places
            </div>
          </div>

          {/* Big ghost mascot */}
          <div
            style={{
              width: 260,
              height: 260,
              background: "#f4c430",
              border: "8px solid #0a0a0a",
              boxShadow: "12px 12px 0 #0a0a0a",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <div
              style={{
                width: 150,
                height: 170,
                background: "#fffdf8",
                border: "7px solid #0a0a0a",
                borderRadius: "80px 80px 20px 20px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 14,
                paddingTop: 20,
              }}
            >
              <div style={{ display: "flex", gap: 22 }}>
                <div
                  style={{
                    width: 22,
                    height: 28,
                    background: "#0a0a0a",
                    borderRadius: 12,
                    display: "flex",
                  }}
                />
                <div
                  style={{
                    width: 22,
                    height: 28,
                    background: "#0a0a0a",
                    borderRadius: 12,
                    display: "flex",
                  }}
                />
              </div>
              <div
                style={{
                  width: 40,
                  height: 14,
                  borderBottom: "6px solid #0a0a0a",
                  borderRadius: "0 0 20px 20px",
                  display: "flex",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
