import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "BhootKosh — Indian Folklore Archive";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#f2e6d0",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            margin: 28,
            width: 1144,
            height: 574,
            border: "8px solid #0a0a0a",
            boxShadow: "16px 16px 0 #0a0a0a",
            background: "#e85d04",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            padding: 48,
            gap: 40,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 16,
              flex: 1,
            }}
          >
            <div style={{ display: "flex", gap: 12 }}>
              <div
                style={{
                  background: "#f4c430",
                  border: "5px solid #0a0a0a",
                  boxShadow: "6px 6px 0 #0a0a0a",
                  padding: "10px 16px",
                  fontSize: 22,
                  fontWeight: 800,
                  color: "#0a0a0a",
                }}
              >
                ARCHIVE
              </div>
              <div
                style={{
                  background: "#5eead4",
                  border: "5px solid #0a0a0a",
                  boxShadow: "6px 6px 0 #0a0a0a",
                  padding: "10px 16px",
                  fontSize: 22,
                  fontWeight: 800,
                  color: "#0a0a0a",
                }}
              >
                INDIAN FOLKLORE
              </div>
            </div>
            <div
              style={{
                fontSize: 100,
                fontWeight: 900,
                color: "#0a0a0a",
                lineHeight: 0.9,
                letterSpacing: -4,
              }}
            >
              BHOOT
            </div>
            <div
              style={{
                alignSelf: "flex-start",
                background: "#0a0a0a",
                color: "#f4c430",
                fontSize: 100,
                fontWeight: 900,
                lineHeight: 0.95,
                letterSpacing: -4,
                padding: "4px 18px 10px",
                boxShadow: "10px 10px 0 #f4c430",
              }}
            >
              KOSH
            </div>
            <div
              style={{
                background: "#fffdf8",
                border: "5px solid #0a0a0a",
                boxShadow: "8px 8px 0 #0a0a0a",
                padding: "14px 18px",
                fontSize: 26,
                fontWeight: 700,
                color: "#0a0a0a",
                maxWidth: 620,
              }}
            >
              Illustrated archive of Indian ghosts, spirits & haunted places
            </div>
          </div>

          {/* Huge classic sheet ghost */}
          <div
            style={{
              width: 280,
              height: 280,
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
                width: 160,
                height: 190,
                background: "#fffdf8",
                border: "8px solid #0a0a0a",
                borderTopLeftRadius: 90,
                borderTopRightRadius: 90,
                borderBottomLeftRadius: 18,
                borderBottomRightRadius: 18,
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "center",
                gap: 28,
                paddingTop: 52,
              }}
            >
              <div
                style={{
                  width: 24,
                  height: 32,
                  background: "#0a0a0a",
                  borderRadius: 999,
                  display: "flex",
                }}
              />
              <div
                style={{
                  width: 24,
                  height: 32,
                  background: "#0a0a0a",
                  borderRadius: 999,
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
