import type { PositionResponse } from "../types/PositionResponse";
import { X, Building2, UserCheck, FileText, Users } from "lucide-react";

interface Props {
  position: PositionResponse;
  onClose: () => void;
}

const PositionViewModal = ({ position, onClose }: Props) => {
  const formatLevel = (level: string) => {
    switch (level) {
      case "JUNIOR":
        return "ระดับต้น";
      case "MIDDLE":
        return "ระดับกลาง";
      case "SENIOR":
        return "ระดับสูง";
      case "MANAGER":
        return "ผู้จัดการ";
      case "DIRECTOR":
        return "ผู้อำนวยการ";
      default:
        return level;
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "JUNIOR":
        return "bg-blue-100 text-blue-800";
      case "MIDDLE":
        return "bg-green-100 text-green-800";
      case "SENIOR":
        return "bg-purple-100 text-purple-800";
      case "MANAGER":
        return "bg-orange-100 text-orange-800";
      case "DIRECTOR":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white bg-opacity-20 rounded-lg">
              <UserCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">รายละเอียดตำแหน่ง</h2>
              <p className="text-blue-100 text-sm">ข้อมูลตำแหน่งงานในองค์กร</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Position Title */}
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              {position.title}
            </h3>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getLevelColor(position.level)}`}>
              {formatLevel(position.level)}
            </span>
          </div>

          {/* Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Department Information */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Building2 className="w-5 h-5 text-blue-600" />
                </div>
                <h4 className="font-semibold text-gray-800">ข้อมูลแผนก</h4>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-600">แผนก:</span>
                  <span className="text-sm text-gray-800">{position.departmentName || "ไม่ระบุ"}</span>
                </div>
              </div>
            </div>

            {/* Level Information */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border border-green-100">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Users className="w-5 h-5 text-green-600" />
                </div>
                <h4 className="font-semibold text-gray-800">ระดับตำแหน่ง</h4>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-600">ระดับ:</span>
                  <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${getLevelColor(position.level)}`}>
                    {formatLevel(position.level)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <FileText className="w-5 h-5 text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-800">คำอธิบายตำแหน่ง</h4>
            </div>
            <div className="text-sm text-gray-700 leading-relaxed">
              {position.description || "ไม่มีคำอธิบายเพิ่มเติม"}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            ปิด
          </button>
        </div>
      </div>
    </div>
  );
};

export default PositionViewModal;
