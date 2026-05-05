import { prisma } from "./db.js";

export async function listBooks() {
  return prisma.book.findMany({ orderBy: { title: "asc" } });
}

export async function findAdminByEmail(email) {
  return prisma.adminUser.findUnique({ where: { email: email.toLowerCase() } });
}

export async function findAdminById(id) {
  return prisma.adminUser.findUnique({ where: { id: Number(id) } });
}

export async function createAdminUser(admin) {
  return prisma.adminUser.create({
    data: {
      email: admin.email.toLowerCase(),
      passwordHash: admin.passwordHash,
      role: admin.role ?? "admin",
      status: admin.status ?? "active"
    }
  });
}

export async function findBookById(id) {
  return prisma.book.findUnique({ where: { id: Number(id) } });
}

export async function createBook(book) {
  return prisma.book.create({
    data: {
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      category: book.category,
      totalCopies: book.totalCopies,
      availableCopies: book.availableCopies
    }
  });
}

export async function listMembers() {
  return prisma.member.findMany({ orderBy: { name: "asc" } });
}

export async function findMemberById(id) {
  return prisma.member.findUnique({ where: { id: Number(id) } });
}

export async function createMember(member) {
  return prisma.member.create({
    data: {
      name: member.name,
      email: member.email,
      phone: member.phone ?? "",
      status: member.status ?? "active"
    }
  });
}

export async function listLoans() {
  return prisma.loan.findMany({
    include: {
      book: {
        select: {
          id: true,
          title: true
        }
      },
      member: {
        select: {
          id: true,
          name: true
        }
      }
    },
    orderBy: { borrowedAt: "desc" }
  });
}

export async function createLoan(loan) {
  return prisma.$transaction((tx) => createLoanWithTx(tx, loan));
}

export async function createLoanWithTx(tx, loan) {
  const created = await tx.loan.create({
    data: {
      bookId: loan.bookId,
      memberId: loan.memberId,
      borrowedAt: loan.borrowedAt,
      dueAt: loan.dueAt,
      returnedAt: loan.returnedAt,
      status: loan.status
    }
  });
  await tx.book.update({
    where: { id: loan.bookId },
    data: { availableCopies: { decrement: 1 } }
  });
  return created;
}

export async function returnLoan(id, returnedAt) {
  return prisma.$transaction((tx) => returnLoanWithTx(tx, id, returnedAt));
}

export async function returnLoanWithTx(tx, id, returnedAt) {
  const activeLoan = await tx.loan.findFirst({
    where: { id: Number(id), returnedAt: null }
  });
  if (!activeLoan) return null;

  const loan = await tx.loan.update({
    where: { id: activeLoan.id },
    data: {
      returnedAt,
      status: "returned"
    }
  });
  await tx.book.update({
    where: { id: loan.bookId },
    data: { availableCopies: { increment: 1 } }
  });
  return loan;
}

export async function extendLoan(id, dueAt) {
  return prisma.$transaction((tx) => extendLoanWithTx(tx, id, dueAt));
}

export async function extendLoanWithTx(tx, id, dueAt) {
  const activeLoan = await tx.loan.findFirst({
    where: { id: Number(id), returnedAt: null }
  });
  if (!activeLoan) return null;

  return tx.loan.update({
    where: { id: activeLoan.id },
    data: {
      dueAt,
      status: "active"
    }
  });
}

export async function findLoanById(id) {
  return prisma.loan.findUnique({ where: { id: Number(id) } });
}
