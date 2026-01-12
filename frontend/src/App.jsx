import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import StudyPlan from "./pages/StudyPlan";

function App() {
  const [isAuth, setIsAuth] = useState(
    Boolean(localStorage.getItem("token"))
  );

  return (
    <BrowserRouter>
      <Routes>

        <Route
          path="/login"
          element={
            isAuth
              ? <Navigate to="/study" replace />
              : <Login setIsAuth={setIsAuth} />
          }
        />

        <Route
          path="/signup"
          element={
            isAuth
              ? <Navigate to="/study" replace />
              : <Signup />
          }
        />

        <Route
          path="/study"
          element={
            isAuth
              ? <StudyPlan setIsAuth={setIsAuth} />
              : <Navigate to="/login" replace />
          }
        />

        <Route
          path="/"
          element={<Navigate to={isAuth ? "/study" : "/login"} replace />}
        />

        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
