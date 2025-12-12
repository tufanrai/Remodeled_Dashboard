"use client";
import React from "react";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function WithAuthorization<T>(
  Component: React.ComponentType<T>,
  roles: string[]
) {
  return function WithAuthentication(props: any) {
    const navigate = useNavigate();
    React.useEffect(() => {
      const token = Cookies.get("access");

      // 1. Token missing
      if (!token) {
        toast.error("token missing: please login");
        navigate("/auth/login", { replace: true });
        return;
      }

      // 2. Token exists but might be garbage → decode carefully
      let decoded: { exp: number; role: string };
      try {
        decoded = jwtDecode(token);
      } catch (e) {
        toast.error("invalid token: please login again");
        Cookies.remove("access");
        navigate("/auth/login", { replace: true });
        return;
      }

      // 3. Expired token
      if (decoded.exp < Math.floor(Date.now() / 1000)) {
        toast.error("session expired: please login");
        Cookies.remove("access");
        navigate("/auth/login", { replace: true });
        return;
      }

      // 4. Unauthorized role
      if (!roles.includes(decoded.role)) {
        toast.error("unauthorised access: access denied");
        Cookies.remove("access");
        navigate("/auth/login", { replace: true });
        return;
      }

      localStorage.setItem("amdin", JSON.stringify(decoded));
    }, []);

    return <Component {...props} />;
  };
}

export default WithAuthorization;
