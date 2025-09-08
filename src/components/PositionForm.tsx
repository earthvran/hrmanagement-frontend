import React, { useState } from "react";
import type { DepartmentOption, PositionFormData } from "../types/PositionFormTypes";

type Props = {
  formData: PositionFormData;
  setFormData: React.Dispatch<React.SetStateAction<PositionFormData>>;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  departments: DepartmentOption[];
  isEdit?: boolean;
};

const PositionForm = ({ formData, onChange, onSubmit, onCancel, departments, isEdit = false }: Props) => {
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };
  const showError = (field: keyof PositionFormData) => {
    return touched[field] && !formData[field];
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const requiredFields: (keyof PositionFormData)[] = ["title", "level", "description"];
    const hasEmptyRequired = requiredFields.some((field) => !formData[field]);
    if (hasEmptyRequired) {
      const newTouched: { [key: string]: boolean } = {};
      requiredFields.forEach((field) => (newTouched[field] = true));
      setTouched((prev) => ({ ...prev, ...newTouched }));
      return;
    }

    onSubmit(e);
  };

  const errorText = "กรุณากรอกข้อมูล";

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 p-8 rounded-2xl shadow-lg mb-6"
    >
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {isEdit ? 'แก้ไขข้อมูลตำแหน่ง' : 'เพิ่มตำแหน่งใหม่'}
        </h2>
        <p className="text-gray-600 mt-1">กรอกข้อมูลตำแหน่งงานสำหรับใช้งานในระบบ</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col space-y-2">
          <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <span>ชื่อตำแหน่ง</span>
            <span className="text-red-500">*</span>
          </label>
          <input
            name="title"
            value={formData.title}
            onChange={onChange}
            onBlur={() => handleBlur("title")}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
            required
            placeholder="เช่น นักพัฒนาซอฟต์แวร์"
          />
          {showError("title") && (
            <div className="flex items-center gap-2 text-red-600 text-sm">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span>{errorText}</span>
            </div>
          )}
        </div>

        <div className="flex flex-col space-y-2">
          <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <span>ระดับ</span>
            <span className="text-red-500">*</span>
          </label>
          <input
            name="level"
            value={formData.level}
            onChange={onChange}
            onBlur={() => handleBlur("level")}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
            required
            placeholder="เช่น JUNIOR, SENIOR, MANAGER"
          />
          {showError("level") && (
            <div className="flex items-center gap-2 text-red-600 text-sm">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span>{errorText}</span>
            </div>
          )}
        </div>

        <div className="flex flex-col space-y-2 md:col-span-2">
          <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <span>คำอธิบายตำแหน่ง</span>
            <span className="text-red-500">*</span>
          </label>
          <input
            name="description"
            value={formData.description}
            onChange={onChange}
            onBlur={() => handleBlur("description")}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
            required
            placeholder="อธิบายงาน หน้าที่ และความรับผิดชอบ"
          />
          {showError("description") && (
            <div className="flex items-center gap-2 text-red-600 text-sm">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span>{errorText}</span>
            </div>
          )}
        </div>

        <div className="flex flex-col space-y-2">
          <label className="text-sm font-semibold text-gray-700">แผนก</label>
          <select
            name="departmentId"
            value={formData.departmentId}
            onChange={onChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400 bg-white"
          >
            {departments.map((dep) => (
              <option key={dep.departmentId} value={dep.departmentId}>
                {dep.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-6 border-t border-gray-200">
        <button
          type="submit"
          className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
        >
          {isEdit ? 'อัปเดต' : 'บันทึก'}
        </button>
        <button
          type="button"
          className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-all duration-200 font-semibold border border-gray-300"
          onClick={onCancel}
        >
          {isEdit ? 'ยกเลิกการแก้ไข' : 'ยกเลิก'}
        </button>
      </div>
    </form>
  );
};

export default PositionForm;
