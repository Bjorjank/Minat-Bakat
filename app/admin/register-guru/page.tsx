// app/admin/register-guru/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function RegisterGuruPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    schoolName: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await axios.post("/api/register-guru", form);
      if (res.data.success) {
        router.push("/admin");
      }
    } catch (err: any) {
      setError(err.response?.data?.error || "Gagal membuat akun guru.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow">
      <h2 className="text-xl font-bold mb-4 text-blue-700">Tambah Guru Baru</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 text-sm">Nama</label>
          <input type="text" name="name" value={form.name} onChange={handleChange} required className="w-full border px-3 py-2 rounded shadow-sm" />
        </div>
        <div>
          <label className="block mb-1 text-sm">Email</label>
          <input type="email" name="email" value={form.email} onChange={handleChange} required className="w-full border px-3 py-2 rounded shadow-sm" />
        </div>
        <div>
          <label className="block mb-1 text-sm">Password</label>
          <input type="password" name="password" value={form.password} onChange={handleChange} required className="w-full border px-3 py-2 rounded shadow-sm" />
        </div>
        <div>
          <label className="block mb-1 text-sm">Nama Sekolah</label>
          <input type="text" name="schoolName" value={form.schoolName} onChange={handleChange} required className="w-full border px-3 py-2 rounded shadow-sm" />
        </div>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          {loading ? "Mendaftarkan..." : "Daftarkan Guru"}
        </button>
      </form>
    </div>
  );
}
