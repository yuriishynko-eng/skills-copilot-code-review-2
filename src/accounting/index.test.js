// Unit tests mirroring docs/TESTPLAN.md
const test = require("node:test");
const assert = require("node:assert");
const { createDataStore, parseAmount, viewBalance, creditAccount, debitAccount } = require("./index");

test("TC-01 view initial balance", () => {
  assert.strictEqual(viewBalance(createDataStore()), "Current balance: 001000.00");
});

test("TC-02 credit a valid amount", () => {
  const r = creditAccount(createDataStore(), 100);
  assert.strictEqual(r.message, "Amount credited. New balance: 001100.00");
});

test("TC-03 balance persists after credit", () => {
  const s = createDataStore();
  creditAccount(s, 100);
  assert.strictEqual(viewBalance(s), "Current balance: 001100.00");
});

test("TC-04 credit zero amount", () => {
  const s = createDataStore();
  creditAccount(s, 0);
  assert.strictEqual(s.read(), 1000);
});

test("TC-05 debit a valid amount", () => {
  assert.strictEqual(debitAccount(createDataStore(), 50).message, "Amount debited. New balance: 000950.00");
});

test("TC-06 debit the full balance", () => {
  const s = createDataStore();
  assert.ok(debitAccount(s, 1000).ok);
  assert.strictEqual(s.read(), 0);
});

test("TC-07 debit more than the balance", () => {
  const s = createDataStore();
  const r = debitAccount(s, 2000);
  assert.strictEqual(r.message, "Insufficient funds for this debit.");
  assert.strictEqual(s.read(), 1000);
});

test("TC-08 multiple operations in one session", () => {
  const s = createDataStore();
  creditAccount(s, 200);
  debitAccount(s, 300);
  assert.strictEqual(viewBalance(s), "Current balance: 000900.00");
});

test("invalid amounts are rejected", () => {
  assert.strictEqual(parseAmount("-5"), null);
  assert.strictEqual(parseAmount("abc"), null);
  assert.strictEqual(parseAmount("12.345"), 12.35);
});
