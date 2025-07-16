# 🌱 Grow a Garden Stock Tracker

This project is a **web-based stock tracker** for the game **Grow a Garden**, using real-time data from the official [Grow a Garden API](https://api.joshlei.com/v2/growagarden/stock).

🔒 **Login Protected** — only friends can access  
🌙 **Dark Mode Toggle**  
🪴 **Live Countdown Timers**  
📦 **Grouped by Category**: Seeds, Gear, Eggs, Cosmetics, and more  
🎨 **Rarity-Colored Labels** for each item  
📢 **Scrolling Alerts** for rare+ items in stock

---

## 📁 Project Structure

├── index.html # Main page  
├── login.html # Simple login screen  
├── favicon.ico # Icon for the webpage  
├── style.css # All visual styling  
├── script.js # Stock fetching, rendering, and alerts  
└── README.md # This file  

---

## 🔧 Features

- **Real-Time Data**: Refreshes every 60 seconds
- **Search & Filter**: Instantly find any item by name or rarity
- **Rarity Alerts**: Displays a marquee message for all `rare` and above
- **Rarity Colors**: Each item shows a color-coded badge
- **Persistent Dark Mode**: Saves preference in localStorage

---

## ✅ How to Use

1. **Clone this repo** or download the files.
2. Open `index.html` in your browser.
3. Login with any dummy value on `login.html` (authentication is local-only).
4. Explore the live inventory, timers, and filters!

---

## 🌈 Rarity Color Legend

| Rarity        | Color         |
|---------------|---------------|
| Common        | Gray          |
| Uncommon      | Green         |
| Rare          | Blue          |
| Legendary     | Orange        |
| Mythical      | Purple        |
| Divine        | Pink          |
| Prismatic     | Rainbow       |
| Transcendent  | Gold / Shine  |

---

## 🧠 Powered By

- [Grow a Garden API](https://api.joshlei.com/v2/growagarden/stock)
- HTML + CSS + JavaScript (Vanilla)

---


## 👤 Author

Made with 💚 by **Aelious**  
For support or feedback, contact me via Discord or GitHub.

---

## 📜 License

MIT License. Use and modify freely!
