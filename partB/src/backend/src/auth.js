import bcrypt from "bcryptjs";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import { Router } from "express";
import { config } from "./config.js";
import { createAdminUser, findAdminByEmail, findAdminById } from "./repositories.js";
import {
  AUTH_COOKIE_NAME,
  TOKEN_EXPIRES_IN,
  authCookieOptions,
  canBootstrapAdmin,
  isActiveAdmin,
  normalizeLoginCredentials,
  publicAdmin
} from "./authRules.js";

export const parseAuthCookies = cookieParser();

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
    canBootstrapAdmin({
      normalizedEmail,
      password,
      adminEmail: config.adminEmail,
      adminPassword: config.adminPassword
    })
  ) {
    const passwordHash = await bcrypt.hash(password, 12);
    return createAdminUser({ email: normalizedEmail, passwordHash });
  }

  return null;
}

async function authenticateAdmin(email, password) {
  const admin = await findOrBootstrapAdmin(email, password);
  if (!isActiveAdmin(admin)) return null;

  const isPasswordValid = await bcrypt.compare(password, admin.passwordHash);
  return isPasswordValid ? admin : null;
}

export async function getCurrentAdmin(req) {
  const token = req.cookies?.[AUTH_COOKIE_NAME];
  if (!token) return null;

  try {
    const payload = jwt.verify(token, config.jwtSecret);
    const admin = await findAdminById(payload.sub);
    if (!isActiveAdmin(admin)) return null;
    return admin;
  } catch {
    return null;
  }
}

export function createAuthRouter() {
  const router = Router();

  router.post("/login", async (req, res, next) => {
    try {
      const { email, password } = normalizeLoginCredentials(req.body);

      if (!email || !password) {
        return res.status(400).json({ errors: ["Имэйл болон нууц үгээ оруулна уу."] });
      }

      const admin = await authenticateAdmin(email, password);
      if (!admin) {
        return res.status(401).json({ errors: ["Имэйл эсвэл нууц үг буруу байна."] });
      }

      res.cookie(AUTH_COOKIE_NAME, signAdminToken(admin), authCookieOptions({ isProduction: config.isProduction }));
      res.json({ user: publicAdmin(admin) });
    } catch (error) {
      next(error);
    }
  });

  router.post("/logout", (_req, res) => {
    res.clearCookie(AUTH_COOKIE_NAME, { ...authCookieOptions({ isProduction: config.isProduction }), maxAge: undefined });
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
