import React, { useState } from "react";
import type { AccountFormData } from "../types/AccountFormData";
import { Eye, EyeOff } from "lucide-react";

type Props = {
  formData: AccountFormData;
  setFormData: React.Dispatch<React.SetStateAction<AccountFormData>>;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  isEdit?: boolean;
};

const AccountForm = ({ formData, onChange, onSubmit, onCancel, isEdit = false }: Props) => {
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };
  
  const isValidPassword = (password: string) => /^.{8,}$/.test(password);
  const passwordsMatch = formData.password === formData.confirmPassword;
  
  const showError = (field: keyof AccountFormData) => {
    return touched[field] && !formData[field];
  };

  const showPasswordMismatchError = () => {
    return touched.confirmPassword && formData.confirmPassword && !passwordsMatch;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const requiredFields: (keyof AccountFormData)[] = ["username", "password", "confirmPassword", "role", "employeeId"];
    const hasEmptyRequired = requiredFields.some((field) => !formData[field]);
    const passwordValid = isValidPassword(formData.password);
    const passwordsMatchValid = passwordsMatch;

    if (hasEmptyRequired || !passwordValid || !passwordsMatchValid) {
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
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {isEdit ? 'แก้ไขบัญชีผู้ใช้งาน' : 'เพิ่มบัญชีผู้ใช้งาน'}
        </h2>
        <p className="text-gray-600">
          กรอกข้อมูลบัญชีผู้ใช้งานใหม่สำหรับพนักงาน
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Username Field */}
        <div className="flex flex-col space-y-2">
          <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <span>ชื่อบัญชีผู้ใช้</span>
            <span className="text-red-500">*</span>
          </label>
          <input
            name="username"
            value={formData.username}
            onChange={onChange}
            onBlur={() => handleBlur("username")}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
            required
            placeholder="กรุณากรอกชื่อผู้ใช้งาน"
          />
          {showError("username") && (
            <div className="flex items-center gap-2 text-red-600 text-sm">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span>{errorText}</span>
            </div>
          )}
        </div>

        {/* Password Field */}
        <div className="flex flex-col space-y-2">
          <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <span>รหัสผ่าน</span>
            <span className="text-red-500">*</span>
          </label>
          <div className="relative group">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={onChange}
              onBlur={() => handleBlur("password")}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 group-hover:border-gray-400"
              required
              placeholder="กรุณากรอกรหัสผ่านอย่างน้อย 8 ตัวอักษร"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-4 flex items-center justify-center hover:bg-gray-50 rounded-r-lg transition-all duration-200 group-hover:bg-gray-50"
              onClick={() => setShowPassword(!showPassword)}
              title={showPassword ? "ซ่อนรหัสผ่าน" : "แสดงรหัสผ่าน"}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors duration-200" />
              ) : (
                <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors duration-200" />
              )}
            </button>
          </div>
          {showError("password") && (
            <div className="flex items-center gap-2 text-red-600 text-sm">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span>{errorText}</span>
            </div>
          )}
          <div className="text-xs text-gray-500">
            รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร
          </div>
        </div>

        {/* Role Field */}
        <div className="flex flex-col space-y-2">
          <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <span>สิทธิ์ผู้ใช้</span>
            <span className="text-red-500">*</span>
          </label>
          <select
            name="role"
            value={formData.role}
            onChange={onChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400 bg-white"
          >
            <option value="ADMIN">แอดมิน</option>
            <option value="HR">ฝ่ายบุคคล</option>
            <option value="EMPLOYEE">พนักงานทั่วไป</option>
          </select>
          <div className="text-xs text-gray-500">
            เลือกสิทธิ์การเข้าถึงระบบ
          </div>
        </div>

        {/* Confirm Password Field */}
        <div className="flex flex-col space-y-2">
          <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <span>ยืนยันรหัสผ่าน</span>
            <span className="text-red-500">*</span>
          </label>
          <div className="relative group">
            <input
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={onChange}
              onBlur={() => handleBlur("confirmPassword")}
              className={`w-full px-4 py-3 border rounded-lg pr-12 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 group-hover:border-gray-400 ${
                showPasswordMismatchError() 
                  ? 'border-red-300 focus:ring-red-500' 
                  : 'border-gray-300 focus:ring-blue-500'
              }`}
              required
              placeholder="กรุณากรอกรหัสผ่านอีกครั้ง"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-4 flex items-center justify-center hover:bg-gray-50 rounded-r-lg transition-all duration-200 group-hover:bg-gray-50"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              title={showConfirmPassword ? "ซ่อนรหัสผ่าน" : "แสดงรหัสผ่าน"}
            >
              {showConfirmPassword ? (
                <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors duration-200" />
              ) : (
                <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors duration-200" />
              )}
            </button>
          </div>
          {showError("confirmPassword") && (
            <div className="flex items-center gap-2 text-red-600 text-sm">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span>{errorText}</span>
            </div>
          )}
          {showPasswordMismatchError() && (
            <div className="flex items-center gap-2 text-red-600 text-sm">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span>รหัสผ่านไม่ตรงกัน</span>
            </div>
          )}
          <div className="text-xs text-gray-500">
            กรุณากรอกรหัสผ่านให้ตรงกับรหัสผ่านด้านบน
          </div>
        </div>

        {/* Employee ID Field (Hidden) */}
        <div className="hidden">
          <input
            type="hidden"
            name="employeeId"
            value={formData.employeeId}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-6 border-t border-gray-200">
        <button
          type="submit"
          className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
        >
          {isEdit ? 'อัปเดตบัญชี' : 'สร้างบัญชี'}
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

export default AccountForm;
