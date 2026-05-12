import assert from "node:assert/strict";
import test from "node:test";
import {
  canLoanBook,
  computeLoanStatus,
  createLoanRecord,
  extendLoanRecord,
  filterBooks,
  normalizeLoanDays,
  returnLoanRecord,
  summarizeDashboard,
  validateBookInput,
  validateMemberInput
} from "../src/shared/libraryRules.js";

const activeMember = { id: 1, name: "Ariun", email: "ariun@example.com", status: "active" };
const inactiveMember = { id: 2, name: "Bold", email: "bold@example.com", status: "inactive" };
const availableBook = { id: 10, title: "Clean Architecture", author: "Robert Martin", isbn: "978-0134494166", category: "Software", totalCopies: 3, availableCopies: 1 };
const unavailableBook = { ...availableBook, id: 11, availableCopies: 0 };

test("valid book input returns no errors", () => {
  assert.deepEqual(validateBookInput(availableBook), []);
});

test("book validation rejects invalid copy counts", () => {
  const errors = validateBookInput({ ...availableBook, totalCopies: 1, availableCopies: 2 });
  assert.ok(errors.includes("Бэлэн хувь нийт хувиас их байж болохгүй."));
});

test("book validation rejects short text and invalid ISBN", () => {
  const errors = validateBookInput({
    title: "A",
    author: "B",
    isbn: "bad-isbn",
    category: "Software",
    totalCopies: 0,
    availableCopies: -1
  });

  assert.equal(errors.length, 5);
});

test("member validation requires valid email", () => {
  assert.ok(validateMemberInput({ name: "Ariun", email: "bad", status: "active" }).includes("Зөв имэйл хаяг оруулна уу."));
});

test("member validation rejects short names and invalid status", () => {
  const errors = validateMemberInput({ name: "A", email: "ariun@example.com", status: "blocked" });
  assert.equal(errors.length, 2);
});

test("active member can loan an available book", () => {
  assert.deepEqual(canLoanBook(availableBook, activeMember), { ok: true });
});

test("inactive member cannot borrow", () => {
  assert.equal(canLoanBook(availableBook, inactiveMember).reason, "Идэвхгүй гишүүнд ном зээлүүлэх боломжгүй.");
});

test("unavailable book cannot be loaned", () => {
  assert.equal(canLoanBook(unavailableBook, activeMember).reason, "Энэ номын бэлэн хувь дууссан байна.");
});

test("createLoanRecord sets due date using loan period", () => {
  const loan = createLoanRecord({ book: availableBook, member: activeMember, borrowedAt: "2026-05-01T00:00:00.000Z", days: 7 });
  assert.equal(loan.dueAt, "2026-05-08T00:00:00.000Z");
  assert.equal(loan.status, "active");
});

test("createLoanRecord rejects invalid loan period", () => {
  assert.throws(
    () => createLoanRecord({ book: availableBook, member: activeMember, borrowedAt: "2026-05-01T00:00:00.000Z", days: 0 }),
    /1-365/
  );
  assert.equal(normalizeLoanDays("21"), 21);
});

test("extendLoanRecord moves due date forward", () => {
  const loan = createLoanRecord({ book: availableBook, member: activeMember, borrowedAt: "2026-05-01T00:00:00.000Z", days: 7 });
  const extended = extendLoanRecord(loan, 5);
  assert.equal(extended.dueAt, "2026-05-13T00:00:00.000Z");
  assert.equal(extended.status, "active");
});

test("returnLoanRecord marks returned loan", () => {
  const loan = createLoanRecord({ book: availableBook, member: activeMember, borrowedAt: "2026-05-01T00:00:00.000Z" });
  const returned = returnLoanRecord(loan, "2026-05-02T00:00:00.000Z");
  assert.equal(returned.status, "returned");
  assert.equal(returned.returnedAt, "2026-05-02T00:00:00.000Z");
});

test("computeLoanStatus detects overdue loan", () => {
  const loan = { dueAt: "2026-05-01T00:00:00.000Z", returnedAt: null };
  assert.equal(computeLoanStatus(loan, "2026-05-03T00:00:00.000Z"), "overdue");
});

test("filterBooks supports query and category", () => {
  const books = [availableBook, { ...availableBook, id: 12, title: "PostgreSQL Guide", category: "Database" }];
  assert.equal(filterBooks(books, { query: "postgres", category: "Database" }).length, 1);
});

test("summarizeDashboard counts active, available, and overdue data", () => {
  const summary = summarizeDashboard(
    {
      books: [availableBook, unavailableBook],
      members: [activeMember, inactiveMember],
      loans: [{ dueAt: "2026-05-01T00:00:00.000Z", returnedAt: null }]
    },
    "2026-05-03T00:00:00.000Z"
  );
  assert.deepEqual(summary, {
    totalBooks: 2,
    availableCopies: 1,
    activeMembers: 1,
    activeLoans: 0,
    overdueLoans: 1
  });
});

test("summarizeDashboard separates active, overdue, and returned loans", () => {
  const summary = summarizeDashboard(
    {
      books: [{ ...availableBook, availableCopies: 2 }],
      members: [activeMember, { ...inactiveMember, status: "active" }],
      loans: [
        { dueAt: "2026-05-10T00:00:00.000Z", returnedAt: null },
        { dueAt: "2026-05-01T00:00:00.000Z", returnedAt: null },
        { dueAt: "2026-05-01T00:00:00.000Z", returnedAt: "2026-05-02T00:00:00.000Z" }
      ]
    },
    "2026-05-03T00:00:00.000Z"
  );

  assert.equal(summary.activeLoans, 1);
  assert.equal(summary.overdueLoans, 1);
  assert.equal(summary.activeMembers, 2);
  assert.equal(summary.availableCopies, 2);
});
