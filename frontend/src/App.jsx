import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import Welcome from "./pages/Welcome";
import LoginPage from "./pages/LoginPage";
import AdminPage from "./pages/admin/AdminPage";
import Forbidden from "./pages/Forbidden";
import NotFound from "./pages/NotFound";

import RequireAuth from "./features/auth/RequireAuth";
import EngineerPage from "./pages/EngineerPage";
import ForemanDashboard from "./pages/ShiftSupervisorPage";

import WorkerDashboard from "./pages/TechnicianPage";
import WorkerTaskDetail from "./pages/WorkerTaskDetail";
import TestPage from "./pages/TestPage";
import ProtectedPageLayout from "./layouts/ProtectedPageLayout";
import UserForm from "./components/UserForm";
import EditUserPage from "./pages/admin/EditUserPage";
import CreateUserPage from "./pages/admin/CreateUserPage";

import AuthProvider from "./features/auth/AuthProvider";
import { useSelector } from "react-redux";
import Home from "./pages/Home";
import DispatcherDataPage from "./pages/flight-dispatcher/DispatcherDataPage";
import EngineerPackagesPage from "./pages/engineer/EngineerPackagesPage";
import EngineerAllEvents from "./pages/engineer/EngineerAllEvents";
import AssignWorkersPage from "./pages/shift-supervisor/AssignWorkersPage";
import SupervisorDashboard from "./pages/shift-supervisor/SupervisorDashboard";
import TurnaroundDetails from "./pages/shift-supervisor/TurnarounDetails";
import ScrollToTop from "./components/ScrollToTop";

function App() {
  console.log("app init");
  const role = useSelector((state) => state.auth.role);
  console.log("Navigation role", role);

  return (
    // <div className="container w-full h-screen bg-amber-50">
    <div className="wrapper">
      <AuthProvider>
        <ScrollToTop />
        <Routes>
          {/* Загальні сторінки */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/home" element={<Home />} />
          {/* <Route path="/" element={role ? <Navigate to={`/${role}`} replace /> : <Navigate to="/login" replace />} /> */}
          {/* <Route path="/" element={<Welcome />} /> */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forbidden" element={<Forbidden />} />
          {/* <Route path="/unauthorized" element={<Unauthorized />} /> */}

          {/* Захищені маршрути */}
          <Route element={<RequireAuth allowedRoles={["admin"]} />}>
            <Route path="/admin" element={<ProtectedPageLayout />}>
              <Route index element={<AdminPage />} />
              <Route path="users/edit/:id" element={<EditUserPage />} />
              <Route path="users/create" element={<CreateUserPage />} />

              {/* <Route index element={<Navigate to="users" />} />
            <Route path="users" element={<AdminPage />} /> */}
              {/* <Route path="tasks" element={<UserForm />} /> */}
              {/* <Route path="tasks" element={<EngineerPage />} /> */}
              {/* <Route path="tasks" element={<DispatcherPage />} /> */}

              <Route path="tasks" element={<ForemanDashboard />} />
              {/* <Route path="tasks" element={<AssignTaskPage />} /> */}
              {/* <Route path="tasks" element={<WorkerDashboard />} /> */}
              {/* <Route path="tasks" element={<WorkerTaskDetail />} /> */}

              {/* <Route path="users" element={<UserList />} /> */}
              {/* <Route path="users/:id/edit" element={<EditUser />} /> */}
            </Route>
          </Route>

          <Route element={<RequireAuth allowedRoles={["engineer"]} />}>
            <Route path="/engineer" element={<ProtectedPageLayout />}>
              {/* <Route index element={<EngineerPage />} /> */}
              <Route index element={<EngineerPackagesPage />} />
              <Route path="events-all" element={<EngineerAllEvents />} />
            </Route>
          </Route>

          <Route element={<RequireAuth allowedRoles={["flight dispatcher"]} />}>
            <Route path="/flight-dispatcher" element={<ProtectedPageLayout />}>
              <Route index element={<DispatcherDataPage />} />
            </Route>
          </Route>

          <Route element={<RequireAuth allowedRoles={["shift supervisor"]} />}>
            <Route path="/shift-supervisor" element={<ProtectedPageLayout />}>
              {/* <Route index element={<ForemanDashboard />} /> */}
              <Route index element={<SupervisorDashboard />} />
              <Route path="turnaround/:turnaroundId" element={<TurnaroundDetails />} />
              {/* <Route path="turnaround:turnaroundId" element={<TurnaroundDetails />} /> */}
              {/* <Route path="turnaround/:id/assign-tasks/:taskId" element={<AssignWorkersPage />} /> */}
              <Route path="turnaround/:turnaroundId/package/:packageId/task/:taskId" element={<AssignWorkersPage />} />
            </Route>
          </Route>

          <Route element={<RequireAuth allowedRoles={["technician"]} />}>
            <Route path="/technician" element={<ProtectedPageLayout />}>
              <Route index element={<WorkerDashboard />} />
              {/* <Route index element={<WorkerTaskDetail />} /> */}
            </Route>
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </div>
  );
}

export default App;
