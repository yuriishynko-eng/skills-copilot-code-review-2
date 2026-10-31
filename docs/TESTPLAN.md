# Test Plan: Student Account Management System

Test plan for the business logic of the legacy COBOL application (`main.cob`, `operations.cob`, `data.cob`). It will later be used to create unit and integration tests for the Node.js version.

| Test Case ID | Test Case Description | Pre-conditions | Test Steps | Expected Result | Actual Result | Status (Pass/Fail) | Comments |
|---|---|---|---|---|---|---|---|
| TC-01 | View initial balance | App started, no transactions yet | 1. Choose option 1 | "Current balance: 001000.00" is shown | | | Starting balance is 1000.00 |
| TC-02 | Credit a valid amount | Balance is 1000.00 | 1. Choose option 2<br>2. Enter 100.00 | "Amount credited. New balance: 001100.00" | | | |
| TC-03 | Balance persists after credit | TC-02 completed | 1. Choose option 1 | "Current balance: 001100.00" | | | Checks data layer WRITE/READ |
| TC-04 | Credit zero amount | Balance is 1000.00 | 1. Choose option 2<br>2. Enter 0 | Balance stays 001000.00 | | | |
| TC-05 | Debit a valid amount | Balance is 1000.00 | 1. Choose option 3<br>2. Enter 50.00 | "Amount debited. New balance: 000950.00" | | | |
| TC-06 | Debit the full balance | Balance is 1000.00 | 1. Choose option 3<br>2. Enter 1000.00 | "Amount debited. New balance: 000000.00" | | | Balance equal to amount is allowed |
| TC-07 | Debit more than the balance | Balance is 1000.00 | 1. Choose option 3<br>2. Enter 2000.00 | "Insufficient funds for this debit." and balance stays 1000.00 | | | Balance must never go negative |
| TC-08 | Multiple operations in one session | Balance is 1000.00 | 1. Credit 200.00<br>2. Debit 300.00<br>3. View balance | "Current balance: 000900.00" | | | |
| TC-09 | Invalid menu choice | App started | 1. Enter 5 | "Invalid choice, please select 1-4." and menu is shown again | | | |
| TC-10 | Exit the application | App started | 1. Choose option 4 | "Exiting the program. Goodbye!" and the program ends | | | |
