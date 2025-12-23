import { Navigate } from "react-router-dom";
import { getJwtPayload } from "./jwt";
import React from "react";

interface ProtectedRouteProps {
  allowedRoles: string[];
  children: React.ReactNode;
}

export default function ProtectedRoute({
  allowedRoles,
  children,
}: ProtectedRouteProps) {
  const payload = getJwtPayload();

  if (!payload) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(payload.role)) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
