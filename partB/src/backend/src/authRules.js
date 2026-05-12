export const AUTH_COOKIE_NAME = "mini_library_token";
export const TOKEN_EXPIRES_IN = "8h";
export const TOKEN_MAX_AGE_MS = 8 * 60 * 60 * 1000;

export function authCookieOptions({ isProduction = false } = {}) {
  return {
    httpOnly: true,
    sameSite: "lax",
    secure: isProduction,
    maxAge: TOKEN_MAX_AGE_MS,
    path: "/"
  };
}

export function publicAdmin(admin) {
  return {
    id: admin.id,
    email: admin.email,
    role: admin.role,
    status: admin.status
  };
}

export function normalizeLoginCredentials(body = {}) {
  return {
    email: String(body.email ?? "").trim().toLowerCase(),
    password: String(body.password ?? "")
  };
}

export function isActiveAdmin(admin) {
  return Boolean(admin && admin.status === "active");
}

export function canBootstrapAdmin({ normalizedEmail, password, adminEmail, adminPassword }) {
  return Boolean(adminEmail && adminPassword && normalizedEmail === adminEmail && password === adminPassword);
}
