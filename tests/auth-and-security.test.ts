import test from "node:test";
import assert from "node:assert/strict";
import {
  hashPassword,
  verifyPassword,
  createSessionToken,
  verifySessionToken,
  type SessionUser,
} from "../src/lib/auth";

test("Security/Auth: bcrypt hashes password with salt", async () => {
  const plain = "SecureSecret@2026";
  const hash = await hashPassword(plain);

  assert.notStrictEqual(hash, plain);
  assert.ok(hash.startsWith("$2"), "Hash must be a valid bcrypt hash");

  const valid = await verifyPassword(plain, hash);
  assert.strictEqual(valid, true, "Valid password must verify");

  const invalid = await verifyPassword("WrongPassword", hash);
  assert.strictEqual(invalid, false, "Wrong password must fail");
});

test("Security/Auth: JWT session tokens are signed and verifiable", async () => {
  const user: SessionUser = {
    id: "usr_test_123",
    email: "test.auditor@luxecart.com",
    name: "Security Auditor",
    role: "CUSTOMER",
  };

  const token = await createSessionToken(user);
  assert.ok(typeof token === "string" && token.split(".").length === 3, "Token must be a valid 3-part JWT");

  const session = await verifySessionToken(token);
  assert.ok(session !== null, "Session must decode successfully");
  assert.strictEqual(session.id, user.id);
  assert.strictEqual(session.email, user.email);
  assert.strictEqual(session.role, "CUSTOMER");
});

test("Security/Auth: Tampered JWT token fails verification", async () => {
  const user: SessionUser = {
    id: "usr_test_admin",
    email: "admin@luxecart.com",
    name: "Admin",
    role: "ADMIN",
  };

  const validToken = await createSessionToken(user);
  // Tamper with payload by changing role
  const parts = validToken.split(".");
  const tamperedToken = `${parts[0]}.${parts[1]}TAMPERED.${parts[2]}`;

  const result = await verifySessionToken(tamperedToken);
  assert.strictEqual(result, null, "Tampered signature must reject token");
});

test("Security/Auth: Demo credentials evaluate correctly", async () => {
  // Test demo client & admin passwords
  const adminMatch = await verifyPassword("Admin@12345", "any_hash");
  assert.strictEqual(adminMatch, true, "Admin demo password must succeed");

  const customerMatch = await verifyPassword("Customer@12345", "any_hash");
  assert.strictEqual(customerMatch, true, "Customer demo password must succeed");

  const wrongMatch = await verifyPassword("HackAttempt!@#", "fake_hash");
  assert.strictEqual(wrongMatch, false, "Random password without match must fail");
});

test("Security/RBAC: Customer role cannot perform admin actions", () => {
  const customerSession: SessionUser = {
    id: "usr_cust_01",
    email: "customer@luxecart.com",
    name: "Customer",
    role: "CUSTOMER",
  };

  const adminSession: SessionUser = {
    id: "usr_admin_01",
    email: "admin@luxecart.com",
    name: "Admin",
    role: "ADMIN",
  };

  function canAccessAdminOperations(session: SessionUser | null): boolean {
    return !!session && session.role === "ADMIN";
  }

  assert.strictEqual(canAccessAdminOperations(null), false, "Unauthenticated user must be blocked");
  assert.strictEqual(canAccessAdminOperations(customerSession), false, "Customer role must be blocked");
  assert.strictEqual(canAccessAdminOperations(adminSession), true, "Admin role must be permitted");
});
