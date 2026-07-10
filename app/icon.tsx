import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

/** Favicon — classic sheet ghost on saffron */
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
          border: "2px solid #0a0a0a",
        }}
      >
        {/* ghost body */}
        <div
          style={{
            width: 18,
            height: 20,
            background: "#fffdf8",
            border: "2px solid #0a0a0a",
            borderRadius: "10px 10px 4px 4px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 3,
            paddingTop: 4,
          }}
        >
          <div
            style={{
              width: 3,
              height: 4,
              background: "#0a0a0a",
              borderRadius: 2,
              display: "flex",
            }}
          />
          <div
            style={{
              width: 3,
              height: 4,
              background: "#0a0a0a",
              borderRadius: 2,
              display: "flex",
            }}
          />
        </div>
      </div>
    ),
    { ...size }
  );
}
