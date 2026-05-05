import bcrypt from "bcryptjs";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import { Router } from "express";
import { config } from "./config.js";
import { createAdminUser, findAdminByEmail, findAdminById } from "./repositories.js";

const AUTH_COOKIE_NAME = "mini_library_token";
const TOKEN_EXPIRES_IN = "8h";
const TOKEN_MAX_AGE_MS = 8 * 60 * 60 * 1000;

export const parseAuthCookies = cookieParser();

function authCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax",
    secure: config.isProduction,
    maxAge: TOKEN_MAX_AGE_MS,
    path: "/"
  };
}

function publicAdmin(admin) {
  return {
    id: admin.id,
    email: admin.email,
    role: admin.role,
    status: admin.status
  };
}

function signAdminToken(admin) {
  return jwt.sign(
    {
      sub: String(admin.id),
      email: admin.email,
      role: admin.role
    },
    config.jwtSecret,
    { expiresIn: TOKEN_EXPIRES_IN }
  );
}

async function findOrBootstrapAdmin(email, password) {
  const normalizedEmail = email.toLowerCase();
  const existingAdmin = await findAdminByEmail(normalizedEmail);
  if (existingAdmin) return existingAdmin;

  if (
    config.adminEmail &&
    config.adminPassword &&
    normalizedEmail === config.adminEmail &&
    password === config.adminPassword
  ) {
    const passwordHash = await bcrypt.hash(password, 12);
    return createAdminUser({ email: normalizedEmail, passwordHash });
  }

  return null;
}

async function authenticateAdmin(email, password) {
  const admin = await findOrBootstrapAdmin(email, password);
  if (!admin || admin.status !== "active") return null;

  const isPasswordValid = await bcrypt.compare(password, admin.passwordHash);
  return isPasswordValid ? admin : null;
}

export async function getCurrentAdmin(req) {
  const token = req.cookies?.[AUTH_COOKIE_NAME];
  if (!token) return null;

  try {
    const payload = jwt.verify(token, config.jwtSecret);
    const admin = await findAdminById(payload.sub);
    if (!admin || admin.status !== "active") return null;
    return admin;
  } catch {
    return null;
  }
}

export function createAuthRouter() {
  const router = Router();

  router.post("/login", async (req, res, next) => {
    try {
      const email = String(req.body?.email ?? "").trim().toLowerCase();
      const password = String(req.body?.password ?? "");

      if (!email || !password) {
        return res.status(400).json({ errors: ["Email and password are required."] });
      }

      const admin = await authenticateAdmin(email, password);
      if (!admin) {
        return res.status(401).json({ errors: ["Invalid email or password."] });
      }

      res.cookie(AUTH_COOKIE_NAME, signAdminToken(admin), authCookieOptions());
      res.json({ user: publicAdmin(admin) });
    } catch (error) {
      next(error);
    }
  });

  router.post("/logout", (_req, res) => {
    res.clearCookie(AUTH_COOKIE_NAME, { ...authCookieOptions(), maxAge: undefined });
    res.json({ ok: true });
  });

  router.get("/me", async (req, res, next) => {
    try {
      const admin = await getCurrentAdmin(req);
      if (!admin) return res.status(401).json({ user: null });
      res.json({ user: publicAdmin(admin) });
    } catch (error) {
      next(error);
    }
  });

  return router;
}
