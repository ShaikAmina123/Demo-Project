import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { ToastProvider } from './components/Toast';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Assets from './pages/Assets';
import AssetDetail from './pages/AssetDetail';
import AssetGroups from './pages/AssetGroups';
import WorkOrders from './pages/WorkOrders';
import CheckInOut from './pages/CheckInOut';
import Maintenance from './pages/Maintenance';
import Licenses from './pages/Licenses';
import AuditList from './pages/AuditList';
import Users from './pages/Users';
import Notifications from './pages/Notifications';
import Barcodes from './pages/Barcodes';
import Reports from './pages/Reports';
import PredefinedForms from './pages/PredefinedForms';
import MediaLibrary from './pages/MediaLibrary';
import Documents from './pages/Documents';
import Depreciation from './pages/Depreciation';
import CompanySettings from './pages/CompanySettings';
import GroupSettings from './pages/GroupSettings';
import UserTemplates from './pages/UserTemplates';
import NotificationSettings from './pages/NotificationSettings';
import AutomatedReports from './pages/AutomatedReports';
import ChangeLogs from './pages/ChangeLogs';
import ApiConfig from './pages/ApiConfig';
import Integrations from './pages/Integrations';
import Support from './pages/Support';
import Tutorials from './pages/Tutorials';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading"><div className="spinner"></div></div>;
  return user ? children : <Navigate to="/login" />;
}

function AppRoutes() {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading"><div className="spinner"></div></div>;

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
      <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="assets" element={<Assets />} />
        <Route path="assets/:id" element={<AssetDetail />} />
        <Route path="asset-groups" element={<AssetGroups />} />
        <Route path="work-orders" element={<WorkOrders />} />
        <Route path="maintenance" element={<Maintenance />} />
        <Route path="check-in-out" element={<CheckInOut />} />
        <Route path="licenses" element={<Licenses />} />
        <Route path="audits" element={<AuditList />} />
        <Route path="users" element={<Users />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="barcodes" element={<Barcodes />} />
        <Route path="reports" element={<Reports />} />
        <Route path="forms" element={<PredefinedForms />} />
        <Route path="media" element={<MediaLibrary />} />
        <Route path="documents" element={<Documents />} />
        <Route path="depreciation" element={<Depreciation />} />
        <Route path="settings/company" element={<CompanySettings />} />
        <Route path="settings/groups" element={<GroupSettings />} />
        <Route path="settings/user-templates" element={<UserTemplates />} />
        <Route path="settings/notifications" element={<NotificationSettings />} />
        <Route path="settings/automated-reports" element={<AutomatedReports />} />
        <Route path="settings/change-logs" element={<ChangeLogs />} />
        <Route path="settings/api" element={<ApiConfig />} />
        <Route path="settings/integrations" element={<Integrations />} />
        <Route path="support" element={<Support />} />
        <Route path="tutorials" element={<Tutorials />} />
      </Route>
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <AppRoutes />
      </ToastProvider>
    </AuthProvider>
  );
}
