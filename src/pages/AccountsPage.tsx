import { useEffect, useState } from "react";
import axios from "axios";
import { Pencil, Eye, Trash2, MoveVertical, ArrowUp, ArrowDown, UserRoundPlus } from "lucide-react";
import type { AccountResponse } from "../types/AccountResponse";
import type { AccountFormData } from "../types/AccountFormData";
import AccountViewModal from "../components/AccountViewModal";
import AccountForm from "../components/AccountForm";

const AccountsPage = () => {
  const [accounts, setAccounts] = useState<AccountResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<AccountResponse | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<AccountFormData>({
    username: "",
    password: "",
    confirmPassword: "",
    role: "EMPLOYEE",
    employeeId: 1,
  });
  const [message, setMessage] = useState<string | null>(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<keyof AccountResponse | "">("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const fetchAll = async () => {
    setLoading(true);
    await Promise.all([fetchAccounts()]);
    setLoading(false);
  };

  const fetchAccounts = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/accounts/getAllEmployees`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAccounts(res.data);
    } catch (err) {
      console.error("Failed to load accounts", err);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleAccount = (act: AccountResponse) => {
    setFormData({
      username: "",
      password: "",
      confirmPassword: "",
      role: act.role || "EMPLOYEE",
      employeeId: act.employeeId,
    });
    setEditingId(null);
    setIsEdit(false);
    setShowForm(true);
  };

  const handleEdit = (act: AccountResponse) => {
    setFormData({
      username: act.username,
      password: "",
      confirmPassword: "",
      role: act.role || "EMPLOYEE",
      employeeId: act.employeeId,
    });
    setEditingId(act.userId || null);
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
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/accounts/deleteUser/${confirmDeleteId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("ลบข้อมูลพนักงานสำเร็จ");
      fetchAccounts();
    } catch (err) {
      console.error("Failed to delete account", err);
      setMessage("เกิดข้อผิดพลาดในการลบข้อมูล");
    }
    setShowConfirmDelete(false);
    setConfirmDeleteId(null);
    setTimeout(() => setMessage(null), 3000);
  };

  const handleView = (act: AccountResponse) => {
    setSelectedAccount(act);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    setLoading(true);
    try {
      // Create data object without confirmPassword for API
      const apiData = {
        username: formData.username,
        password: formData.password,
        role: formData.role,
        employeeId: formData.employeeId,
      };
      
      if (isEdit && editingId) {
        await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/accounts/updateUser/${editingId}`, apiData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessage("อัปเดตข้อมูลสำเร็จ");
      } else {
        await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/accounts/createUser`, apiData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessage("เพิ่มข้อมูลพนักงานสำเร็จ");
      }
      setShowForm(false);
      setIsEdit(false);
      setEditingId(null);
      await fetchAccounts();
    } catch (err) {
      console.error("Failed to submit account", err);
      setMessage("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    }
    setLoading(false);
    setTimeout(() => setMessage(null), 3000);
  };

  // Helper function to display username with fallback
  const displayUsername = (username: string | null | undefined) => {
    if (!username || username.trim() === '') {
      return <span className="text-gray-500 italic">ยังไม่สร้าง</span>;
    }
    return username;
  };

  // Helper function to display role with fallback
  const displayRole = (role: string | null | undefined) => {
    if (!role || role.trim() === '') {
      return <span className="text-gray-500 italic">ยังไม่ได้กำหนด</span>;
    }
    
    let roleText = '';
    switch (role) {
      case 'ADMIN':
        roleText = 'แอดมิน';
        break;
      case 'HR':
        roleText = 'ฝ่ายบุคคล';
        break;
      case 'EMPLOYEE':
        roleText = 'พนักงานทั่วไป';
        break;
      default:
        roleText = role;
    }
    
    return roleText;
  };

  const handleSort = (field: keyof AccountResponse) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const renderSortIcon = (field: keyof AccountResponse) => {
    if (sortField !== field) return <MoveVertical size={14} className="inline-block ml-1 text-white/70" />;
    return sortOrder === "asc" ? <ArrowUp size={14} className="inline-block ml-1" /> : <ArrowDown size={14} className="inline-block ml-1" />;
  };

  const filteredAccounts = accounts
    .filter(act =>
      act.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      act.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      act.departmentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      act.positionName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      act.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      act.role?.toLowerCase().includes(searchTerm.toLowerCase()) 
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
  const currentAccounts = filteredAccounts.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredAccounts.length / itemsPerPage);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
        <h1 className="text-2xl font-extrabold text-blue-700">การจัดการบัญชีผู้ใช้งาน</h1>
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
        </div>
      </div>

      {message && (
        <div className="px-4 py-2 text-green-700 bg-green-100 border border-green-300 rounded mb-4">
          {message}
        </div>
      )}

      {showForm && (
        <AccountForm
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
                <th className="px-6 py-3 cursor-pointer" onClick={() => handleSort("employeeCode")}>รหัส {renderSortIcon("employeeCode")}</th>
                <th className="px-6 py-3 cursor-pointer" onClick={() => handleSort("firstName")}>ชื่อ-นามสกุล {renderSortIcon("firstName")}</th>
                <th className="px-6 py-3 cursor-pointer" onClick={() => handleSort("departmentName")}>แผนก {renderSortIcon("departmentName")}</th>
                <th className="px-6 py-3 cursor-pointer" onClick={() => handleSort("positionName")}>ตำแหน่ง {renderSortIcon("positionName")}</th>
                <th className="px-6 py-3 cursor-pointer" onClick={() => handleSort("username")}>ชื่อบัญชีผู้ใช้ {renderSortIcon("username")}</th>
                <th className="px-6 py-3 cursor-pointer" onClick={() => handleSort("role")}>สิทธิ์ผู้ใช้ {renderSortIcon("role")}</th>
                <th className="px-6 py-3">การดำเนินการ</th>
              </tr>
            </thead>
            <tbody>
              {currentAccounts.map((act, index) => (
                <tr key={act.employeeId} className="border-b hover:bg-blue-50">
                  <td className="px-6 py-4 whitespace-nowrap">{indexOfFirstItem + index + 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{act.employeeCode}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{act.firstName} {act.lastName}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{act.departmentName}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{act.positionName}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{displayUsername(act.username)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{displayRole(act.role)}</td>
                  <td className="px-6 py-5">
                    {act.userId === null ?(
                    <button onClick={() => handleAccount(act)} title="สร้างบัญชี" className="text-green-500 hover:text-green-600 px-1 py-1">
                      <UserRoundPlus size={18} />
                    </button>
                    ):(
                    <button onClick={() => handleEdit(act)} title="แก้ไข" className="text-yellow-400 hover:text-yellow-500 px-1 py-1">
                      <Pencil size={18} />
                    </button>
                    )}
                    <button onClick={() => handleView(act)} title="ดูรายละเอียด" className="text-blue-500 hover:text-blue-700 px-1 py-1">
                      <Eye size={18} />
                    </button>
                    {act.userId && (
                    <button onClick={() => handleDelete(act.userId!)} title="ลบ" className="text-red-500 hover:text-red-700 px-1 py-1">
                      <Trash2 size={18} />
                    </button>
                    )}
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

      {selectedAccount && (
        <AccountViewModal employee={selectedAccount} onClose={() => setSelectedAccount(null)} />
      )}

      {showConfirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-start pt-20 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full border border-blue-200">
            <h2 className="text-lg font-bold text-black-700 mb-4">ยืนยันการลบข้อมูล</h2>
            <p className="text-gray-800 mb-6">
              คุณแน่ใจหรือไม่ว่าต้องการลบบัญชีผู้ใช้ของพนักงาน
              <span className="font-semibold text-blue-600">
                {" "+accounts.find(a => a.userId === confirmDeleteId)?.firstName} {accounts.find(a => a.userId === confirmDeleteId)?.lastName+" "}
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

export default AccountsPage;
