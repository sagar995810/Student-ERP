# Student ERP Portal - Major Project

A modern, full-stack Student Enterprise Resource Planning (ERP) portal built with a Node.js backend, SQLite database, and a responsive frontend.

## 🚀 Features

### 1. Student Authentication
- Secure login system for multiple students.
- Backend validation against a SQLite database.
- Persistent session state (simulated in frontend).

### 2. Interactive Dashboard
- **GPA Tracker**: Real-time display of current academic performance.
- **Next Class**: Dynamic notification of the upcoming lecture.
- **Progress Bars**: Visual tracking of course and assignment completion.
- **Quick Stats**: At-a-glance view of pending tasks and notifications.

### 3. Academic Management
- **Course List**: View all enrolled courses with unique codes.
- **Gradebook**: Detailed table showing midterm, final, and average scores.
- **Announcements**: Stay updated with the latest campus news and events.

### 4. Assignment Submission System
- **Active Tasks**: List of due, in-progress, and pending assignments.
- **Online Submission**: Students can submit text-based assignments directly through the portal.
- **Submission History**: Track past submissions with timestamps and content snippets.

### 5. Enhanced User Interface
- **Glassmorphism Design**: Modern, translucent UI elements.
- **Theme Support**: Switch between Default, Dark, and Sunset themes.
- **Responsive Sidebar**: Collapsible navigation for mobile and tablet views.
- **Animated Transitions**: Smooth fade-in effects for sections and cards.

### 6. Campus Chat Bot
- Integrated chat interface for quick assistance.
- Modern circular toggle and animated message bubbles.
- Automated responses for common student queries.

---

## 🛠 Tech Stack

- **Frontend**: HTML5, CSS3 (Vanilla CSS with CSS Variables), JavaScript (ES6+)
- **Backend**: Node.js, Express.js
- **Database**: SQLite3 (via `better-sqlite3`)
- **Icons/Styling**: Custom CSS animations, Emoji-based iconography

---

## 📦 Project Structure

```text
/
├── server.js           # Express server and API endpoints
├── setup_db.js        # Script to initialize/reset SQLite database
├── portal.db          # SQLite database file (auto-generated)
├── index.html         # Main portal structure
├── script.js          # Frontend logic and API integration
├── style.css          # Modern UI styling and animations
├── package.json       # Project dependencies and scripts
└── assets/            # Project images and icons
```

---

## 🚦 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v14 or higher recommended)

### Installation
1. Clone the project to your local machine.
2. Install dependencies:
   ```bash
   npm install
   ```

### Database Initialization
Run the setup script to create the database and populate it with sample student data:
```bash
node setup_db.js
```

### Running the Portal
Start the backend server:
```bash
npm start
```
The server will run at `http://localhost:3000`. You can open `index.html` in your browser or serve it via the Express static middleware.

---

## 🔑 Test Credentials

| Email | Password | Role |
| :--- | :--- | :--- |
| `alex.johnson@example.com` | `password123` | CS Student |
| `jane.smith@example.com` | `password123` | AI & ML Student |
| `sagar@edu.com` | `@123456` | IT Student |
| `priya.sharma@example.com` | `password123` | CS Student |
| `rahul.verma@example.com` | `password123` | Mechanical Student |

---

## 📝 License
This project is for educational purposes as part of a Major Project submission.
