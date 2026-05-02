import { query } from "./db.js";

const bookFields = "id, title, author, isbn, category, total_copies AS \"totalCopies\", available_copies AS \"availableCopies\"";
const memberFields = "id, name, email, phone, status";
const loanFields =
  "id, book_id AS \"bookId\", member_id AS \"memberId\", borrowed_at AS \"borrowedAt\", due_at AS \"dueAt\", returned_at AS \"returnedAt\", status";

export async function listBooks() {
  const result = await query(`SELECT ${bookFields} FROM books ORDER BY title ASC`);
  return result.rows;
}

export async function findBookById(id) {
  const result = await query(`SELECT ${bookFields} FROM books WHERE id = $1`, [id]);
  return result.rows[0] ?? null;
}

export async function createBook(book) {
  const result = await query(
    `INSERT INTO books (title, author, isbn, category, total_copies, available_copies)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING ${bookFields}`,
    [book.title, book.author, book.isbn, book.category, book.totalCopies, book.availableCopies]
  );
  return result.rows[0];
}

export async function listMembers() {
  const result = await query(`SELECT ${memberFields} FROM members ORDER BY name ASC`);
  return result.rows;
}

export async function findMemberById(id) {
  const result = await query(`SELECT ${memberFields} FROM members WHERE id = $1`, [id]);
  return result.rows[0] ?? null;
}

export async function createMember(member) {
  const result = await query(
    `INSERT INTO members (name, email, phone, status)
     VALUES ($1, $2, $3, $4)
     RETURNING ${memberFields}`,
    [member.name, member.email, member.phone ?? "", member.status ?? "active"]
  );
  return result.rows[0];
}

export async function listLoans() {
  const result = await query(`SELECT ${loanFields} FROM loans ORDER BY borrowed_at DESC`);
  return result.rows;
}

export async function createLoan(loan) {
  const result = await query(
    `INSERT INTO loans (book_id, member_id, borrowed_at, due_at, returned_at, status)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING ${loanFields}`,
    [loan.bookId, loan.memberId, loan.borrowedAt, loan.dueAt, loan.returnedAt, loan.status]
  );
  await query("UPDATE books SET available_copies = available_copies - 1 WHERE id = $1", [loan.bookId]);
  return result.rows[0];
}

export async function returnLoan(id, returnedAt) {
  const result = await query(
    `UPDATE loans
     SET returned_at = $2, status = 'returned'
     WHERE id = $1 AND returned_at IS NULL
     RETURNING ${loanFields}`,
    [id, returnedAt]
  );
  const loan = result.rows[0] ?? null;
  if (loan) {
    await query("UPDATE books SET available_copies = available_copies + 1 WHERE id = $1", [loan.bookId]);
  }
  return loan;
}
