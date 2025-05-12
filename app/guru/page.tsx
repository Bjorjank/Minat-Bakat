"use client";

import { useEffect, useState } from "react";
import axios from "axios";

interface Question {
  id: string;
  text: string;
  trait: string;
}

export default function DashboardGuru() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [form, setForm] = useState<{ id?: string; text: string; trait: string }>({ text: "", trait: "" });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    const res = await axios.get("/api/soal");
    setQuestions(res.data);
  };

  const handleSubmit = async () => {
    if (isEditing && form.id) {
      await axios.put(`/api/soal/${form.id}`, {
        text: form.text,
        trait: form.trait,
      });
    } else {
      await axios.post("/api/soal", {
        text: form.text,
        trait: form.trait,
      });
    }

    setForm({ text: "", trait: "" });
    setIsEditing(false);
    fetchQuestions();
  };

  const handleEdit = (q: Question) => {
    setForm({ id: q.id, text: q.text, trait: q.trait });
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Yakin ingin menghapus soal ini?")) {
      await axios.delete(`/api/soal/${id}`);
      fetchQuestions();
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">{isEditing ? "Edit Soal" : "Tambah Soal Baru"}</h1>
      <div className="mb-4 space-y-2">
        <input type="text" placeholder="Teks soal" className="w-full border px-3 py-2 rounded" value={form.text} onChange={(e) => setForm({ ...form, text: e.target.value })} />
        <input type="text" placeholder="Trait" className="w-full border px-3 py-2 rounded" value={form.trait} onChange={(e) => setForm({ ...form, trait: e.target.value })} />
        <button onClick={handleSubmit} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          {isEditing ? "Simpan Perubahan" : "Tambah Soal"}
        </button>
      </div>

      <h2 className="text-xl font-semibold mt-6 mb-2">Daftar Soal</h2>
      <table className="w-full border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-3 py-2 text-left">Teks</th>
            <th className="border px-3 py-2">Trait</th>
            <th className="border px-3 py-2">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {questions.map((q) => (
            <tr key={q.id}>
              <td className="border px-3 py-2">{q.text}</td>
              <td className="border px-3 py-2 text-center">{q.trait}</td>
              <td className="border px-3 py-2 text-center space-x-2">
                <button onClick={() => handleEdit(q)} className="text-blue-600 hover:underline">
                  Edit
                </button>
                <button onClick={() => handleDelete(q.id)} className="text-red-600 hover:underline">
                  Hapus
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
