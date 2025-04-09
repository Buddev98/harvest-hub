import "./App.css";
import LoginForm from "./pages/Login";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AuthGuard from "./components/AuthGuard";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import "bootstrap/dist/css/bootstrap.min.css";
import Register from "./pages/Register";
import BookDoctorAppoint from "./pages/BookDoctorAppoint"
import MyAppointments from "./pages/MyAppointments"
import Appointments from "./pages/Appointments"
import MedicalRecordForm from "./pages/MedicalRecord";
import AllPatientList from "./pages/AllPatientsList"
function App() {
  interface RouteConfig {
    path: string;
    element: React.ReactNode;
    role?: "patient" | "admin";
  }

  const routes: RouteConfig[] = [
    { path: "/", element: <LoginForm /> },
    { path: "/register", element: <Register /> },
    { path: "/dashboard", element: <Dashboard />, role: "admin" },
    {path:"/book", element:<BookDoctorAppoint/>, role: "patient"},
    { path: "/myappointments", element: <MyAppointments />, role: "patient" },
    { path: "/appointlist", element: <Appointments />, role: "admin" },
    { path: "/appointmentapproval", element: <Appointments />, role: "admin" },
    { path: "/medical/:id", element: <MedicalRecordForm/>, role: "admin" },
    { path: "/allPatient", element: <AllPatientList/>, role: "admin" }

  ];

  return (
    <div className="bg-purple-200 min-h-screen">
      <BrowserRouter>
        <Routes>
          {routes.map(({ path, element, role }) => (
            <Route
              key={path}
              path={path}
              element={
                role ? (
                  <Layout>
                    <AuthGuard role={role}>{element}</AuthGuard>
                  </Layout>
                ) : (
                  element
                )
              }
            />
          ))}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
