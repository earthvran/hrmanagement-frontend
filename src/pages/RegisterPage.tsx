import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [employeeId, setEmployeeId] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    await axios.post("http://localhost:8080/api/auth/signup", {
      username,
      password,
      role: "EMPLOYEE",
      employeeId: parseInt(employeeId),
    });
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleRegister} className="bg-white p-8 rounded shadow-md w-80">
        <h2 className="text-2xl font-bold mb-4">Register</h2>
        <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} className="w-full p-2 border mb-4" required />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="w-full p-2 border mb-4" required />
        <input type="number" placeholder="Employee ID" value={employeeId} onChange={e => setEmployeeId(e.target.value)} className="w-full p-2 border mb-4" required />
        <button type="submit" className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600">Register</button>
      </form>
    </div>
  );
};

export default RegisterPage;