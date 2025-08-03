# 💰 BudgetNow – Personal Expense Tracker

**BudgetNow** is a modern web-based expense tracker that helps users manage their personal finances with ease. Built using **React.js**, **Context API**, and **Chart.js**, the application allows users to record expenses, analyze spending habits, and visualize data through interactive charts.


## 🚀 Live Demo

> Coming soon (Deploy on Vercel or Netlify)

---

## 🛠️ Tech Stack

- **Frontend:** React.js, Vite, Tailwind CSS  
- **State Management:** React Context API  
- **Charts:** Chart.js  
- **Build Tools:** Vite  
- **Linting:** ESLint

---

## 📦 Features

- 📊 Interactive Pie and Bar charts for expense analysis  
- 💸 Add and categorize expenses dynamically  
- 🧾 View summarized expense reports  
- 💻 Responsive layout for all screen sizes  
- ♻️ Real-time updates with React Context API

---

## 🧑‍💻 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/budget-now.git
cd budjet-now-main

npm install
npm run dev

budjet-now-main/
│
├── src/
│   ├── assets/                # Static assets (icons, images)
│   ├── components/            # Reusable components (charts, forms, dashboard)
│   ├── context/               # Global ExpenseContext with reducer logic
│   ├── layouts/               # Layout structure (Dashboard)
│   ├── App.jsx                # Main app entry
│   └── main.jsx               # ReactDOM render
├── public/                    # Static public files
├── package.json               # Project metadata
└── vite.config.js             # Vite configuration

🧩 Problem It Solves
Many individuals struggle to maintain a clear view of their financial habits. BudgetNow solves this by:

Centralizing and categorizing personal expenses

Providing visual insights to control spending

Enabling better financial decision-making

Helping users stick to monthly budgets and goals

🚧 Challenges Faced
Integrating Chart.js dynamically with live data updates

Building clean UI using Tailwind without CSS clutter

Managing nested component state through Context API

Optimizing performance for multiple state updates

Balancing data accuracy with a smooth user experience
