// Node.js port of the legacy COBOL Student Account Management System.
// Mirrors main.cob (menu), operations.cob (business logic) and data.cob (storage).
const readline = require("readline");

const INITIAL_BALANCE = 1000.0;
const MAX_AMOUNT = 999999.99; // PIC 9(6)V99

// data.cob - DataProgram: in-memory balance storage with READ / WRITE
function createDataStore(initial = INITIAL_BALANCE) {
  let storageBalance = initial;
  return {
    read: () => storageBalance,
    write: (balance) => {
      storageBalance = balance;
    },
  };
}

function formatBalance(value) {
  return value.toFixed(2).padStart(9, "0");
}

function parseAmount(input) {
  const amount = Number(input);
  if (!Number.isFinite(amount) || amount < 0 || amount > MAX_AMOUNT) return null;
  return Math.round(amount * 100) / 100;
}

// operations.cob - Operations: TOTAL / CREDIT / DEBIT
function viewBalance(store) {
  return `Current balance: ${formatBalance(store.read())}`;
}

function creditAccount(store, amount) {
  const newBalance = Math.round((store.read() + amount) * 100) / 100;
  if (newBalance > MAX_AMOUNT) return { ok: false, message: "Amount exceeds the maximum balance." };
  store.write(newBalance);
  return { ok: true, message: `Amount credited. New balance: ${formatBalance(newBalance)}` };
}

function debitAccount(store, amount) {
  const balance = store.read();
  if (balance < amount) return { ok: false, message: "Insufficient funds for this debit." };
  const newBalance = Math.round((balance - amount) * 100) / 100;
  store.write(newBalance);
  return { ok: true, message: `Amount debited. New balance: ${formatBalance(newBalance)}` };
}

// main.cob - MainProgram: interactive menu loop
async function main() {
  const rl = readline.createInterface({ input: process.stdin });
  const lines = rl[Symbol.asyncIterator]();
  const ask = async (q) => {
    process.stdout.write(q);
    const { value, done } = await lines.next();
    return done ? "4" : value;
  };
  const store = createDataStore();
  let running = true;

  while (running) {
    console.log("--------------------------------");
    console.log("Account Management System");
    console.log("1. View Balance");
    console.log("2. Credit Account");
    console.log("3. Debit Account");
    console.log("4. Exit");
    console.log("--------------------------------");
    const choice = (await ask("Enter your choice (1-4): ")).trim();

    switch (choice) {
      case "1":
        console.log(viewBalance(store));
        break;
      case "2":
      case "3": {
        const label = choice === "2" ? "credit" : "debit";
        const amount = parseAmount(await ask(`Enter ${label} amount: `));
        if (amount === null) {
          console.log("Invalid amount.");
          break;
        }
        const result = choice === "2" ? creditAccount(store, amount) : debitAccount(store, amount);
        console.log(result.message);
        break;
      }
      case "4":
        running = false;
        break;
      default:
        console.log("Invalid choice, please select 1-4.");
    }
  }
  console.log("Exiting the program. Goodbye!");
  rl.close();
}

if (require.main === module) {
  main();
}

module.exports = { createDataStore, formatBalance, parseAmount, viewBalance, creditAccount, debitAccount, INITIAL_BALANCE };
