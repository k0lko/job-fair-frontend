import { useEffect } from "react";
import { logout } from "../services/auth";
import { useNavigate } from "react-router-dom";

export default function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    logout();
    localStorage.removeItem("token");
    localStorage.removeItem("token_expires");

    window.dispatchEvent(new Event("authChange"));
  
    navigate("/", { replace: true });
  }, []);

  return null;
}
