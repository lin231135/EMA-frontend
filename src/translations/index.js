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
import esStudentHistoryPayment from "./es/student/StudentHistoryPayment";
import esAddClassModal from "./es/AddClassModal";
import esStudentDashboard from "./es/student/StudentDashboard";
import esAdminDashboard from "./es/admin/AdminDashboard";
import esAdminPayment from "./es/admin/AdminPayment";

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
import enStudentHistoryPayment from "./en/student/StudentHistoryPayment";
import enAddClassModal from "./en/AddClassModal";
import enStudentDashboard from "./en/student/StudentDashboard";
import enAdminDashboard from "./en/admin/AdminDashboard";
import enAdminPayment from "./en/admin/AdminPayment";

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
    studentHistoryPayment: esStudentHistoryPayment,
    addClassModal: esAddClassModal,
    studentDashboard: esStudentDashboard,
    adminDashboard: esAdminDashboard,
    adminPayment: esAdminPayment,
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
    studentHistoryPayment: enStudentHistoryPayment,
    addClassModal: enAddClassModal,
    studentDashboard: enStudentDashboard,
    adminDashboard: enAdminDashboard,
    adminPayment: enAdminPayment,
  },
};

export default translations;
