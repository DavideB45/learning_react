function TaskCompleted({ state }) {
  const isCompleted = state === true || state === "completed";

  const color = isCompleted ? "green" : "red";
  const text = isCompleted ? "Task completed" : "Task not completed";

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <span
        style={{
          width: "12px",
          height: "12px",
          borderRadius: "50%",
          backgroundColor: color,
          display: "inline-block",
        }}
      />
      <span>{text}</span>
    </div>
  );
}

export default TaskCompleted