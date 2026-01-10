export interface NormalizedJwtPayload {
  sub: string;
  email?: string;
  role: string;
  exp: number;

  // ✅ optional name fields (safe)
  fullName?: string;
  firstName?: string;
  lastName?: string;
}

/* ============================
   Get & normalize JWT payload
============================ */
export function getJwtPayload(): NormalizedJwtPayload | null {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const base64Payload = token.split(".")[1];
    const jsonPayload = atob(base64Payload);
    const raw = JSON.parse(jsonPayload);

    // ✅ Normalize ASP.NET Core role claim
    const role =
      raw.role ??
      raw["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

    if (!role) return null;

    return {
      sub: raw.sub,
      email: raw.email,
      role,
      exp: raw.exp,

      // ✅ name support (handles multiple backends)
      fullName:
        raw.fullName ??
        raw.name ??
        raw["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"],

      firstName:
        raw.firstName ??
        raw["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname"],

      lastName:
        raw.lastName ??
        raw["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname"],
    };
  } catch {
    return null;
  }
}

/* ============================
   Initials helper (UI-safe)
============================ */
export function getUserInitials(): string {
  const user = getJwtPayload();
  if (!user) return "?";

  // Prefer fullName
  let name = user.fullName;

  // Fallback to first + last
  if (!name && (user.firstName || user.lastName)) {
    name = [user.firstName, user.lastName].filter(Boolean).join(" ");
  }

  if (!name) return "?";

  return name
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}
