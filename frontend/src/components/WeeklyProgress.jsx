import { useEffect, useState } from "react";
import api from "../services/api";

export default function WeeklyProgress() {
  const [hours, setHours] = useState(0);

  const goal = 40; // weekly goal

  useEffect(() => {
    api.get("/progress/weekly").then((res) => {
      setHours(res.data.total_hours);
    });
  }, []);

  const percentage = Math.min((hours / goal) * 100, 100);

  return (
    <div className="card">
      <h3>Weekly Progress</h3>

      <p style={{ fontSize: "28px", color: "#2563eb", margin: "5px 0" }}>
        {hours} hrs
      </p>

      <small>Goal: {goal} hrs / week</small>

      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${percentage}%` }}
        />
      </div>

      <p style={{ marginTop: "8px" }}>
        {percentage.toFixed(0)}% completed
      </p>
    </div>
  );
}
