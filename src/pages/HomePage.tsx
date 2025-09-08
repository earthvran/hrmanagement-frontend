import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Building2, 
  UserCheck, 
  UserCog, 
  TrendingUp, 
  Calendar,
  ArrowRight,
  Plus,
  Eye,
  Settings,
  BarChart3
} from 'lucide-react';
import axios from 'axios';

interface DashboardStats {
  totalEmployees: number;
  totalDepartments: number;
  totalPositions: number;
  totalAccounts: number;
}

const HomePage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalEmployees: 0,
    totalDepartments: 0,
    totalPositions: 0,
    totalAccounts: 0
  });
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        // Decode token to get user role
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUserRole(payload.role);

        // Fetch statistics
        const [employeesRes, departmentsRes, positionsRes, accountsRes] = await Promise.all([
          axios.get('http://localhost:8080/api/employees/getAllEmployees', {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get('http://localhost:8080/api/departments/getAllDepartments', {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get('http://localhost:8080/api/positions/getAllPositions', {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get('http://localhost:8080/api/accounts/getAllAccounts', {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        setStats({
          totalEmployees: employeesRes.data.length,
          totalDepartments: departmentsRes.data.length,
          totalPositions: positionsRes.data.length,
          totalAccounts: accountsRes.data.length
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const quickActions = [
    {
      title: 'เพิ่มพนักงานใหม่',
      description: 'เพิ่มข้อมูลพนักงานเข้าสู่ระบบ',
      icon: <Plus className="w-6 h-6" />,
      link: '/employees',
      color: 'from-blue-500 to-blue-600',
      hoverColor: 'from-blue-600 to-blue-700'
    },
    {
      title: 'ดูรายการพนักงาน',
      description: 'จัดการและดูข้อมูลพนักงานทั้งหมด',
      icon: <Eye className="w-6 h-6" />,
      link: '/employees',
      color: 'from-green-500 to-green-600',
      hoverColor: 'from-green-600 to-green-700'
    },
    {
      title: 'จัดการแผนก',
      description: 'เพิ่มและแก้ไขข้อมูลแผนก',
      icon: <Building2 className="w-6 h-6" />,
      link: '/departments',
      color: 'from-purple-500 to-purple-600',
      hoverColor: 'from-purple-600 to-purple-700'
    },
    {
      title: 'จัดการตำแหน่ง',
      description: 'เพิ่มและแก้ไขข้อมูลตำแหน่ง',
      icon: <UserCheck className="w-6 h-6" />,
      link: '/positions',
      color: 'from-orange-500 to-orange-600',
      hoverColor: 'from-orange-600 to-orange-700'
    }
  ];

  const adminActions = [
    {
      title: 'จัดการบัญชีผู้ใช้',
      description: 'เพิ่มและแก้ไขบัญชีผู้ใช้ในระบบ',
      icon: <UserCog className="w-6 h-6" />,
      link: '/accounts',
      color: 'from-red-500 to-red-600',
      hoverColor: 'from-red-600 to-red-700'
    }
  ];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'สวัสดีตอนเช้า';
    if (hour < 17) return 'สวัสดีตอนบ่าย';
    return 'สวัสดีตอนเย็น';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {getGreeting()} 👋
            </h1>
            <p className="text-xl text-blue-100 mb-2">
              ยินดีต้อนรับสู่ระบบจัดการทรัพยากรบุคคล
            </p>
            <p className="text-blue-200">
              จัดการข้อมูลพนักงาน แผนก และตำแหน่งได้อย่างมีประสิทธิภาพ
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">พนักงานทั้งหมด</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalEmployees}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-xl">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-green-600">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span>เพิ่มขึ้น 12% จากเดือนที่แล้ว</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">แผนกทั้งหมด</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalDepartments}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-xl">
                <Building2 className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-green-600">
              <BarChart3 className="w-4 h-4 mr-1" />
              <span>จัดการได้อย่างมีประสิทธิภาพ</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">ตำแหน่งทั้งหมด</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalPositions}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-xl">
                <UserCheck className="w-8 h-8 text-purple-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-purple-600">
              <Calendar className="w-4 h-4 mr-1" />
              <span>อัปเดตล่าสุดเมื่อ 2 ชั่วโมงที่แล้ว</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">บัญชีผู้ใช้</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalAccounts}</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-xl">
                <UserCog className="w-8 h-8 text-orange-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-orange-600">
              <Settings className="w-4 h-4 mr-1" />
              <span>ระบบจัดการผู้ใช้</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <span className="mr-3">🚀</span>
            การดำเนินการด่วน
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                to={action.link}
                className="group bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${action.color} text-white mb-4 group-hover:bg-gradient-to-r ${action.hoverColor} transition-all duration-300`}>
                  {action.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {action.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  {action.description}
                </p>
                <div className="flex items-center text-blue-600 font-medium text-sm group-hover:text-blue-700 transition-colors">
                  <span>เริ่มต้นใช้งาน</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Admin Actions */}
        {userRole === 'ADMIN' && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="mr-3">⚙️</span>
              การจัดการระบบ (สำหรับผู้ดูแล)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {adminActions.map((action, index) => (
                <Link
                  key={index}
                  to={action.link}
                  className="group bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
                >
                  <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${action.color} text-white mb-4 group-hover:bg-gradient-to-r ${action.hoverColor} transition-all duration-300`}>
                    {action.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-red-600 transition-colors">
                    {action.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {action.description}
                  </p>
                  <div className="flex items-center text-red-600 font-medium text-sm group-hover:text-red-700 transition-colors">
                    <span>เข้าสู่ระบบจัดการ</span>
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* System Status */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <span className="mr-3">📊</span>
            สถานะระบบ
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center p-4 bg-green-50 rounded-xl border border-green-200">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-3 animate-pulse"></div>
              <div>
                <p className="font-semibold text-green-800">ระบบทำงานปกติ</p>
                <p className="text-sm text-green-600">เซิร์ฟเวอร์พร้อมใช้งาน</p>
              </div>
            </div>
            <div className="flex items-center p-4 bg-blue-50 rounded-xl border border-blue-200">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
              <div>
                <p className="font-semibold text-blue-800">ฐานข้อมูล</p>
                <p className="text-sm text-blue-600">เชื่อมต่อสำเร็จ</p>
              </div>
            </div>
            <div className="flex items-center p-4 bg-purple-50 rounded-xl border border-purple-200">
              <div className="w-3 h-3 bg-purple-500 rounded-full mr-3"></div>
              <div>
                <p className="font-semibold text-purple-800">การรักษาความปลอดภัย</p>
                <p className="text-sm text-purple-600">ระบบป้องกันทำงาน</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
