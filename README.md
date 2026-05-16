# BobGoblin 👹
## AI Powered Release Intelligence

BobGoblin is an AI powered release intelligence platform that helps engineering teams automate regression testing and deployment validation using IBM Bob, Playwright, and intelligent QA workflows.

---

# 🚨 The Problem

Developers often spend hours manually testing critical application flows before every deployment. Even small code changes can unexpectedly break checkout systems, APIs, frontend interactions, or accessibility behavior.

Traditional regression testing is:
- repetitive
- slow
- expensive
- difficult to scale

Despite all the effort, production bugs still slip through.

---

# 👹 What BobGoblin Does

BobGoblin automatically:
- analyzes Git code changes
- identifies impacted business flows
- generates AI powered regression testing strategies using IBM Bob
- executes Playwright automation suites
- detects release risks
- surfaces unstable QA contracts
- provides deployment recommendations

Instead of manually clicking through the application before every release, developers get an intelligent AI assisted QA workflow.

---

# 🧠 How It Works

```txt
Developer changes code
        ↓
BobGoblin analyzes Git diff
        ↓
Impacted flows detected
        ↓
IBM Bob generates regression suites
        ↓
Playwright executes tests
        ↓
Failures + risks analyzed
        ↓
watsonx inspired release recommendation
```

---

# ✨ Key Features

## 🔍 Diff Based Release Analysis
BobGoblin scans modified files and identifies which business flows are affected.

Example:
- Checkout changes
- Payment changes
- Authentication changes

---

## 🤖 IBM Bob Regression Intelligence
IBM Bob generates enterprise style Playwright regression suites covering:
- happy paths
- edge cases
- invalid inputs
- API failures
- loading states
- accessibility checks

---

## 🎭 Automated Browser Testing
Playwright executes regression suites automatically and validates deployment critical flows.

---

## ⚠️ Release Risk Detection
BobGoblin identifies:
- unstable frontend contracts
- failing regression paths
- cascading failures
- deployment blockers

---

## 🧪 Smoke Test Stabilization
Engineers can isolate stable smoke suites for production ready deployment validation.

---

# 🛠️ Tech Stack

## Frontend
- Next.js
- TypeScript

## Backend
- Node.js
- Express

## QA & Automation
- IBM Bob
- Playwright

## AI Intelligence
- watsonx inspired release analysis

---



## Dashboard
<img width="1470" height="607" alt="image" src="https://github.com/user-attachments/assets/4a7e79ac-b574-48bf-9f70-15ba75463399" />



---

## Playwright Regression Report
<img width="1464" height="438" alt="image" src="https://github.com/user-attachments/assets/dc1994e4-5c35-43e6-a173-985a927d579f" />
<img width="715" height="135" alt="image" src="https://github.com/user-attachments/assets/97caeb53-fd14-4ccf-ab4c-5caf9ae811d1" />


---

## IBM Bob Generated Test Suite
<img width="1470" height="651" alt="image" src="https://github.com/user-attachments/assets/e1d9b5aa-9f4e-4dd8-81fc-a6c948036c40" />




---

# 🚀 Running The Project

## 1. Clone Repository

```bash
git clone https://github.com/shriyaagg/BobGoblin.git
cd BobGoblin
```

---

## 2. Install Dependencies

### Root

```bash
npm install
```

### Dashboard

```bash
cd dashboard
npm install
```

### Server

```bash
cd ../server
npm install
```

---

## 3. Start Frontend

```bash
cd dashboard
npm run dev
```

Runs on:
```txt
http://localhost:3000
```

---

## 4. Start Backend

```bash
cd server
npm run dev
```

Runs on:
```txt
http://localhost:4000
```

---

## 5. Run Playwright Tests

From project root:

```bash
npx playwright test tests/checkout.smoke.spec.ts
```

---

# 🧪 Example Workflow

1. Developer modifies checkout flow
2. BobGoblin detects impacted business paths
3. IBM Bob generates regression scenarios
4. Playwright validates release safety
5. watsonx inspired analysis recommends deployment status

---

# 🌟 Why BobGoblin Matters

BobGoblin transforms regression testing from a manual repetitive process into an intelligent AI assisted release governance workflow.

It combines:
- AI generated QA planning
- automated browser testing
- release intelligence
- deployment confidence

into one unified engineering platform.

---

# 👹 Team BobGoblin

Built for modern AI powered software delivery workflows.
