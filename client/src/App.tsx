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
import AddProduct from "./pages/AddProduct";
import FarmerDashboard from "./pages/Farmerdashboard";
function App() {
  interface RouteConfig {
    path: string;
    element: React.ReactNode;
    role?: "buyer" | "farmer";
  }

  const routes: RouteConfig[] = [
    { path: "/", element: <LoginForm /> },
    { path: "/register", element: <Register /> },
    { path: "/dashboard", element: <Dashboard />, role: "farmer" },
    {path:"/book", element:<BookDoctorAppoint/>, role: "buyer"},
    { path: "/myappointments", element: <MyAppointments />, role: "buyer" },
    { path: "/appointlist", element: <Appointments />, role: "farmer" },
    { path: "/appointmentapproval", element: <Appointments />, role: "farmer" },
    { path: "/medical/:id", element: <MedicalRecordForm/>, role: "farmer" },
    { path: "/allPatient", element: <AllPatientList/>, role: "farmer" },
    { path: "/addproduct", element: <AddProduct/>, role: "farmer" },
    { path: "/FarmerDashboard", element: <FarmerDashboard/>, role: "farmer" }
  ];

  return (
    <div className="bg-green-200 min-h-screen">
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
