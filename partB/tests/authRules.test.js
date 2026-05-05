import assert from "node:assert/strict";
import test from "node:test";
import {
  TOKEN_MAX_AGE_MS,
  authCookieOptions,
  canBootstrapAdmin,
  isActiveAdmin,
  normalizeLoginCredentials,
  publicAdmin
} from "../backend/src/authRules.js";

test("login credentials are trimmed and normalized", () => {
  assert.deepEqual(normalizeLoginCredentials({ email: " Admin@Example.COM ", password: "secret" }), {
    email: "admin@example.com",
    password: "secret"
  });
});

test("login credentials default to empty strings", () => {
  assert.deepEqual(normalizeLoginCredentials(), { email: "", password: "" });
});

test("auth cookie options are httpOnly and environment aware", () => {
  assert.deepEqual(authCookieOptions({ isProduction: false }), {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    maxAge: TOKEN_MAX_AGE_MS,
    path: "/"
  });
  assert.equal(authCookieOptions({ isProduction: true }).secure, true);
});

test("publicAdmin hides password hash", () => {
  const admin = {
    id: 1,
    email: "admin@example.com",
    role: "admin",
    status: "active",
    passwordHash: "hash"
  };

  assert.deepEqual(publicAdmin(admin), {
    id: 1,
    email: "admin@example.com",
    role: "admin",
    status: "active"
  });
});

test("only active admins can authenticate", () => {
  assert.equal(isActiveAdmin({ status: "active" }), true);
  assert.equal(isActiveAdmin({ status: "disabled" }), false);
  assert.equal(isActiveAdmin(null), false);
});

test("bootstrap admin requires configured email and password match", () => {
  assert.equal(
    canBootstrapAdmin({
      normalizedEmail: "admin@example.com",
      password: "admin12345",
      adminEmail: "admin@example.com",
      adminPassword: "admin12345"
    }),
    true
  );
  assert.equal(
    canBootstrapAdmin({
      normalizedEmail: "admin@example.com",
      password: "wrong",
      adminEmail: "admin@example.com",
      adminPassword: "admin12345"
    }),
    false
  );
});
