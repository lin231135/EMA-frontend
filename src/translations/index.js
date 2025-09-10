import esAbout from "./es/about";
import esCommon from "./es/common";
import esContact from "./es/contact";
import esHome from "./es/home";
import esSchedule from "./es/schedule";
import esPreregister from "./es/preregister";
import { register as esRegister } from "./es/register";
import { passwordModal as esPasswordModal } from "./es/passwordModal";
import { login as esLogin } from "./es/login";
import esStudentCalendar from "./es/StudentCalendar";
import esAddClassModal from "./es/AddClassModal";

import enAbout from "./en/about";
import enCommon from "./en/common";
import enContact from "./en/contact";
import enHome from "./en/home";
import enSchedule from "./en/schedule";
import enPreregister from "./en/preregister";
import { register as enRegister } from "./en/register";
import { passwordModal as enPasswordModal } from "./en/passwordModal";
import { login as enLogin } from "./en/login";
import enStudentCalendar from "./en/StudentCalendar";
import enAddClassModal from "./en/AddClassModal";

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
    addClassModal: esAddClassModal,
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
    addClassModal: enAddClassModal,
  },
};

export default translations;

