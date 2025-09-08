import { useEffect, useState } from "react";
import axios from "axios";
import { Plus, Pencil, Eye, Trash2, MoveVertical, ArrowUp, ArrowDown } from "lucide-react";
import EmployeeForm from "./EmployeeForm";
import type { EmployeeResponse } from "../types/EmployeeResponse";
import type { DepartmentOption, EmployeeFormData, PositionOption } from "../types/EmployeeFormTypes";
import EmployeeViewModal from "./EmployeeViewModal";

const EmployeesDemo = () => {
  const [employees, setEmployees] = useState<EmployeeResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeResponse | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [departments, setDepartments] = useState<DepartmentOption[]>([]);
  const [positions, setPositions] = useState<PositionOption[]>([]);
  const [formData, setFormData] = useState<EmployeeFormData>({
    employeeCode: "",
    firstName: "",
    lastName: "",
    gender: "M",
    birthDate: "",
    hireDate: "",
    email: "",
    phoneNumber: "",
    departmentId: 1,
    positionId: 1,
    salary: 0,
    status: "ACTIVE",
  });
  const [message, setMessage] = useState<string | null>(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<keyof EmployeeResponse | "">("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const fetchAll = async () => {
    setLoading(true);
    await Promise.all([fetchEmployees(), fetchDepartments(), fetchPositions()]);
    setLoading(false);
  };

  const fetchEmployees = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/employees/getAllEmployees`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEmployees(res.data);
    } catch (err) {
      console.error("Failed to load employees", err);
    }
  };

  const fetchDepartments = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/departments/getAllDepartments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDepartments(res.data);
    } catch (err) {
      console.error("Failed to load departments", err);
    }
  };

  const fetchPositions = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/positions/getAll`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPositions(res.data);
    } catch (err) {
      console.error("Failed to load positions", err);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleEdit = (emp: EmployeeResponse) => {
    setFormData({
      employeeCode: emp.employeeCode,
      firstName: emp.firstName,
      lastName: emp.lastName,
      gender: emp.gender || "M",
      birthDate: emp.birthDate || "",
      hireDate: emp.hireDate || "",
      email: emp.email,
      phoneNumber: emp.phoneNumber,
      departmentId: emp.departmentName ? departments.find(d => d.name === emp.departmentName)?.departmentId || 1 : 1,
      positionId: emp.positionName ? positions.find(p => p.title === emp.positionName)?.positionId || 1 : 1,
      salary: Number(emp.salary),
      status: emp.status || "ACTIVE",
    });
    setEditingId(emp.employeeId || null);
    setIsEdit(true);
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    setConfirmDeleteId(id);
    setShowConfirmDelete(true);
  };

  const confirmDelete = async () => {
    if (!confirmDeleteId) return;
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/employees/deleteEmployee/${confirmDeleteId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("ลบข้อมูลพนักงานสำเร็จ");
      fetchEmployees();
    } catch (err) {
      console.error("Failed to delete employee", err);
      setMessage("เกิดข้อผิดพลาดในการลบข้อมูล");
    }
    setShowConfirmDelete(false);
    setConfirmDeleteId(null);
    setTimeout(() => setMessage(null), 3000);
  };

  const handleView = (emp: EmployeeResponse) => {
    setSelectedEmployee(emp);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    setLoading(true);
    try {
      if (isEdit && editingId) {
        await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/employees/updateEmployee/${editingId}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessage("อัปเดตข้อมูลสำเร็จ");
      } else {
        await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/employees/createEmployee`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessage("เพิ่มข้อมูลพนักงานสำเร็จ");
      }
      setShowForm(false);
      setIsEdit(false);
      setEditingId(null);
      await fetchEmployees();
    } catch (err) {
      console.error("Failed to submit employee", err);
      setMessage("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    }
    setLoading(false);
    setTimeout(() => setMessage(null), 3000);
  };

  const handleSort = (field: keyof EmployeeResponse) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const renderSortIcon = (field: keyof EmployeeResponse) => {
    if (sortField !== field) return <MoveVertical size={14} className="inline-block ml-1 text-white/70" />;
    return sortOrder === "asc" ? <ArrowUp size={14} className="inline-block ml-1" /> : <ArrowDown size={14} className="inline-block ml-1" />;
  };

  const filteredEmployees = employees
    .filter(emp =>
      emp.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.departmentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.positionName?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (!sortField) return 0;
      const valA = a[sortField];
      const valB = b[sortField];

      if (typeof valA === "string" && typeof valB === "string") {
        return sortOrder === "asc"
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      }

      return 0;
    });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentEmployees = filteredEmployees.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
        <h1 className="text-2xl font-extrabold text-blue-700">ข้อมูลพนักงาน</h1>
        <div className="flex flex-col md:flex-row gap-2 items-start md:items-center">
          <input
            type="text"
            placeholder="ค้นหา..."
            className="border border-blue-300 px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="border border-blue-300 px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
          >
            {[5, 10, 15, 20].map((num) => (
              <option key={num} value={num}>แสดง {num} รายการ</option>
            ))}
          </select>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-all duration-200"
            onClick={() => {
              setShowForm(true);
              setIsEdit(false);
              setFormData({
                employeeCode: "",
                firstName: "",
                lastName: "",
                gender: "M",
                birthDate: "",
                hireDate: "",
                email: "",
                phoneNumber: "",
                departmentId: 1,
                positionId: 1,
                salary: 0,
                status: "ACTIVE",
              });
            }}
          >
            <Plus size={16} className="inline-block mr-1" /> เพิ่มข้อมูล
          </button>
        </div>
      </div>

      {message && (
        <div className="px-4 py-2 text-green-700 bg-green-100 border border-green-300 rounded mb-4">
          {message}
        </div>
      )}

      {showForm && (
        <EmployeeForm
          formData={formData}
          setFormData={setFormData}
          onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
          onSubmit={handleSubmit}
          onCancel={() => { setShowForm(false); setIsEdit(false); setEditingId(null); }}
          departments={departments}
          positions={positions}
          isEdit={isEdit}
        />
      )}

      {loading ? (
        <div className="px-6 py-4 text-blue-600 text-center">กำลังโหลดข้อมูล...</div>
      ) : (
        <div className="overflow-x-auto bg-white shadow rounded-lg">
          <table className="min-w-full text-sm text-left text-gray-700">
            <thead className="text-sm font-semibold text-white uppercase bg-blue-600">
              <tr>
                <th className="px-6 py-3 cursor-pointer" onClick={() => handleSort("employeeCode")}>รหัส {renderSortIcon("employeeCode")}</th>
                <th className="px-6 py-3 cursor-pointer" onClick={() => handleSort("firstName")}>ชื่อ-นามสกุล {renderSortIcon("firstName")}</th>
                <th className="px-6 py-3 cursor-pointer" onClick={() => handleSort("departmentName")}>แผนก {renderSortIcon("departmentName")}</th>
                <th className="px-6 py-3 cursor-pointer" onClick={() => handleSort("positionName")}>ตำแหน่ง {renderSortIcon("positionName")}</th>
                <th className="px-6 py-3 cursor-pointer" onClick={() => handleSort("email")}>อีเมล {renderSortIcon("email")}</th>
                <th className="px-6 py-3 cursor-pointer" onClick={() => handleSort("status")}>สถานะ {renderSortIcon("status")}</th>
                <th className="px-6 py-3">การดำเนินการ</th>
              </tr>
            </thead>
            <tbody>
              {currentEmployees.map(emp => (
                <tr key={emp.employeeId} className="border-b hover:bg-blue-50">
                  <td className="px-6 py-4 whitespace-nowrap">{emp.employeeCode}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{emp.firstName} {emp.lastName}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{emp.departmentName}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{emp.positionName}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{emp.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{emp.status}</td>
                  <td className="px-6 py-5">
                    <button onClick={() => handleView(emp)} title="ดูรายละเอียด" className="text-blue-500 hover:text-blue-700 px-1 py-1">
                      <Eye size={16} />
                    </button>
                    <button onClick={() => handleEdit(emp)} title="แก้ไข" className="text-yellow-400 hover:text-yellow-500 px-1 py-1">
                      <Pencil size={16} />
                    </button>
                    <button onClick={() => handleDelete(emp.employeeId!)} title="ลบ" className="text-red-500 hover:text-red-700 px-1 py-1">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-4 flex flex-col md:flex-row justify-between items-center px-4 py-2">
            <span className="text-sm text-blue-600 mb-2 md:mb-0">
              หน้าที่ {currentPage} จาก {totalPages}
            </span>
            <div className="flex flex-wrap gap-2 items-center">
              <button
                onClick={() => setCurrentPage(1)}
                className="px-3 py-1 border rounded bg-blue-100 hover:bg-blue-200 text-blue-700 disabled:opacity-50"
                disabled={currentPage === 1}
              >
                หน้าแรก
              </button>
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                className="px-3 py-1 border rounded bg-blue-100 hover:bg-blue-200 text-blue-700 disabled:opacity-50"
                disabled={currentPage === 1}
              >
                ก่อนหน้า
              </button>
              {pageNumbers.map((num) => (
                <button
                  key={num}
                  onClick={() => setCurrentPage(num)}
                  className={`px-3 py-1 border rounded ${currentPage === num ? 'bg-blue-500 text-white' : 'bg-blue-50 text-blue-700 hover:bg-blue-100'}`}
                >
                  {num}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                className="px-3 py-1 border rounded bg-blue-100 hover:bg-blue-200 text-blue-700 disabled:opacity-50"
                disabled={currentPage === totalPages}
              >
                ถัดไป
              </button>
              <button
                onClick={() => setCurrentPage(totalPages)}
                className="px-3 py-1 border rounded bg-blue-100 hover:bg-blue-200 text-blue-700 disabled:opacity-50"
                disabled={currentPage === totalPages}
              >
                หน้าสุดท้าย
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedEmployee && (
        <EmployeeViewModal employee={selectedEmployee} onClose={() => setSelectedEmployee(null)} />
      )}

      {showConfirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-start pt-20 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full border border-blue-200">
            <h2 className="text-lg font-bold text-black-700 mb-4">ยืนยันการลบข้อมูล</h2>
            <p className="text-gray-800 mb-6">
              คุณแน่ใจหรือไม่ว่าต้องการลบพนักงาน
              <span className="font-semibold text-blue-600">
                {" "+employees.find(e => e.employeeId === confirmDeleteId)?.firstName} {employees.find(e => e.employeeId === confirmDeleteId)?.lastName+" "}
              </span>
              ?
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowConfirmDelete(false)}
                className="px-4 py-2 rounded bg-gray-400 text-white hover:bg-gray-500"
              >
                ยกเลิก
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
              >
                ลบ
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default EmployeesDemo;
