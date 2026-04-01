import { useState, useEffect } from "react";

const API = "http://localhost:5000";

export default function App() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    fetch(`${API}/todos`)
      .then((r) => r.json())
      .then(setTodos);
  }, []);

  const addTodo = async () => {
    if (!input.trim()) return;
    const res = await fetch(`${API}/todos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: input }),
    });
    const todo = await res.json();
    setTodos([...todos, todo]);
    setInput("");
  };

  const toggleTodo = async (id) => {
    const res = await fetch(`${API}/todos/${id}`, { method: "PUT" });
    const updated = await res.json();
    setTodos(todos.map((t) => (t.id === id ? updated : t)));
  };

  const deleteTodo = async (id) => {
    await fetch(`${API}/todos/${id}`, { method: "DELETE" });
    setTodos(todos.filter((t) => t.id !== id));
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Todo List</h1>

      <div style={styles.inputRow}>
        <input
          style={styles.input}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTodo()}
          placeholder="Add new notes"
        />
        <button style={styles.addBtn} onClick={addTodo}>Add</button>
      </div>

      <ul style={styles.list}>
        {todos.map((todo) => (
          <li key={todo.id} style={styles.item}>
            <span
              onClick={() => toggleTodo(todo.id)}
              style={{ ...styles.text, textDecoration: todo.done ? "line-through" : "none", opacity: todo.done ? 0.4 : 1 }}
            >
              {todo.text}
            </span>
            <button style={styles.deleteBtn} onClick={() => deleteTodo(todo.id)}>✕</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

const styles = {
  container: { maxWidth: 480, margin: "60px auto", fontFamily: "sans-serif", padding: "0 16px" },
  title: { fontSize: 28, marginBottom: 24 },
  inputRow: { display: "flex", gap: 8, marginBottom: 24 },
  input: { flex: 1, padding: "10px 14px", fontSize: 15, border: "1px solid #ddd", borderRadius: 8, outline: "none" },
  addBtn: { padding: "10px 20px", background: "#3b82f6", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 15 },
  list: { listStyle: "none", padding: 0, margin: 0 },
  item: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid #f0f0f0" },
  text: { cursor: "pointer", fontSize: 15, flex: 1 },
  deleteBtn: { background: "none", border: "none", color: "#999", cursor: "pointer", fontSize: 16, padding: "0 4px" },
};
