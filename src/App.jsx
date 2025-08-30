import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { LoginForm } from "./components/forms";
import Register from "./components/pages/Register";
import { Home, About, Profile, Settings, Contact } from "./components/pages";
import Schedule from "./components/pages/Schedule";
import { AuthProvider } from "./contexts/AuthContext";
import { Prueba } from "./components/pages";
import PreRegisterForm from "./components/forms/PreRegisterForm";


export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/register" element={<Register />} />
      <Route path="/schedule" element={<Schedule />} />
      <Route path="/prueba" element={<Prueba />} />
      <Route path="/preregister" element={<PreRegisterForm />} />
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