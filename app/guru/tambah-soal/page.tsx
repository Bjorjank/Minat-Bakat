"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function TambahSoal() {
  const [text, setText] = useState("");
  const [trait, setTrait] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/soal", {
      method: "POST",
      body: JSON.stringify({ text, trait }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();
    if (data.success) {
      router.push("/guru");
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-12 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Tambah Soal</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-1" htmlFor="text">
            Soal
          </label>
          <input id="text" type="text" value={text} onChange={(e) => setText(e.target.value)} className="w-full border px-3 py-2 rounded" required />
        </div>
        <div className="mb-4">
          <label className="block mb-1" htmlFor="trait">
            Trait
          </label>
          <select id="trait" value={trait} onChange={(e) => setTrait(e.target.value)} className="w-full border px-3 py-2 rounded" required>
            <option value="">Pilih Trait</option>
            <option value="introvert">Introvert</option>
            <option value="extrovert">Extrovert</option>
            <option value="thinking">Thinking</option>
            <option value="feeling">Feeling</option>
            <option value="judging">Judging</option>
            <option value="perceiving">Perceiving</option>
            {/* Tambahkan pilihan trait lainnya */}
          </select>
        </div>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Simpan Soal
        </button>
      </form>
    </div>
  );
}
