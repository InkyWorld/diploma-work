import { Navigate, Route, Routes } from "react-router-dom";
import Welcome from "./pages/Welcome";
import LoginPage from "./pages/LoginPage";
import AdminPage from "./pages/AdminPage";
import Forbidden from "./pages/Forbidden";
import NotFound from "./pages/NotFound";

import RequireAuth from "./features/auth/RequireAuth";
import EngineerPage from "./pages/EngineerPage";
import ForemanDashboard from "./pages/ShiftSupervisorPage";
import EngineerDashboard from "./pages/EngineerPage";
import DispatcherDashboard from "./pages/DispatcherPage";
import AssignTaskPage from "./pages/AssignTaskPage";
import WorkerDashboard from "./pages/TechnicianPage";
import WorkerTaskDetail from "./pages/WorkerTaskDetail";
import TestPage from "./pages/TestPage";
import ProtectedPageLayout from "./layouts/ProtectedPageLayout";

function App() {
  return (
    // <div className="container w-full h-screen bg-amber-50">
    <div className="wrapper">
      <Routes>
        {/* Загальні сторінки */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forbidden" element={<Forbidden />} />
        {/* <Route path="/unauthorized" element={<Unauthorized />} /> */}

        {/* Захищені маршрути */}
        <Route element={<RequireAuth allowedRoles={["admin"]} />}>
          <Route path="/admin" element={<ProtectedPageLayout />}>
            <Route index element={<AdminPage />} />
            <Route path="tasks" element={<TestPage />} />
            {/* <Route path="tasks" element={<EngineerDashboard />} /> */}
            {/* <Route path="tasks" element={<DispatcherDashboard />} /> */}

            {/* <Route path="tasks" element={<ForemanDashboard />} /> */}
            {/* <Route path="tasks" element={<AssignTaskPage />} /> */}
            {/* <Route path="tasks" element={<WorkerDashboard />} /> */}
            {/* <Route path="tasks" element={<WorkerTaskDetail />} /> */}

            {/* <Route path="users" element={<UserList />} /> */}
            {/* <Route path="users/:id/edit" element={<EditUser />} /> */}
          </Route>
        </Route>

        <Route element={<RequireAuth allowedRoles={["engineer"]} />}>
          <Route path="/engineer" element={<EngineerPage />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
