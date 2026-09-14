import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../services/api";

export default function ProtectedRoute({ children, requiredRole }) {
  const [status, setStatus] = useState("checking"); // checking | ok | denied

  useEffect(() => {
    let cancelled = false;

    API.get("/auth/me")
      .then((res) => {
        if (cancelled) return;
        const role = res.data?.user?.role;
        if (requiredRole && role !== requiredRole) {
          setStatus("denied");
        } else {
          setStatus("ok");
        }
      })
      .catch(() => {
        if (!cancelled) setStatus("denied");
      });

    return () => {
      cancelled = true;
    };
  }, [requiredRole]);

  if (status === "checking") return null;
  if (status === "denied") return <Navigate to="/login" replace />;
  return children;
}
