import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

/** Favicon — unmistakable sheet ghost */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#e85d04",
        }}
      >
        {/* ghost: rounded top, flat-ish body */}
        <div
          style={{
            width: 20,
            height: 22,
            background: "#fffdf8",
            border: "2px solid #0a0a0a",
            borderTopLeftRadius: 12,
            borderTopRightRadius: 12,
            borderBottomLeftRadius: 4,
            borderBottomRightRadius: 4,
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
            gap: 4,
            paddingTop: 6,
          }}
        >
          <div
            style={{
              width: 3.5,
              height: 3.5,
              background: "#0a0a0a",
              borderRadius: 999,
              display: "flex",
            }}
          />
          <div
            style={{
              width: 3.5,
              height: 3.5,
              background: "#0a0a0a",
              borderRadius: 999,
              display: "flex",
            }}
          />
        </div>
      </div>
    ),
    { ...size }
  );
}
