import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import "./App.css";
import HomePage from "./pages/HomePage";
import RootLayout from "./pages/RootLayout";
import ErrorPage from "./pages/ErrorPage";
import AboutPage from "./pages/AboutPage";
import ExcusePage from "./pages/ExcusePage";
import ReviewPage from "./pages/ReviewPage";
import AllExcusesPage from "./pages/AllExcusesPage";
import EditExcusePage from "./pages/EditExcusePage";
import AdminStatistics from "./components/AdminStatistics";
import AdminReviews from "./components/AdminReviews";
import AdminSupport from "./components/AdminSupport";
import SupportPage from "./pages/SupportPage";
import AddNewExcuse from "./components/AddNewExcuse";
import { AuthProvider } from "./components/AuthContext";
import AdminPage from "./pages/AdminPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "about", element: <AboutPage /> },
      { path: "excuses", element: <ExcusePage /> },
      { path: "reviews", element: <ReviewPage /> },
      { path: "support", element: <SupportPage /> },
    ],
  },
  {
    path: "/admin",
    element: <AdminPage />,
    children: [
      { index: true, element: <Navigate to="all-excuses" replace /> },
      {
        path: "all-excuses",
        element: <AllExcusesPage />,
      },
      {
        path: "add-excuse",
        element: <AddNewExcuse />,
      },
      {
        path: "statistics",
        element: <AdminStatistics />,
      },
      {
        path: "admin-reviews",
        element: <AdminReviews />,
      },
      {
        path: "support-tickets",
        element: <AdminSupport />,
      },
      {
        path: "edit/:categoryId/:situationId/:excuseId",
        element: <EditExcusePage />,
      },
    ],
  },
]);

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
