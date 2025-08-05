import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { LoginForm, RegisterForm } from "./components/forms";
import { Home, About } from "./components/pages";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/register" element={<RegisterForm />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;