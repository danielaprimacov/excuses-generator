import { Outlet } from "react-router-dom";
import Admin from "../components/Admin";

function AdminPage() {
  return (
    <div className="admin-page">
      <Admin />
      <div className="admin-page-content"> 
        <Outlet />
      </div>
    </div>
  );
}

export default AdminPage;
