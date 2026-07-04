import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiBell,
  FiBookOpen,
  FiCheck,
  FiClipboard,
  FiFileText,
  FiX,
} from "react-icons/fi";

import {
  deleteNotification,
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "../../services/notification.service";

const typeMeta = {
  lesson_plan: {
    color: "#2563EB",
    icon: <FiBookOpen />,
    label: "Academic",
  },
  assignment: {
    color: "#F97316",
    icon: <FiClipboard />,
    label: "Assignments",
  },
  system: {
    color: "#7C3AED",
    icon: <FiFileText />,
    label: "System",
  },
};

const timeLabel = (value) => {
  if (!value) return "";

  const diff = Date.now() - new Date(value).getTime();
  const minutes = Math.max(1, Math.round(diff / 60000));

  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  return `${Math.round(hours / 24)}d ago`;
};

export default function NotificationDropdown() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const unreadCount = useMemo(
    () => notifications.filter((item) => !item.is_read).length,
    [notifications]
  );

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

  const handleMarkAll = async () => {
    await markAllNotificationsRead();
    await loadNotifications();
  };

  const handleRead = async (id) => {
    await markNotificationRead(id);
    await loadNotifications();
  };

  const handleDismiss = async (id) => {
    await deleteNotification(id);
    await loadNotifications();
  };

  const goToAll = () => {
    setOpen(false);
    navigate(
      user.role === "faculty"
        ? "/faculty/notifications"
        : "/notifications"
    );
  };

  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={() => setOpen((current) => !current)}
        style={{
          position: "relative",
          border: "none",
          background: "transparent",
          cursor: "pointer",
          color: "#111827",
          padding: 8,
        }}
      >
        <FiBell size={22} />
        {unreadCount > 0 && (
          <span
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              width: 18,
              height: 18,
              borderRadius: "50%",
              background: "#F43F5E",
              color: "#fff",
              fontSize: 11,
              fontWeight: 700,
              display: "grid",
              placeItems: "center",
            }}
          >
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            top: 44,
            right: 0,
            width: 480,
            maxHeight: 640,
            overflow: "hidden",
            background: "#fff",
            border: "1px solid #E5EAF2",
            borderRadius: 24,
            boxShadow: "0 20px 45px rgba(15,23,42,.16)",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "20px 24px 16px",
              borderBottom: "1px solid #EEF2F7",
            }}
          >
            <div>
              <h3 style={{ margin: 0, color: "#111827" }}>
                Notifications
              </h3>
              <p style={{ margin: "6px 0 0", color: "#64748B" }}>
                {unreadCount > 0
                  ? `${unreadCount} unread`
                  : "You're all caught up"}
              </p>
            </div>

            <button
              onClick={handleMarkAll}
              style={{
                border: "none",
                background: "transparent",
                color: "#64748B",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              <FiCheck /> Mark all
            </button>
          </div>

          <div style={{ maxHeight: 420, overflowY: "auto" }}>
            {notifications.slice(0, 5).map((item) => {
              const meta = typeMeta[item.type] || typeMeta.system;

              return (
                <div
                  key={item.id}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "52px 1fr 30px",
                    gap: 14,
                    padding: "18px 24px",
                    background: !item.is_read ? "#F8FBFF" : "#fff",
                    borderBottom: "1px solid #F1F5F9",
                  }}
                >
                  <div
                    style={{
                      width: 46,
                      height: 46,
                      borderRadius: 16,
                      background: meta.color,
                      color: "#fff",
                      display: "grid",
                      placeItems: "center",
                      fontSize: 22,
                    }}
                  >
                    {meta.icon}
                  </div>

                  <div>
                    <h4 style={{ margin: 0, color: "#111827" }}>
                      {item.title}
                      {!item.is_read && (
                        <span
                          style={{
                            display: "inline-block",
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            background: "#2563EB",
                            marginLeft: 8,
                          }}
                        />
                      )}
                    </h4>
                    <p
                      style={{
                        margin: "7px 0",
                        color: "#64748B",
                        lineHeight: 1.4,
                      }}
                    >
                      {item.message}
                    </p>
                    <small style={{ color: "#64748B" }}>
                      {meta.label} · {timeLabel(item.created_at)}
                    </small>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 12,
                    }}
                  >
                    {!item.is_read && (
                      <button
                        title="Mark read"
                        onClick={() => handleRead(item.id)}
                        style={iconButton}
                      >
                        <FiCheck />
                      </button>
                    )}
                    <button
                      title="Dismiss"
                      onClick={() => handleDismiss(item.id)}
                      style={iconButton}
                    >
                      <FiX />
                    </button>
                  </div>
                </div>
              );
            })}

            {notifications.length === 0 && (
              <p
                style={{
                  padding: 28,
                  margin: 0,
                  color: "#64748B",
                  textAlign: "center",
                }}
              >
                No notifications yet.
              </p>
            )}
          </div>

          <button
            onClick={goToAll}
            style={{
              width: "100%",
              padding: "18px",
              border: "none",
              borderTop: "1px solid #EEF2F7",
              background: "#fff",
              color: "#2563EB",
              fontSize: 16,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            View all notifications
          </button>
        </div>
      )}
    </div>
  );
}

const iconButton = {
  width: 28,
  height: 28,
  border: "none",
  borderRadius: 8,
  background: "transparent",
  color: "#64748B",
  cursor: "pointer",
};
