const express = require("express");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const authMiddleware = require("./middleware/authMiddleware");

const app = express();
app.use(bodyParser.json());

const PORT = 5000;

// Dummy user and account balance
let accountBalance = 1000;
const user = { username: "vasu", password: "12345" };

// Login Route
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (username === user.username && password === user.password) {
    const token = jwt.sign({ username }, "secretkey123", { expiresIn: "1h" });
    return res.json({ message: "Login successful", token });
  }
  res.status(401).json({ message: "Invalid credentials" });
});

// Protected Routes
app.get("/balance", authMiddleware, (req, res) => {
  res.json({ balance: accountBalance });
});

app.post("/deposit", authMiddleware, (req, res) => {
  const { amount } = req.body;
  if (!amount || amount <= 0) {
    return res.status(400).json({ message: "Invalid deposit amount" });
  }
  accountBalance += amount;
  res.json({ message: "Deposit successful", newBalance: accountBalance });
});

app.post("/withdraw", authMiddleware, (req, res) => {
  const { amount } = req.body;
  if (!amount || amount <= 0) {
    return res.status(400).json({ message: "Invalid withdrawal amount" });
  }
  if (amount > accountBalance) {
    return res.status(400).json({ message: "Insufficient balance" });
  }
  accountBalance -= amount;
  res.json({ message: "Withdrawal successful", newBalance: accountBalance });
});

// Default route
app.get("/", (req, res) => {
  res.send("JWT Banking API is running securely.");
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
