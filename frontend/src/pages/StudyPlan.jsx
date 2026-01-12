import { useEffect, useState } from "react";
import api from "../services/api";
import WeeklyProgress from "../components/WeeklyProgress";

export default function StudyPlan({ setIsAuth }) {
  // BASIC STATES
  const [subject, setSubject] = useState("");
  const [hours, setHours] = useState("");
  const [plans, setPlans] = useState([]);

  // SMART PLAN STATES
  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [smartPlan, setSmartPlan] = useState(null);
  const [loadingPlan, setLoadingPlan] = useState(false);

  // AI TIMETABLE STATES
  const [timetable, setTimetable] = useState(null);
  const [loadingTimetable, setLoadingTimetable] = useState(false);

  // =========================
  // FETCH SAVED BASIC PLANS
  // =========================
  const fetchPlans = async () => {
    try {
      const res = await api.get("/study/");
      setPlans(res.data);
    } catch (err) {
      console.error("Failed to fetch plans");
    }
  };

  // =========================
  // LOAD SAVED AI TIMETABLE
  // =========================
  const loadSavedTimetable = async () => {
    try {
      const res = await api.get("/ai-timetable/latest");
      if (res.data) {
        setTimetable(res.data.timetable);
        setSubject(res.data.subject);
      }
    } catch (err) {
      console.log("No saved timetable");
    }
  };

  // =========================
  // CREATE BASIC STUDY PLAN
  // =========================
  const createPlan = async () => {
    if (!subject || !hours) return;

    try {
      await api.post("/study/", { subject, hours });
      setSubject("");
      setHours("");
      fetchPlans();
    } catch {
      alert("Failed to save study plan");
    }
  };

  // =========================
  // SMART RULE-BASED PLAN
  // =========================
  const getSmartPlan = async () => {
    if (!subject || !hours || !category || !difficulty) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoadingPlan(true);
      const res = await api.post("/smart-plan/", {
        subject,
        hours,
        category,
        difficulty,
      });
      setSmartPlan(res.data);
    } catch {
      alert("Failed to generate AI timetable");
    } finally {
      setLoadingPlan(false);
    }
  };

  // =========================
  // AI WEEKLY TIMETABLE
  // =========================
  const getAITimetable = async () => {
  if (!subject || !hours || !category || !difficulty) {
    alert("Fill all fields first");
    return;
  }

  try {
    setLoadingTimetable(true);

    const res = await api.post("/ai-timetable/", {
      subject,
      hours,
      category,
      difficulty,
    });

    // ✅ IMPORTANT: check data safely
    if (res.data && res.data.timetable) {
      setTimetable(res.data.timetable);
    } else {
      throw new Error("Invalid timetable response");
    }

  } catch (err) {
    console.error(err);
    alert("Failed to generate AI timetable");
  } finally {
    setLoadingTimetable(false);
  }
};


  // =========================
  // INITIAL LOAD
  // =========================
  useEffect(() => {
    fetchPlans();
    loadSavedTimetable();
  }, []);

  return (
    <div className="container">
      {/* HEADER */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>Smart Learning Planner</h2>

        <button
          onClick={() => {
            localStorage.removeItem("token");
            setIsAuth(false);
          }}
          style={{
            background: "#ef4444",
            color: "white",
            padding: "8px 14px",
            borderRadius: "6px",
            fontWeight: "bold",
            border: "none",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>

      <div className="dashboard">
        {/* LEFT */}
        <div>
          {/* CREATE PLAN */}
          <div className="card">
            <h3>Create Study Plan</h3>

            <input
              placeholder="Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />

            <input
              type="number"
              placeholder="Hours per week"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
            />

            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="">Subject Type</option>
              <option value="theory">Theory</option>
              <option value="problem">Problem Solving</option>
              <option value="practical">Practical / Coding</option>
            </select>

            <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
              <option value="">Difficulty</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>

            <div style={{ marginTop: "10px" }}>
              <button onClick={createPlan}>Add Plan</button>

              <button
                style={{ marginLeft: "10px", background: "#1e40af", color: "white" }}
                onClick={getSmartPlan}
              >
                Smart Plan
              </button>

              <button
                style={{ marginLeft: "10px", background: "#0f172a", color: "white" }}
                onClick={getAITimetable}
              >
                AI Timetable 📅
              </button>
            </div>
          </div>

          {/* SMART PLAN OUTPUT */}
          {loadingPlan && <p>Generating smart plan...</p>}

          {smartPlan && (
            <div className="card">
              <h3>Recommended Study Plan</h3>
              {Object.entries(smartPlan.breakdown).map(([k, v]) => (
                <p key={k}><strong>{k}</strong>: {v} hrs</p>
              ))}
              <p><strong>Daily:</strong> {smartPlan.daily_suggestion}</p>
              <ul>
                {smartPlan.tips.map((tip, i) => (
                  <li key={i}>{tip}</li>
                ))}
              </ul>
            </div>
          )}

          {/* AI TIMETABLE */}
          {loadingTimetable && <p>Generating AI timetable...</p>}

          {timetable && (
            <div className="card">
              <h3>AI Weekly Timetable</h3>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                  gap: "12px",
                  marginTop: "12px",
                }}
              >
                {Object.entries(timetable).map(([day, tasks]) => (
                  <div
                    key={day}
                    style={{
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      padding: "10px",
                      background: "#f8fafc",
                    }}
                  >
                    <h4>{day}</h4>
                    <ul>
                      {tasks.map((task, i) => (
                        <li key={i}>{task}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SAVED PLANS */}
          <div className="card">
            <h3>Your Saved Plans</h3>
            {plans.length === 0 && <p>No plans yet</p>}
            {plans.map((p) => (
              <p key={p.id}>{p.subject} — {p.hours} hrs</p>
            ))}
          </div>
        </div>

        {/* RIGHT */}
        <div>
          <WeeklyProgress />
        </div>
      </div>
    </div>
  );
}
