from flask import Flask, jsonify, request
from flask_cors import CORS
import json
import os

# Initialize Flask application
app = Flask(__name__)
CORS(app)  # Enable CORS for frontend communication

# Path to the JSON file containing quiz questions
DATA_FILE = os.path.join(os.path.dirname(__file__), 'data', 'questions.json')

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