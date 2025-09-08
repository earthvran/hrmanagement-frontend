

import { useEffect, useState } from "react";
import axios from "axios";
import { Plus, Pencil, Eye, Trash2, MoveVertical, ArrowUp, ArrowDown } from "lucide-react";
import type { DepartmentResponse } from "../types/DepartmentResponse";
import type { DepartmentFormData } from "../types/DepartmentFormTypes";
import DepartmentForm from "../components/DepartmentForm";
import DepartmentViewModal from "../components/DepartmentViewModal";

const DepartmentsPage = () => {
  const [departments, setDepartments] = useState<DepartmentResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<DepartmentResponse | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<DepartmentFormData>({
    name: "",
    description: "",
  });
  const [message, setMessage] = useState<string | null>(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<keyof DepartmentResponse | "">("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const fetchAll = async () => {
    setLoading(true);
    await Promise.all([fetchDepartments()]);
    setLoading(false);
  };

  const fetchDepartments = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get("http://localhost:8080/api/departments/getAllDepartments", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDepartments(res.data);
    } catch (err) {
      console.error("Failed to load departments", err);
    }
  };

  

  useEffect(() => {
    fetchAll();
  }, []);

  const handleEdit = (dpt: DepartmentResponse) => {
    setFormData({
      name: dpt.name,
      description: dpt.description,
    });
    setEditingId(dpt.departmentId || null);
    setIsEdit(true);
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    setConfirmDeleteId(id);
    setShowConfirmDelete(true);
    setShowForm(false);
  };

  const confirmDelete = async () => {
    if (!confirmDeleteId) return;
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`http://localhost:8080/api/departments/deleteDepartment/${confirmDeleteId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("ลบข้อมูลแผนกสำเร็จ");
      fetchDepartments();
    } catch (err) {
      console.error("Failed to delete Department", err);
      setMessage("เกิดข้อผิดพลาดในการลบข้อมูล");
    }
    setShowConfirmDelete(false);
    setConfirmDeleteId(null);
    setTimeout(() => setMessage(null), 3000);
  };

  const handleView = (emp: DepartmentResponse) => {
    setSelectedDepartment(emp);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    setLoading(true);
    try {
      if (isEdit && editingId) {
        await axios.put(`http://localhost:8080/api/departments/updateDepartment/${editingId}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessage("อัปเดตข้อมูลสำเร็จ");
      } else {
        await axios.post("http://localhost:8080/api/departments/createDepartment", formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessage("เพิ่มข้อมูลแผนกสำเร็จ");
      }
      setShowForm(false);
      setIsEdit(false);
      setEditingId(null);
      await fetchDepartments();
    } catch (err) {
      console.error("Failed to submit department", err);
      setMessage("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    }
    setLoading(false);
    setTimeout(() => setMessage(null), 3000);
  };

  const handleSort = (field: keyof DepartmentResponse) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const renderSortIcon = (field: keyof DepartmentResponse) => {
    if (sortField !== field) return <MoveVertical size={14} className="inline-block ml-1 text-white/70" />;
    return sortOrder === "asc" ? <ArrowUp size={14} className="inline-block ml-1" /> : <ArrowDown size={14} className="inline-block ml-1" />;
  };

  const filteredDepartments = departments
    .filter(dpt =>
      dpt.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dpt.description.toLowerCase().includes(searchTerm.toLowerCase()) 
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
  const currentDepartments = filteredDepartments.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredDepartments.length / itemsPerPage);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
        <h1 className="text-2xl font-extrabold text-blue-700">ข้อมูลแผนก</h1>
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
                name: "",
                description: "",
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
        <DepartmentForm
          formData={formData}
          setFormData={setFormData}
          onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
          onSubmit={handleSubmit}
          onCancel={() => { setShowForm(false); setIsEdit(false); setEditingId(null); }}
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
                <th className="px-6 py-3">ลำดับ</th>
                <th className="px-10 py-3 cursor-pointer" onClick={() => handleSort("name")}>ชื่อแผนก {renderSortIcon("name")}</th>
                <th className="px-10 py-3 cursor-pointer" onClick={() => handleSort("description")}>คำอธิบายชื่อแผนก {renderSortIcon("description")}</th>
                <th className="px-10 py-3">การดำเนินการ</th>
              </tr>
            </thead>
            <tbody>
              {currentDepartments.map((dpt, index) => (
                <tr key={dpt.departmentId} className="border-b hover:bg-blue-50">
                  <td className="px-6 py-4 whitespace-nowrap">{indexOfFirstItem + index + 1}</td>
                  <td className="px-10 py-4 whitespace-nowrap">{dpt.name}</td>
                  <td className="px-10 py-4 whitespace-nowrap">{dpt.description}</td>
                  <td className="px-10 py-5">
                    <button onClick={() => handleView(dpt)} title="ดูรายละเอียด" className="text-blue-500 hover:text-blue-700 px-1 py-1">
                      <Eye size={16} />
                    </button>
                    <button onClick={() => handleEdit(dpt)} title="แก้ไข" className="text-yellow-400 hover:text-yellow-500 px-1 py-1">
                      <Pencil size={16} />
                    </button>
                    <button onClick={() => handleDelete(dpt.departmentId!)} title="ลบ" className="text-red-500 hover:text-red-700 px-1 py-1">
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

      {selectedDepartment && (
        <DepartmentViewModal department={selectedDepartment} onClose={() => setSelectedDepartment(null)} />
      )}

      {showConfirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-start pt-20 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full border border-blue-200">
            <h2 className="text-lg font-bold text-black-700 mb-4">ยืนยันการลบข้อมูล</h2>
            <p className="text-gray-800 mb-6">
              คุณแน่ใจหรือไม่ว่าต้องการลบแผนก
              <span className="font-semibold text-blue-600">
                {" "+departments.find(e => e.departmentId === confirmDeleteId)?.name+" "}
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

export default DepartmentsPage;
