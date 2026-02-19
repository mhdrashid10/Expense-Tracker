# Personal Expense Tracker

A simple full-stack web app to track daily expenses and manage personal finances.

## Features

- Quickly add expenses with note, amount, category, and date
- Clean table view of all entries
- Delete individual expenses
- Filter expenses by category (shows only categories present in your data)
- Filter by exact date using calendar picker
- Real-time total displayed for the currently filtered expenses
- Minimal, responsive design (works on mobile and desktop)

## Tech Stack

- **Backend**: Python + Flask + SQLAlchemy + SQLite
- **Frontend**: React (Vite + TypeScript) + Axios
- **Cross-origin support**: flask-cors
- **Styling**: Inline CSS (simple and dependency-free)

## Installation & Running Locally

### Prerequisites
- Python 3.8+
- Node.js 18+ (with npm)

### Backend
```bash
cd backend
pip install -r requirements.txt
python app.py