import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { 
  Menu, 
  X, 
  User, 
  Home, 
  Building2, 
  UserCheck, 
  LogOut, 
  ChevronDown,
  Shield,
  Users
} from "lucide-react";
import { jwtDecode } from "jwt-decode";
import type { JwtPayload } from "../types/JwtPayload";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [username, setUsername] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

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
    setUserMenuOpen(false);
    navigate("/login");
  };

  const isAdmin = userRole === "ADMIN";

  const getRoleDisplay = (role: string | null) => {
    switch (role) {
      case 'ADMIN':
        return { text: 'ผู้ดูแลระบบ', color: 'text-red-600', bgColor: 'bg-red-100' };
      case 'HR':
        return { text: 'ฝ่ายบุคคล', color: 'text-purple-600', bgColor: 'bg-purple-100' };
      case 'EMPLOYEE':
        return { text: 'พนักงาน', color: 'text-blue-600', bgColor: 'bg-blue-100' };
      default:
        return { text: 'ผู้ใช้', color: 'text-gray-600', bgColor: 'bg-gray-100' };
    }
  };

  const roleInfo = getRoleDisplay(userRole);

  return (
    <>
      {/* Main Navbar */}
      <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left side - Logo and Menu Button */}
            <div className="flex items-center space-x-4">
              {token && (
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="p-2 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
                >
                  {menuOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
              )}
              
              <Link to="/" className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-lg">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">HR Management</h1>
                  <p className="text-xs text-gray-500">ระบบจัดการทรัพยากรบุคคล</p>
                </div>
              </Link>
            </div>

            {/* Right side - User Info */}
            {token && (
              <div className="flex items-center space-x-4">
                {/* User Role Badge */}
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${roleInfo.bgColor} ${roleInfo.color}`}>
                  {roleInfo.text}
                </div>

                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 transition-all duration-200"
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm font-medium text-gray-700 hidden sm:block">
                      {username}
                    </span>
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </button>

                  {/* User Dropdown */}
                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">{username}</p>
                        <p className="text-xs text-gray-500">{roleInfo.text}</p>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2 transition-colors duration-200"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>ออกจากระบบ</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Sidebar Menu */}
      {menuOpen && token && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-25 z-40"
            onClick={() => setMenuOpen(false)}
          />
          
          {/* Sidebar */}
          <div className="fixed top-0 left-0 h-full w-72 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl">
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">เมนูหลัก</h2>
                    <p className="text-xs text-gray-500">ระบบจัดการทรัพยากรบุคคล</p>
                  </div>
                </div>
                <button
                  onClick={() => setMenuOpen(false)}
                  className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all duration-200"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="space-y-2">
                <Link
                  to="/"
                  className={`flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 ${
                    isActive('/') 
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg' 
                      : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                  }`}
                  onClick={() => setMenuOpen(false)}
                >
                  <Home size={20} />
                  <span className="font-medium">หน้าแรก</span>
                </Link>

                <Link
                  to="/employees"
                  className={`flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 ${
                    isActive('/employees') 
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg' 
                      : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                  }`}
                  onClick={() => setMenuOpen(false)}
                >
                  <Users size={20} />
                  <span className="font-medium">จัดการพนักงาน</span>
                </Link>

                <Link
                  to="/departments"
                  className={`flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 ${
                    isActive('/departments') 
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg' 
                      : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                  }`}
                  onClick={() => setMenuOpen(false)}
                >
                  <Building2 size={20} />
                  <span className="font-medium">จัดการแผนก</span>
                </Link>

                <Link
                  to="/positions"
                  className={`flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 ${
                    isActive('/positions') 
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg' 
                      : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                  }`}
                  onClick={() => setMenuOpen(false)}
                >
                  <UserCheck size={20} />
                  <span className="font-medium">จัดการตำแหน่ง</span>
                </Link>

                {isAdmin && (
                  <Link
                    to="/accounts"
                    className={`flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 ${
                      isActive('/accounts') 
                        ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg' 
                        : 'text-gray-700 hover:bg-red-50 hover:text-red-600'
                    }`}
                    onClick={() => setMenuOpen(false)}
                  >
                    <Shield size={20} />
                    <span className="font-medium">จัดการบัญชีผู้ใช้</span>
                  </Link>
                )}
              </nav>

              {/* User Info Section */}
              <div className="mt-8 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{username}</p>
                    <p className="text-xs text-gray-500">{roleInfo.text}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Navbar;
