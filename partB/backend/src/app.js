import express from "express";
import cors from "cors";
import { createAuthRouter, parseAuthCookies } from "./auth.js";
import {
  createLoanRecord,
  computeLoanStatus,
  filterBooks,
  summarizeDashboard,
  validateBookInput,
  validateMemberInput
} from "../../shared/libraryRules.js";
import {
  createBook,
  createLoan,
  createMember,
  findBookById,
  findMemberById,
  listBooks,
  listLoans,
  listMembers,
  returnLoan
} from "./repositories.js";

export function createApp() {
  const app = express();
  app.use(cors({ origin: true, credentials: true }));
  app.use(express.json());
  app.use(parseAuthCookies);

  app.get("/api/health", (_req, res) => {
    res.json({ ok: true, service: "mini-library-api" });
  });

  app.use("/api/auth", createAuthRouter());

  app.get("/api/books", async (req, res, next) => {
    try {
      const books = await listBooks();
      res.json(filterBooks(books, req.query));
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/books", async (req, res, next) => {
    try {
      const errors = validateBookInput(req.body);
      if (errors.length) return res.status(400).json({ errors });
      const book = await createBook(req.body);
      res.status(201).json(book);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/members", async (_req, res, next) => {
    try {
      res.json(await listMembers());
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/members", async (req, res, next) => {
    try {
      const errors = validateMemberInput(req.body);
      if (errors.length) return res.status(400).json({ errors });
      const member = await createMember(req.body);
      res.status(201).json(member);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/loans", async (_req, res, next) => {
    try {
      const loans = await listLoans();
      res.json(loans.map((loan) => ({ ...loan, status: computeLoanStatus(loan) })));
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/loans", async (req, res, next) => {
    try {
      const [book, member] = await Promise.all([findBookById(req.body.bookId), findMemberById(req.body.memberId)]);
      const loan = createLoanRecord({ book, member, borrowedAt: req.body.borrowedAt ?? new Date(), days: req.body.days ?? 14 });
      res.status(201).json(await createLoan(loan));
    } catch (error) {
      if (["Book not found.", "Member not found.", "Member is not active.", "No available copies."].includes(error.message)) {
        return res.status(400).json({ errors: [error.message] });
      }
      next(error);
    }
  });

  app.patch("/api/loans/:id/return", async (req, res, next) => {
    try {
      const loan = await returnLoan(req.params.id, req.body.returnedAt ?? new Date());
      if (!loan) return res.status(404).json({ errors: ["Active loan not found."] });
      res.json(loan);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/dashboard/summary", async (_req, res, next) => {
    try {
      const [books, members, loans] = await Promise.all([listBooks(), listMembers(), listLoans()]);
      res.json(summarizeDashboard({ books, members, loans }));
    } catch (error) {
      next(error);
    }
  });

  app.use((error, _req, res, _next) => {
    console.error(error);
    res.status(500).json({ errors: ["Unexpected server error."] });
  });

  return app;
}
