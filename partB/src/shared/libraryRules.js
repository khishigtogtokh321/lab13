export const LOAN_STATUSES = {
  ACTIVE: "active",
  RETURNED: "returned",
  OVERDUE: "overdue"
};

export function validateBookInput(input) {
  const errors = [];
  if (!input.title || input.title.trim().length < 2) errors.push("Номын нэрийг 2-оос дээш тэмдэгтээр оруулна уу.");
  if (!input.author || input.author.trim().length < 2) errors.push("Зохиогчийн нэрийг 2-оос дээш тэмдэгтээр оруулна уу.");
  if (!input.isbn || !/^[0-9-]{10,17}$/.test(input.isbn)) errors.push("ISBN нь 10-17 оронтой тоо эсвэл зураас (-) агуулсан байх ёстой.");
  if (!Number.isInteger(input.totalCopies) || input.totalCopies < 1) errors.push("Нийт хувь хамгийн багадаа 1 байх ёстой.");
  if (!Number.isInteger(input.availableCopies) || input.availableCopies < 0) errors.push("Бэлэн хувь 0-ээс бага байж болохгүй.");
  if (input.availableCopies > input.totalCopies) errors.push("Бэлэн хувь нийт хувиас их байж болохгүй.");
  return errors;
}

export function validateMemberInput(input) {
  const errors = [];
  if (!input.name || input.name.trim().length < 2) errors.push("Гишүүний нэрийг 2-оос дээш тэмдэгтээр оруулна уу.");
  if (!input.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email)) errors.push("Зөв имэйл хаяг оруулна уу.");
  if (input.status && !["active", "inactive"].includes(input.status)) errors.push("Гишүүний төлөв буруу байна.");
  return errors;
}

export function canLoanBook(book, member) {
  if (!book) return { ok: false, reason: "Сонгосон ном олдсонгүй." };
  if (!member) return { ok: false, reason: "Сонгосон гишүүн олдсонгүй." };
  if (member.status !== "active") return { ok: false, reason: "Идэвхгүй гишүүнд ном зээлүүлэх боломжгүй." };
  if (book.availableCopies < 1) return { ok: false, reason: "Энэ номын бэлэн хувь дууссан байна." };
  return { ok: true };
}

export function createLoanRecord({ book, member, borrowedAt, days = 14 }) {
  const allowed = canLoanBook(book, member);
  if (!allowed.ok) throw new Error(allowed.reason);
  const loanDays = normalizeLoanDays(days);
  const borrowed = new Date(borrowedAt);
  const due = new Date(borrowed);
  due.setDate(due.getDate() + loanDays);
  return {
    bookId: book.id,
    memberId: member.id,
    borrowedAt: borrowed.toISOString(),
    dueAt: due.toISOString(),
    returnedAt: null,
    status: LOAN_STATUSES.ACTIVE
  };
}

export function normalizeLoanDays(days, label = "Зээлийн хугацаа") {
  const value = Number(days);
  if (!Number.isInteger(value) || value < 1 || value > 365) {
    throw new Error(`${label} 1-365 хоногийн хооронд бүхэл тоо байх ёстой.`);
  }
  return value;
}

export function extendLoanRecord(loan, days = 7) {
  if (!loan) throw new Error("Зээлэлтийн бүртгэл олдсонгүй.");
  if (loan.returnedAt) throw new Error("Буцаасан зээлэлтийг сунгах боломжгүй.");
  const extensionDays = normalizeLoanDays(days, "Сунгах хугацаа");
  const due = new Date(loan.dueAt);
  due.setDate(due.getDate() + extensionDays);
  return {
    ...loan,
    dueAt: due.toISOString(),
    status: LOAN_STATUSES.ACTIVE
  };
}

export function returnLoanRecord(loan, returnedAt) {
  if (!loan) throw new Error("Зээлэлтийн бүртгэл олдсонгүй.");
  if (loan.returnedAt) throw new Error("Энэ зээлэлт аль хэдийн буцаагдсан байна.");
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
