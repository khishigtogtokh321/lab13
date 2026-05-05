const API_BASE_URL = process.env.API_BASE_URL ?? "http://localhost:4000";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "admin@example.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "admin12345";

let authCookie = "";

async function request(path, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...(authCookie ? { Cookie: authCookie } : {}),
    ...options.headers
  };

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers
  });

  const setCookie = response.headers.get("set-cookie");
  if (setCookie) {
    authCookie = setCookie.split(";")[0];
  }

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const details = data.errors?.join("; ") ?? response.statusText;
    throw new Error(`${options.method ?? "GET"} ${path} failed with ${response.status}: ${details}`);
  }

  return data;
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function main() {
  const stamp = Date.now();
  const isbnSuffix = String(stamp).slice(-10);
  const bookPayload = {
    title: `Smoke Test Book ${stamp}`,
    author: "API Smoke",
    isbn: `99-${isbnSuffix}`,
    category: "Smoke",
    totalCopies: 2,
    availableCopies: 2
  };
  const memberPayload = {
    name: `Smoke Member ${stamp}`,
    email: `smoke-${stamp}@example.com`,
    phone: "99000000",
    status: "active"
  };

  console.log(`API smoke target: ${API_BASE_URL}`);

  const health = await request("/api/health");
  assert(health.ok === true, "Health check did not return ok=true");
  console.log("ok health");

  await request("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD })
  });
  assert(authCookie, "Login did not set an auth cookie");

  const me = await request("/api/auth/me");
  assert(me.user?.email === ADMIN_EMAIL.toLowerCase(), "Authenticated user email mismatch");
  console.log("ok auth");

  const book = await request("/api/books", {
    method: "POST",
    body: JSON.stringify(bookPayload)
  });
  assert(book.id, "Book create response did not include id");

  const member = await request("/api/members", {
    method: "POST",
    body: JSON.stringify(memberPayload)
  });
  assert(member.id, "Member create response did not include id");
  console.log("ok book/member create");

  const loan = await request("/api/loans", {
    method: "POST",
    body: JSON.stringify({ bookId: book.id, memberId: member.id, days: 3 })
  });
  assert(loan.id, "Loan create response did not include id");
  assert(new Date(loan.dueAt) > new Date(loan.borrowedAt), "Loan due date was not after borrowed date");
  console.log("ok loan create");

  const extended = await request(`/api/loans/${loan.id}/extend`, {
    method: "PATCH",
    body: JSON.stringify({ days: 2 })
  });
  assert(new Date(extended.dueAt) > new Date(loan.dueAt), "Loan extension did not move due date forward");
  console.log("ok loan extend");

  const returned = await request(`/api/loans/${loan.id}/return`, {
    method: "PATCH"
  });
  assert(returned.status === "returned", "Returned loan status was not returned");
  assert(returned.returnedAt, "Returned loan did not include returnedAt");
  console.log("ok loan return");

  const loans = await request("/api/loans");
  const returnedLoan = loans.find((item) => item.id === loan.id);
  assert(returnedLoan?.status === "returned", "Returned loan was not visible in loan list");

  const summary = await request("/api/dashboard/summary");
  assert(Number.isInteger(summary.totalBooks), "Dashboard summary totalBooks was not an integer");
  assert(Number.isInteger(summary.activeMembers), "Dashboard summary activeMembers was not an integer");
  assert(Number.isInteger(summary.availableCopies), "Dashboard summary availableCopies was not an integer");
  assert(Number.isInteger(summary.overdueLoans), "Dashboard summary overdueLoans was not an integer");
  console.log("ok loans list/dashboard");

  await request("/api/auth/logout", { method: "POST" });
  console.log("ok logout");
  console.log("API smoke passed");
}

main().catch((error) => {
  console.error(`API smoke failed: ${error.message}`);
  process.exitCode = 1;
});
