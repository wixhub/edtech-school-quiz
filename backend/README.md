# EdTech School Quiz - Backend

This is the backend service for the EdTech School Quiz platform, built with **Python** and **Flask**. It provides a lightweight, secure REST API to serve questions and evaluate student responses.

---

## Key Features

- **Teacher-Friendly:** Educators can easily add or modify questions in JSON format (`questions.json`) without needing to touch or modify any Python backend logic.

- **Security & Anti-Cheat:** The correct answer index (`correct` field) is safely stripped on the backend within the `/api/quiz` endpoint before questions are sent to the client. This prevents students from inspecting network requests or using browser developer tools to cheat.

- **CORS Enabled:** Fully configured to seamlessly communicate with modern frontend applications (like Angular).

---

## 🚀 Live Backend

🔗 **[View Backend on Render](https://edtech-school-quiz.onrender.com)**

---

## Project Structure

```text
backend/
├── data/
│   └── questions.json    # JSON storage for quiz questions (managed by educators)
├── venv/                 # Python virtual environment
├── app.py                # Main Flask application and API endpoints
├── requirements.txt      # Project dependencies
└── README.md             # Backend documentation
```
