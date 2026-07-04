import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiBell,
  FiBookOpen,
  FiCheck,
  FiClipboard,
  FiFileText,
  FiRotateCcw,
  FiTrash2,
  FiX,
} from "react-icons/fi";

import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";
import {
  deleteNotification,
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "../services/notification.service";

const metaByType = {
  lesson_plan: {
    label: "Academic",
    color: "#2563EB",
    icon: <FiBookOpen />,
    action: "View timetable",
    path: "/timetable",
  },
  assignment: {
    label: "Assignments",
    color: "#F97316",
    icon: <FiClipboard />,
    action: "Open assignment",
    path: "/assignments",
  },
  system: {
    label: "System",
    color: "#7C3AED",
    icon: <FiFileText />,
    action: "Open",
    path: null,
  },
};

const dateKey = (value) =>
  value ? new Date(value).toISOString().slice(0, 10) : "";

const relativeTime = (value) => {
  if (!value) return "";

  const diff = Date.now() - new Date(value).getTime();
  const minutes = Math.max(1, Math.round(diff / 60000));

  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  return `${Math.round(hours / 24)}d ago`;
};

export default function Notifications() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("all");

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isFaculty = user.role === "faculty";

  const loadNotifications = async () => {
    try {
      const data = await getNotifications();
      setNotifications(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadNotifications();

    const intervalId = window.setInterval(loadNotifications, 10000);
    window.addEventListener("focus", loadNotifications);

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener("focus", loadNotifications);
    };
  }, []);

  const unreadCount = useMemo(
    () => notifications.filter((item) => !item.is_read).length,
    [notifications]
  );

  const todayCount = useMemo(() => {
    const today = dateKey(new Date());

    return notifications.filter(
      (item) => dateKey(item.created_at) === today
    ).length;
  }, [notifications]);

  const filters = useMemo(() => {
    const base = [
      { key: "all", label: `All (${notifications.length})` },
      { key: "unread", label: `Unread (${unreadCount})` },
    ];

    const types = Array.from(
      new Set(notifications.map((item) => item.type || "system"))
    ).map((type) => ({
      key: type,
      label: metaByType[type]?.label || "System",
    }));

    return [...base, ...types];
  }, [notifications, unreadCount]);

  const visible = useMemo(() => {
    if (filter === "all") return notifications;
    if (filter === "unread") {
      return notifications.filter((item) => !item.is_read);
    }

    return notifications.filter((item) => item.type === filter);
  }, [filter, notifications]);

  const handleMarkAll = async () => {
    await markAllNotificationsRead();
    await loadNotifications();
  };

  const handleClear = async () => {
    const ok = window.confirm("Clear all visible notifications?");
    if (!ok) return;

    await Promise.all(
      visible.map((item) => deleteNotification(item.id))
    );
    await loadNotifications();
  };

  const handleDismiss = async (id) => {
    await deleteNotification(id);
    await loadNotifications();
  };

  const handleRead = async (id) => {
    await markNotificationRead(id);
    await loadNotifications();
  };

  const handleAction = async (item) => {
    if (!item.is_read) {
      await markNotificationRead(item.id);
    }

    const meta = metaByType[item.type] || metaByType.system;

    if (item.type === "lesson_plan") {
      navigate(isFaculty ? "/faculty/lesson-plan" : "/timetable");
      return;
    }

    if (meta.path) {
      navigate(meta.path);
    } else {
      await loadNotifications();
    }
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        background: "#EEF6FF",
      }}
    >
      <Sidebar />

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <Navbar />

        <main
          style={{
            flex: 1,
            overflowY: "auto",
            padding: 35,
          }}
        >
          <section
            style={{
              background: "linear-gradient(135deg,#2563EB,#3B82F6)",
              color: "#fff",
              borderRadius: 28,
              padding: "44px 46px",
            }}
          >
            <span
              style={{
                display: "inline-flex",
                padding: "9px 20px",
                borderRadius: 999,
                background: "rgba(255,255,255,.16)",
                fontWeight: 700,
              }}
            >
              {isFaculty ? "Faculty inbox" : "Student inbox"}
            </span>

            <h1
              style={{
                margin: "26px 0 12px",
                fontSize: 54,
                letterSpacing: 0,
              }}
            >
              Notifications
            </h1>

            <p
              style={{
                margin: 0,
                fontSize: 20,
                opacity: 0.86,
              }}
            >
              Everything that needs your attention, organised in one place.
            </p>

            <div style={{ display: "flex", gap: 12, marginTop: 34 }}>
              <button onClick={handleMarkAll} style={heroButton}>
                <FiCheck /> Mark all read
              </button>
              <button
                onClick={loadNotifications}
                style={{
                  ...heroButton,
                  background: "transparent",
                  color: "#fff",
                  border: "1px solid rgba(255,255,255,.45)",
                }}
              >
                <FiRotateCcw /> Restore all
              </button>
            </div>
          </section>

          <section
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3,1fr)",
              gap: 22,
              marginTop: 28,
            }}
          >
            <StatCard icon={<FiBell />} value={notifications.length} label="Total in inbox" />
            <StatCard icon={<FiBell />} value={unreadCount} label="Unread" muted />
            <StatCard icon={<FiCheck />} value={todayCount} label="From today" />
          </section>

          <section
            style={{
              background: "#fff",
              borderRadius: 28,
              marginTop: 30,
              padding: 28,
              boxShadow: "0 12px 30px rgba(15,23,42,.06)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 24,
              }}
            >
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {filters.map((item) => (
                  <button
                    key={item.key}
                    onClick={() => setFilter(item.key)}
                    style={{
                      border: "1px solid #E2E8F0",
                      background:
                        filter === item.key ? "#2563EB" : "#fff",
                      color:
                        filter === item.key ? "#fff" : "#64748B",
                      borderRadius: 999,
                      padding: "10px 20px",
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              <button
                onClick={handleClear}
                style={{
                  border: "none",
                  background: "transparent",
                  color: "#E11D48",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                <FiTrash2 /> Clear visible
              </button>
            </div>

            <div style={{ display: "grid", gap: 16 }}>
              {visible.map((item) => {
                const meta = metaByType[item.type] || metaByType.system;

                return (
                  <div
                    key={item.id}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "58px 1fr",
                      gap: 16,
                      position: "relative",
                      border: "1px solid #E2E8F0",
                      borderRadius: 24,
                      padding: "22px 24px",
                      background: !item.is_read ? "#F8FBFF" : "#fff",
                    }}
                  >
                    {!item.is_read && (
                      <span
                        style={{
                          position: "absolute",
                          right: 24,
                          top: 24,
                          width: 10,
                          height: 10,
                          borderRadius: "50%",
                          background: "#2563EB",
                        }}
                      />
                    )}

                    <div
                      style={{
                        width: 52,
                        height: 52,
                        borderRadius: 16,
                        background: meta.color,
                        color: "#fff",
                        display: "grid",
                        placeItems: "center",
                        fontSize: 24,
                      }}
                    >
                      {meta.icon}
                    </div>

                    <div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          flexWrap: "wrap",
                        }}
                      >
                        <h3
                          style={{
                            margin: 0,
                            color: "#111827",
                            fontSize: 19,
                          }}
                        >
                          {item.title}
                        </h3>
                        <span
                          style={{
                            background: "#F1F5F9",
                            color: "#64748B",
                            borderRadius: 999,
                            padding: "4px 10px",
                            textTransform: "uppercase",
                            fontSize: 12,
                            fontWeight: 800,
                            letterSpacing: 1,
                          }}
                        >
                          {meta.label}
                        </span>
                        <span style={{ color: "#64748B" }}>
                          · {relativeTime(item.created_at)}
                        </span>
                      </div>

                      <p
                        style={{
                          color: "#64748B",
                          fontSize: 17,
                          margin: "10px 0 18px",
                        }}
                      >
                        {item.message}
                      </p>

                      <div style={{ display: "flex", gap: 14 }}>
                        <button
                          onClick={() => handleAction(item)}
                          style={primaryAction}
                        >
                          {item.type === "lesson_plan" && isFaculty
                            ? "Open lesson plan"
                            : meta.action}
                        </button>

                        {!item.is_read && (
                          <button
                            onClick={() => handleRead(item.id)}
                            style={textAction}
                          >
                            <FiCheck /> Mark read
                          </button>
                        )}

                        <button
                          onClick={() => handleDismiss(item.id)}
                          style={{
                            ...textAction,
                            color: "#E11D48",
                          }}
                        >
                          <FiX /> Dismiss
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}

              {visible.length === 0 && (
                <p
                  style={{
                    textAlign: "center",
                    color: "#64748B",
                    padding: 50,
                    margin: 0,
                    fontSize: 18,
                  }}
                >
                  No notifications found.
                </p>
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

function StatCard({ icon, value, label }) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 22,
        padding: 26,
        display: "flex",
        alignItems: "center",
        gap: 18,
        boxShadow: "0 12px 26px rgba(15,23,42,.06)",
      }}
    >
      <div
        style={{
          width: 58,
          height: 58,
          borderRadius: 18,
          background: "#EEF6FF",
          color: "#2563EB",
          display: "grid",
          placeItems: "center",
          fontSize: 26,
        }}
      >
        {icon}
      </div>
      <div>
        <h2 style={{ margin: 0, color: "#111827", fontSize: 36 }}>
          {value}
        </h2>
        <p style={{ margin: 0, color: "#64748B" }}>{label}</p>
      </div>
    </div>
  );
}

const heroButton = {
  border: "none",
  background: "#fff",
  color: "#2563EB",
  borderRadius: 18,
  padding: "16px 24px",
  fontWeight: 800,
  fontSize: 16,
  display: "inline-flex",
  gap: 10,
  alignItems: "center",
  cursor: "pointer",
};

const primaryAction = {
  border: "none",
  background: "#2563EB",
  color: "#fff",
  borderRadius: 12,
  padding: "11px 18px",
  fontWeight: 700,
  cursor: "pointer",
};

const textAction = {
  border: "none",
  background: "transparent",
  color: "#111827",
  borderRadius: 12,
  padding: "11px 8px",
  display: "inline-flex",
  gap: 8,
  alignItems: "center",
  fontWeight: 700,
  cursor: "pointer",
};
