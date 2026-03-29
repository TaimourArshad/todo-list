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
    todo = {"id": next_id, "text": data["text"], "done": False}
    todos.append(todo)
    next_id += 1
    return jsonify(todo), 201

@app.route("/todos/<int:todo_id>", methods=["PUT"])
def toggle_todo(todo_id):
    for todo in todos:
        if todo["id"] == todo_id:
            todo["done"] = not todo["done"]
            return jsonify(todo)
    return jsonify({"error": "Not found"}), 404

@app.route("/todos/<int:todo_id>", methods=["DELETE"])
def delete_todo(todo_id):
    global todos
    todos = [t for t in todos if t["id"] != todo_id]
    return jsonify({"success": True})

if __name__ == "__main__":
    app.run(debug=True)
