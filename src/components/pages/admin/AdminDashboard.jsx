// src/components/pages/admin/AdminDashboard.jsx
import AdminLayout from "../../layout/admin/AdminLayout";
import { useAuth } from "../../../contexts/AuthContext";
import translations from "../../../translations";

export default function AdminDashboard() {
  const { lang } = useAuth();
  const t = translations[lang].adminDashboard.adminDashboard;

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {t.welcomeMessage}
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            This is your admin view. You can add your custom content here.
          </p>
        </div>

        {/* Content Area */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Admin Content
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Here you can add whatever content you need for your admin interface.
            The AdminLayout with sidebar navigation is already set up and working.
          </p>
        </div>
      </div>
    </AdminLayout>
  );
}