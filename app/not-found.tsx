import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--bg-secondary)",
        padding: "var(--space-5)",
        textAlign: "center",
      }}
    >
      <Image
        src="/assets/linkon-no.png"
        alt="Linkon"
        width={120}
        height={40}
        style={{ objectFit: "contain", marginBottom: "var(--space-6)" }}
      />
      <p
        style={{
          fontSize: "var(--text-xs)",
          fontWeight: 700,
          color: "var(--linkon-accent)",
          letterSpacing: "0.1em",
          marginBottom: "var(--space-3)",
        }}
      >
        404
      </p>
      <h1
        style={{
          fontSize: "var(--text-3xl)",
          fontWeight: 700,
          color: "var(--text-primary)",
          marginBottom: "var(--space-4)",
        }}
      >
        We could not find that page.
      </h1>
      <p
        style={{
          fontSize: "var(--text-base)",
          color: "var(--text-muted)",
          marginBottom: "var(--space-7)",
          maxWidth: "360px",
          lineHeight: 1.7,
        }}
      >
        The page may have moved, been removed, or never existed in this
        environment.
      </p>
      <Link href="/" className="btn btn--primary">
        Return home
      </Link>
    </div>
  );
}
