import Link from "next/link";

export default function Home() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        fontFamily: "'Inter', sans-serif",
        color: "#fff",
        padding: "40px",
        textAlign: "center",
      }}
    >
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: "16px",
          background: "rgba(255,255,255,0.2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "28px",
          fontWeight: 800,
          marginBottom: "24px",
          backdropFilter: "blur(10px)",
        }}
      >
        SR
      </div>
      <h1
        style={{
          fontSize: "clamp(28px, 5vw, 48px)",
          fontWeight: 800,
          marginBottom: "12px",
          letterSpacing: "-0.5px",
        }}
      >
        SmartRecruit Career
      </h1>
      <p
        style={{
          fontSize: "16px",
          opacity: 0.8,
          maxWidth: "480px",
          lineHeight: 1.6,
          marginBottom: "32px",
        }}
      >
        Nền tảng trang tuyển dụng chuyên nghiệp. Truy cập trang career của công
        ty bằng cách thêm slug vào URL.
      </p>
      <div
        style={{
          background: "rgba(255,255,255,0.15)",
          borderRadius: "12px",
          padding: "16px 28px",
          fontSize: "14px",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255,255,255,0.2)",
        }}
      >
        <code style={{ fontFamily: "'SF Mono', Consolas, monospace" }}>
          /{"{company-slug}"}
        </code>
      </div>
    </main>
  );
}
