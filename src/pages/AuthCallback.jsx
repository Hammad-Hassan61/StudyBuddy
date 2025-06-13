import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (token) {
      localStorage.setItem("token", token);
      if (window.opener) {
        window.opener.postMessage({ type: "google-auth-success", token }, window.location.origin);
        window.close();
        navigate("/dashboard");
      } else {
        navigate("/dashboard");
      }
    }
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-lg text-blue-700">Logging you in...</div>
    </div>
  );
};

export default AuthCallback;