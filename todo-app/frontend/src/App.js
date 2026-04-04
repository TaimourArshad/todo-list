import { useState, useEffect } from "react";

const API = "http://localhost:5000";

const PRIORITIES = ["High", "Medium", "Low"];
const CATEGORIES = ["General", "Work", "Personal", "Shopping", "Health"];

const PRIORITY_COLORS = {
  High: { bg: "#fee2e2", text: "#dc2626", border: "#fca5a5" },
  Medium: { bg: "#fef9c3", text: "#ca8a04", border: "#fde047" },
  Low: { bg: "#dcfce7", text: "#16a34a", border: "#86efac" },
};

export default function App() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [category, setCategory] = useState("General");
  const [dueDate, setDueDate] = useState("");
  const [search, setSearch] = useState("");
  const [filterPriority, setFilterPriority] = useState("All");
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    fetch(`${API}/todos`).then(r => r.json()).then(setTodos);
  }, []);

  const theme = {
    bg: darkMode ? "#1a1a2e" : "#f8fafc",
    card: darkMode ? "#16213e" : "#ffffff",
    text: darkMode ? "#e2e8f0" : "#1e293b",
    subtext: darkMode ? "#94a3b8" : "#64748b",
    border: darkMode ? "#334155" : "#e2e8f0",
    input: darkMode ? "#0f3460" : "#f1f5f9",
    inputText: darkMode ? "#e2e8f0" : "#1e293b",
  };

  const addTodo = async () => {
    if (!input.trim()) return;
    const res = await fetch(`${API}/todos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: input, priority, category, due_date: dueDate }),
    });
    const todo = await res.json();
    setTodos([...todos, todo]);
    setInput("");
    setDueDate("");
  };

  const toggleTodo = async (id) => {
    const todo = todos.find(t => t.id === id);
    const res = await fetch(`${API}/todos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ done: !todo.done }),
    });
    const updated = await res.json();
    setTodos(todos.map(t => t.id === id ? updated : t));
  };

  const deleteTodo = async (id) => {
    await fetch(`${API}/todos/${id}`, { method: "DELETE" });
    setTodos(todos.filter(t => t.id !== id));
  };

  const saveEdit = async (id) => {
    const res = await fetch(`${API}/todos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: editText }),
    });
    const updated = await res.json();
    setTodos(todos.map(t => t.id === id ? updated : t));
    setEditingId(null);
  };

  const filtered = todos.filter(t => {
    const matchSearch = t.text.toLowerCase().includes(search.toLowerCase());
    const matchPriority = filterPriority === "All" || t.priority === filterPriority;
    const matchCategory = filterCategory === "All" || t.category === filterCategory;
    const matchStatus = filterStatus === "All" || (filterStatus === "Done" ? t.done : !t.done);
    return matchSearch && matchPriority && matchCategory && matchStatus;
  });

  const sel = { padding: "8px 12px", borderRadius: 8, border: `1px solid ${theme.border}`, background: theme.input, color: theme.inputText, fontSize: 14, cursor: "pointer" };

  return (
    <div style={{ minHeight: "100vh", background: theme.bg, padding: "40px 16px", transition: "all 0.3s" }}>
      <div style={{ maxWidth: 680, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
          <div>
            <h1 style={{ fontSize: 32, fontWeight: 800, color: theme.text, margin: 0 }}>My Todo List</h1>
            <p style={{ color: theme.subtext, margin: "4px 0 0", fontSize: 14 }}>
              {todos.filter(t => !t.done).length} tasks remaining
            </p>
          </div>
          <button onClick={() => setDarkMode(!darkMode)} style={{ padding: "8px 16px", borderRadius: 20, border: "none", background: darkMode ? "#e2e8f0" : "#1e293b", color: darkMode ? "#1e293b" : "#e2e8f0", cursor: "pointer", fontSize: 14, fontWeight: 600 }}>
            {darkMode ? "☀️ Light" : "🌙 Dark"}
          </button>
        </div>

        {/* Add Todo Form */}
        <div style={{ background: theme.card, borderRadius: 16, padding: 24, marginBottom: 24, boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}>
          <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
            <input
              style={{ flex: 1, padding: "10px 14px", borderRadius: 8, border: `1px solid ${theme.border}`, background: theme.input, color: theme.inputText, fontSize: 15, outline: "none" }}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && addTodo()}
              placeholder="Add a new task..."
            />
            <button onClick={addTodo} style={{ padding: "10px 20px", background: "#3b82f6", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 15, fontWeight: 600 }}>
              Add
            </button>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <select style={sel} value={priority} onChange={e => setPriority(e.target.value)}>
              {PRIORITIES.map(p => <option key={p}>{p}</option>)}
            </select>
            <select style={sel} value={category} onChange={e => setCategory(e.target.value)}>
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
            <input
              type="date"
              style={{ ...sel, cursor: "pointer" }}
              value={dueDate}
              onChange={e => setDueDate(e.target.value)}
            />
          </div>
        </div>

        {/* Search and Filters */}
        <div style={{ background: theme.card, borderRadius: 16, padding: 20, marginBottom: 24, boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}>
          <input
            style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: `1px solid ${theme.border}`, background: theme.input, color: theme.inputText, fontSize: 15, outline: "none", boxSizing: "border-box", marginBottom: 12 }}
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="🔍 Search tasks..."
          />
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <select style={sel} value={filterPriority} onChange={e => setFilterPriority(e.target.value)}>
              <option value="All">All Priorities</option>
              {PRIORITIES.map(p => <option key={p}>{p}</option>)}
            </select>
            <select style={sel} value={filterCategory} onChange={e => setFilterCategory(e.target.value)}>
              <option value="All">All Categories</option>
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
            <select style={sel} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
              <option value="Allllllllll">All Status</option>
              <option value="Active">Active</option>
              <option value="Done">Done</option>
            </select>
          </div>
        </div>

        {/* Todo List */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {filtered.length === 0 && (
            <div style={{ textAlign: "center", color: theme.subtext, padding: 40, background: theme.card, borderRadius: 16 }}>
              No tasks found
            </div>
          )}
          {filtered.map(todo => {
            const pc = PRIORITY_COLORS[todo.priority];
            const isOverdue = todo.due_date && new Date(todo.due_date) < new Date() && !todo.done;
            return (
              <div key={todo.id} style={{ background: theme.card, borderRadius: 12, padding: 16, boxShadow: "0 2px 8px rgba(0,0,0,0.06)", borderLeft: `4px solid ${pc.border}`, opacity: todo.done ? 0.6 : 1, transition: "all 0.2s" }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                  <input type="checkbox" checked={todo.done} onChange={() => toggleTodo(todo.id)} style={{ width: 18, height: 18, cursor: "pointer", marginTop: 2 }} />
                  <div style={{ flex: 1 }}>
                    {editingId === todo.id ? (
                      <div style={{ display: "flex", gap: 8 }}>
                        <input
                          style={{ flex: 1, padding: "6px 10px", borderRadius: 6, border: `1px solid ${theme.border}`, background: theme.input, color: theme.inputText, fontSize: 15 }}
                          value={editText}
                          onChange={e => setEditText(e.target.value)}
                          onKeyDown={e => e.key === "Enter" && saveEdit(todo.id)}
                          autoFocus
                        />
                        <button onClick={() => saveEdit(todo.id)} style={{ padding: "6px 12px", background: "#22c55e", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer" }}>Save</button>
                        <button onClick={() => setEditingId(null)} style={{ padding: "6px 12px", background: "#94a3b8", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer" }}>Cancel</button>
                      </div>
                    ) : (
                      <span style={{ fontSize: 15, color: theme.text, textDecoration: todo.done ? "line-through" : "none" }}>{todo.text}</span>
                    )}
                    <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap", alignItems: "center" }}>
                      <span style={{ fontSize: 12, padding: "2px 8px", borderRadius: 20, background: pc.bg, color: pc.text, fontWeight: 600 }}>{todo.priority}</span>
                      <span style={{ fontSize: 12, padding: "2px 8px", borderRadius: 20, background: theme.input, color: theme.subtext }}>{todo.category}</span>
                      {todo.due_date && (
                        <span style={{ fontSize: 12, padding: "2px 8px", borderRadius: 20, background: isOverdue ? "#fee2e2" : theme.input, color: isOverdue ? "#dc2626" : theme.subtext }}>
                          {isOverdue ? "⚠️ " : "📅 "}{todo.due_date}
                        </span>
                      )}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button onClick={() => { setEditingId(todo.id); setEditText(todo.text); }} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 16, padding: "2px 4px" }}>✏️</button>
                    <button onClick={() => deleteTodo(todo.id)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 16, padding: "2px 4px" }}>🗑️</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}