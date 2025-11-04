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
import esHistoryPayment from "./es/app/HistoryPayment";
import esAddClassModal from "./es/AddClassModal";
import esStudentDashboard from "./es/student/StudentDashboard";
import esAdminDashboard from "./es/admin/AdminDashboard";
import esStudentActionModals from "./es/admin/studentActionModals";
import { paymentsManagement as esPaymentsManagement } from "./es/paymentsManagement";
import esStudentProfile from "./es/student/StudentProfile";
import esParentDashboard from "./es/parent/ParentDashboard";
import esParentNavbar from "./es/parent/ParentNavbar";
import esParentSidebar from "./es/parent/ParentSidebar";
import esParentCalendar from "./es/parent/ParentCalendar";
import esParentProfileSelect from "./es/parent/ParentProfileSelect";
import esCharts from "./es/charts";
import esService from "./es/service";
import esPaymentForm from "./es/form/PaymentForm";
import esProfile from "./es/app/Profile";
import esChildrenManagement from "./es/childrenManagement";
import esInscription from "./es/app/Inscripcion";

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
import enHistoryPayment from "./en/app/HistoryPayment";
import enAddClassModal from "./en/AddClassModal";
import enStudentDashboard from "./en/student/StudentDashboard";
import enAdminDashboard from "./en/admin/AdminDashboard";
import enStudentActionModals from "./en/admin/studentActionModals";
import { paymentsManagement as enPaymentsManagement } from "./en/paymentsManagement";
import enStudentProfile from "./en/student/StudentProfile";
import enParentDashboard from "./en/parent/ParentDashboard";
import enParentNavbar from "./en/parent/ParentNavbar";
import enParentSidebar from "./en/parent/ParentSidebar";
import enParentCalendar from "./en/parent/ParentCalendar";
import enParentProfileSelect from "./en/parent/ParentProfileSelect";
import enCharts from "./en/charts";
import enService from "./en/service";
import enPaymentForm from "./en/form/PaymentForm";
import enProfile from "./en/app/Profile";
import enChildrenManagement from "./en/childrenManagement";
import enInscription from "./en/app/Inscripcion";


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
    historyPayments: esHistoryPayment,
    addClassModal: esAddClassModal,
    studentDashboard: esStudentDashboard,
    adminDashboard: esAdminDashboard,
    studentActionModals: esStudentActionModals,
    paymentsManagement: esPaymentsManagement,
    studentProfile: esStudentProfile,
    parentDashboard: esParentDashboard,
    parentNavbar: esParentNavbar,
    parentSidebar: esParentSidebar,
    parentCalendar: esParentCalendar,
    profiles: esParentProfileSelect.profiles,
    charts: esCharts,
    service: esService,
    paymentForm: esPaymentForm,
    profile: esProfile,
    childrenManagement: esChildrenManagement,
    enrollment: esInscription,
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
    historyPayments: enHistoryPayment,
    addClassModal: enAddClassModal,
    studentDashboard: enStudentDashboard,
    adminDashboard: enAdminDashboard,
    studentActionModals: enStudentActionModals,
    paymentsManagement: enPaymentsManagement,
    studentProfile: enStudentProfile,
    parentDashboard: enParentDashboard,
    parentNavbar: enParentNavbar,
    parentSidebar: enParentSidebar,
    parentCalendar: enParentCalendar,
    profiles: enParentProfileSelect.profiles,
    charts: enCharts,
    service: enService,
    paymentForm: enPaymentForm,
    profile: enProfile,
    childrenManagement: enChildrenManagement,
    enrollment: enInscription,
  },
};

export default translations;
