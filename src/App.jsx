import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import Home from "./components/Home";
import RootLayout from "./pages/RootLayout";
import ErrorPage from "./pages/ErrorPage";
import AboutPage from "./pages/AboutPage";
import ExcusePage from "./pages/ExcusePage";
import ReviewPage from "./pages/ReviewPage";
import UpgradePage from "./pages/UpgradePage";
import AdminPage from "./pages/AdminPage";
import SupportPage from "./pages/SupportPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
      { path: "about", element: <AboutPage /> },
      { path: "excuses/:excuseId", element: <ExcusePage /> },
      { path: "reviews", element: <ReviewPage /> },
      { path: "upgrade", element: <UpgradePage /> },
      { path: "admin", element: <AdminPage /> },
      { path: "support", element: <SupportPage /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
