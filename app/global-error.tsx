"use client";

/**
 * Catches errors in the root layout (e.g. bad metadataBase / env).
 * Must define its own <html> and <body>.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
          background: "#f2e6d0",
          color: "#0a0a0a",
          padding: 24,
        }}
      >
        <div
          style={{
            maxWidth: 420,
            border: "3px solid #0a0a0a",
            boxShadow: "6px 6px 0 #0a0a0a",
            background: "#fffdf8",
            padding: 28,
            textAlign: "center",
          }}
        >
          <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.1em" }}>
            BHOOTKOSH
          </p>
          <h1 style={{ fontSize: 28, margin: "12px 0" }}>Site error</h1>
          <p style={{ fontSize: 14, lineHeight: 1.5, opacity: 0.8 }}>
            A server error occurred while loading the archive.
            {error?.digest ? ` (${error.digest})` : ""}
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              marginTop: 20,
              border: "3px solid #0a0a0a",
              background: "#e85d04",
              color: "#fff",
              fontWeight: 700,
              padding: "10px 18px",
              cursor: "pointer",
              boxShadow: "3px 3px 0 #0a0a0a",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
