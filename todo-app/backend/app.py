from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

todos = []
next_id = 1

@app.route("/todos", methods=["GET"])
def get_todos():
    return jsonify(todos)

@app.route("/todos", methods=["POST"])
def add_todo():
    global next_id
    data = request.get_json()
    todo = {
        "id": next_id,
        "text": data["text"],
        "done": False,
        "priority": data.get("priority", "Medium"),
        "category": data.get("category", "General"),
        "due_date": data.get("due_date", "")
    }
    todos.append(todo)
    next_id += 1
    return jsonify(todo), 201

@app.route("/todos/<int:todo_id>", methods=["PUT"])
def update_todo(todo_id):
    data = request.get_json()
    for todo in todos:
        if todo["id"] == todo_id:
            if "done" in data:
                todo["done"] = data["done"]
            if "text" in data:
                todo["text"] = data["text"]
            if "priority" in data:
                todo["priority"] = data["priority"]
            if "category" in data:
                todo["category"] = data["category"]
            if "due_date" in data:
                todo["due_date"] = data["due_date"]
            return jsonify(todo)
    return jsonify({"error": "Not found"}), 404

@app.route("/todos/<int:todo_id>", methods=["DELETE"])
def delete_todo(todo_id):
    global todos
    todos = [t for t in todos if t["id"] != todo_id]
    return jsonify({"success": True})

if __name__ == "__main__":
    app.run(debug=True)