import type { EmployeeResponse } from "../types/EmployeeResponse";
import { X, Mail, Phone, DollarSign, User, Building, Briefcase } from "lucide-react";

interface Props {
  employee: EmployeeResponse;
  onClose: () => void;
}

const EmployeeViewModal = ({ employee, onClose }: Props) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'INACTIVE':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'ทำงาน';
      case 'INACTIVE':
        return 'ลาออก';
      default:
        return status;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            รายละเอียดพนักงาน
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={24} className="text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Profile Section */}
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8">
            {/* Profile Picture */}
            <div className="relative">
              {employee.presignedRequestUrl ? (
                <img
                  src={employee.presignedRequestUrl}
                  alt={`${employee.firstName} ${employee.lastName}`}
                  className="w-32 h-32 rounded-full object-cover border-4 border-blue-100 shadow-lg"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = "/account-svgrepo.svg";
                  }}
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                  {(employee.firstName?.[0] || "").toUpperCase()}
                  {(employee.lastName?.[0] || "").toUpperCase()}
                </div>
              )}
              <div className={`absolute -bottom-2 -right-2 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(employee.status)}`}>
                {getStatusText(employee.status)}
              </div>
            </div>

            {/* Basic Info */}
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-3xl font-bold text-gray-900 mb-2">
                {employee.firstName} {employee.lastName}
              </h3>
              <p className="text-lg text-gray-600 mb-3">
                {employee.positionName} • {employee.departmentName}
              </p>
              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <div className="flex items-center gap-2 text-gray-600">
                  <User size={16} />
                  <span className="text-sm">{employee.employeeCode}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail size={16} />
                  <span className="text-sm">{employee.email}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Phone size={16} />
                  <span className="text-sm">{employee.phoneNumber}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Information */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <User size={20} />
                ข้อมูลส่วนตัว
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">เพศ:</span>
                  <span className="font-medium">{employee.gender === "M" ? "ชาย" : "หญิง"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">วันเกิด:</span>
                  <span className="font-medium">{formatDate(employee.birthDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">วันที่เริ่มงาน:</span>
                  <span className="font-medium">{formatDate(employee.hireDate)}</span>
                </div>
              </div>
            </div>

            {/* Work Information */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Briefcase size={20} />
                ข้อมูลการทำงาน
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">แผนก:</span>
                  <span className="font-medium flex items-center gap-1">
                    <Building size={14} />
                    {employee.departmentName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">ตำแหน่ง:</span>
                  <span className="font-medium">{employee.positionName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">เงินเดือน:</span>
                  <span className="font-medium flex items-center gap-1 text-green-600">
                    <DollarSign size={14} />
                    ฿{employee.salary.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="mt-6 bg-blue-50 rounded-xl p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Mail size={20} />
              ข้อมูลการติดต่อ
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                <Mail size={20} className="text-blue-500" />
                <div>
                  <p className="text-sm text-gray-600">อีเมล</p>
                  <p className="font-medium">{employee.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                <Phone size={20} className="text-green-500" />
                <div>
                  <p className="text-sm text-gray-600">เบอร์โทรศัพท์</p>
                  <p className="font-medium">{employee.phoneNumber}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            ปิด
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeViewModal;
