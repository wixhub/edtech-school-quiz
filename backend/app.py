from flask import Flask, jsonify, request, render_template_string
from flask_cors import CORS
import json
import os

# Initialize Flask application
app = Flask(__name__)
CORS(app)  # Enable CORS for frontend communication

# Path to the JSON file containing quiz questions
DATA_FILE = os.path.join(os.path.dirname(__file__), 'data', 'questions.json')

@app.route('/')
def home():
    html_content = """
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>EdTech Quiz API</title>
        <style>
            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                background-color: #0f172a;
                color: #f8fafc;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                margin: 0;
            }
            .card {
                background: #1e293b;
                padding: 2.5rem;
                border-radius: 1rem;
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
                text-align: center;
                max-width: 600px;
            }
            h1 { color: #38bdf8; margin-bottom: 0.5rem; font-size: 1.5rem; }
            p { color: #94a3b8; font-size: 0.95rem; margin-bottom: 1.5rem; line-height: 1.5; }
            a { color: #38bdf8; text-decoration: none; font-weight: 500; }
            a:hover { text-decoration: underline; }
            .badge {
                display: inline-block;
                background: #065f46;
                color: #34d399;
                padding: 0.25rem 0.75rem;
                border-radius: 9999px;
                font-size: 0.85rem;
                font-weight: 600;
                margin-bottom: 1rem;
            }
        </style>
    </head>
    <body>
        <div class="card">
            <div><span class="badge">● Online</span></div>
            <h1>EdTech Quiz API</h1>
            <p>Backend service is up and running successfully.<br><br>
               You can view the user interface of the application on the page <a href="https://edtech-quiz.pages.dev/" target="_blank">edtech-quiz.pages.dev</a>.
            </p>
        </div>
    </body>
    </html>
    """
    return render_template_string(html_content)

def load_questions():
    """Load quiz questions from the JSON data file."""
    if not os.path.exists(DATA_FILE):
        return []
    with open(DATA_FILE, 'r', encoding='utf-8') as f:
        return json.load(f)

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint to verify backend status."""
    return jsonify({"status": "healthy", "project": "EDTECH-SCHOOL-QUIZ"})

@app.route('/api/quiz', methods=['GET'])
def get_quiz():
    """Return the list of quiz questions without exposing correct answers."""
    quiz_questions = load_questions()
    safe_questions = []
    for q in quiz_questions:
        safe_questions.append({
            "id": q["id"],
            "question": q["question"],
            "options": q["options"]
        })
    return jsonify(safe_questions)

@app.route('/api/quiz/submit', methods=['POST'])
def submit_quiz():
    """Evaluate submitted answers and return the score."""
    quiz_questions = load_questions()
    data = request.json
    user_answers = data.get("answers", {})
    
    score = 0
    total = len(quiz_questions)
    results = {}

    for q in quiz_questions:
        qid = str(q["id"])
        qid_int = q["id"]
        
        selected = user_answers.get(qid) if qid in user_answers else user_answers.get(qid_int)
        is_correct = (selected == q["correct"])
        if is_correct:
            score += 1
        results[qid_int] = {
            "correct": is_correct,
            "correct_answer": q["correct"]
        }

    return jsonify({
        "score": score,
        "total": total,
        "results": results
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)