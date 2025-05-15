import { Outlet } from "react-router-dom";
import { useContext } from "react";
import Navigation from "../components/Navigation";
import LoginModal from "../components/LoginModal";
import SignupModal from "../components/SignupModal";
import { AuthContext } from "../components/AuthContext";
import Footer from "../components/Footer";

function RootLayout() {
  const { authModal, closeAuthModal } = useContext(AuthContext);

  return (
    <>
      <Navigation />

      {authModal === "login" && <LoginModal onClose={closeAuthModal} />}
      {authModal === "signup" && <SignupModal onClose={closeAuthModal} />}

      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

export default RootLayout;
