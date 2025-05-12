// app/admin/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface SchoolData {
  id: string;
  name: string;
  users: { role: string }[];
}

export default function AdminPage() {
  const [schools, setSchools] = useState<SchoolData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/schools")
      .then((res) => res.json())
      .then((data) => setSchools(data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-5xl mx-auto mt-12 p-6">
      <h1 className="text-2xl font-bold text-blue-700 mb-6">Dashboard Superadmin</h1>

      <div className="mb-6">
        <Link href="/admin/register-guru" className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          + Tambah Guru
        </Link>
      </div>

      {loading ? (
        <p>Memuat data sekolah...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {schools.map((school) => {
            const guruCount = school.users.filter((u) => u.role === "GURU").length;
            const muridCount = school.users.filter((u) => u.role === "USER").length;

            return (
              <div key={school.id} className="p-4 bg-white rounded-xl shadow border">
                <h2 className="text-lg font-semibold text-blue-600 mb-2">{school.name}</h2>
                <p className="text-sm text-gray-700 mb-1">Guru: {guruCount}</p>
                <p className="text-sm text-gray-700 mb-1">Murid: {muridCount}</p>
                <div className="mt-2 flex gap-2">
                  <Link href={`/admin/sekolah/${school.id}`} className="text-sm text-blue-600 hover:underline">
                    Detail Sekolah
                  </Link>
                  <Link href={`/admin/register-guru?sekolah=${school.name}`} className="text-sm text-green-600 hover:underline">
                    Tambah Guru
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
