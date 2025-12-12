import { useNavigate } from "react-router-dom";
import React, { useEffect } from "react";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { jwtDecode } from "jwt-decode";

function SuperAdminAuthorization<T>(
  Component: React.ComponentType,
  roles: string[]
) {
  return function WithSuperAdminAuthorization(props: any) {
    const router = useNavigate();

    useEffect(() => {
      const token = Cookies.get("access");

      // 1. Token missing
      if (!token) {
        toast.error("token missing: please login");
        router("/auth/login");
        return;
      }

      // 2. Token exists but might be garbage → decode carefully
      let decoded: { exp: number; role: string };
      try {
        decoded = jwtDecode(token);
      } catch (e) {
        toast.error("invalid token: please login again");
        Cookies.remove("access");
        router("/auth/login");
        return;
      }

      // 3. Expired token
      if (decoded.exp < Math.floor(Date.now() / 1000)) {
        toast.error("session expired: please login");
        Cookies.remove("access");
        router("/auth/login");
        return;
      }

      // 4. Unauthorized role
      if (!roles.includes(decoded.role)) {
        toast.error("unauthorised access: access denied");
        router("/");
        return;
      }
    }, []);

    return <Component {...props} />;
  };
}

export default SuperAdminAuthorization;
