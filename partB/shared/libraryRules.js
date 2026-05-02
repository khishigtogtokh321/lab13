export const LOAN_STATUSES = {
  ACTIVE: "active",
  RETURNED: "returned",
  OVERDUE: "overdue"
};

export function validateBookInput(input) {
  const errors = [];
  if (!input.title || input.title.trim().length < 2) errors.push("Title is required.");
  if (!input.author || input.author.trim().length < 2) errors.push("Author is required.");
  if (!input.isbn || !/^[0-9-]{10,17}$/.test(input.isbn)) errors.push("ISBN must contain 10-17 digits or hyphens.");
  if (!Number.isInteger(input.totalCopies) || input.totalCopies < 1) errors.push("Total copies must be at least 1.");
  if (!Number.isInteger(input.availableCopies) || input.availableCopies < 0) errors.push("Available copies cannot be negative.");
  if (input.availableCopies > input.totalCopies) errors.push("Available copies cannot exceed total copies.");
  return errors;
}

export function validateMemberInput(input) {
  const errors = [];
  if (!input.name || input.name.trim().length < 2) errors.push("Member name is required.");
  if (!input.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email)) errors.push("Valid email is required.");
  if (input.status && !["active", "inactive"].includes(input.status)) errors.push("Invalid member status.");
  return errors;
}

export function canLoanBook(book, member) {
  if (!book) return { ok: false, reason: "Book not found." };
  if (!member) return { ok: false, reason: "Member not found." };
  if (member.status !== "active") return { ok: false, reason: "Member is not active." };
  if (book.availableCopies < 1) return { ok: false, reason: "No available copies." };
  return { ok: true };
}

export function createLoanRecord({ book, member, borrowedAt, days = 14 }) {
  const allowed = canLoanBook(book, member);
  if (!allowed.ok) throw new Error(allowed.reason);
  const borrowed = new Date(borrowedAt);
  const due = new Date(borrowed);
  due.setDate(due.getDate() + days);
  return {
    bookId: book.id,
    memberId: member.id,
    borrowedAt: borrowed.toISOString(),
    dueAt: due.toISOString(),
    returnedAt: null,
    status: LOAN_STATUSES.ACTIVE
  };
}

export function returnLoanRecord(loan, returnedAt) {
  if (!loan) throw new Error("Loan not found.");
  if (loan.returnedAt) throw new Error("Loan already returned.");
  return {
    ...loan,
    returnedAt: new Date(returnedAt).toISOString(),
    status: LOAN_STATUSES.RETURNED
  };
}

export function computeLoanStatus(loan, now = new Date()) {
  if (loan.returnedAt) return LOAN_STATUSES.RETURNED;
  return new Date(loan.dueAt) < new Date(now) ? LOAN_STATUSES.OVERDUE : LOAN_STATUSES.ACTIVE;
}

export function filterBooks(books, { query = "", category = "all", availability = "all" } = {}) {
  const normalized = query.trim().toLowerCase();
  return books.filter((book) => {
    const matchesQuery =
      !normalized ||
      [book.title, book.author, book.isbn, book.category].some((value) =>
        String(value).toLowerCase().includes(normalized)
      );
    const matchesCategory = category === "all" || book.category === category;
    const matchesAvailability =
      availability === "all" ||
      (availability === "available" && book.availableCopies > 0) ||
      (availability === "unavailable" && book.availableCopies === 0);
    return matchesQuery && matchesCategory && matchesAvailability;
  });
}

export function summarizeDashboard({ books, members, loans }, now = new Date()) {
  const activeLoans = loans.filter((loan) => computeLoanStatus(loan, now) === LOAN_STATUSES.ACTIVE);
  const overdueLoans = loans.filter((loan) => computeLoanStatus(loan, now) === LOAN_STATUSES.OVERDUE);
  return {
    totalBooks: books.length,
    availableCopies: books.reduce((sum, book) => sum + book.availableCopies, 0),
    activeMembers: members.filter((member) => member.status === "active").length,
    activeLoans: activeLoans.length,
    overdueLoans: overdueLoans.length
  };
}
