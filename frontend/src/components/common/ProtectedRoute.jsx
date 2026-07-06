import { Navigate } from "react-router-dom";

export default function ProtectedRoute({
  children,
  allowedRoles = [],
}) {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  if (!token || !user) {
    return <Navigate to="/" replace />;
  }

  if (
    allowedRoles.length > 0 &&
    !allowedRoles.includes(user.role)
  ) {
    const home =
      user.role === "faculty"
        ? "/faculty"
        : user.role === "applicant"
          ? "/applicant"
          : user.role === "admin"
            ? "/admin"
            : "/student";

    return <Navigate to={home} replace />;
  }

  return children;
}
