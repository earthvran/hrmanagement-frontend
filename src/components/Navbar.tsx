import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Menu, X, User, Home, Briefcase, UserCog } from "lucide-react";
import { jwtDecode } from "jwt-decode";
import type { JwtPayload } from "../types/JwtPayload";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [username, setUsername] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    const handleTokenUpdate = () => {
      const newToken = localStorage.getItem("token");
      setToken(newToken);
      if (newToken) {
        try {
          const payload = jwtDecode<JwtPayload>(newToken);
          setUsername(payload.username || payload.sub || null);
          setUserRole(payload.role || null);
        } catch (e: unknown) {
          if (e instanceof Error) {
            console.error("Token decode error:", e.message);
          }
          setUsername(null);
          setUserRole(null);
        }
      } else {
        setUsername(null);
        setUserRole(null);
      }
    };

    handleTokenUpdate();
    window.addEventListener("storage", handleTokenUpdate);
    window.addEventListener("focus", handleTokenUpdate);
    return () => {
      window.removeEventListener("storage", handleTokenUpdate);
      window.removeEventListener("focus", handleTokenUpdate);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUsername(null);
    setUserRole(null);
    navigate("/login");
  };
  const isAdmin = userRole === "ADMIN";

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-gray-800 shadow-md flex items-center justify-between px-4 py-6">
      <div className="flex items-center gap-4">
        {token && (
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-blue-600 dark:text-white"
          >
            {menuOpen ? <X /> : <Menu />}
          </button>
        )}
      </div>

      <div className="text-xl font-bold text-blue-600 dark:text-white absolute left-1/2 transform -translate-x-1/2">
        HR Management
      </div>

      {token && (
        <div className="flex items-center gap-4">
          {username && <span className="text-gray-600 dark:text-gray-300">Hello, {username}</span>}
          <button
            onClick={handleLogout}
            className="text-red-500 hover:underline"
          >
            Logout
          </button>
        </div>
      )}

      {menuOpen && token && (
        <div className="fixed top-0 left-0 h-full w-52 bg-white dark:bg-gray-900 text-gray-800 dark:text-white shadow-md p-4 space-y-5 z-50 transform transition-transform duration-300 ease-in-out translate-x-0">
          <button
            className="text-black dark:text-white ml-auto block mb-6"
            onClick={() => setMenuOpen(false)}
          >
            <X />
          </button>
          <Link
            to="/"
            className={`flex items-center space-x-2 ${isActive('/') ? 'text-blue-600 font-semibold bg-blue-50 rounded-md px-2 py-1 border-l-4 border-blue-600' : 'hover:text-blue-500'}`}
            onClick={() => setMenuOpen(false)}
            aria-current={isActive('/') ? 'page' : undefined}
          >
            <Home size={18} /> <span>หน้าแรก</span>
          </Link>
          <Link
            to="/employees"
            className={`flex items-center space-x-2 ${isActive('/employees') ? 'text-blue-600 font-semibold bg-blue-50 rounded-md px-2 py-1 border-l-4 border-blue-600' : 'hover:text-blue-500'}`}
            onClick={() => setMenuOpen(false)}
            aria-current={isActive('/employees') ? 'page' : undefined}
          >
            <User size={18} /> <span>พนักงาน</span>
          </Link>
          <Link
            to="/departments"
            className={`flex items-center space-x-2 ${isActive('/departments') ? 'text-blue-600 font-semibold bg-blue-50 rounded-md px-2 py-1 border-l-4 border-blue-600' : 'hover:text-blue-500'}`}
            onClick={() => setMenuOpen(false)}
            aria-current={isActive('/departments') ? 'page' : undefined}
          >
            <Briefcase size={18} /> <span>แผนก</span>
          </Link>
          <Link
            to="/positions"
            className={`flex items-center space-x-2 ${isActive('/positions') ? 'text-blue-600 font-semibold bg-blue-50 rounded-md px-2 py-1 border-l-4 border-blue-600' : 'hover:text-blue-500'}`}
            onClick={() => setMenuOpen(false)}
            aria-current={isActive('/positions') ? 'page' : undefined}
          >
            <Briefcase size={18} /> <span>ตำแหน่ง</span>
          </Link>
          {isAdmin && (
            <Link
              to="/accounts"
              className={`flex items-center space-x-2 ${isActive('/accounts') ? 'text-blue-600 font-semibold bg-blue-50 rounded-md px-2 py-1 border-l-4 border-blue-600' : 'hover:text-blue-500'}`}
              onClick={() => setMenuOpen(false)}
              aria-current={isActive('/accounts') ? 'page' : undefined}
            >
              <UserCog size={18} /> <span>บัญชีผู้ใช้</span>
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
