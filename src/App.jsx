import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { LoginForm, RegisterForm } from "./components/forms";
import { Home, About, Profile, Settings } from "./components/pages";
import { AuthProvider } from "./contexts/AuthContext";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/register" element={<RegisterForm />} />
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