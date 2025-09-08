import type { ReactElement } from "react";
import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  username?: string;
  sub?: string;
  role?: string;
  exp?: number;
  iat?: number;
}

interface ProtectedRouteProps {
  children: ReactElement;
  requiredRole?: "ADMIN" | "USER";
  fallbackPath?: string;
}

const ProtectedRoute = ({ 
  children, 
  requiredRole, 
  fallbackPath = "/login" 
}: ProtectedRouteProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const validateToken = () => {
      const token = localStorage.getItem("token");
      
      if (!token) {
        setIsAuthenticated(false);
        setUserRole(null);
        setIsLoading(false);
        return;
      }

      try {
        const payload = jwtDecode<JwtPayload>(token);
        const currentTime = Date.now() / 1000;
        
        // ตรวจสอบ token expiration
        if (payload.exp && payload.exp < currentTime) {
          localStorage.removeItem("token");
          setIsAuthenticated(false);
          setUserRole(null);
          setIsLoading(false);
          return;
        }

        setIsAuthenticated(true);
        setUserRole(payload.role || null);
        setIsLoading(false);
      } catch (error) {
        console.error("Token validation error:", error);
        localStorage.removeItem("token");
        setIsAuthenticated(false);
        setUserRole(null);
        setIsLoading(false);
      }
    };

    validateToken();

    // ตรวจสอบ token เมื่อมีการเปลี่ยนแปลง
    const handleStorageChange = () => {
      validateToken();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("focus", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("focus", handleStorageChange);
    };
  }, []);

  // แสดง loading ขณะตรวจสอบ authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">กำลังตรวจสอบสิทธิ์การเข้าถึง...</p>
        </div>
      </div>
    );
  }

  // ไม่ได้ login
  if (!isAuthenticated) {
    return <Navigate to={fallbackPath} replace />;
  }

  // ตรวจสอบ role ถ้ามีการกำหนด
  if (requiredRole && userRole !== requiredRole) {
    // ถ้าไม่ใช่ ADMIN แต่พยายามเข้าหน้า ADMIN
    if (requiredRole === "ADMIN" && userRole !== "ADMIN") {
      return <Navigate to="/" replace />;
    }
    // กรณีอื่นๆ
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
