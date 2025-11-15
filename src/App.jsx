import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { LoginForm } from "./components/forms";
import Register from "./components/pages/Register";
import { Home, About, Settings, Contact } from "./components/pages";
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
import AdminPayment from "./components/pages/admin/AdminPayment";
import AdminPaymentsManagement from "./components/pages/admin/AdminPaymentsManagement";
import Profile from "./components/pages/app/Profile";
import Service from "./components/pages/Service";
import ParentProfileSelect from "./components/pages/parent/ParentProfileSelect";
import ScrollToTop from "./components/ui/ScrollToTop";
import PaymentForm from "./components/forms/PaymentForm";
import StudentPayment from "./components/pages/student/StudentPayment";
import ParentPayment from "./components/pages/parent/ParentPayment";
import ParentHistoryPayments from "./components/pages/parent/ParentHistoryPayments";
import HistoryPayments from "./components/pages/app/HistoryPayments";
import Enrollment from "./components/pages/app/Enrollment.jsx";
import StudentEnrollment from "./components/pages/student/StudentEnrollment";
import ParentEnrollment from "./components/pages/parent/ParentEnrollment";
import StudentEnrollmentSchedule from "./components/pages/student/StudentEnrollmentSchedule";
import ParentEnrollmentSchedule from "./components/pages/parent/ParentEnrollmentSchedule";
import ParentEnrollmentChild from "./components/pages/parent/ParentEnrollmentChild";
import StudentEnrollmentPayment from "./components/pages/student/StudentEnrollmentPayment";
import ParentEnrollmentPayment from "./components/pages/parent/ParentEnrollmentPayment";
import StudentEnrollmentConfirm from "./components/pages/student/StudentEnrollmentConfirm";
import ParentEnrollmentConfirm from "./components/pages/parent/ParentEnrollmentConfirm";
import Material from "./components/pages/teacher/Materials.jsx";
import TeacherDashboard from "./components/pages/teacher/TeacherDashboard.jsx";
import TeacherDashboard2 from "./components/pages/teacher/TeacherDashboard2.jsx";
import TeacherCalendar from "./components/pages/teacher/TeacherCalendar.jsx";
import TeacherStudentsList from "./components/pages/teacher/TeacherStudentsList.jsx";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      {/* Parent */}
      <Route path="/parent/ParentProfileSelect" element={<ParentProfileSelect />} />
      <Route path="/parent/dashboard" element={<ParentDashboard />} />
      <Route path="/parent/payment" element={<ParentPayment />} />
      <Route path="/parent/calendar" element={<ParentCalendar />} />
      <Route path="/parent/enrollment" element={<ParentEnrollment />} />
      <Route path="/parent/enrollment/child" element={<ParentEnrollmentChild />} />
      <Route path="/parent/enrollment/schedule" element={<ParentEnrollmentSchedule />} />
      <Route path="/parent/enrollment/payment" element={<ParentEnrollmentPayment />} />
      <Route path="/parent/enrollment/confirm" element={<ParentEnrollmentConfirm />} />
      <Route path="/parent/profile" element={<Profile />} />
      <Route path="/parent/historyPayments" element={<ParentHistoryPayments />} />

      {/* Admin */}
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/student-list-report" element={<StudentListReport />} />
      <Route path="/admin/payments" element={<AdminPaymentsManagement />} />
      <Route path="/admin/payments/create" element={<AdminPayment />} />
      <Route path="/admin/profile" element={<Profile />} />

      {/* Student */}
      <Route path="/student/dashboard/:studentId" element={<StudentDashboard />} />
      <Route path="/student/calendar" element={<StudentCalendar />} />
      {/* <Route path="/student/payments" element={<StudentHistoryPayments />} /> */}
      <Route path="/student/historyPayments" element={<StudentHistoryPayments />} />
      <Route path="/student/payment" element={<StudentPayment />} />
      <Route path="/student/enrollment" element={<StudentEnrollment />} />
      <Route path="/student/enrollment/schedule" element={<StudentEnrollmentSchedule />} />
      <Route path="/student/enrollment/payment" element={<StudentEnrollmentPayment />} />
      <Route path="/student/enrollment/confirm" element={<StudentEnrollmentConfirm />} />
      <Route path="/student/profile" element={<Profile />} />

      {/* Teacher */}
      <Route path="/teacher/materials" element={<Material />} />
      <Route path="/teacher/dashboard" element={<TeacherDashboard2 />} />
      <Route path="/teacher/students-list" element={<TeacherStudentsList />} />
      <Route path="/teacher/calendar" element={<TeacherCalendar />} />
      <Route path="/teacher/profile" element={<Profile />} />


      {/* Varios */}
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/register" element={<Register />} />
      <Route path="/schedule" element={<Schedule />} />
      <Route path="/preregister" element={<PreRegisterForm />} />
      <Route path="/service" element={<Service />} />
      <Route path="/paymentForm" element={<PaymentForm />} />
      <Route path="/historyPayments" element={<HistoryPayments />} />
      <Route path="/enrollment" element={<Enrollment />} />

      {/* 404 → home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop /> 
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;