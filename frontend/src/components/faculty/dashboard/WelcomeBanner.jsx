function getUserName() {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    return user?.username || "Faculty";
  } catch {
    return "Faculty";
  }
}

export default function WelcomeBanner() {
  const name = getUserName();

  return (
    <div
      style={{
        marginBottom: "35px",
      }}
    >
      <p
        style={{
          fontSize: "14px",
          color: "#6B7280",
          letterSpacing: "3px",
          textTransform: "uppercase",
          marginBottom: "8px",
          fontWeight: "500",
        }}
      >
        Faculty Workspace
      </p>

      <h1
        style={{
          fontSize: "56px",
          fontWeight: "700",
          margin: 0,
          color: "#111827",
          lineHeight: "1.1",
        }}
      >
        Hello,{" "}
        <span
          style={{
            color: "#3B82F6",
          }}
        >
          {name}
        </span>
      </h1>

      <p
        style={{
          marginTop: "10px",
          fontSize: "22px",
          color: "#64748B",
        }}
      >
        Generate course materials in seconds.
      </p>
    </div>
  );
}