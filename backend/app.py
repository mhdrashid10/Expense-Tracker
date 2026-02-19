from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from datetime import datetime

app = Flask(__name__)
CORS(app)  # Allows React (localhost:5173) to talk to Flask (localhost:5000)

# Use SQLite database file in the same folder
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///expenses.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# Table for expenses
class Expense(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.String(200), nullable=False)
    amount = db.Column(db.Float, nullable=False)          # e.g. 450.50
    category = db.Column(db.String(50))                   # e.g. "Food", "Bills"
    date = db.Column(db.String(20), default=datetime.now().strftime("%Y-%m-%d"))

    def to_dict(self):
        return {
            'id': self.id,
            'description': self.description,
            'amount': self.amount,
            'category': self.category or "Other",
            'date': self.date
        }

# Create the table if it doesn't exist
with app.app_context():
    db.create_all()

# Get all expenses
@app.route('/api/expenses', methods=['GET'])
def get_expenses():
    expenses = Expense.query.all()
    return jsonify([exp.to_dict() for exp in expenses])

# Add a new expense
@app.route('/api/expenses', methods=['POST'])
def add_expense():
    data = request.get_json()
    if not data or 'description' not in data or 'amount' not in data:
        return jsonify({'error': 'Missing description or amount'}), 400

    new_expense = Expense(
        description=data['description'],
        amount=float(data['amount']),
        category=data.get('category', 'Other')
    )
    db.session.add(new_expense)
    db.session.commit()
    return jsonify(new_expense.to_dict()), 201

# Delete an expense by id
@app.route('/api/expenses/<int:id>', methods=['DELETE'])
def delete_expense(id):
    expense = Expense.query.get_or_404(id)
    db.session.delete(expense)
    db.session.commit()
    return '', 204

# Simple total (for later use)
@app.route('/api/totals', methods=['GET'])
def get_totals():
    expenses = Expense.query.all()
    total = sum(exp.amount for exp in expenses)
    return jsonify({'total_expenses': total})

if __name__ == '__main__':
    app.run(debug=True, port=5000)