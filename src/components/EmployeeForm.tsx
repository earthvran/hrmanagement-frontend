// src/components/EmployeeForm.tsx
import React, { useState } from "react";
import type {
  DepartmentOption,
  EmployeeFormData,
  PositionOption,
} from "../types/EmployeeFormTypes";

type Props = {
  formData: EmployeeFormData;
  setFormData: React.Dispatch<React.SetStateAction<EmployeeFormData>>;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  onDepartmentChange?: (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  departments: DepartmentOption[];
  positions: PositionOption[];
  isEdit?: boolean;
};

const EmployeeForm = ({ formData, setFormData, onChange, onDepartmentChange, onSubmit, onCancel, departments, positions, isEdit = false }: Props) => {
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
  const [imageError, setImageError] = useState(false);
  console.log(formData);
  // Show existing image when editing
  const currentImageUrl = formData.profilePicture 
    ? URL.createObjectURL(formData.profilePicture) 
    : formData.presignedRequestUrl || null;

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, profilePicture: file }));
      setImageError(false); // Reset error when new file is selected
    }
  };

  const removeImage = () => {
    setFormData(prev => ({ 
      ...prev, 
      profilePicture: null,
      presignedRequestUrl: null,
      profilePictureUrl: null
    }));
    setImageError(false);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const isValidEmail = (email: string) => /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);
  const isValidPhone = (phone: string) => /^\d{9,10}$/.test(phone);
  const isValidSalary = (salary: number) => salary > 0;
  const isValidDepartment = (deptId: number | undefined) => !!deptId && Number(deptId) > 0;
  const isValidPosition = (posId: number | undefined) => !!posId && Number(posId) > 0;
  const isValidDateRange = (birthDate: string, hireDate: string) => {
    if (!birthDate || !hireDate) return true;
    return new Date(hireDate) > new Date(birthDate);
  };
  const isValidGender = (gender: string | undefined) => !!gender && gender !== "";
  const isValidStatus = (status: string | undefined) => !!status && status !== "";

  const dateRangeValid = isValidDateRange(formData.birthDate, formData.hireDate);

  const showError = (field: keyof EmployeeFormData) => {
    return touched[field] && !formData[field];
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const requiredFields: (keyof EmployeeFormData)[] = ["employeeCode", "firstName", "lastName", "email", "phoneNumber", "birthDate", "hireDate", "departmentId", "positionId", "gender", "status"];
    const hasEmptyRequired = requiredFields.some((field) => !formData[field]);
    const emailValid = isValidEmail(formData.email);
    const phoneValid = isValidPhone(formData.phoneNumber);
    const salaryValid = isValidSalary(formData.salary);
    const departmentValid = isValidDepartment(formData.departmentId);
    const positionValid = isValidPosition(formData.positionId);
    const genderValid = isValidGender(formData.gender);
    const statusValid = isValidStatus(formData.status);

    if (hasEmptyRequired || !emailValid || !phoneValid || !salaryValid || !dateRangeValid || !departmentValid || !positionValid || !genderValid || !statusValid) {
      const newTouched: { [key: string]: boolean } = {};
      requiredFields.forEach((field) => (newTouched[field] = true));
      newTouched.salary = true;
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
          {isEdit ? 'แก้ไขข้อมูลพนักงาน' : 'เพิ่มพนักงานใหม่'}
        </h2>
        <p className="text-gray-600">
          กรอกข้อมูลพนักงานใหม่เข้าสู่ระบบ
        </p>
      </div>

      {/* Hidden input for presignedRequestUrl */}
      <input
        type="hidden"
        name="presignedRequestUrl"
        value={formData.profilePictureUrl || ''}
      />

      {/* Profile Picture Upload */}
      <div className="flex flex-col items-center mb-8">
        <div className="relative">
          {currentImageUrl && !imageError ? (
            <div className="relative">
              <img
                src={currentImageUrl}
                alt="Preview"
                className="w-40 h-40 rounded-full object-cover border-4 border-blue-100 shadow-lg"
                onError={handleImageError}
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm hover:bg-red-600 transition-colors duration-200 shadow-md"
                title="ลบรูป"
              >
                ×
              </button>
            </div>
          ) : (
            <div className="w-40 h-40 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 border-4 border-dashed border-gray-300 flex items-center justify-center shadow-lg">
              <div className="text-center">
                <div className="text-gray-400 text-5xl mb-3">📷</div>
                <div className="text-gray-500 text-sm font-medium">
                  {imageError ? 'โหลดรูปไม่สำเร็จ' : 'ไม่มีรูป'}
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="mt-6">
          <label className="cursor-pointer bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
            {currentImageUrl && !imageError ? 'เปลี่ยนรูป' : 'อัปโหลดรูป'}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
        </div>
        <p className="text-xs text-gray-500 mt-3">
          รองรับไฟล์ JPG, PNG ขนาดไม่เกิน 50MB
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Employee Code Field */}
        <div className="flex flex-col space-y-2">
          <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <span>รหัสพนักงาน</span>
            <span className="text-red-500">*</span>
          </label>
          <input
            name="employeeCode"
            value={formData.employeeCode}
            onChange={onChange}
            onBlur={() => handleBlur("employeeCode")}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
            required
            placeholder="กรุณากรอกรหัสพนักงาน"
          />
          {showError("employeeCode") && (
            <div className="flex items-center gap-2 text-red-600 text-sm">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span>{errorText}</span>
            </div>
          )}
        </div>

        {/* First Name Field */}
        <div className="flex flex-col space-y-2">
          <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <span>ชื่อ</span>
            <span className="text-red-500">*</span>
          </label>
          <input
            name="firstName"
            value={formData.firstName}
            onChange={onChange}
            onBlur={() => handleBlur("firstName")}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
            required
            placeholder="กรุณากรอกชื่อ"
          />
          {showError("firstName") && (
            <div className="flex items-center gap-2 text-red-600 text-sm">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span>{errorText}</span>
            </div>
          )}
        </div>

        {/* Last Name Field */}
        <div className="flex flex-col space-y-2">
          <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <span>นามสกุล</span>
            <span className="text-red-500">*</span>
          </label>
          <input
            name="lastName"
            value={formData.lastName}
            onChange={onChange}
            onBlur={() => handleBlur("lastName")}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
            required
            placeholder="กรุณากรอกนามสกุล"
          />
          {showError("lastName") && (
            <div className="flex items-center gap-2 text-red-600 text-sm">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span>{errorText}</span>
            </div>
          )}
        </div>

        {/* Gender Field */}
        <div className="flex flex-col space-y-2">
          <label className="text-sm font-semibold text-gray-700">
            เพศ
          </label>
          <select
            name="gender"
            value={formData.gender}
            onChange={onChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400 bg-white"
          >
            <option value="">-- เลือกเพศ --</option>
            <option value="M">ชาย</option>
            <option value="F">หญิง</option>
          </select>
          {touched.gender && !isValidGender(formData.gender) && (
            <div className="flex items-center gap-2 text-red-600 text-sm">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span>กรุณาเลือกเพศ</span>
            </div>
          )}
        </div>

        {/* Birth Date Field */}
        <div className="flex flex-col space-y-2">
          <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <span>วันเกิด</span>
            <span className="text-red-500">*</span>
          </label>
          <input
            name="birthDate"
            type="date"
            value={formData.birthDate}
            onChange={onChange}
            onBlur={() => handleBlur("birthDate")}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
            required
          />
          {showError("birthDate") && (
            <div className="flex items-center gap-2 text-red-600 text-sm">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span>{errorText}</span>
            </div>
          )}
        </div>

        {/* Hire Date Field */}
        <div className="flex flex-col space-y-2">
          <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <span>วันที่เริ่มงาน</span>
            <span className="text-red-500">*</span>
          </label>
          <input
            name="hireDate"
            type="date"
            value={formData.hireDate}
            onChange={onChange}
            onBlur={() => handleBlur("hireDate")}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
            required
          />
          {showError("hireDate") && (
            <div className="flex items-center gap-2 text-red-600 text-sm">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span>{errorText}</span>
            </div>
          )}
          {touched.hireDate && !dateRangeValid && (
            <div className="flex items-center gap-2 text-red-600 text-sm">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span>วันที่เริ่มงานต้องหลังวันเกิด</span>
            </div>
          )}
        </div>

        {/* Email Field */}
        <div className="flex flex-col space-y-2">
          <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <span>อีเมล</span>
            <span className="text-red-500">*</span>
          </label>
          <input
            name="email"
            value={formData.email}
            onChange={onChange}
            onBlur={() => handleBlur("email")}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
            required
            placeholder="example@company.com"
          />
          {touched.email && !isValidEmail(formData.email) && (
            <div className="flex items-center gap-2 text-red-600 text-sm">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span>รูปแบบอีเมลไม่ถูกต้อง</span>
            </div>
          )}
        </div>

        {/* Phone Number Field */}
        <div className="flex flex-col space-y-2">
          <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <span>เบอร์โทรศัพท์</span>
            <span className="text-red-500">*</span>
          </label>
          <input
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={onChange}
            onBlur={() => handleBlur("phoneNumber")}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
            required
            placeholder="0812345678"
          />
          {touched.phoneNumber && !isValidPhone(formData.phoneNumber) && (
            <div className="flex items-center gap-2 text-red-600 text-sm">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span>กรุณากรอกเบอร์โทรให้ถูกต้อง (9-10 หลัก)</span>
            </div>
          )}
        </div>

        {/* Department Field */}
        <div className="flex flex-col space-y-2">
          <label className="text-sm font-semibold text-gray-700">
            แผนก
          </label>
          <select
            name="departmentId"
            value={formData.departmentId}
            onChange={onDepartmentChange || onChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400 bg-white"
          >
            <option value={0}>-- เลือกแผนก --</option>
            {departments.map((dep) => (
              <option key={dep.departmentId} value={dep.departmentId}>
                {dep.name}
              </option>
            ))}
          </select>
          {touched.departmentId && !isValidDepartment(formData.departmentId) && (
            <div className="flex items-center gap-2 text-red-600 text-sm">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span>กรุณาเลือกแผนก</span>
            </div>
          )}
        </div>

        {/* Position Field */}
        <div className="flex flex-col space-y-2">
          <label className="text-sm font-semibold text-gray-700">
            ตำแหน่ง
          </label>
          <select
            name="positionId"
            value={formData.positionId}
            onChange={onChange}
            disabled={!isValidDepartment(formData.departmentId)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400 bg-white"
          >
            <option value={0}>-- เลือกตำแหน่ง --</option>
            {positions.map((pos) => (
              <option key={pos.positionId} value={pos.positionId}>
                {pos.title}
              </option>
            ))}
          </select>
          {!isValidDepartment(formData.departmentId) && (
            <div className="text-xs text-gray-500 mt-1">กรุณาเลือกแผนกก่อนเพื่อแสดงรายการตำแหน่ง</div>
          )}
          {touched.positionId && !isValidPosition(formData.positionId) && (
            <div className="flex items-center gap-2 text-red-600 text-sm">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span>กรุณาเลือกตำแหน่ง</span>
            </div>
          )}
        </div>

        {/* Salary Field */}
        <div className="flex flex-col space-y-2">
          <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <span>เงินเดือน</span>
            <span className="text-red-500">*</span>
          </label>
          <input
            name="salary"
            type="number"
            value={formData.salary}
            onChange={onChange}
            onBlur={() => handleBlur("salary")}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
            required
            placeholder="25000"
          />
          {touched.salary && !isValidSalary(formData.salary) && (
            <div className="flex items-center gap-2 text-red-600 text-sm">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span>เงินเดือนต้องมากกว่า 0</span>
            </div>
          )}
        </div>

        {/* Status Field */}
        <div className="flex flex-col space-y-2">
          <label className="text-sm font-semibold text-gray-700">
            สถานะการจ้างงาน
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={onChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400 bg-white"
          >
            <option value="">-- เลือกสถานะการจ้างงาน --</option>
            <option value="ACTIVE">ทำงาน</option>
            <option value="INACTIVE">ลาออก</option>
          </select>
          {touched.status && !isValidStatus(formData.status) && (
            <div className="flex items-center gap-2 text-red-600 text-sm">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span>กรุณาเลือกสถานะการจ้างงาน</span>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-6 border-t border-gray-200">
        <button
          type="submit"
          className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
        >
          {isEdit ? 'อัปเดตข้อมูล' : 'เพิ่มพนักงาน'}
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

export default EmployeeForm;
