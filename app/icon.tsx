import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

/** Browser tab favicon — neo-brutal brand mark */
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
          border: "3px solid #0a0a0a",
        }}
      >
        <div
          style={{
            width: 18,
            height: 18,
            background: "#f4c430",
            border: "2px solid #0a0a0a",
            transform: "rotate(45deg)",
            display: "flex",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
