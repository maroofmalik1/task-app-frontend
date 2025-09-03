import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const nav = useNavigate();

  const fetchTasks = async () => {
    try {
      const res = await API.get("/tasks");
      setTasks(res.data);
    } catch {
      nav("/login");
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const addTask = async (e) => {
    e.preventDefault();
    if (!title) return;
    const res = await API.post("/tasks", { title, description: desc });
    setTasks([res.data, ...tasks]);
    setTitle("");
    setDesc("");
  };

  const toggleTask = async (id) => {
    const res = await API.patch(`/tasks/${id}/toggle`);
    setTasks(tasks.map((t) => (t._id === id ? res.data : t)));
  };

  const deleteTask = async (id) => {
    await API.delete(`/tasks/${id}`);
    setTasks(tasks.filter((t) => t._id !== id));
  };

  const logout = () => {
    localStorage.removeItem("token");
    nav("/login");
  };

  return (
    <div className="container">
      <h1>Your Tasks</h1>
      <form onSubmit={addTask}>
        <input
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          placeholder="Description"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />
        <button>Add Task</button>
      </form>

      <ul className="task-list">
        {tasks.map((t) => (
          <li key={t._id} className={`task-item ${t.completed ? "done" : ""}`}>
            <span>{t.title}</span>
            <div className="task-actions">
              <button onClick={() => toggleTask(t._id)}>
                {t.completed ? "Undo" : "Done"}
              </button>
              <button onClick={() => deleteTask(t._id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>

      <button onClick={logout} className="logout-btn" style={{ marginTop: "1rem" }}>
        Logout
      </button>
    </div>
  );
}
