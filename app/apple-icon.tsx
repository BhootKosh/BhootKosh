import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** Apple touch icon — neo-brutal sheet ghost */
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
              border: "5px solid #0a0a0a",
              borderRadius: 999,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: 48,
                height: 54,
                background: "#fffdf8",
                border: "4px solid #0a0a0a",
                borderRadius: "24px 24px 8px 8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                paddingTop: 10,
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 10,
                  background: "#0a0a0a",
                  borderRadius: 4,
                  display: "flex",
                }}
              />
              <div
                style={{
                  width: 8,
                  height: 10,
                  background: "#0a0a0a",
                  borderRadius: 4,
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
