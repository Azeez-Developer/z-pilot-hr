export interface NormalizedJwtPayload {
  sub: string;
  email?: string;
  role: string;
  exp: number;
}

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
    };
  } catch {
    return null;
  }
}
