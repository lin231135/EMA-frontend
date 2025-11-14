import esAbout from "./es/about";
import esCommon from "./es/common";
import esContact from "./es/contact";
import esHome from "./es/home";
import esSchedule from "./es/schedule";
import esPreregister from "./es/preregister";
import { register as esRegister } from "./es/register";
import { passwordModal as esPasswordModal } from "./es/passwordModal";
import { login as esLogin } from "./es/login";
import esStudentCalendar from "./es/student/StudentCalendar";
import esStudentDashboard from "./es/student/StudentDashboard";
import esStudentProfile from "./es/student/StudentProfile";
import esStudentSidebar from "./es/student/StudentSidebar";
import esStudentNavbar from "./es/student/StudentNavbar";
import esHistoryPayment from "./es/app/HistoryPayment";
import esAddClassModal from "./es/AddClassModal";
import esAdminDashboard from "./es/admin/AdminDashboard";
import esAdminSidebar from "./es/admin/AdminSidebar";
import esAdminNavbar from "./es/admin/AdminNavbar";
import esStudentActionModals from "./es/admin/studentActionModals";
import { paymentsManagement as esPaymentsManagement } from "./es/paymentsManagement";
import esParentDashboard from "./es/parent/ParentDashboard";
import esParentNavbar from "./es/parent/ParentNavbar";
import esParentSidebar from "./es/parent/ParentSidebar";
import esParentCalendar from "./es/parent/ParentCalendar";
import esParentProfileSelect from "./es/parent/ParentProfileSelect";
import esTeacherSidebar from "./es/teacher/TeacherSidebar";
import esTeacherNavbar from "./es/teacher/TeacherNavbar";
import esCharts from "./es/charts";
import esService from "./es/service";
import esPaymentForm from "./es/form/PaymentForm";
import esProfile from "./es/app/Profile";
import esChildrenManagement from "./es/childrenManagement";
import esInscription from "./es/app/Inscripcion";
import esWelcomeModal from "./es/WelcomeModal";
import esEnrollment from "./es/enrollment";

import enAbout from "./en/about";
import enCommon from "./en/common";
import enContact from "./en/contact";
import enHome from "./en/home";
import enSchedule from "./en/schedule";
import enPreregister from "./en/preregister";
import { register as enRegister } from "./en/register";
import { passwordModal as enPasswordModal } from "./en/passwordModal";
import { login as enLogin } from "./en/login";
import enStudentCalendar from "./en/student/StudentCalendar";
import enStudentDashboard from "./en/student/StudentDashboard";
import enStudentProfile from "./en/student/StudentProfile";
import enStudentSidebar from "./en/student/StudentSidebar";
import enStudentNavbar from "./en/student/StudentNavbar";
import enHistoryPayment from "./en/app/HistoryPayment";
import enAddClassModal from "./en/AddClassModal";
import enAdminDashboard from "./en/admin/AdminDashboard";
import enAdminSidebar from "./en/admin/AdminSidebar";
import enAdminNavbar from "./en/admin/AdminNavbar";
import enStudentActionModals from "./en/admin/studentActionModals";
import { paymentsManagement as enPaymentsManagement } from "./en/paymentsManagement";
import enParentDashboard from "./en/parent/ParentDashboard";
import enParentNavbar from "./en/parent/ParentNavbar";
import enParentSidebar from "./en/parent/ParentSidebar";
import enParentCalendar from "./en/parent/ParentCalendar";
import enParentProfileSelect from "./en/parent/ParentProfileSelect";
import enTeacherSidebar from "./en/teacher/TeacherSidebar";
import enTeacherNavbar from "./en/teacher/TeacherNavbar";
import enCharts from "./en/charts";
import enService from "./en/service";
import enPaymentForm from "./en/form/PaymentForm";
import enProfile from "./en/app/Profile";
import enChildrenManagement from "./en/childrenManagement";
import enInscription from "./en/app/Inscripcion";
import enWelcomeModal from "./en/WelcomeModal";
import enEnrollment from "./en/enrollment";


const translations = {
  es: {
    about: esAbout,
    common: esCommon,
    contact: esContact,
    home: esHome,
    schedule: esSchedule,
    preregister: esPreregister,
    register: esRegister,
    passwordModal: esPasswordModal,
    login: esLogin,
    studentCalendar: esStudentCalendar,
    studentDashboard: esStudentDashboard,
    studentProfile: esStudentProfile,
    studentSidebar: esStudentSidebar,
    studentNavbar: esStudentNavbar,
    historyPayments: esHistoryPayment,
    addClassModal: esAddClassModal,
    adminDashboard: esAdminDashboard,
    adminSidebar: esAdminSidebar,
    adminNavbar: esAdminNavbar,
    studentActionModals: esStudentActionModals,
    paymentsManagement: esPaymentsManagement,
    parentDashboard: esParentDashboard,
    parentNavbar: esParentNavbar,
    parentSidebar: esParentSidebar,
    parentCalendar: esParentCalendar,
    profiles: esParentProfileSelect.profiles,
    teacherSidebar: esTeacherSidebar,
    teacherNavbar: esTeacherNavbar,
    charts: esCharts,
    service: esService,
    paymentForm: esPaymentForm,
    profile: esProfile,
    childrenManagement: esChildrenManagement,
    enrollment: esInscription,
    welcomeModal: esWelcomeModal,
    enrollmentComponents: esEnrollment,
  },
  en: {
    about: enAbout,
    common: enCommon,
    contact: enContact,
    home: enHome,
    schedule: enSchedule,
    preregister: enPreregister,
    register: enRegister,
    passwordModal: enPasswordModal,
    login: enLogin,
    studentCalendar: enStudentCalendar,
    studentDashboard: enStudentDashboard,
    studentProfile: enStudentProfile,
    studentSidebar: enStudentSidebar,
    studentNavbar: enStudentNavbar,
    historyPayments: enHistoryPayment,
    addClassModal: enAddClassModal,
    adminDashboard: enAdminDashboard,
    adminSidebar: enAdminSidebar,
    adminNavbar: enAdminNavbar,
    studentActionModals: enStudentActionModals,
    paymentsManagement: enPaymentsManagement,
    parentDashboard: enParentDashboard,
    parentNavbar: enParentNavbar,
    parentSidebar: enParentSidebar,
    parentCalendar: enParentCalendar,
    profiles: enParentProfileSelect.profiles,
    teacherSidebar: enTeacherSidebar,
    teacherNavbar: enTeacherNavbar,
    charts: enCharts,
    service: enService,
    paymentForm: enPaymentForm,
    profile: enProfile,
    childrenManagement: enChildrenManagement,
    enrollment: enInscription,
    welcomeModal: enWelcomeModal,
    enrollmentComponents: enEnrollment,
  },
};

export default translations;
