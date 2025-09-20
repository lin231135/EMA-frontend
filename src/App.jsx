import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { LoginForm } from "./components/forms";
import Register from "./components/pages/Register";
import { Home, About, Profile, Settings, Contact } from "./components/pages";
import Schedule from "./components/pages/Schedule";
import { AuthProvider } from "./contexts/AuthContext";
import PreRegisterForm from "./components/forms/PreRegisterForm";
import StudentDashboard from "./components/pages/student/StudentDashboard";
import StudentCalendar from "./components/pages/student/StudentCalendar";
import StudentHistoryPayments from "./components/pages/student/StudentHistoryPayments";
import ParentDashboard from "./components/pages/parent/ParentDashboard";
import AdminDashboard from "./components/pages/admin/AdminDashboard";
import StudentListReport from "./components/pages/admin/StudentListReport";
import ParentCalendar from "./components/pages/parent/ParentCalendar";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      {/* Parent */}
      <Route path="/parent/ParentCalendar" element={<ParentCalendar />} />
      <Route path="/parent/ParentDashboard" element={<ParentDashboard />} />

      <Route path="/parent/calendar" element={<Navigate to="/parent/ParentCalendar" replace />} />
      <Route path="/parent/dashboard" element={<Navigate to="/parent/ParentDashboard" replace />} />

      {/* Admin */}
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/student-list-report" element={<StudentListReport />} />

      {/* Student */}
      <Route path="/student/StudentDashboard" element={<StudentDashboard />} />
      <Route path="/student/StudentCalendar" element={<StudentCalendar />} />
      <Route path="/student/payments" element={<StudentHistoryPayments />} />
      <Route path="/student/StudentHistoryPayments" element={<StudentHistoryPayments />} />

      {/* Varios */}
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/register" element={<Register />} />
      <Route path="/schedule" element={<Schedule />} />
      <Route path="/preregister" element={<PreRegisterForm />} />

      {/* 404 → home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;