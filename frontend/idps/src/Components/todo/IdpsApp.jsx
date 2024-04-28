import "./IdpsApp.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import HeaderComponent from "./HeaderComponent";

import WelcomeComponent from "./WelcomeComponent";
import AttacksComponent from "./AttacksComponent";
import RolesComponent from "./RolesComponent";

import LoginComponent from "./LoginComponent";
import LogoutComponent from "./LogoutComponent";

import ErrorComponent from "./ErrorComponent";

import AuthProvider, { useAuth } from "./security/AuthContext";
import ApplicationComponent from "./ApplicationComponent";
import ViewApplicationsComponent from "./ViewApplicationsComponent";
import RolePrivilegeComponent from "./RolePrivilegeComponent";

function AuthenticatedRoute({ children }) {
  const authContext = useAuth();

  if (authContext.isAuthenticated) {
    return children;
  }

  return <Navigate to="/" />;
}

export default function IdpsApp() {
  return (
    <div className="IdpsApp">
      <AuthProvider>
        <BrowserRouter>
          <HeaderComponent />
          <Routes>
            <Route path="/" element={<LoginComponent />} />
            <Route path="/login" element={<LoginComponent />} />

            <Route
              path="/welcome"
              element={
                <AuthenticatedRoute>
                  <WelcomeComponent />
                </AuthenticatedRoute>
              }
            />

            <Route
              path="/attacks"
              element={
                <AuthenticatedRoute>
                  <AttacksComponent />
                </AuthenticatedRoute>
              }
            />

            <Route
              path="/application/add"
              element={
                <AuthenticatedRoute>
                  <ApplicationComponent />
                </AuthenticatedRoute>
              }
            />
            <Route
              path="/application/view"
              element={
                <AuthenticatedRoute>
                  <ViewApplicationsComponent />
                </AuthenticatedRoute>
              }
            />
            <Route
              path="/roles"
              element={
                <AuthenticatedRoute>
                  <RolesComponent />
                </AuthenticatedRoute>
              }
            />
            <Route
              path="/roles/privileges"
              element={
                <AuthenticatedRoute>
                  <RolePrivilegeComponent />
                </AuthenticatedRoute>
              }
            />
            <Route
              path="/logout"
              element={
                <AuthenticatedRoute>
                  <LogoutComponent />
                </AuthenticatedRoute>
              }
            />
            <Route path="*" element={<ErrorComponent />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}
