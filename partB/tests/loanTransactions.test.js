import assert from "node:assert/strict";
import test from "node:test";
import { createLoanWithTx, extendLoanWithTx, returnLoanWithTx } from "../src/backend/src/repositories.js";

function createMockTx({ activeLoan = { id: 7, bookId: 3 }, updatedLoan } = {}) {
  const calls = [];
  const loanAfterUpdate = updatedLoan ?? { id: activeLoan?.id ?? 7, bookId: activeLoan?.bookId ?? 3, status: "active" };

  return {
    calls,
    tx: {
      loan: {
        create: async (args) => {
          calls.push(["loan.create", args]);
          return { id: 10, ...args.data };
        },
        findFirst: async (args) => {
          calls.push(["loan.findFirst", args]);
          return activeLoan;
        },
        update: async (args) => {
          calls.push(["loan.update", args]);
          return { ...loanAfterUpdate, ...args.data };
        }
      },
      book: {
        update: async (args) => {
          calls.push(["book.update", args]);
          return { id: args.where.id };
        }
      }
    }
  };
}

test("createLoanWithTx creates loan and decrements available copy in one transaction body", async () => {
  const { tx, calls } = createMockTx();
  const loan = {
    bookId: 3,
    memberId: 4,
    borrowedAt: "2026-05-01T00:00:00.000Z",
    dueAt: "2026-05-15T00:00:00.000Z",
    returnedAt: null,
    status: "active"
  };

  const created = await createLoanWithTx(tx, loan);

  assert.equal(created.id, 10);
  assert.deepEqual(calls.map(([name]) => name), ["loan.create", "book.update"]);
  assert.deepEqual(calls[1][1], {
    where: { id: 3 },
    data: { availableCopies: { decrement: 1 } }
  });
});

test("returnLoanWithTx marks active loan returned and increments available copy", async () => {
  const returnedAt = "2026-05-06T00:00:00.000Z";
  const { tx, calls } = createMockTx({ activeLoan: { id: 7, bookId: 3 } });

  const returned = await returnLoanWithTx(tx, "7", returnedAt);

  assert.equal(returned.status, "returned");
  assert.deepEqual(calls.map(([name]) => name), ["loan.findFirst", "loan.update", "book.update"]);
  assert.deepEqual(calls[0][1], { where: { id: 7, returnedAt: null } });
  assert.deepEqual(calls[2][1], {
    where: { id: 3 },
    data: { availableCopies: { increment: 1 } }
  });
});

test("returnLoanWithTx does not update inventory when no active loan exists", async () => {
  const { tx, calls } = createMockTx({ activeLoan: null });

  const returned = await returnLoanWithTx(tx, 99, new Date());

  assert.equal(returned, null);
  assert.deepEqual(calls.map(([name]) => name), ["loan.findFirst"]);
});

test("extendLoanWithTx updates due date without changing inventory", async () => {
  const dueAt = "2026-05-20T00:00:00.000Z";
  const { tx, calls } = createMockTx({ activeLoan: { id: 7, bookId: 3 } });

  const extended = await extendLoanWithTx(tx, 7, dueAt);

  assert.equal(extended.dueAt, dueAt);
  assert.equal(extended.status, "active");
  assert.deepEqual(calls.map(([name]) => name), ["loan.findFirst", "loan.update"]);
});
